import { Link } from 'react-router-dom';
import { companyInfo } from '../api.js';

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
    a: 'בהחלט. אנו מבצעים גם עבודות מותאמות אישית בהיקף קטן – ארונות, דלתות, ספריות ורהיטים – בנוסף לפרויקטים מלאים.',
  },
  {
    q: 'באילו חומרים אתם עובדים?',
    a: 'מגוון רחב: עץ מלא, פורניר, HPL לפנים וחוץ, קוריאן, מלמין, מתכת ועוד. בחירת החומרים נעשית בהתאם לתכנון, לתקציב ולדרישות הפרויקט.',
  },
];

export default function Support() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <span className="badge badge-accent">שירות ותמיכה</span>
        <h1 style={{ marginTop: '1rem' }}>שירות ותמיכה</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          מענה לשאלות נפוצות ודרכי יצירת קשר עם {companyInfo.name}.
        </p>

        <div className="grid grid-2" style={{ margin: '2rem 0' }}>
          <div className="card">
            <h3>צריכים עזרה דחופה?</h3>
            <p>
              לקוחות קיימים או פרויקטים בביצוע – ניתן ליצור עמנו קשר ישירות בטלפון
              בשעות הפעילות:
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              📞 <a href={`tel:${companyInfo.phone}`}>{companyInfo.phoneDisplay}</a>
            </p>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              {companyInfo.hours.weekdays}<br />
              {companyInfo.hours.friday}
            </p>
          </div>
          <div className="card">
            <h3>לקוחות חדשים</h3>
            <p>
              להצעת מחיר או בירור ראשוני – השאירו פרטים בטופס ונחזור אליכם
              תוך יום עסקים אחד.
            </p>
            <Link to="/contact" className="btn btn-accent" style={{ marginTop: '0.5rem' }}>
              למילוי טופס יצירת קשר
            </Link>
          </div>
        </div>

        <h2>שאלות נפוצות</h2>
        <div style={{ marginTop: '1rem' }}>
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="card"
              style={{ marginBottom: '0.75rem', padding: '1rem 1.2rem' }}
            >
              <summary style={{
                fontWeight: 600, cursor: 'pointer', listStyle: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>{item.q}</span>
                <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>+</span>
              </summary>
              <p className="text-muted" style={{ marginTop: '0.8rem' }}>{item.a}</p>
            </details>
          ))}
        </div>

        <h2 style={{ marginTop: '2.5rem' }}>דרכי תקשורת</h2>
        <div className="grid grid-3">
          <div className="card text-center">
            <div style={{ fontSize: '2rem' }}>📞</div>
            <h3>טלפון</h3>
            <p><a href={`tel:${companyInfo.phone}`}>{companyInfo.phoneDisplay}</a></p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem' }}>✉️</div>
            <h3>דוא"ל</h3>
            <p><a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem' }}>📍</div>
            <h3>המשרד / מפעל</h3>
            <p>{companyInfo.address}</p>
          </div>
        </div>

        <p className="text-muted" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          השאלה שלכם לא מופיעה ברשימה? <Link to="/contact">פנו אלינו בטופס יצירת קשר</Link>
          {' '}ונחזור אליכם בהקדם.
        </p>
      </div>
    </section>
  );
}
