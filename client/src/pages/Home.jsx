import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { companyInfo } from '../api.js';
import './Home.css';

export default function Home() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {});
    api.get('/projects').then((r) => setProjects(r.data.filter((p) => p.isFeatured))).catch(() => {});
  }, []);

  const yearsActive = new Date().getFullYear() - companyInfo.founded;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">י.ש. מהנדסים בע״מ · גבעת אלה</span>
            <h1>נגרות וחיפויים<br/>ברמה הגבוהה ביותר.</h1>
            <p className="hero-sub">
              מעל {yearsActive} שנות ניסיון בנגרות לבניין, חיפויי HPL וחיפויי לובי –
              בפרויקטים פרטיים, מסחריים וציבוריים בכל רחבי הארץ.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-accent">לקבלת הצעת מחיר</Link>
              <Link to="/projects" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: '#fff' }}>
                הפרויקטים שלנו
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>{yearsActive}+</strong>
              <span>שנות ניסיון</span>
            </div>
            <div className="stat">
              <strong>100+</strong>
              <span>פרויקטים שהושלמו</span>
            </div>
            <div className="stat">
              <strong>20</strong>
              <span>אנשי צוות</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>התחומים שלנו</h2>
            <p className="text-muted">מגוון רחב של שירותי נגרות וחיפוי, הכל תחת קורת גג אחת.</p>
          </div>
          <div className="grid grid-3">
            {services.slice(0, 6).map((s) => (
              <Link to="/services" key={s._id} className="card service-card">
                <div className="service-icon">{s.icon || '🔧'}</div>
                <h3>{s.title}</h3>
                <p className="text-muted">{s.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>פרויקטים נבחרים</h2>
            <p className="text-muted">מבחר מהפרויקטים האחרונים שלנו – מבנים פרטיים ועד מתחמים ציבוריים.</p>
          </div>
          <div className="grid grid-3">
            {projects.slice(0, 3).map((p) => (
              <article key={p._id} className="card project-card">
                <div className="project-thumb" style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : undefined}>
                  {!p.imageUrl && <span className="thumb-ph">{p.category}</span>}
                </div>
                <div className="project-body">
                  <span className="badge badge-accent">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p className="text-muted">{p.summary}</p>
                  <small className="text-muted">{p.location} · {p.year}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/projects" className="btn btn-outline">כל הפרויקטים</Link>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-inner">
          <div>
            <h2 style={{ color: '#fff' }}>מוכנים לתכנן יחד את הפרויקט הבא?</h2>
            <p style={{ color: '#d7dee8', marginBottom: 0 }}>
              נשמח לשמוע עליכם – שיחת ייעוץ ראשונית ללא עלות.
            </p>
          </div>
          <Link to="/contact" className="btn btn-accent">צור קשר</Link>
        </div>
      </section>
    </>
  );
}
