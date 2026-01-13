const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1';

export function setToken(token) {
  localStorage.setItem('taskflow_token', token || '');
}

export function getToken() {
  return localStorage.getItem('taskflow_token') || '';
}

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json.data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  workspaces: () => request('/workspaces'),
  projects: (workspaceId) => request(`/workspaces/${workspaceId}/projects`),
  createProject: (workspaceId, payload) =>
    request(`/workspaces/${workspaceId}/projects`, { method: 'POST', body: payload }),
  board: (projectId) => request(`/projects/${projectId}/board`),
  createTask: (columnId, payload) => request(`/columns/${columnId}/tasks`, { method: 'POST', body: payload }),
  moveTask: (taskId, payload) => request(`/tasks/${taskId}/move`, { method: 'PATCH', body: payload }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),
  createColumn: (projectId, payload) => request(`/projects/${projectId}/columns`, { method: 'POST', body: payload }),
  deleteColumn: (columnId) => request(`/columns/${columnId}`, { method: 'DELETE' }),
};
