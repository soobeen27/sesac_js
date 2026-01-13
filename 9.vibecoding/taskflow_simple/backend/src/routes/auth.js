import express from 'express';
import bcrypt from 'bcryptjs';
import { run, get } from '../db.js';
import { signToken, authRequired } from '../auth.js';
import { uid, ok, fail } from '../utils.js';

export const createAuthRouter = (db) => {
  const router = express.Router();

  router.post('/auth/signup', async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return fail(res, 400, 'VALIDATION_ERROR', 'email, password, name are required');

    const exists = await get(db, 'SELECT id FROM users WHERE email = ?', [email]).catch(() => null);
    if (exists) return fail(res, 409, 'CONFLICT', 'Email already exists');

    const userId = uid('u');
    const hash = await bcrypt.hash(password, 10);

    await run(db, 'INSERT INTO users(id,email,password_hash,name) VALUES (?,?,?,?)', [userId, email, hash, name]);

    // Seed: create personal workspace + default project + default columns
    const wsId = uid('w');
    await run(db, 'INSERT INTO workspaces(id,name) VALUES (?,?)', [wsId, `${name}의 워크스페이스`]);
    await run(db, 'INSERT INTO memberships(id,workspace_id,user_id,role) VALUES (?,?,?,?)', [
      uid('m'),
      wsId,
      userId,
      'owner',
    ]);

    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)', [
      projId,
      wsId,
      '첫 프로젝트',
      '자동 생성된 기본 프로젝트',
      userId,
    ]);

    const columns = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of columns) {
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [uid('c'), projId, c.name, c.ord]);
    }

    return res.status(201).json({ ok: true, data: { userId, workspaceId: wsId, projectId: projId } });
  });

  router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return fail(res, 400, 'VALIDATION_ERROR', 'email and password are required');

    const user = await get(db, 'SELECT id,email,password_hash,name FROM users WHERE email = ?', [email]).catch(
      () => null
    );
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

    const accessToken = signToken({ id: user.id, email: user.email, name: user.name });
    return ok(res, { accessToken, user: { id: user.id, email: user.email, name: user.name } });
  });

  router.get('/auth/me', authRequired, async (req, res) => {
    const u = await get(db, 'SELECT id,email,name,created_at FROM users WHERE id = ?', [req.user.id]).catch(() => null);
    if (!u) return fail(res, 404, 'NOT_FOUND', 'User not found');
    return ok(res, u);
  });

  return router;
};
