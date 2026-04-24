import { useEffect, useState } from 'react';
import api from '../../api.js';
import ImageUpload from '../../components/ImageUpload.jsx';

const blank = {
  title: '', slug: '', category: '', location: '', year: new Date().getFullYear(),
  summary: '', description: '', imageUrl: '', order: 0, isFeatured: false,
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/projects');
      setItems(data);
      setErr('');
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בטעינת הפרויקטים');
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing('new'); setForm(blank); setErr(''); }
  function openEdit(item) { setEditing(item._id); setForm({ ...blank, ...item }); setErr(''); }
  function close() { setEditing(null); setErr(''); }

  async function save(e) {
    e.preventDefault();
    setErr('');
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        order: Number(form.order) || 0,
      };
      if (editing === 'new') {
        await api.post('/projects', payload);
      } else {
        await api.put(`/projects/${editing}`, payload);
      }
      close();
      load();
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בשמירה');
    }
  }

  async function remove(id) {
    if (!confirm('למחוק פרויקט זה?')) return;
    try {
      await api.delete(`/projects/${id}`);
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
        <h1>פרויקטים</h1>
        <button className="btn" onClick={openNew}>+ פרויקט חדש</button>
      </div>

      {err && !editing && <div className="alert alert-error">{err}</div>}

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>סדר</th>
              <th>שם</th>
              <th>קטגוריה</th>
              <th>מיקום</th>
              <th>שנה</th>
              <th>מומלץ</th>
              <th style={{ width: 160 }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td>{p.order}</td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.location}</td>
                <td>{p.year || '—'}</td>
                <td>{p.isFeatured ? '⭐' : '—'}</td>
                <td className="admin-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(p)}>עריכה</button>
                  <button className="btn btn-danger" onClick={() => remove(p._id)}>מחיקה</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted">אין פרויקטים עדיין.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={close} role="dialog" aria-modal="true">
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === 'new' ? 'פרויקט חדש' : 'עריכת פרויקט'}</h2>
            {err && <div className="alert alert-error" role="alert">{err}</div>}
            <div className="grid grid-2">
              <div className="form-group">
                <label>שם <span className="req">*</span></label>
                <input required value={form.title} onChange={update('title')} />
              </div>
              <div className="form-group">
                <label>מזהה (slug) <span className="req">*</span></label>
                <input required value={form.slug} onChange={update('slug')} dir="ltr"
                       placeholder="lobby-haifa-tower" />
              </div>
            </div>
            <div className="grid grid-3">
              <div className="form-group">
                <label>קטגוריה</label>
                <input value={form.category} onChange={update('category')} placeholder="חיפוי לובי" />
              </div>
              <div className="form-group">
                <label>מיקום</label>
                <input value={form.location} onChange={update('location')} placeholder="חיפה" />
              </div>
              <div className="form-group">
                <label>שנה</label>
                <input type="number" value={form.year} onChange={update('year')} />
              </div>
            </div>
            <div className="form-group">
              <label>תיאור קצר</label>
              <input value={form.summary} onChange={update('summary')}
                     placeholder="משפט אחד שמסכם את הפרויקט" />
            </div>
            <div className="form-group">
              <label>תיאור מלא</label>
              <textarea value={form.description} onChange={update('description')}
                        placeholder="תיאור מורחב — חומרים, היקף, אתגרים…" />
            </div>
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              label="תמונת פרויקט"
            />
            <div className="form-group">
              <label>סדר תצוגה</label>
              <input type="number" value={form.order} onChange={update('order')} />
              <div className="help">מספר נמוך = מוצג קודם.</div>
            </div>
            <div className="form-group">
              <label className="inline">
                <input type="checkbox" checked={form.isFeatured} onChange={update('isFeatured')} />
                <span>מומלץ — מוצג בדף הבית</span>
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="submit" className="btn">שמירה</button>
              <button type="button" className="btn btn-ghost" onClick={close}>ביטול</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
