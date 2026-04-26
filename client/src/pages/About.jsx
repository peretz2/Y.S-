import { Link } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import Editable from '../content/Editable.jsx';
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
  const { info: companyInfo } = useCompanyInfo();
  const { t } = useContent();
  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span><Editable contentKey="about.eyebrow" as="span">{t('about.eyebrow', '§ אודות')}</Editable> · Est. {companyInfo.founded}</span>
        </div>
        <h1 className="display">
          <Editable contentKey="about.title.1" as="span">{t('about.title.1', 'צוות אחד.')}</Editable><br />
          <Editable contentKey="about.title.2" as="span">{t('about.title.2', 'מפעל אחד.')}</Editable><br />
          <em><Editable contentKey="about.title.3" as="span">{t('about.title.3', 'עשרים שנה.')}</Editable></em>
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
          <div className="idx"><span className="n">§01</span><span className="k"><Editable contentKey="about.vision.label" as="span">{t('about.vision.label', 'החזון')}</Editable></span></div>
          <h2>
            <Editable contentKey="about.vision.heading" as="span">{t('about.vision.heading', 'אסתטיקה, עמידות,')}</Editable><br />
            <em><Editable contentKey="about.vision.heading.em" as="span">{t('about.vision.heading.em', 'יעילות כלכלית.')}</Editable></em>
          </h2>
        </div>
        <div className="about-vision">
          <p className="vision-a">
            <Editable contentKey="about.vision.a" as="span" multiline>{t('about.vision.a', 'אנחנו מאמינים שעבודת נגרות ברמה אדריכלית אינה שירות — היא שותפות. כל פרויקט מתחיל בהבנת הצורך האמיתי של המזמין והאדריכל, וממשיך בפרטים הקטנים — מחיבור בין חומרים ועד לגמר המדויק של קצה אחד.')}</Editable>
          </p>
          <p className="vision-b">
            <Editable contentKey="about.vision.b" as="span" multiline>{t('about.vision.b', 'שילוב של מפעל ייצור מודרני עם צוות הנדסי מנוסה מאפשר לנו לקחת אחריות מלאה על כל שלב: תכנון, רכש, ייצור, לוגיסטיקה והתקנה. תוצאה אחת, גורם אחראי אחד.')}</Editable>
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§02</span><span className="k"><Editable contentKey="about.expertise.label" as="span">{t('about.expertise.label', 'התמחויות')}</Editable></span></div>
          <h2>
            <Editable contentKey="about.expertise.heading" as="span">{t('about.expertise.heading', 'חמישה תחומים.')}</Editable><br />
            <em><Editable contentKey="about.expertise.heading.em" as="span">{t('about.expertise.heading.em', 'שפה אחת.')}</Editable></em>
          </h2>
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
          <div className="idx"><span className="n">§03</span><span className="k"><Editable contentKey="about.values.label" as="span">{t('about.values.label', 'ערכי הליבה')}</Editable></span></div>
          <h2>
            <Editable contentKey="about.values.heading" as="span">{t('about.values.heading', 'שלושה ערכים,')}</Editable><br />
            <em><Editable contentKey="about.values.heading.em" as="span">{t('about.values.heading.em', 'שמלווים כל פרויקט.')}</Editable></em>
          </h2>
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
          <h2>
            <Editable contentKey="about.cta.heading" as="span">{t('about.cta.heading', 'רוצים לשמוע עוד?')}</Editable><br />
            <em><Editable contentKey="about.cta.heading.em" as="span">{t('about.cta.heading.em', 'בואו נתחיל שיחה.')}</Editable></em>
          </h2>
          <div className="cta-side">
            <p><Editable contentKey="about.cta.lead" as="span" multiline>{t('about.cta.lead', 'שיחת ייעוץ ראשונית ללא עלות. אנחנו עונים בתוך יום עסקים.')}</Editable></p>
            <Link to="/contact" className="btn btn-inv"><Editable contentKey="about.cta.button" as="span">{t('about.cta.button', 'לפנייה ←')}</Editable></Link>
          </div>
        </div>
      </section>
    </>
  );
}
