import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import './Services.css';

const FALLBACK = [
  { _id: 's1', order: 1, title: 'נגרות לבניין', slug: 'carpentry', shortDescription: 'דלתות, ארונות, מטבחים וספריות בהזמנה אישית.', description: 'פתרונות נגרות מותאמים לפרויקטים פרטיים ומסחריים — מתכנון ראשוני ועד גמר מדויק באתר.' },
  { _id: 's2', order: 2, title: 'חיפויי HPL', slug: 'hpl', shortDescription: 'חזיתות בניינים, לובאים ומשרדים בעמידות גבוהה.', description: 'עבודה עם לוחות HPL בגימור אדריכלי, לפנים ולחוץ, בדגש על פרטי חיבור ואטימה.' },
  { _id: 's3', order: 3, title: 'חיפוי לובאים', slug: 'lobby', shortDescription: 'שילוב עץ, HPL, קוריאן ומתכת לעיצוב ייחודי.', description: 'חיפוי לובי שמשלב מספר חומרים לשפה אדריכלית עשירה — החל מלוחות אקוסטיים ועד פאנלים מוארים.' },
  { _id: 's4', order: 4, title: 'ייצור CNC מותאם', slug: 'cnc', shortDescription: 'מפעל CNC לפרויקטים מורכבים בלוחות זמנים צפופים.', description: 'מכונות CNC מתקדמות המאפשרות לנו לייצר רכיבים מורכבים בדיוק גבוה ובהיקפים גדולים.' },
  { _id: 's5', order: 5, title: 'ליווי הנדסי', slug: 'engineering', shortDescription: 'עבודה צמודה עם אדריכלים, קבלנים ומזמינים.', description: 'מפגשי אפיון, שרטוטי ביצוע, הצעות חלופות חומר ותיאום עם יתר הקבלנים — ליווי מלא עד מסירה.' },
];

const MATERIALS = [
  'עץ מלא', 'פורניר', 'HPL פנים / חוץ', 'קוריאן', 'מלמין', 'מתכת', 'זכוכית', 'לוחות אקוסטיים',
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('/services');
        if (!alive) return;
        if (Array.isArray(data) && data.length) {
          setServices([...data].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      } catch (_e) { /* keep fallback */ }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>§ שירותים · תכנון · ייצור · התקנה</span>
        </div>
        <h1 className="display">
          מה שאנחנו<br /><em>יודעים לעשות.</em>
        </h1>
        <div className="page-lead">
          <p>
            מגוון שירותי נגרות וחיפוי ברמה אדריכלית — מהתכנון הראשוני ועד ההתקנה באתר.
            כל פרויקט מתחיל בהבנה של הצורך ונבנה סביב החומרים והפרטים שנכונים לו.
          </p>
          <p>
            צוות הנדסי ומפעל CNC במקום אחד. לקוחות פרטיים, אדריכלים וקבלנים ראשיים
            עובדים איתנו מאז 2005.
          </p>
        </div>
      </section>

      <section className="wrap sec svc-sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k">הקטלוג</span></div>
          <h2>חמישה תחומים,<br />צוות <em>אחד.</em></h2>
        </div>
        {loading && services === FALLBACK ? (
          <p className="text-muted text-center">טוען…</p>
        ) : (
          <div className="svc-list">
            {services.map((s, i) => (
              <article key={s._id || s.slug} className="svc-row svc-row-detailed">
                <span className="num">{String(s.order || i + 1).padStart(2, '0')}</span>
                <div className="svc-head-col">
                  <span className="name">{s.title}</span>
                  <span className="svc-icon">{s.icon || ''}</span>
                </div>
                <div className="svc-copy">
                  <p className="short">{s.shortDescription}</p>
                  {s.description && s.description !== s.shortDescription && (
                    <p className="long">{s.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§02</span><span className="k">חומרים</span></div>
          <h2>החומרים שאיתם<br /><em>אנחנו עובדים.</em></h2>
        </div>
        <ul className="mat-grid">
          {MATERIALS.map((m, i) => (
            <li key={m}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <h2>פרויקט בתכנון?<br /><em>נשמח לעזור.</em></h2>
          <div className="cta-side">
            <p>שלחו לנו מספר שורות או תכניות ראשוניות — נחזור אליכם עם כיוון ברור תוך יום עסקים.</p>
            <Link to="/contact" className="btn btn-inv">לקבלת הצעת מחיר ←</Link>
          </div>
        </div>
      </section>
    </>
  );
}
