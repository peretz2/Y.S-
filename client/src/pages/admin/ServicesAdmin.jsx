import { useEffect, useState } from 'react';
import api from '../../api.js';

const blank = {
  title: '', slug: '', icon: '', shortDescription: '', description: '',
  order: 0, isActive: true,
};

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/services/all');
      setItems(data);
      setErr('');
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בטעינת השירותים');
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing('new');
    setForm(blank);
    setErr('');
  }

  function openEdit(item) {
    setEditing(item._id);
    setForm({ ...blank, ...item });
    setErr('');
  }

  function close() { setEditing(null); setErr(''); }

  async function save(e) {
    e.preventDefault();
    setErr('');
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing === 'new') {
        await api.post('/services', payload);
      } else {
        await api.put(`/services/${editing}`, payload);
      }
      close();
      load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בשמירה');
    }
  }

  async function remove(id) {
    if (!confirm('למחוק שירות זה?')) return;
    try {
      await api.delete(`/services/${id}`);
      setErr('');
      await load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה במחיקה');
    }
  }

  const update = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  return (
    <>
      <div className="admin-header">
        <h1>שירותים</h1>
        <button className="btn" onClick={openNew}>+ שירות חדש</button>
      </div>

      {err && !editing && <div className="alert alert-error">{err}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>סדר</th>
              <th>שם</th>
              <th>מזהה (slug)</th>
              <th>פעיל</th>
              <th style={{ width: 160 }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id}>
                <td>{s.order}</td>
                <td>{s.icon} {s.title}</td>
                <td><code>{s.slug}</code></td>
                <td>{s.isActive ? '✅' : '—'}</td>
                <td className="admin-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(s)}>עריכה</button>
                  <button className="btn btn-danger" onClick={() => remove(s._id)}>מחיקה</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted">אין שירותים עדיין.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={close}>
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === 'new' ? 'שירות חדש' : 'עריכת שירות'}</h2>
            {err && <div className="alert alert-error">{err}</div>}
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label>שם *</label>
                <input required value={form.title} onChange={update('title')} />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input required value={form.slug} onChange={update('slug')} />
              </div>
            </div>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label>אייקון (אמוג׳י)</label>
                <input value={form.icon} onChange={update('icon')} placeholder="🪚" />
              </div>
              <div className="form-group">
                <label>סדר תצוגה</label>
                <input type="number" value={form.order} onChange={update('order')} />
              </div>
            </div>
            <div className="form-group">
              <label>תיאור קצר *</label>
              <input required value={form.shortDescription} onChange={update('shortDescription')} />
            </div>
            <div className="form-group">
              <label>תיאור מלא *</label>
              <textarea required value={form.description} onChange={update('description')} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={form.isActive} onChange={update('isActive')} />
                {' '}מוצג באתר
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
              <button type="submit" className="btn">שמירה</button>
              <button type="button" className="btn btn-outline" onClick={close}>ביטול</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
