import { useEffect, useState } from 'react';
import api from '../../api.js';
import ImageUpload from '../../components/ImageUpload.jsx';

const blank = {
  title: '', slug: '', category: '', location: '', year: new Date().getFullYear(),
  summary: '', description: '', images: [], order: 0, isFeatured: false,
};

const cardStyle = {
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
  background: 'var(--surface)',
  display: 'flex',
  flexDirection: 'column',
};

const imgPreviewStyle = {
  width: '100%',
  aspectRatio: '4/3',
  objectFit: 'cover',
  display: 'block',
  background: 'var(--border)',
};

const cardBodyStyle = {
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const cardActionsStyle = {
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
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

  function openEdit(item) {
    let images = item.images && item.images.length
      ? [...item.images]
      : item.imageUrl
        ? [{ url: item.imageUrl, caption: '', order: 0 }]
        : [];
    setEditing(item._id);
    setForm({ ...blank, ...item, images });
    setErr('');
  }

  function close() { setEditing(null); setErr(''); }

  // ── image gallery helpers ────────────────────────────────────────────────

  function addImage(url) {
    setForm((f) => ({
      ...f,
      images: [...f.images, { url, caption: '', order: f.images.length }],
    }));
  }

  function removeImage(index) {
    setForm((f) => {
      const next = f.images.filter((_, i) => i !== index);
      next.forEach((img, i) => { img.order = i; });
      return { ...f, images: next };
    });
  }

  function moveImage(index, direction) {
    setForm((f) => {
      const next = [...f.images];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      next.forEach((img, i) => { img.order = i; });
      return { ...f, images: next };
    });
  }

  function updateCaption(index, caption) {
    setForm((f) => {
      const next = [...f.images];
      next[index] = { ...next[index], caption };
      return { ...f, images: next };
    });
  }

  // ── save ─────────────────────────────────────────────────────────────────

  async function save(e) {
    e.preventDefault();
    setErr('');
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        order: Number(form.order) || 0,
        images: form.images,
      };
      // don't send legacy imageUrl — server derives it from images[0]
      delete payload.imageUrl;

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
              <th>תמונות</th>
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
                <td>{p.images?.length || (p.imageUrl ? 1 : 0)}</td>
                <td>{p.isFeatured ? '⭐' : '—'}</td>
                <td className="admin-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(p)}>עריכה</button>
                  <button className="btn btn-danger" onClick={() => remove(p._id)}>מחיקה</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted">אין פרויקטים עדיין.</td></tr>
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

            {/* ── multi-image gallery ─────────────────────────────────────── */}
            <div className="form-group">
              <label>תמונות הפרויקט</label>
              {form.images.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={cardStyle}>
                      <div style={{ position: 'relative' }}>
                        <img src={img.url} alt="" style={imgPreviewStyle} />
                        {i === 0 && (
                          <span style={{
                            position: 'absolute', top: 6, insetInlineStart: 6,
                            background: 'rgb(17,17,17)', color: '#fff',
                            fontSize: '0.65rem', fontWeight: 600,
                            padding: '2px 6px', borderRadius: 4,
                          }}>
                            ראשית
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          aria-label="הסר תמונה"
                          style={{
                            position: 'absolute', top: 4, insetInlineEnd: 4,
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'rgba(220,38,38,0.9)', color: '#fff',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', lineHeight: 1, padding: 0,
                          }}
                        >×</button>
                      </div>
                      <div style={cardBodyStyle}>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateCaption(i, e.target.value)}
                          placeholder="כיתוב (אופציונלי)"
                          style={{ fontSize: '0.8rem' }}
                        />
                        <div style={cardActionsStyle}>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => moveImage(i, 'up')}
                            disabled={i === 0}
                            style={{ flex: 1, padding: '2px 0', fontSize: '0.8rem' }}
                          >▲</button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => moveImage(i, 'down')}
                            disabled={i === form.images.length - 1}
                            style={{ flex: 1, padding: '2px 0', fontSize: '0.8rem' }}
                          >▼</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <ImageUpload
                value=""
                onChange={addImage}
                label="+ הוסף תמונה"
              />
            </div>

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
