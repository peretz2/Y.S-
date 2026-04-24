import { useRef, useState } from 'react';
import api from '../api.js';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;

export default function ImageUpload({ value, onChange, label = 'תמונה' }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErr('רק JPEG, PNG או WebP');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`הקובץ גדול מ-${MAX_MB}MB`);
      e.target.value = '';
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/uploads/image', fd);
      onChange(data.url);
    } catch (error) {
      setErr(error.response?.data?.error || 'שגיאה בהעלאה');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function remove() {
    if (!value) return;
    const prev = value;
    onChange('');
    if (prev.startsWith('/uploads/')) {
      try {
        await api.delete('/uploads/image', { params: { url: prev } });
      } catch (_e) { /* ignore – DB already updated */ }
    }
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      {value ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '0.5rem', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)',
        }}>
          <img
            src={value} alt="preview"
            style={{
              width: 80, height: 80, objectFit: 'cover',
              borderRadius: 'var(--radius-sm)', flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <small className="text-muted" style={{
              display: 'block', direction: 'ltr', textAlign: 'left',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{value}</small>
          </div>
          <button type="button" className="btn btn-danger" onClick={remove}>
            הסרה
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef} type="file" accept={ACCEPT}
            onChange={onPick} disabled={uploading}
            style={{ display: 'none' }}
          />
          <button
            type="button" className="btn btn-outline"
            onClick={() => inputRef.current?.click()} disabled={uploading}
          >
            {uploading ? 'מעלה…' : '📷 העלאת תמונה'}
          </button>
          <small className="text-muted" style={{ display: 'block', marginTop: '0.4rem' }}>
            JPEG / PNG / WebP, עד {MAX_MB}MB. התמונה תומר ל-WebP ותוקטן אוטומטית.
          </small>
        </>
      )}
      {err && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{err}</div>}
    </div>
  );
}
