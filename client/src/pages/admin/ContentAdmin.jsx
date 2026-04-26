import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api.js';
import ContentPreview from './ContentPreview.jsx';

const SECTION_CONFIG = [
  { key: 'nav',      icon: '🧭', label: 'תפריט ניווט עליון' },
  { key: 'footer',   icon: '🦶', label: 'פוטר (תחתית האתר)' },
  { key: 'home',     icon: '🏠', label: 'דף הבית' },
  { key: 'about',    icon: '👥', label: 'עמוד אודות' },
  { key: 'services', icon: '🛠️', label: 'עמוד שירותים' },
  { key: 'projects', icon: '🏗️', label: 'עמוד פרויקטים' },
  { key: 'contact',  icon: '📞', label: 'עמוד צור קשר' },
  { key: 'legal',    icon: '📄', label: 'עמודים משפטיים' },
];
const SECTION_ORDER = SECTION_CONFIG.map((s) => s.key);
const SECTION_MAP = Object.fromEntries(SECTION_CONFIG.map((s) => [s.key, s]));

// ─── Toast ─────────────────���──────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', top: 20, right: '50%', transform: 'translateX(50%)',
      background: '#1a7c3e', color: '#fff', padding: '0.75rem 1.5rem',
      borderRadius: 8, fontWeight: 500, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      animation: 'slideDown 0.2s ease',
    }}>
      {message}
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateX(50%) translateY(-10px); } to { opacity:1; transform:translateX(50%) translateY(0); } }`}</style>
    </div>
  );
}

// ─── Item Card ───────────────────────────────────────────
function ItemCard({ item, onSaved, onToast }) {
  const [value, setValue] = useState(item.value || '');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const textareaRef = useRef(null);

  const isDirty = value !== (item.value || '');
  const lines = value ? value.split('\n').length : 1;
  const rows = Math.min(12, Math.max(2, lines));

  // auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  async function save() {
    setSaving(true);
    try {
      await api.put(`/content/${item.key}`, { value });
      onSaved(item.key, value);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      onToast(`✓ הטקסט "${item.label}" עודכן בהצלחה`);
    } catch (_e) {
      // keep dirty so user can retry
    } finally {
      setSaving(false);
    }
  }

  const btnLabel = saving ? 'שומר...' : savedFlash ? '✓ נשמר!' : 'שמור';
  const btnStyle = savedFlash ? { color: '#1a7c3e' } : {};

  return (
    <div style={{
      background: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '1.5rem',
      marginBottom: '1rem',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>
          📝 {item.label}
        </div>
        {item.description && (
          <div className="muted" style={{ fontSize: '0.9rem' }}>{item.description}</div>
        )}
      </div>

      {/* Input + actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          {item.multiline ? (
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: '100%' }}
            />
          )}
        </div>
        <button
          className="btn"
          onClick={save}
          disabled={!isDirty || saving}
          style={btnStyle}
        >
          {btnLabel}
        </button>
        <button
          type="button"
          title="פתח את הטקסט באתר"
          onClick={() => window.open(item.previewPath || '/', '_blank')}
          style={{
            background: 'none', border: '1px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-sm)', padding: '0.4rem 0.6rem',
            cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-secondary)',
            minHeight: 44,
          }}
        >
          ↗
        </button>
      </div>

      {/* Preview */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className="muted" style={{ fontSize: '0.85rem', marginBottom: 6 }}>👁️ תצוגה מקדימה</div>
        <ContentPreview value={value} previewType={item.previewType || 'plain'} />
      </div>

      {/* Technical details */}
      <details style={{ marginTop: '0.5rem' }}>
        <summary className="muted" style={{ cursor: 'pointer', fontSize: '0.85rem', userSelect: 'none' }}>
          ▾ פרטים טכניים
        </summary>
        <div className="muted" style={{ fontSize: '0.85rem', marginTop: 6, paddingRight: 8 }}>
          מזהה: <code style={{ fontFamily: 'monospace', background: 'var(--color-bg-tertiary)', padding: '1px 4px', borderRadius: 3 }}>{item.key}</code>
        </div>
      </details>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────
export default function ContentAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [toast, setToast] = useState(null);

  function handleSearchChange(value) {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/content/admin/all');
      setItems(data);
    } catch (_e) {
      setError('שגיאה בטעינת התוכן מהשרת.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSaved(key, newValue) {
    setItems((prev) => prev.map((it) => it.key === key ? { ...it, value: newValue } : it));
  }

  const q = search.trim().toLowerCase();
  const filtered = q
    ? items.filter((it) =>
        (it.label || '').toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q) ||
        (it.value || '').toLowerCase().includes(q)
      )
    : items;

  // build ordered groups
  const knownSections = SECTION_ORDER.filter((s) => filtered.some((it) => it.section === s));
  const unknownSections = [...new Set(filtered.map((it) => it.section).filter((s) => !SECTION_ORDER.includes(s)))];
  const allSections = [...knownSections, ...unknownSections];
  const groups = allSections.map((section) => ({
    section,
    sectionItems: filtered.filter((it) => it.section === section),
  })).filter((g) => g.sectionItems.length > 0);

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="admin-header">
        <div>
          <h1>ניהול תוכן האתר</h1>
          <div className="admin-header-meta">
            כאן ניתן לערוך כל טקסט שמופיע באתר. השינויים מתעדכנים מיידית. השתמשו בחיפוש כדי למצוא במהירות טקסט מסוים.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800 }}>
        {/* Search + count */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ margin: 0, flex: '1 1 280px' }}>
            <input
              type="search"
              placeholder="חיפוש טקסט באתר..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          {!loading && !error && (
            <span className="muted" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              סך הכל {filtered.length} טקסטים
            </span>
          )}
        </div>

        {/* States */}
        {loading && <div className="muted">טוען…</div>}

        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{error}</span>
            <button className="btn btn-ghost" onClick={load} style={{ marginRight: 'auto' }}>נסו שוב</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="alert alert-error">
            אין תוכן עדיין. הריצו <code>npm run seed</code> בטרמינל.
          </div>
        )}

        {!loading && !error && items.length > 0 && q && filtered.length === 0 && (
          <div className="muted" style={{ padding: '2rem 0', textAlign: 'center' }}>
            לא נמצאו טקסטים התואמים לחיפוש &quot;{search}&quot;. נסו מילה אחרת.
          </div>
        )}

        {/* Sections */}
        {groups.map(({ section, sectionItems }) => {
          const cfg = SECTION_MAP[section] || { icon: '📌', label: section };
          return (
            <div key={section} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--color-border-secondary)' }}>
                <span style={{ fontSize: '1.3rem' }}>{cfg.icon}</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{cfg.label}</h2>
                <span className="muted" style={{ fontSize: '0.85rem', marginRight: 4 }}>({sectionItems.length})</span>
              </div>
              {sectionItems.map((item) => (
                <ItemCard key={item.key} item={item} onSaved={handleSaved} onToast={setToast} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
