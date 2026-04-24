import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
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
        <h1>שכחתי <em>סיסמה.</em></h1>
        <p className="auth-sub">הזן את כתובת המייל ונשלח אליך קישור לאיפוס.</p>

        {submitted ? (
          <>
            <div className="alert alert-success" role="status">
              אם הכתובת קיימת במערכת, נשלח אליה מייל עם הוראות לאיפוס הסיסמה. הקישור תקף לשעה.
            </div>
            <div className="auth-foot">
              <Link to="/admin/login">חזרה לכניסה</Link>
            </div>
          </>
        ) : (
          <>
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
              <div className="auth-actions">
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'שולח…' : 'שליחת קישור ←'}
                </button>
              </div>
            </form>
            <div className="auth-foot">
              <Link to="/admin/login">חזרה לכניסה</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
