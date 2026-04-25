import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import './Home.css';

const FALLBACK_SERVICES = [
  { _id: 's1', order: 1, title: 'נגרות לבניין', slug: 'carpentry', shortDescription: 'דלתות, ארונות, מטבחים וספריות בהזמנה אישית לפרויקטים פרטיים ומסחריים.' },
  { _id: 's2', order: 2, title: 'חיפויי HPL', slug: 'hpl', shortDescription: 'חיפויי פנים וחוץ בעמידות גבוהה לחזיתות בניינים, לובאים ומשרדים.' },
  { _id: 's3', order: 3, title: 'חיפוי לובאים', slug: 'lobby', shortDescription: 'שילוב עץ, HPL, קוריאן ומתכת לעיצוב לובי ייחודי עם נוכחות אדריכלית.' },
  { _id: 's4', order: 4, title: 'ייצור CNC מותאם', slug: 'cnc', shortDescription: 'מפעל CNC מודרני לפרויקטים מורכבים ובלוחות זמנים צפופים.' },
  { _id: 's5', order: 5, title: 'ליווי הנדסי', slug: 'engineering', shortDescription: 'עבודה צמודה עם אדריכלים, קבלנים ומזמינים – מתכנון ועד מסירה.' },
];

const STATS = [
  { k: 'Experience', v: '21', sup: '+', n: 'שנות פעילות מאז 2005' },
  { k: 'Projects',   v: '100', sup: '+', n: 'פרויקטים שהושלמו בארץ' },
  { k: 'Team',       v: '20', sup: '',  n: 'מהנדסים, טכנאים ונגרים' },
  { k: 'Coverage',   v: '360°', sup: '', n: 'תכנון · ייצור · התקנה' },
];

const PROCESS = [
  { n: '01', t: 'פגישת היכרות', d: 'הבנת הצרכים, סיור באתר ובחירת כיוון אדריכלי ראשוני.' },
  { n: '02', t: 'תכנון ופירוט', d: 'שרטוטים טכניים, דגמי חומרים והצעת מחיר מפורטת.' },
  { n: '03', t: 'ייצור במפעל', d: 'ייצור CNC מדויק בבית המלאכה בגבעת אלה, בקרת איכות לכל שלב.' },
  { n: '04', t: 'התקנה ומסירה', d: 'התקנה באתר ע״י צוות מקצועי, בדיקה סופית ומסירה מסודרת.' },
];

