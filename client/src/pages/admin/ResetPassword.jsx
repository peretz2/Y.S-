import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (password !== confirm) {
      setErr('הסיסמאות אינן תואמות');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: '2rem' }}>
        <h1 style={{ marginBottom: '0.3rem' }}>איפוס סיסמה</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          בחרו סיסמה חדשה (לפחות 8 תווים, אות גדולה, אות קטנה וספרה).
        </p>
        {!token && (
          <div className="alert alert-error">חסר טוקן – השתמשו בקישור שנשלח אליכם במייל.</div>
        )}
        {done ? (
          <div className="alert alert-success">
            הסיסמה עודכנה. מעבירים אתכם למסך הכניסה…
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {err && <div className="alert alert-error">{err}</div>}
            <div className="form-group">
              <label>סיסמה חדשה</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required minLength={8} autoFocus autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>אישור סיסמה</label>
              <input
                type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required minLength={8} autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading || !token}>
              {loading ? 'מעדכן…' : 'עדכון סיסמה'}
            </button>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/admin/login">חזרה לכניסה</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
