import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useContent } from './SiteContentContext.jsx';
import api from '../api.js';

export default function Editable({ contentKey, as: Tag = 'span', multiline = false, children }) {
  const { user } = useAuth();
  const { t, reload } = useContent();
  const value = t(contentKey, children || '');

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  // sync draft when value changes externally
  useEffect(() => { setDraft(value); }, [value]);

  // focus input when editor opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onPointer(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (!user) return <Tag>{value}</Tag>;

  function openEditor(e) {
    e.preventDefault();
    e.stopPropagation();
    setDraft(value);
    setSaved(false);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      await api.put(`/content/${contentKey}`, { value: draft });
      await reload();
      setSaved(true);
      setTimeout(() => { setSaved(false); setOpen(false); }, 800);
    } catch (_e) {
      // keep editor open so user can retry
    } finally {
      setSaving(false);
    }
  }

  function onInputKey(e) {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); save(); }
    if (multiline && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
  }

  return (
    <Tag
      style={{ position: 'relative', outline: '1px dashed transparent', transition: 'outline-color 0.15s', padding: 2 }}
      className="editable-wrapper"
      onMouseEnter={(e) => { e.currentTarget.style.outlineColor = 'var(--color-border-secondary)'; }}
      onMouseLeave={(e) => { if (!open) e.currentTarget.style.outlineColor = 'transparent'; }}
    >
      {value}

      {/* pencil button */}
      <button
        type="button"
        onClick={openEditor}
        aria-label={`ערוך: ${contentKey}`}
        style={{
          position: 'absolute',
          top: -8,
          insetInlineEnd: -8,
          width: 24,
          height: 24,
          background: 'var(--color-text-primary)',
          color: 'var(--color-bg-primary)',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.15s',
          zIndex: 100,
          padding: 0,
          lineHeight: 1,
        }}
        className="editable-pencil"
      >
        ✎
      </button>

      {/* inline editor popover */}
      {open && (
        <div
          ref={popoverRef}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            insetInlineEnd: 0,
            background: 'var(--color-bg-primary)',
            border: '2px solid var(--color-text-primary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.75rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            minWidth: 280,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {multiline ? (
            <textarea
              ref={inputRef}
              value={draft}
              rows={3}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onInputKey}
              style={{ width: '100%', resize: 'vertical', fontSize: '0.9rem' }}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onInputKey}
              style={{ width: '100%', fontSize: '0.9rem' }}
            />
          )}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={saving}
              style={{ background: 'none', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-sm)', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || draft === value}
              className="btn"
              style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}
            >
              {saving ? 'שומר...' : saved ? '✓' : 'שמור'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .editable-wrapper:hover .editable-pencil { opacity: 1 !important; }
      `}</style>
    </Tag>
  );
}
