import { useEffect, useState } from 'react';
import api from '../../api.js';

export default function ContactsAdmin() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/contacts');
      setItems(data);
      setErr('');
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בטעינת הפניות');
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    try {
      await api.patch(`/contacts/${id}/read`);
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בסימון כנקרא');
    }
  }

  async function remove(id) {
    if (!confirm('למחוק פנייה זו?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      setSelected(null);
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה במחיקה');
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <>
      <div className="admin-header">
        <h1>פניות מהאתר</h1>
        <small className="text-muted">{items.length} פניות בסך הכל</small>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>סטטוס</th>
              <th>תאריך</th>
              <th>שם</th>
              <th>טלפון</th>
              <th>נושא</th>
              <th>מייל נשלח</th>
              <th style={{ width: 220 }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} style={c.isRead ? { opacity: 0.7 } : undefined}>
                <td>{c.isRead ? '✓ נקרא' : <strong style={{ color: 'var(--color-accent)' }}>חדש</strong>}</td>
                <td>{formatDate(c.createdAt)}</td>
                <td>{c.name}</td>
                <td><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                <td>{c.subject || '—'}</td>
                <td>{c.emailSent ? '✉️' : '—'}</td>
                <td className="admin-actions">
                  <button className="btn btn-outline" onClick={() => setSelected(c)}>צפייה</button>
                  {!c.isRead && (
                    <button className="btn" onClick={() => markRead(c._id)}>סמן כנקרא</button>
                  )}
                  <button className="btn btn-danger" onClick={() => remove(c._id)}>מחיקה</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted">אין פניות עדיין.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.subject || 'פנייה'}</h2>
            <p className="text-muted">{formatDate(selected.createdAt)}</p>
            <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem 1rem' }}>
              <dt><strong>שם:</strong></dt><dd>{selected.name}</dd>
              <dt><strong>טלפון:</strong></dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd>
              {selected.email && (<><dt><strong>אימייל:</strong></dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></>)}
              <dt><strong>הודעה:</strong></dt>
              <dd style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</dd>
            </dl>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {!selected.isRead && (
                <button className="btn" onClick={async () => { await markRead(selected._id); setSelected(null); }}>
                  סמן כנקרא
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>סגור</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
