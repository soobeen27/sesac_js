import express from 'express';
import { run, get, all } from '../db.js';
import { authRequired } from '../auth.js';
import { uid, ok, fail } from '../utils.js';

export const createProjectsRouter = (db) => {
  const router = express.Router();

  router.get('/workspaces/:workspaceId/projects', authRequired, async (req, res) => {
    const { workspaceId } = req.params;
    // membership check
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      workspaceId,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to workspace');

    const rows = await all(
      db,
      `
      SELECT id, workspace_id as workspaceId, name, description, created_at as createdAt
      FROM projects
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `,
      [workspaceId]
    );
    return ok(res, { items: rows });
  });

  router.post('/workspaces/:workspaceId/projects', authRequired, async (req, res) => {
    const { workspaceId } = req.params;
    const { name, description = '' } = req.body || {};
    if (!name) return fail(res, 400, 'VALIDATION_ERROR', 'name is required');

    const mem = await get(db, 'SELECT role FROM memberships WHERE workspace_id=? AND user_id=?', [
      workspaceId,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to workspace');

    const projectId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)', [
      projectId,
      workspaceId,
      name,
      description,
      req.user.id,
    ]);

    // default columns
    const cols = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of cols) {
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [
        uid('c'),
        projectId,
        c.name,
        c.ord,
      ]);
    }

    return res.status(201).json({ ok: true, data: { id: projectId, workspaceId, name, description } });
  });

  router.get('/projects/:projectId/board', authRequired, async (req, res) => {
    const { projectId } = req.params;

    // membership via project -> workspace
    const proj = await get(db, 'SELECT id, workspace_id FROM projects WHERE id=?', [projectId]).catch(() => null);
    if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to project');

    const columns = await all(db, 'SELECT id, name, ord FROM columns WHERE project_id=? ORDER BY ord ASC', [projectId]);
    const tasks = await all(
      db,
      `
      SELECT id, column_id as columnId, project_id as projectId, title, description, assignee_id as assigneeId,
             due_date as dueDate, start_date as startDate, end_date as endDate, priority, status, ord, created_at as createdAt
      FROM tasks
      WHERE project_id=?
      ORDER BY column_id, ord
    `,
      [projectId]
    );

    // group tasks by column
    const byCol = {};
    for (const c of columns) byCol[c.id] = [];
    for (const t of tasks) {
      if (!byCol[t.columnId]) byCol[t.columnId] = [];
      byCol[t.columnId].push(t);
    }

    return ok(res, { projectId, columns, tasksByColumn: byCol });
  });

  return router;
};
