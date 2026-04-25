import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './admin.css';

const NAV = [
  { section: 'תוכן', items: [
    { to: '/admin', end: true, label: 'לוח בקרה', ico: '◆' },
    { to: '/admin/services', label: 'שירותים', ico: '◇' },
    { to: '/admin/projects', label: 'פרויקטים', ico: '▣' },
  ]},
  { section: 'תקשורת', items: [
    { to: '/admin/contacts', label: 'פניות', ico: '✉' },
  ]},
  { section: 'אתר', items: [
    { to: '/admin/company', label: 'פרטי חברה', ico: '☎' },
    { to: '/admin/content', label: 'תוכן האתר', ico: '✎' },
  ]},
  { section: 'ניהול', items: [
    { to: '/admin/users', label: 'משתמשי אדמין', ico: '◉' },
    { to: '/admin/account', label: 'החשבון שלי', ico: '✱' },
  ]},
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side" aria-label="ניווט פאנל ניהול">
        <div className="admin-brand">
          <strong>י.ש. מהנדסים</strong>
          <small>פאנל ניהול</small>
        </div>
        <nav className="admin-nav" aria-label="ניווט ראשי">
          <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--color-border-secondary)', marginBottom: '1rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                borderRadius: 'var(--border-radius-md)',
                transition: 'background 0.15s',
              }}
            >
              <span aria-hidden="true">🌐</span>
              <span>צפה באתר</span>
              <span style={{ marginInlineStart: 'auto', opacity: 0.5 }}>↗</span>
            </a>
          </div>
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="admin-nav-section">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="nav-ico" aria-hidden="true">{item.ico}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-user">
          <div className="user-meta">{user?.email}</div>
          <button className="btn btn-ghost" onClick={onLogout}>
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
