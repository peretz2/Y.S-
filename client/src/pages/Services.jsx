import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useContent } from '../content/SiteContentContext.jsx';
import Editable from '../content/Editable.jsx';
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
  const { t } = useContent();

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
          <span className="line" /><span><Editable contentKey="services.eyebrow" as="span">{t('services.eyebrow', '§ שירותים · תכנון · ייצור · התקנה')}</Editable></span>
        </div>
        <h1 className="display">
          <Editable contentKey="services.title.1" as="span">{t('services.title.1', 'מה שאנחנו')}</Editable><br />
          <em><Editable contentKey="services.title.2" as="span">{t('services.title.2', 'יודעים לעשות.')}</Editable></em>
        </h1>
        <div className="page-lead">
          <p><Editable contentKey="services.lead.1" as="span" multiline>{t('services.lead.1', 'מגוון שירותי נגרות וחיפוי ברמה אדריכלית — מהתכנון הראשוני ועד ההתקנה באתר. כל פרויקט מתחיל בהבנה של הצורך ונבנה סביב החומרים והפרטים שנכונים לו.')}</Editable></p>
          <p><Editable contentKey="services.lead.2" as="span" multiline>{t('services.lead.2', 'צוות הנדסי ומפעל CNC במקום אחד. לקוחות פרטיים, אדריכלים וקבלנים ראשיים עובדים איתנו מאז 2005.')}</Editable></p>
        </div>
      </section>

      <section className="wrap sec svc-sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k"><Editable contentKey="services.catalog.label" as="span">{t('services.catalog.label', 'הקטלוג')}</Editable></span></div>
          <h2>
            <Editable contentKey="services.catalog.heading" as="span">{t('services.catalog.heading', 'חמישה תחומים,')}</Editable><br />
            <Editable contentKey="services.catalog.heading.pre" as="span">{t('services.catalog.heading.pre', 'צוות ')}</Editable><em><Editable contentKey="services.catalog.heading.em" as="span">{t('services.catalog.heading.em', 'אחד.')}</Editable></em>
          </h2>
        </div>
        {loading && services === FALLBACK ? (
          <p className="text-muted text-center"><Editable contentKey="services.loading" as="span">{t('services.loading', 'טוען…')}</Editable></p>
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
          <div className="idx"><span className="n">§02</span><span className="k"><Editable contentKey="services.materials.label" as="span">{t('services.materials.label', 'חומרים')}</Editable></span></div>
          <h2>
            <Editable contentKey="services.materials.heading" as="span">{t('services.materials.heading', 'החומרים שאיתם')}</Editable><br />
            <em><Editable contentKey="services.materials.heading.em" as="span">{t('services.materials.heading.em', 'אנחנו עובדים.')}</Editable></em>
          </h2>
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
          <h2>
            <Editable contentKey="services.cta.heading" as="span">{t('services.cta.heading', 'פרויקט בתכנון?')}</Editable><br />
            <em><Editable contentKey="services.cta.heading.em" as="span">{t('services.cta.heading.em', 'נשמח לעזור.')}</Editable></em>
          </h2>
          <div className="cta-side">
            <p><Editable contentKey="services.cta.lead" as="span" multiline>{t('services.cta.lead', 'שלחו לנו מספר שורות או תכניות ראשוניות — נחזור אליכם עם כיוון ברור תוך יום עסקים.')}</Editable></p>
            <Link to="/contact" className="btn btn-inv"><Editable contentKey="services.cta.button" as="span">{t('services.cta.button', 'לקבלת הצעת מחיר ←')}</Editable></Link>
          </div>
        </div>
      </section>
    </>
  );
}
