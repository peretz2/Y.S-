import { Link } from 'react-router-dom';
import { companyInfo } from '../api.js';
import './About.css';

const EXPERTISE = [
  { t: 'נגרות לבניין', d: 'דלתות, ארונות, מטבחים, ספריות ורהיטים בהזמנה אישית לפרויקטים פרטיים ומסחריים.' },
  { t: 'חיפויי HPL פנים וחוץ', d: 'חזיתות בניינים, לובאים ומשרדים בעמידות גבוהה ובגימור אדריכלי.' },
  { t: 'חיפוי לובאים', d: 'שילוב עץ, HPL, קוריאן ומתכת לעיצוב לובי ייחודי עם נוכחות אדריכלית.' },
  { t: 'ייצור CNC מותאם', d: 'מפעל CNC מודרני לפרויקטים מורכבים ובלוחות זמנים צפופים.' },
  { t: 'ליווי הנדסי', d: 'עבודה צמודה עם אדריכלים, קבלנים ומזמינים — מתכנון ועד מסירה.' },
];

const VALUES = [
  { k: '§01', t: 'מקצועיות', d: 'הקפדה על תקנים, פרטים ואיכות גמר בכל פרויקט — גם בפריט בודד.' },
  { k: '§02', t: 'אמינות', d: 'עמידה בלוחות זמנים ובתקציב, תקשורת ברורה ושקופה לאורך הדרך.' },
  { k: '§03', t: 'חדשנות', d: 'שימוש בטכנולוגיות ייצור מתקדמות ובחומרים איכותיים בהתאמה אישית.' },
];

export default function About() {
  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>§ אודות · Est. {companyInfo.founded}</span>
        </div>
        <h1 className="display">
          צוות אחד.<br />מפעל אחד.<br /><em>עשרים שנה.</em>
        </h1>
        <div className="page-lead">
          <p>
            חברת <strong>{companyInfo.name}</strong> פועלת מאז {companyInfo.founded} ממפעלה ב{companyInfo.address.split(',')[1].trim()},
            ומתמחה בנגרות לבניין, חיפויי HPL וחיפוי לובאים לפרויקטים פרטיים, מסחריים וציבוריים.
            הצוות שלנו מונה עשרים מהנדסים, טכנאים ונגרים, המעניקים שירות מקצה לקצה — מתכנון וייצור ועד התקנה באתר.
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k">החזון</span></div>
          <h2>אסתטיקה, עמידות,<br /><em>יעילות כלכלית.</em></h2>
        </div>
        <div className="about-vision">
          <p className="vision-a">
            אנחנו מאמינים שעבודת נגרות ברמה אדריכלית אינה שירות — היא שותפות.
            כל פרויקט מתחיל בהבנת הצורך האמיתי של המזמין והאדריכל, וממשיך בפרטים הקטנים —
            מחיבור בין חומרים ועד לגמר המדויק של קצה אחד.
          </p>
          <p className="vision-b">
            שילוב של מפעל ייצור מודרני עם צוות הנדסי מנוסה מאפשר לנו לקחת אחריות מלאה על כל שלב:
            תכנון, רכש, ייצור, לוגיסטיקה והתקנה. תוצאה אחת, גורם אחראי אחד.
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§02</span><span className="k">התמחויות</span></div>
          <h2>חמישה תחומים.<br /><em>שפה אחת.</em></h2>
        </div>
        <div className="svc-list about-list">
          {EXPERTISE.map((e, i) => (
            <div key={e.t} className="svc-row">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="name">{e.t}</span>
              <span className="desc">{e.d}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§03</span><span className="k">ערכי הליבה</span></div>
          <h2>שלושה ערכים,<br />שמלווים <em>כל פרויקט.</em></h2>
        </div>
        <div className="values">
          {VALUES.map((v) => (
            <div key={v.k} className="val-card">
              <div className="val-k">{v.k}</div>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <h2>רוצים לשמוע עוד?<br /><em>בואו נתחיל שיחה.</em></h2>
          <div className="cta-side">
            <p>שיחת ייעוץ ראשונית ללא עלות. אנחנו עונים בתוך יום עסקים.</p>
            <Link to="/contact" className="btn btn-inv">לפנייה ←</Link>
          </div>
        </div>
      </section>
    </>
  );
}
