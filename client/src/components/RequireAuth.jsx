import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--color-text-muted)',
      }}>
        טוען…
      </div>
    );
  }

  if (status !== 'authed') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
