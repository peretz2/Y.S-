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
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">
          <span className="line" /><span>§ איפוס סיסמה</span>
        </div>
        <h1>סיסמה <em>חדשה.</em></h1>
        <p className="auth-sub">לפחות 8 תווים, אות גדולה, אות קטנה וספרה.</p>

        {!token && (
          <div className="alert alert-error" role="alert">
            חסר טוקן — השתמשו בקישור שנשלח אליכם במייל.
          </div>
        )}

        {done ? (
          <>
            <div className="alert alert-success" role="status">
              הסיסמה עודכנה. מעבירים אתכם למסך הכניסה…
            </div>
          </>
        ) : (
          <>
            <form onSubmit={onSubmit} noValidate>
              {err && <div className="alert alert-error" role="alert">{err}</div>}
              <div className="form-group">
                <label htmlFor="pw">סיסמה חדשה</label>
                <input
                  id="pw"
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required minLength={8} autoFocus autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pw2">אישור סיסמה</label>
                <input
                  id="pw2"
                  type="password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required minLength={8} autoComplete="new-password"
                />
              </div>
              <div className="auth-actions">
                <button type="submit" className="btn" disabled={loading || !token}>
                  {loading ? 'מעדכן…' : 'עדכון סיסמה ←'}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="auth-foot">
          <Link to="/admin/login">חזרה לכניסה</Link>
        </div>
      </div>
    </main>
  );
}
