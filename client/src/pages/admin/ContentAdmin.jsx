import { useEffect, useState } from 'react';
import api from '../../api.js';

const SECTION_LABELS = {
  nav:      'תפריט ניווט',
  footer:   'פוטר',
  home:     'דף הבית',
  about:    'אודות',
  services: 'עמוד שירותים',
  projects: 'עמוד פרויקטים',
  contact:  'צור קשר',
  legal:    'עמודים משפטיים',
};

const SECTION_ORDER = ['nav', 'footer', 'home', 'about', 'services', 'projects', 'contact', 'legal'];

function ContentRow({ item, onSaved }) {
  const [value, setValue] = useState(item.value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty = value !== item.value;
  const lines = value ? value.split('\n').length : 1;
  const rows = Math.min(8, Math.max(2, lines));

  async function save() {
    setSaving(true);
    try {
      await api.put(`/content/${item.key}`, { value });
      onSaved(item.key, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_e) {
      // keep dirty so user can retry
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="content-row">
      <div className="content-row-label">
        <strong>{item.label}</strong>
        <small className="muted" style={{ fontFamily: 'monospace', display: 'block', marginTop: 2 }}>{item.key}</small>
      </div>
      <div className="content-row-input">
        {item.multiline ? (
          <textarea
            rows={rows}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: '100%' }}
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
      <div className="content-row-action">
        <button
          className="btn"
          onClick={save}
          disabled={!isDirty || saving}
        >
          {saving ? 'שומר…' : saved ? '✓ נשמר' : 'שמור'}
        </button>
      </div>
    </div>
  );
}

export default function ContentAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/content/admin/all');
        setItems(data);
      } catch (_e) {
        setError('שגיאה בטעינת התוכן');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleSaved(key, newValue) {
    setItems((prev) => prev.map((it) => it.key === key ? { ...it, value: newValue } : it));
  }

  const filtered = search.trim()
    ? items.filter((it) => {
        const q = search.toLowerCase();
        return (
          it.key.toLowerCase().includes(q) ||
          (it.label || '').toLowerCase().includes(q) ||
          (it.section || '').toLowerCase().includes(q) ||
          (it.value || '').toLowerCase().includes(q)
        );
      })
    : items;

  // group by section
  const groups = [];
  const seen = new Set();
  const orderedSections = [
    ...SECTION_ORDER.filter((s) => filtered.some((it) => it.section === s)),
    ...filtered
      .map((it) => it.section)
      .filter((s) => !SECTION_ORDER.includes(s) && !seen.has(s) && seen.add(s)),
  ];

  for (const section of orderedSections) {
    const sectionItems = filtered.filter((it) => it.section === section);
    if (sectionItems.length) groups.push({ section, sectionItems });
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>תוכן האתר</h1>
          <div className="admin-header-meta">עריכת כל הטקסטים המופיעים באתר. שמירה מתעדכנת מיידית.</div>
        </div>
      </div>

      <div style={{ maxWidth: 880 }}>
        <div className="form-group" style={{ marginBottom: 24 }}>
          <input
            type="search"
            placeholder="חיפוש..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 400 }}
          />
        </div>

        {loading && <div className="muted">טוען…</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="alert alert-error">אין תוכן. הריצו npm run seed</div>
        )}

        {groups.map(({ section, sectionItems }) => (
          <div key={section} className="admin-section" style={{ marginBottom: 32 }}>
            <header className="admin-section-head">
              <h2>{SECTION_LABELS[section] || section} <span className="muted" style={{ fontWeight: 400, fontSize: '0.85em' }}>({sectionItems.length})</span></h2>
            </header>
            <div className="content-list">
              {sectionItems.map((item) => (
                <ContentRow key={item.key} item={item} onSaved={handleSaved} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .content-row {
          display: grid;
          grid-template-columns: 220px 1fr auto;
          gap: 12px;
          align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .content-row:last-child { border-bottom: none; }
        .content-row-label { padding-top: 6px; }
        .content-row-action { padding-top: 4px; }
        @media (max-width: 640px) {
          .content-row { grid-template-columns: 1fr auto; }
          .content-row-label { grid-column: 1 / -1; }
        }
      `}</style>
    </>
  );
}
