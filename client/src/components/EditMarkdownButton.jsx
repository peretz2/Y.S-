import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function EditMarkdownButton({ contentKey }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Link
      to={`/admin/content?search=${encodeURIComponent(contentKey)}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem',
        padding: '0.5rem 1rem',
        background: 'transparent',
        color: 'inherit',
        border: '1px dashed currentColor',
        borderRadius: '999px',
        textDecoration: 'none',
        fontSize: '0.85rem',
        opacity: 0.7,
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
    >
      <span aria-hidden="true">✎</span>
      <span>ערוך תוכן זה בפאנל הניהול</span>
    </Link>
  );
}
