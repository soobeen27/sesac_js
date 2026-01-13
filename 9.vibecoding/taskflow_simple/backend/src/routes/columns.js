import express from 'express';
import { run, get, all } from '../db.js';
import { authRequired } from '../auth.js';
import { uid, ok, fail } from '../utils.js';

export const createColumnsRouter = (db) => {
  const router = express.Router();

  router.post('/projects/:projectId/columns', authRequired, async (req, res) => {
    const { projectId } = req.params;
    const { name } = req.body || {};
    if (!name) return fail(res, 400, 'VALIDATION_ERROR', 'name is required');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [projectId]).catch(() => null);
    if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    const maxRow = await get(db, 'SELECT COALESCE(MAX(ord), 0) as m FROM columns WHERE project_id=?', [projectId]);
    const ord = (maxRow?.m || 0) + 1;

    const colId = uid('c');
    await run(db, 'INSERT INTO columns(id, project_id, name, ord) VALUES (?,?,?,?)', [colId, projectId, name, ord]);

    return res.status(201).json({ ok: true, data: { id: colId, projectId, name, ord } });
  });

  router.delete('/columns/:columnId', authRequired, async (req, res) => {
    const { columnId } = req.params;
    const col = await get(db, 'SELECT id, project_id, ord FROM columns WHERE id=?', [columnId]).catch(() => null);
    if (!col) return fail(res, 404, 'NOT_FOUND', 'Column not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [col.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [
      proj.workspace_id,
      req.user.id,
    ]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    // Move tasks to the first column that is NOT the current one
    const otherCols = await all(db, 'SELECT id FROM columns WHERE project_id=? AND id != ? ORDER BY ord ASC LIMIT 1', [
      col.project_id,
      columnId,
    ]);

    if (otherCols.length > 0) {
      const targetColId = otherCols[0].id;
      // Get max ord in target column to append
      const maxRow = await get(db, 'SELECT COALESCE(MAX(ord), 0) as m FROM tasks WHERE column_id=?', [targetColId]);
      let currentMax = maxRow?.m || 0;

      // Updating tasks one by one is inefficient but safe for reordering if we care about relative order,
      // but here we just want to dump them.
      // We can do a mass update, but `ord` management is tricky.
      // Let's just append them.
      const tasksToMove = await all(db, 'SELECT id FROM tasks WHERE column_id=?', [columnId]);
      for (const t of tasksToMove) {
        currentMax++;
        await run(db, 'UPDATE tasks SET column_id=?, ord=? WHERE id=?', [targetColId, currentMax, t.id]);
      }
    } else {
      // If no other columns, just delete tasks or keep them orphaned?
      // Schema says ON DELETE CASCADE for tasks -> column_id. So they will be deleted!
      // If user deletes the LAST column, tasks are gone. This is acceptable or we should block deleting last column.
      // Let's prevent deleting the last column.
      const countRow = await get(db, 'SELECT COUNT(*) as c FROM columns WHERE project_id=?', [col.project_id]);
      if ((countRow?.c || 0) <= 1) {
        return fail(res, 400, 'BAD_REQUEST', 'Cannot delete the last column');
      }
    }

    await run(db, 'DELETE FROM columns WHERE id=?', [columnId]);
    return ok(res, { deleted: true });
  });

  return router;
};
