import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const email = localStorage.getItem('ys_user_email');

  function logout() {
    localStorage.removeItem('ys_token');
    localStorage.removeItem('ys_user_email');
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
        </nav>
        <div className="admin-user">
          <small className="text-muted">{email}</small>
          <button className="btn btn-outline" onClick={logout} style={{ width: '100%', marginTop: '0.5rem' }}>
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
