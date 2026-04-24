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

      <div style={{ maxWidth: 560 }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>פרטי חשבון</h3>
          <p><strong>אימייל:</strong> {user?.email}</p>
          <p><strong>תפקיד:</strong> {user?.role}</p>
        </div>

        <form onSubmit={onSubmit} className="card">
          <h3>שינוי סיסמה</h3>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה וספרה.
          </p>
          {msg.type && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <div className="form-group">
            <label>סיסמה נוכחית</label>
            <input
              type="password" value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label>סיסמה חדשה</label>
            <input
              type="password" value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              required minLength={8} autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>אישור סיסמה חדשה</label>
            <input
              type="password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required minLength={8} autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'מעדכן…' : 'עדכון סיסמה'}
          </button>
        </form>
      </div>
    </>
  );
}
