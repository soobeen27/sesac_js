import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { api } from '../api.js';
import TaskCreationModal from '../components/TaskCreationModal.jsx';

export default function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [err, setErr] = useState('');
  const [viewMode, setViewMode] = useState('KANBAN'); // KANBAN | GANTT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColName, setNewColName] = useState('');

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await api.board(projectId);
      setBoard(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  async function handleCreateTask(columnId, taskData) {
    await api.createTask(columnId, {
      title: taskData.title,
      description: taskData.description || '',
      startDate: taskData.startDate || null,
      endDate: taskData.endDate || null,
    });
    load();
  }

  async function handleCreateColumn() {
    const name = newColName.trim();
    if (!name) return;
    try {
      await api.createColumn(projectId, { name });
      setNewColName('');
      setIsAddingCol(false);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteColumn(colId) {
    if (!confirm('이 컬럼을 삭제하시겠습니까? 포함된 태스크는 자동으로 다른 컬럼으로 이동됩니다.')) return;
    try {
      await api.deleteColumn(colId);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // source/dest columns
    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    // Optimistic update
    const newBoard = { ...board };
    const sourceTasks = [...(newBoard.tasksByColumn[sourceColId] || [])];
    const destTasks = sourceColId === destColId ? sourceTasks : [...(newBoard.tasksByColumn[destColId] || [])];

    const [moved] = sourceTasks.splice(source.index, 1);

    // update moved item columnId if changed
    if (sourceColId !== destColId) {
      moved.columnId = destColId;
    }

    destTasks.splice(destination.index, 0, moved);

    newBoard.tasksByColumn[sourceColId] = sourceTasks;
    newBoard.tasksByColumn[destColId] = destTasks;
    setBoard(newBoard);

    await api.moveTask(draggableId, {
      toColumnId: destColId,
      toOrder: destination.index + 1,
    });
  }

  async function remove(taskId) {
    await api.deleteTask(taskId);
    load();
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">불러오는 중...</div>
      </div>
    );
  if (err)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-red-500">오류: {err}</div>
      </div>
    );
  if (!board) return null;

  // Transform data for Gantt
  let ganttTasks = [];
  if (viewMode === 'GANTT') {
    const all = [];
    const colMap = {};
    board.columns.forEach((c) => (colMap[c.id] = c.name));

    Object.entries(board.tasksByColumn).forEach(([colId, tasks]) => {
      tasks.forEach((t) => all.push({ ...t, colName: colMap[colId] || '' }));
    });

    ganttTasks = all
      .filter((t) => t.startDate && t.endDate)
      .map((t) => {
        let color = '#ccc'; // default
        const lower = t.colName.toLowerCase();
        if (lower.includes('todo')) color = '#a3a3a3';
        else if (lower.includes('doing') || lower.includes('progress')) color = '#579dff'; // blue
        else if (lower.includes('done') || lower.includes('complete')) color = '#4ade80'; // green

        return {
          start: new Date(t.startDate),
          end: new Date(t.endDate),
          name: t.title,
          id: t.id,
          type: 'task',
          progress: 100, // showing full bar
          isDisabled: true,
          styles: { progressColor: color, progressSelectedColor: color },
        };
      });
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="flex-none h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-slate-900">Kanban Board</h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'KANBAN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setViewMode('KANBAN')}
            >
              보드
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'GANTT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setViewMode('GANTT')}
            >
              Gantt
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-colors flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span> 새 태스크
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => navigate('/')}
          >
            ← 프로젝트로
          </button>
        </div>
      </header>

      {viewMode === 'GANTT' ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-full overflow-hidden flex flex-col">
            {ganttTasks.length > 0 ? (
              <div className="flex-1 overflow-auto">
                <Gantt
                  tasks={ganttTasks}
                  viewMode={ViewMode.Day}
                  locale="ko"
                  columnWidth={60}
                  listCellWidth=""
                  barCornerRadius={4}
                  barFill={60}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                시작일과 종료일이 설정된 태스크가 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-6 items-start">
              {board.columns.map((col) => (
                <div
                  key={col.id}
                  className="w-80 flex-shrink-0 flex flex-col max-h-full bg-slate-100/50 rounded-xl border border-slate-200/60 shadow-sm"
                >
                  <div className="p-4 border-b border-slate-200/60 bg-slate-50 rounded-t-xl flex justify-between items-center group/header">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{col.name}</h3>
                      <div className="text-xs text-slate-500">{board.tasksByColumn[col.id]?.length || 0} tasks</div>
                    </div>
                    {board.columns.length > 1 && (
                      <button
                        className="opacity-0 group-hover/header:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        onClick={() => handleDeleteColumn(col.id)}
                        title="컬럼 삭제"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <Droppable droppableId={col.id}>
                    {(provided) => (
                      <div
                        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {(board.tasksByColumn[col.id] || []).map((t, index) => (
                          <Draggable key={t.id} draggableId={t.id} index={index}>
                            {(provided) => (
                              <div
                                className="group relative bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <h4 className="font-medium text-slate-900 mb-1">{t.title}</h4>
                                {t.description ? (
                                  <p className="text-slate-600 text-xs mb-2 line-clamp-2">{t.description}</p>
                                ) : (
                                  <p className="text-slate-400 text-xs mb-2">설명 없음</p>
                                )}

                                {(t.startDate || t.endDate) && (
                                  <div className="text-xs text-slate-500 bg-slate-50 inline-block px-1.5 py-0.5 rounded border border-slate-100">
                                    📅 {t.startDate || '?'} ~ {t.endDate || '?'}
                                  </div>
                                )}

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      remove(t.id);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {(board.tasksByColumn[col.id] || []).length === 0 && (
                          <div className="text-center text-slate-400 text-xs py-4">태스크가 없습니다.</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}

              {/* Add Column Button */}
              <div className="w-80 flex-shrink-0">
                {isAddingCol ? (
                  <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200/60 shadow-sm">
                    <input
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-2"
                      placeholder="새 컬럼 이름"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateColumn();
                        if (e.key === 'Escape') setIsAddingCol(false);
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                        onClick={handleCreateColumn}
                      >
                        추가
                      </button>
                      <button
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors"
                        onClick={() => setIsAddingCol(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-medium flex items-center justify-center gap-2"
                    onClick={() => setIsAddingCol(true)}
                  >
                    <span>+</span> 컬럼 추가
                  </button>
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      )}

      <TaskCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
        columns={board.columns}
      />
    </div>
  );
}
