import express from 'express';
import { run, all } from '../db.js';
import { authRequired } from '../auth.js';
import { ok } from '../utils.js';

export const createWorkspacesRouter = (db) => {
  const router = express.Router();

  router.get('/workspaces', authRequired, async (req, res) => {
    const rows = await all(
      db,
      `
      SELECT w.id, w.name, m.role
      FROM memberships m
      JOIN workspaces w ON w.id = m.workspace_id
      WHERE m.user_id = ?
      ORDER BY w.created_at DESC
    `,
      [req.user.id]
    );
    return ok(res, { items: rows });
  });

  return router;
};
