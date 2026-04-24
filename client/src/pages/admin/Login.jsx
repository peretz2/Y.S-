import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/admin';

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאת התחברות');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem',
    }}>
      <form onSubmit={onSubmit} className="card" style={{ width: '100%', maxWidth: 420, padding: '2rem' }}>
        <h1 style={{ marginBottom: '0.3rem' }}>כניסת מנהל</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          פאנל ניהול – י.ש. מהנדסים
        </p>
        {err && <div className="alert alert-error">{err}</div>}
        <div className="form-group">
          <label>אימייל</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required autoFocus autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>סיסמה</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'מתחבר…' : 'כניסה'}
        </button>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/admin/forgot-password">שכחתי סיסמה</Link>
        </p>
      </form>
    </div>
  );
}
