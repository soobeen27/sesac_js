import express from 'express';
import { openDb } from '../db.js';
import { ok } from '../utils.js';

import { createAuthRouter } from './auth.js';
import { createWorkspacesRouter } from './workspaces.js';
import { createProjectsRouter } from './projects.js';
import { createColumnsRouter } from './columns.js';
import { createTasksRouter } from './tasks.js';

export function createRouter() {
  const router = express.Router();
  const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
  const db = openDb(dbPath);

  // Health
  router.get('/health', (req, res) => ok(res, { status: 'ok' }));

  // Mount sub-routers
  // Note: These routers will be mounted on the root of /api/v1 because we passed router to app.use('/api/v1', ...)

  router.use(createAuthRouter(db));
  router.use(createWorkspacesRouter(db));
  router.use(createProjectsRouter(db));
  router.use(createColumnsRouter(db));
  router.use(createTasksRouter(db));

  return router;
}
