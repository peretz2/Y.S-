import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useContent } from '../content/SiteContentContext.jsx';
import Editable from '../content/Editable.jsx';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('הכל');
  const [loading, setLoading] = useState(true);
  const { t } = useContent();

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
          <span className="line" /><span><Editable contentKey="projects.eyebrow" as="span">{t('projects.eyebrow', '§ תיק עבודות · Selected works')}</Editable></span>
        </div>
        <h1 className="display">
          <Editable contentKey="projects.title.1" as="span">{t('projects.title.1', 'מה שעשינו')}</Editable><br />
          <em><Editable contentKey="projects.title.2" as="span">{t('projects.title.2', 'בשנים האחרונות.')}</Editable></em>
        </h1>
        <div className="page-lead">
          <p><Editable contentKey="projects.lead.1" as="span" multiline>{t('projects.lead.1', 'מבחר פרויקטים בתחומי הנגרות לבניין, חיפויי HPL וחיפוי לובאים — מפרויקטים פרטיים ועד לבנייני משרדים ומגורים. כל פרויקט תוכנן, יוצר והותקן על ידי הצוות שלנו.')}</Editable></p>
          <p><Editable contentKey="projects.lead.2" as="span" multiline>{t('projects.lead.2', 'הגלריה מתעדכנת באופן שוטף. לקוח שעבדנו איתו ולא מופיע כאן — כנראה בכוונה: חלק מהפרויקטים נשארים פרטיים לבקשת המזמין.')}</Editable></p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k"><Editable contentKey="projects.section.label" as="span">{t('projects.section.label', 'הפרויקטים')}</Editable></span></div>
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
          <p className="text-muted text-center"><Editable contentKey="projects.loading" as="span">{t('projects.loading', 'טוען…')}</Editable></p>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-center"><Editable contentKey="projects.empty" as="span">{t('projects.empty', 'אין פרויקטים להצגה.')}</Editable></p>
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
                  {p.images && p.images.length > 1 && (
                    <span style={{
                      position: 'absolute', bottom: 8, insetInlineEnd: 8,
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      fontSize: '0.72rem', fontWeight: 600,
                      padding: '2px 7px', borderRadius: 4,
                      lineHeight: 1.5,
                    }}>
                      +{p.images.length - 1}
                    </span>
                  )}
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
          <h2>
            <Editable contentKey="projects.cta.heading" as="span">{t('projects.cta.heading', 'יש לכם פרויקט')}</Editable><br />
            <em><Editable contentKey="projects.cta.heading.em" as="span">{t('projects.cta.heading.em', 'דומה בתכנון?')}</Editable></em>
          </h2>
          <div className="cta-side">
            <p><Editable contentKey="projects.cta.lead" as="span" multiline>{t('projects.cta.lead', 'שלחו לנו תכניות ראשוניות או תיאור של הכיוון — נחזור עם כיוון מחיר ראשוני.')}</Editable></p>
            <Link to="/contact" className="btn btn-inv"><Editable contentKey="projects.cta.button" as="span">{t('projects.cta.button', 'התחלת שיחה ←')}</Editable></Link>
          </div>
        </div>
      </section>
    </>
  );
}
