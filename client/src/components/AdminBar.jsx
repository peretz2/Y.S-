import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const barStyle = {
  position: 'relative',
  zIndex: 1000,
  background: 'var(--color-dark, #111)',
  color: 'var(--color-dark-ink, #e9e4d8)',
  padding: '0.5rem 1rem',
  fontSize: '0.85rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  borderBottom: '1px solid var(--color-line, #cec8bc)',
};

const btnStyle = {
  background: 'transparent',
  color: 'inherit',
  border: '1px solid currentColor',
  padding: '0.25rem 0.75rem',
  borderRadius: 'var(--radius-pill, 999px)',
  cursor: 'pointer',
  fontSize: '0.8rem',
  textDecoration: 'none',
  display: 'inline-block',
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
      <span>👤 מחובר כאדמין</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ opacity: 0.7 }}>{user.email}</span>
        <Link to="/" style={btnStyle}>🌐 צפה באתר</Link>
        <Link to="/admin" style={btnStyle}>פאנל ניהול</Link>
        <button style={{ ...btnStyle, border: '1px solid currentColor' }} onClick={handleLogout}>
          התנתק
        </button>
      </div>
    </div>
  );
}
