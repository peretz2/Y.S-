import { useState } from 'react';
import api from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function ChangePassword() {
  const { user } = useAuth();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: null, text: '' });
    if (newPassword !== confirm) {
      setMsg({ type: 'error', text: 'הסיסמאות אינן תואמות' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setMsg({ type: 'success', text: 'הסיסמה עודכנה בהצלחה' });
      setCurrent(''); setNew(''); setConfirm('');
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.error || 'שגיאה' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>חשבון ואבטחה</h1>
      </div>

      <div className="admin-grid-2">
        <section className="admin-section">
          <header className="admin-section-head">
            <span className="mono">פרטי חשבון</span>
            <h2>הפרטים שלך</h2>
          </header>
          <dl className="admin-dl">
            <dt>אימייל</dt>
            <dd className="ltr">{user?.email}</dd>
            <dt>תפקיד</dt>
            <dd>{user?.role === 'admin' ? 'מנהל מערכת' : user?.role}</dd>
          </dl>
        </section>

        <section className="admin-section">
          <header className="admin-section-head">
            <span className="mono">אבטחה</span>
            <h2>שינוי סיסמה</h2>
          </header>
          <form onSubmit={onSubmit} noValidate>
            <p className="help" style={{ marginBottom: '1rem' }}>
              הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה וספרה.
            </p>
            {msg.type && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
            <div className="form-group">
              <label htmlFor="cur">סיסמה נוכחית</label>
              <input
                id="cur"
                type="password" value={currentPassword}
                onChange={(e) => setCurrent(e.target.value)}
                required autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="new">סיסמה חדשה</label>
              <input
                id="new"
                type="password" value={newPassword}
                onChange={(e) => setNew(e.target.value)}
                required minLength={8} autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="new2">אישור סיסמה חדשה</label>
              <input
                id="new2"
                type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required minLength={8} autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'מעדכן…' : 'עדכון סיסמה'}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
