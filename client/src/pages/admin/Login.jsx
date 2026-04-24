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
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">
          <span className="line" /><span>§ פאנל ניהול</span>
        </div>
        <h1>כניסת <em>מנהל.</em></h1>
        <p className="auth-sub">י.ש. מהנדסים — גישה לעריכת תוכן האתר.</p>

        <form onSubmit={onSubmit} noValidate>
          {err && <div className="alert alert-error" role="alert">{err}</div>}

          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required autoFocus autoComplete="username"
              placeholder="name@example.com"
              dir="ltr"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password"
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'מתחבר…' : 'כניסה ←'}
            </button>
          </div>
        </form>

        <div className="auth-foot">
          <Link to="/admin/forgot-password">שכחתי סיסמה</Link>
        </div>
      </div>
    </main>
  );
}
