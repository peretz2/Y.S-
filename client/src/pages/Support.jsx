import { Link } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import './Support.css';

const FAQ = [
  {
    q: 'באילו אזורים בארץ אתם פועלים?',
    a: 'אנו פועלים בכל רחבי הארץ, עם התמקדות בצפון ובמרכז. פרויקטים באזורים מרוחקים יותר מתבצעים לפי היקף הפרויקט ולוח הזמנים.',
  },
  {
    q: 'כמה זמן לוקח לקבל הצעת מחיר?',
    a: 'אנו מחזירים התייחסות ראשונית תוך יום-יומיים עסקים. הצעת מחיר מפורטת ניתנת לאחר פגישת אפיון או קבלת תכניות האדריכל.',
  },
  {
    q: 'האם אתם עובדים עם אדריכלים וקבלנים ראשיים?',
    a: 'כן. חלק ניכר מהפעילות שלנו הוא בשיתוף פעולה ישיר עם אדריכלים, מעצבי פנים וקבלנים ראשיים, החל משלב התכנון ועד המסירה באתר.',
  },
  {
    q: 'מה אורך האחריות על העבודות?',
    a: 'האחריות משתנה לפי סוג העבודה והחומר, ומפורטת בהסכם לכל פרויקט. ככלל, אנו מעניקים אחריות על ביצוע ועל חומרים לפי התקנים הרלוונטיים.',
  },
  {
    q: 'האם ניתן להזמין פריטים בודדים של נגרות (דלת, ארון)?',
    a: 'בהחלט. אנו מבצעים גם עבודות מותאמות אישית בהיקף קטן — ארונות, דלתות, ספריות ורהיטים — בנוסף לפרויקטים מלאים.',
  },
  {
    q: 'באילו חומרים אתם עובדים?',
    a: 'מגוון רחב: עץ מלא, פורניר, HPL לפנים וחוץ, קוריאן, מלמין, מתכת ועוד. בחירת החומרים נעשית בהתאם לתכנון, לתקציב ולדרישות הפרויקט.',
  },
];

export default function Support() {
  const { info: companyInfo } = useCompanyInfo();
  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>§ שירות ותמיכה · Support</span>
        </div>
        <h1 className="display">
          שאלות נפוצות,<br /><em>תשובות ברורות.</em>
        </h1>
        <div className="page-lead">
          <p>
            כל מה שצריך לדעת לפני פנייה. אם השאלה שלכם לא מופיעה כאן —
            מוזמנים לפנות אלינו ישירות ונחזור תוך יום עסקים.
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§01</span><span className="k">יצירת קשר מהיר</span></div>
          <h2>שתי דרכים<br /><em>להתחיל.</em></h2>
        </div>
        <div className="sup-contact-grid">
          <div className="sup-block">
            <div className="mono">לקוחות קיימים</div>
            <h3>תמיכה בטלפון</h3>
            <p>
              לפרויקטים בביצוע או לקוחות קיימים — ניתן ליצור איתנו קשר ישיר בטלפון בשעות הפעילות.
            </p>
            <a href={`tel:${companyInfo.phone}`} className="sup-phone ltr">{companyInfo.phoneDisplay}</a>
            <div className="sup-hours">
              <div>{companyInfo.hours.weekdays}</div>
              <div>{companyInfo.hours.friday}</div>
            </div>
          </div>
          <div className="sup-block sup-block-dark">
            <div className="mono">לקוחות חדשים</div>
            <h3>טופס פנייה</h3>
            <p>
              להצעת מחיר, בירור ראשוני או פגישת היכרות — השאירו פרטים בטופס ונחזור אליכם תוך יום עסקים אחד.
            </p>
            <Link to="/contact" className="btn btn-inv">למילוי טופס ←</Link>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§02</span><span className="k">FAQ</span></div>
          <h2>שאלות<br /><em>שכבר נשאלו.</em></h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <details key={item.q} className="faq-item">
              <summary>
                <span className="faq-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq-q">{item.q}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </summary>
              <p className="faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head">
          <div className="idx"><span className="n">§03</span><span className="k">דרכי תקשורת</span></div>
          <h2>
            או פשוט —<br /><em>תתקשרו.</em>
          </h2>
        </div>
        <div className="sup-ch-grid">
          <a href={`tel:${companyInfo.phone}`} className="sup-ch">
            <span className="mono">Phone</span>
            <span className="sup-ch-v ltr">{companyInfo.phoneDisplay}</span>
          </a>
          <a href={`mailto:${companyInfo.email}`} className="sup-ch">
            <span className="mono">Email</span>
            <span className="sup-ch-v ltr">{companyInfo.email}</span>
          </a>
          <div className="sup-ch">
            <span className="mono">Office</span>
            <span className="sup-ch-v">{companyInfo.address}</span>
          </div>
        </div>
        <p className="sup-closer">
          השאלה שלכם לא מופיעה כאן?
          {' '}<Link to="/contact">שלחו אלינו פנייה</Link>
          {' '}ונחזור אליכם בהקדם.
        </p>
      </section>
    </>
  );
}
