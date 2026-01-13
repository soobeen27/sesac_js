import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Dashboard({ user, onLogout }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedWs, setSelectedWs] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function bootstrap() {
    setMsg('');
    setLoading(true);
    try {
      const ws = await api.workspaces();
      setWorkspaces(ws.items);
      const firstWs = ws.items[0]?.id || '';
      setSelectedWs(firstWs);

      if (firstWs) {
        const ps = await api.projects(firstWs);
        setProjects(ps.items);
      } else {
        setProjects([]);
      }
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (!selectedWs) return;
    api
      .projects(selectedWs)
      .then((d) => setProjects(d.items))
      .catch(() => setProjects([]));
  }, [selectedWs]);

  async function createProject() {
    const name = newProjectName.trim();
    if (!name) return;
    try {
      await api.createProject(selectedWs, { name, description: '' });
      setNewProjectName('');
      const ps = await api.projects(selectedWs);
      setProjects(ps.items);
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (loading && workspaces.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">TaskFlow</h2>
          <div className="text-slate-500">안녕하세요, {user?.name} 님</div>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          onClick={onLogout}
        >
          로그아웃
        </button>
      </div>

      {msg && <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">오류: {msg}</div>}

      <hr className="my-8 border-slate-200" />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">워크스페이스</h3>
        <div className="mb-8">
          <select
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={selectedWs}
            onChange={(e) => setSelectedWs(e.target.value)}
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.role})
              </option>
            ))}
          </select>
        </div>

        <hr className="my-8 border-slate-100" />

        <h3 className="text-lg font-semibold text-slate-900 mb-4">프로젝트</h3>
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="새 프로젝트 이름"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-colors"
            onClick={createProject}
          >
            추가
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((p) => (
            <div
              className="group p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white"
              key={p.id}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{p.description || '설명 없음'}</div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  onClick={() => navigate(`/board/${p.id}`)}
                >
                  보드 열기
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              프로젝트가 없습니다. 위에서 추가해보세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
