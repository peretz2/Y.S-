import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('הכל');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('/projects');
        if (alive && Array.isArray(data)) {
          setProjects([...data].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      } catch (_e) { /* ignore */ }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['הכל', ...Array.from(set)];
  }, [projects]);

  const filtered = category === 'הכל'
    ? projects
    : projects.filter((p) => p.category === category);

  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>§ תיק עבודות · Selected works</span>
        </div>
        <h1 className="display">
          מה שעשינו<br /><em>בשנים האחרונות.</em>
        </h1>
        <div className="page-lead">
          <p>
            מבחר פרויקטים בתחומי הנגרות לבניין, חיפויי HPL וחיפוי לובאים — מפרויקטים פרטיים ועד לבנייני משרדים ומגורים.
            כל פרויקט תוכנן, יוצר והותקן על ידי הצוות שלנו.
          </p>
          <p>
            הגלריה מתעדכנת באופן שוטף. לקוח שעבדנו איתו ולא מופיע כאן — כנראה בכוונה: חלק מהפרויקטים נשארים פרטיים לבקשת המזמין.
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k">הפרויקטים</span></div>
          <h2>
            {filtered.length ? <>{String(filtered.length).padStart(2, '0')} עבודות<br /><em>נבחרות.</em></> : <>אין עדיין<br /><em>פרויקטים.</em></>}
          </h2>
        </div>

        {!loading && categories.length > 2 && (
          <div className="proj-filters" role="tablist" aria-label="סינון לפי קטגוריה">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={c === category}
                className={`proj-chip ${c === category ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-muted text-center">טוען…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-center">אין פרויקטים להצגה.</p>
        ) : (
          <div className="proj-grid">
            {filtered.map((p, i) => (
              <article key={p._id} className="proj-card">
                <div
                  className="proj-media"
                  style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : undefined}
                  aria-hidden={p.imageUrl ? 'true' : undefined}
                >
                  {!p.imageUrl && (
                    <span className="proj-placeholder">
                      {p.category || 'פרויקט'}
                    </span>
                  )}
                  <span className="proj-num">№ {String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="proj-body">
                  <div className="proj-mono">
                    <span>{p.category || '—'}</span>
                    <span>·</span>
                    <span>{p.year || '—'}</span>
                  </div>
                  <h3>{p.title}</h3>
                  {p.summary && <p className="proj-summary">{p.summary}</p>}
                  <dl className="proj-dl">
                    <dt>Location</dt><dd>{p.location || '—'}</dd>
                    <dt>Category</dt><dd>{p.category || '—'}</dd>
                    <dt>Year</dt><dd>{p.year || '—'}</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <h2>יש לכם פרויקט<br /><em>דומה בתכנון?</em></h2>
          <div className="cta-side">
            <p>שלחו לנו תכניות ראשוניות או תיאור של הכיוון — נחזור עם כיוון מחיר ראשוני.</p>
            <Link to="/contact" className="btn btn-inv">התחלת שיחה ←</Link>
          </div>
        </div>
      </section>
    </>
  );
}
