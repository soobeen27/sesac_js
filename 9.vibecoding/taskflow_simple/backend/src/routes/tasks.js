import express from 'express';
import { run, get, all } from '../db.js';
import { authRequired } from '../auth.js';
import { uid, ok, fail } from '../utils.js';

export const createTasksRouter = (db) => {
  const router = express.Router();

  router.post('/columns/:columnId/tasks', authRequired, async (req, res) => {
    const { columnId } = req.params;
    const {
      title,
      description = '',
      dueDate = null,
      startDate = null,
      endDate = null,
      priority = 'medium',
    } = req.body || {};
    if (!title) return fail(res, 400, 'VALIDATION_ERROR', 'title is required');

    const col = await get(db, 'SELECT id, project_id FROM columns WHERE id=?', [columnId]).catch(() => null);
    if (!col) return fail(res, 404, 'NOT_FOUND', 'Column not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [col.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    const maxRow = await get(db, 'SELECT COALESCE(MAX(ord), 0) as m FROM tasks WHERE column_id=?', [columnId]);
    const ord = (maxRow?.m || 0) + 1;

    const taskId = uid('t');
    await run(
      db,
      `
      INSERT INTO tasks(id, project_id, column_id, title, description, due_date, start_date, end_date, priority, status, ord, created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `,
      [
        taskId,
        col.project_id,
        columnId,
        title,
        description,
        dueDate,
        startDate,
        endDate,
        priority,
        'open',
        ord,
        req.user.id,
      ]
    );

    return res.status(201).json({
      ok: true,
      data: {
        id: taskId,
        columnId,
        projectId: col.project_id,
        title,
        description,
        dueDate,
        startDate,
        endDate,
        priority,
        status: 'open',
        ord,
      },
    });
  });

  router.patch('/tasks/:taskId/move', authRequired, async (req, res) => {
    const { taskId } = req.params;
    const { toColumnId, toOrder } = req.body || {};
    if (!toColumnId || !toOrder) return fail(res, 400, 'VALIDATION_ERROR', 'toColumnId and toOrder are required');

    const task = await get(db, 'SELECT id, project_id, column_id, ord FROM tasks WHERE id=?', [taskId]).catch(
      () => null
    );
    if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [task.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    // naive reorder in destination column:
    // 1) shift down tasks with ord >= toOrder in destination column
    await run(db, 'UPDATE tasks SET ord = ord + 1 WHERE column_id=? AND ord >= ?', [toColumnId, toOrder]);

    // 2) set task to destination
    await run(db, 'UPDATE tasks SET column_id=?, ord=? WHERE id=?', [toColumnId, toOrder, taskId]);

    // 3) compact source column orders (simple)
    const srcTasks = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [task.column_id]);
    let i = 1;
    for (const r of srcTasks) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [i++, r.id]);
    }
    const dstTasks = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [toColumnId]);
    i = 1;
    for (const r of dstTasks) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [i++, r.id]);
    }

    return ok(res, { taskId, toColumnId, toOrder });
  });

  router.delete('/tasks/:taskId', authRequired, async (req, res) => {
    const { taskId } = req.params;
    const task = await get(db, 'SELECT id, project_id, column_id FROM tasks WHERE id=?', [taskId]).catch(() => null);
    if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [task.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    await run(db, 'DELETE FROM tasks WHERE id=?', [taskId]);

    // compact column
    const rows = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [task.column_id]);
    let ord = 1;
    for (const r of rows) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [ord++, r.id]);
    }

    return ok(res, { deleted: true });
  });

  return router;
};
