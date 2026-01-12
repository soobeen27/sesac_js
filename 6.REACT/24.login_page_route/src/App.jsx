import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { useAuth } from './auth/AuthProvider';

const linkStyle = ({ isActive }) => ({
  padding: '8px 10px',
  borderRadius: 10,
  textDecoration: 'none',
  color: 'inherit',
  background: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
});

function App() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 15 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2>로그인 앱</h2>
        <nav style={{ display: 'flex', gap: 10 }}>
          <NavLink style={linkStyle} to="/">
            Home
          </NavLink>
          {!isAuthed ? (
            <NavLink style={linkStyle} to="/login">
              Login
            </NavLink>
          ) : (
            <>
              <span style={{ opacity: 0.7, fontSize: 14 }}>{user?.id ? `안녕하세요 ${user.id}` : '로그인됨'}</span>{' '}
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          <NavLink style={linkStyle} to="/profile">
            Profile
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
