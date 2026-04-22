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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: '2rem' }}>
        <h1 style={{ marginBottom: '0.3rem' }}>שכחתי סיסמה</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          הזינו את כתובת המייל ונשלח אליכם קישור לאיפוס סיסמה.
        </p>
        {submitted ? (
          <>
            <div className="alert alert-success">
              אם הכתובת קיימת במערכת, נשלח אליה מייל עם הוראות לאיפוס הסיסמה.
              הקישור תקף למשך שעה אחת.
            </div>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/admin/login">חזרה לכניסה</Link>
            </p>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            {err && <div className="alert alert-error">{err}</div>}
            <div className="form-group">
              <label>אימייל</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required autoFocus autoComplete="username"
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'שולח…' : 'שליחת קישור לאיפוס'}
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
