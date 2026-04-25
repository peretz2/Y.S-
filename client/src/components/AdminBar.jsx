import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const barStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  background: 'var(--color-text-primary)',
  color: 'var(--color-bg-primary)',
  padding: '0.5rem 1rem',
  fontSize: '0.85rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  borderBottom: '1px solid var(--color-border-secondary)',
};

const btnStyle = {
  background: 'transparent',
  color: 'inherit',
  border: '1px solid currentColor',
  padding: '0.25rem 0.75rem',
  borderRadius: 'var(--border-radius-pill)',
  cursor: 'pointer',
  fontSize: '0.8rem',
};

export default function AdminBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div style={barStyle}>
      <span>✏️ מצב עריכה</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ opacity: 0.7 }}>{user.email}</span>
        <Link to="/admin" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-block' }}>
          פאנל ניהול
        </Link>
        <button style={btnStyle} onClick={handleLogout}>
          התנתק
        </button>
      </div>
    </div>
  );
}
