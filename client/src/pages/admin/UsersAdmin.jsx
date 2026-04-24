import { useEffect, useState } from 'react';
import api from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

const blank = { email: '', password: '' };

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [resetFor, setResetFor] = useState(null);
  const [resetPw, setResetPw] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
      setErr('');
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בטעינת המשתמשים');
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing('new'); setForm(blank); setErr(''); }
  function close() { setEditing(null); setResetFor(null); setForm(blank); setResetPw(''); setErr(''); }

  async function save(e) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      await api.post('/auth/users', form);
      close();
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה ביצירת המשתמש');
    } finally {
      setSaving(false);
    }
  }

  async function remove(u) {
    if (u._id === me?._id) {
      alert('אי אפשר למחוק את עצמך מכאן.');
      return;
    }
    if (!confirm(`למחוק את המשתמש ${u.email}? פעולה זו אינה הפיכה.`)) return;
    try {
      await api.delete(`/auth/users/${u._id}`);
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה במחיקה');
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      await api.post(`/auth/users/${resetFor._id}/reset-password`, { password: resetPw });
      close();
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה באיפוס הסיסמה');
    } finally {
      setSaving(false);
    }
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>משתמשי אדמין</h1>
          <div className="admin-header-meta">
            {users.length} מנהלים פעילים
          </div>
        </div>
        <button className="btn" onClick={openNew}>+ אדמין חדש</button>
      </div>

      {err && !editing && !resetFor && <div className="alert alert-error" role="alert">{err}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>אימייל</th>
              <th>תפקיד</th>
              <th>נוצר בתאריך</th>
              <th>סיסמה עודכנה</th>
              <th style={{ width: 220 }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="ltr">
                  {u.email}
                  {u.email === me?.email && <span className="ibadge" style={{ marginInlineStart: 8 }}>זה אתה</span>}
                </td>
                <td>{u.role === 'admin' ? 'מנהל' : u.role}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>{formatDate(u.passwordChangedAt)}</td>
                <td className="admin-actions">
                  <button className="btn btn-ghost" onClick={() => { setResetFor(u); setResetPw(''); setErr(''); }}>
                    איפוס סיסמה
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => remove(u)}
                    disabled={u.email === me?.email}
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted">אין משתמשים.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={close} role="dialog" aria-modal="true">
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>אדמין חדש</h2>
            {err && <div className="alert alert-error" role="alert">{err}</div>}
            <div className="form-group">
              <label htmlFor="ne">אימייל <span className="req">*</span></label>
              <input
                id="ne" type="email" required dir="ltr"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="np">סיסמה ראשונית <span className="req">*</span></label>
              <input
                id="np" type="text" required minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div className="help">
                לפחות 8 תווים, אות גדולה, אות קטנה וספרה. המשתמש יוכל לשנות אחרי הכניסה הראשונה.
              </div>
            </div>
            <div className="admin-modal-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'יוצר…' : 'יצירת משתמש'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={close}>ביטול</button>
            </div>
          </form>
        </div>
      )}

      {resetFor && (
        <div className="admin-modal-backdrop" onClick={close} role="dialog" aria-modal="true">
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={resetPassword}>
            <h2>איפוס סיסמה</h2>
            {err && <div className="alert alert-error" role="alert">{err}</div>}
            <p className="help" style={{ margin: '0 28px 16px' }}>
              איפוס סיסמה של <strong className="ltr">{resetFor.email}</strong>. הסיסמה החדשה תיכנס לתוקף מיד.
            </p>
            <div className="form-group">
              <label htmlFor="rp">סיסמה חדשה <span className="req">*</span></label>
              <input
                id="rp" type="text" required minLength={8}
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
              />
              <div className="help">
                לפחות 8 תווים, אות גדולה, אות קטנה וספרה.
              </div>
            </div>
            <div className="admin-modal-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'מעדכן…' : 'עדכון סיסמה'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={close}>ביטול</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
