import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './AccessibilityWidget.css';

const STORAGE_KEY = 'ys_a11y_prefs';

const TOGGLES = [
  { key: 'large-text', label: 'הגדלת טקסט' },
  { key: 'huge-text', label: 'טקסט ענק' },
  { key: 'high-contrast', label: 'ניגודיות גבוהה' },
  { key: 'invert-colors', label: 'היפוך צבעים' },
  { key: 'highlight-links', label: 'הדגשת קישורים' },
  { key: 'readable-font', label: 'גופן קריא' },
  { key: 'underline-headings', label: 'הדגשת כותרות' },
  { key: 'reduce-motion', label: 'עצירת אנימציות' },
];

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_e) {
    return {};
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(loadPrefs);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    TOGGLES.forEach(({ key }) => {
      html.classList.toggle(`a11y-${key}`, !!prefs[key]);
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (_e) { /* ignore */ }
  }, [prefs]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onClick(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        toggleRef.current && !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  function toggle(key) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      if (key === 'large-text' && next[key]) next['huge-text'] = false;
      if (key === 'huge-text' && next[key]) next['large-text'] = false;
      if (key === 'high-contrast' && next[key]) next['invert-colors'] = false;
      if (key === 'invert-colors' && next[key]) next['high-contrast'] = false;
      return next;
    });
  }

  function reset() { setPrefs({}); }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="a11y-toggle-btn"
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">♿</span>
      </button>

      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          className="a11y-panel"
          role="dialog"
          aria-labelledby="a11y-panel-title"
        >
          <div className="a11y-panel-head">
            <h2 id="a11y-panel-title">התאמות נגישות</h2>
            <button
              type="button" className="a11y-close" aria-label="סגירה"
              onClick={() => { setOpen(false); toggleRef.current?.focus(); }}
            >×</button>
          </div>

          <div className="a11y-grid">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`a11y-chip ${prefs[key] ? 'on' : ''}`}
                aria-pressed={!!prefs[key]}
                onClick={() => toggle(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="a11y-foot">
            <button type="button" className="a11y-reset" onClick={reset}>
              איפוס הגדרות
            </button>
            <Link to="/accessibility" onClick={() => setOpen(false)}>
              הצהרת נגישות ←
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
