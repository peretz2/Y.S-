import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('ys_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}