export default function Home() {
  const { info: companyInfo } = useCompanyInfo();
  const { t } = useContent();
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [s, p] = await Promise.all([
          api.get('/services').catch(() => ({ data: [] })),
          api.get('/projects').catch(() => ({ data: [] })),
        ]);
        if (!alive) return;
        if (Array.isArray(s.data) && s.data.length) {
          setServices([...s.data].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
        if (Array.isArray(p.data)) {
          const sorted = [...p.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjects(sorted.slice(0, 3));
        }
      } catch (_e) { /* keep fallback */ }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <>
      <section className="wrap hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>{t('home.hero.eyebrow', 'Y.SCH. Engineers · גבעת אלה')} · Est. {companyInfo.founded}</span>
        </div>
        <h1 className="display">
          {t('home.hero.title.1', 'נגרות')}<br />{t('home.hero.title.2', 'וחיפויים.')}<br />
          <em>{t('home.hero.title.3', 'בגובה העיניים.')}</em>
        </h1>
        <div className="hero-meta">
          <p className="lead">
            {t('home.hero.lead', 'מעל שני עשורים של ייצור נגרות ברמה אדריכלית – חזיתות HPL, חיפויי לובי ונגרות פנים מוקפדת, לפרויקטים פרטיים, מסחריים וציבוריים בכל רחבי הארץ.')}
          </p>
          <div className="meta-col">
            <span className="mono">{t('home.hero.servicesLabel', 'השירותים שלנו')}</span>
            <div className="val">{t('home.hero.servicesValue', 'חיפוי HPL · נגרות · לובי')}</div>
            <div className="note">{t('home.hero.servicesNote', 'תכנון · ייצור · התקנה')}</div>
          </div>
          <div className="meta-col">
            <span className="mono">{t('home.hero.ctaLabel', 'לפרויקט חדש')}</span>
            <div className="hero-actions">
              <Link to="/contact" className="btn">{t('home.hero.ctaPrimary', 'לקבלת הצעת מחיר ←')}</Link>
              <Link to="/projects" className="btn btn-ghost">{t('home.hero.ctaGhost', 'תיק עבודות')}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="hero-slab">
          <span className="tag">Featured · {new Date().getFullYear()}</span>
          <div className="caption">
            <div>
              <div className="ttl">מגדל מגורים, חיפה</div>
              <div className="mono">חיפוי לובי · אלון · קוריאן</div>
            </div>
            <div className="mono">480 מ״ר · פרויקט №01</div>
          </div>
        </div>
      </section>

      <div className="strip">
        <div className="strip-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="strip-group">
              <span>נגרות לבניין</span><span>חיפוי HPL</span><span>חיפוי לובי</span>
              <span>ייצור CNC</span><span>ליווי הנדסי</span>
            </span>
          ))}
        </div>
      </div>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k">השירותים</span></div>
          <h2>חמישה תחומים.<br /><em>מפעל אחד.</em> צוות אחד.</h2>
        </div>
        <div className="svc-list">
          {services.map((s, i) => (
            <Link key={s._id || s.slug} to="/services" className="svc-row">
              <span className="num">{String(s.order || i + 1).padStart(2, '0')}</span>
              <span className="name">{s.title}</span>
              <span className="desc">{s.shortDescription || s.description || ''}</span>
              <span className="more">לפרטים</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="stats">
          {STATS.map((s) => (
            <div key={s.k} className="stat">
              <div className="k">{s.k}</div>
              <div className="v">{s.v}<span className="sup">{s.sup}</span></div>
              <div className="n">{s.n}</div>
            </div>
          ))}
        </div>
      </section>

      {projects.length > 0 && (
        <section className="wrap sec">
          <div className="sec-head">
            <div className="idx"><span className="n">§02</span><span className="k">פרויקטים נבחרים</span></div>
            <h2>עבודות שנעשו<br />בשלוש השנים <em>האחרונות.</em></h2>
          </div>
          <div className="proj-featured">
            {projects.map((p, i) => (
              <article key={p._id} className="proj-row">
                <div className="pnum">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</div>
                <div className="pmeta">
                  <h3>{p.title}</h3>
                  <dl>
                    <dt>Category</dt><dd>{p.category || '—'}</dd>
                    <dt>Location</dt><dd>{p.location || '—'}</dd>
                    <dt>Year</dt><dd>{p.year || '—'}</dd>
                    <dt>Summary</dt><dd>{p.summary || ''}</dd>
                  </dl>
                </div>
                <div className="pimg" style={{ backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : undefined }}>
                  {!p.imageUrl && <span className="ph">Project photography · {p.category || ''}</span>}
                </div>
              </article>
            ))}
          </div>
          <div className="sec-cta">
            <Link to="/projects" className="btn btn-ghost">כל תיק העבודות ←</Link>
          </div>
        </section>
      )}

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§03</span><span className="k">התהליך</span></div>
          <h2>ארבעה שלבים.<br />מפגישה ראשונה <em>עד מסירה.</em></h2>
        </div>
        <div className="process">
          {PROCESS.map((p) => (
            <div key={p.n} className="step">
              <div className="sn">{p.n}</div>
              <h4>{p.t}</h4>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <h2>פרויקט חדש באופק?<br /><em>נשמח לשמוע.</em></h2>
          <div className="cta-side">
            <p>שיחת ייעוץ ראשונית ללא עלות. אנחנו עונים בתוך יום עסקים ומגיעים לסיור באתר על פי צורך.</p>
            <Link to="/contact" className="btn btn-inv">להתחלת שיחה ←</Link>
          </div>
        </div>
      </section>
    </>
  );
}
