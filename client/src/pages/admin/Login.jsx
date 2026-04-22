import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ys_token', data.token);
      localStorage.setItem('ys_user_email', data.user.email);
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
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="form-group">
          <label>סיסמה</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'מתחבר…' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}
