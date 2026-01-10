import { NavLink, Outlet } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  textDecoration: 'none',
  marginLeft: 10,
  fontWeight: isActive ? 700 : 400,
});

export default function RootLayout() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <nav>
        <NavLink to="/" end style={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/users" style={linkStyle}>
          Users
        </NavLink>
        <NavLink to="/posts" style={linkStyle}>
          Posts
        </NavLink>
        <NavLink to="/about" style={linkStyle}>
          About
        </NavLink>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
