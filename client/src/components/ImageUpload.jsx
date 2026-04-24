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
        <div className="upload-preview">
          <img src={value} alt="" />
          <div className="upload-meta">
            <small className="upload-url ltr">{value}</small>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={remove}>
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
            type="button" className="upload-dropzone"
            onClick={() => inputRef.current?.click()} disabled={uploading}
          >
            <span className="upload-ico" aria-hidden="true">↑</span>
            <span className="upload-cta">{uploading ? 'מעלה…' : 'העלאת תמונה'}</span>
            <span className="upload-help">JPEG / PNG / WebP · עד {MAX_MB}MB · יומר אוטומטית ל-WebP</span>
          </button>
        </>
      )}
      {err && <div className="alert alert-error" role="alert" style={{ marginTop: '8px' }}>{err}</div>}
    </div>
  );
}
