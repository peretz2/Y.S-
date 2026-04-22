import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <strong>י.ש. מהנדסים</strong>
          <small>פאנל ניהול</small>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>לוח בקרה</NavLink>
          <NavLink to="/admin/services">שירותים</NavLink>
          <NavLink to="/admin/projects">פרויקטים</NavLink>
          <NavLink to="/admin/contacts">פניות</NavLink>
          <NavLink to="/admin/account">חשבון / סיסמה</NavLink>
        </nav>
        <div className="admin-user">
          <small className="text-muted">{user?.email}</small>
          <button className="btn btn-outline" onClick={onLogout} style={{ width: '100%', marginTop: '0.5rem' }}>
            התנתקות
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
