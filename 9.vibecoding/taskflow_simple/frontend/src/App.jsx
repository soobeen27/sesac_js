import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api, getToken, setToken } from './api.js';
import './styles.css';

// Components
import AuthCard from './components/AuthCard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Board from './pages/Board.jsx';

function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(!!getToken());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Bootstrap app on load
  useEffect(() => {
    async function init() {
      if (authed) {
        try {
          const me = await api.me();
          setUser(me);
        } catch (e) {
          setAuthed(false);
          setToken('');
        }
      }
      setReady(true);
    }
    init();
  }, [authed]);

  function logout() {
    setToken('');
    setAuthed(false);
    setUser(null);
    navigate('/');
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">초기화 중...</div>
      </div>
    );
  }

  // Wrapper for protected routes
  const Protected = ({ children }) => {
    if (!authed) return <AuthCard onAuthed={() => setAuthed(true)} />;
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard user={user} setUser={setUser} onLogout={logout} />
          </Protected>
        }
      />
      <Route
        path="/board/:projectId"
        element={
          <Protected>
            <Board />
          </Protected>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
