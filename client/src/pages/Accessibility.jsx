import { Link } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';

export default function Accessibility() {
  const { info: companyInfo } = useCompanyInfo();
  return (
    <section className="wrap">
      <article className="prose">
        <div className="prose-eyebrow">
          <span className="line" /><span>§ חוקי · Accessibility</span>
        </div>
        <h1>הצהרת <em>נגישות.</em></h1>
        <div className="prose-meta">
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
        </div>

        <h2>מחויבות לנגישות</h2>
        <p>
          חברת <strong>{companyInfo.name}</strong> רואה בנגישות השירות
          לאנשים עם מוגבלות יעד מרכזי. אנו פועלים להנגיש את אתר האינטרנט שלנו,
          על מנת שיוכל לשמש כל משתמש, לרבות אנשים עם מוגבלויות, באופן מיטבי.
        </p>

        <h2>תקן הנגישות באתר</h2>
        <p>
          האתר נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
          נגישות לשירות), התשע"ג–2013, ובהתאם להמלצות התקן הישראלי
          ת"י 5568 ברמה AA, המבוסס על המלצות ארגון WCAG 2.0 של ארגון W3C.
        </p>

        <h2>התאמות הנגישות באתר</h2>
        <ul>
          <li>האתר כולל תפריט נגישות צף המאפשר: הגדלת טקסט, ניגודיות גבוהה,
            היפוך צבעים, הדגשת קישורים, החלפה לגופן קריא, הדגשת כותרות ועצירת אנימציות.</li>
          <li>האתר תומך בניווט באמצעות מקלדת בלבד (מקש Tab) ובסגירת תפריטים באמצעות Escape.</li>
          <li>ניתן לדלג ישירות לתוכן הראשי באמצעות קישור "דלג לתוכן" המופיע עם קבלת פוקוס.</li>
          <li>האתר מותאם לעבודה עם קוראי מסך נפוצים (JAWS, NVDA, VoiceOver).</li>
          <li>כל התמונות כוללות טקסט חלופי (alt) מתאים.</li>
          <li>מבנה הכותרות (H1–H3) היררכי וברור.</li>
          <li>האתר מותאם לצפייה במגוון גדלי מסך (רספונסיבי).</li>
          <li>האתר כולו כתוב בעברית ובכיוון טקסט מימין לשמאל (RTL).</li>
        </ul>

        <h2>הגבלות נגישות ידועות</h2>
        <p>
          ייתכנו תכנים או עמודים שאינם עומדים באופן מלא בדרישות הנגישות
          בשל מורכבות טכנית או תוכן חיצוני. אנו פועלים לשיפור מתמיד ומברכים
          על משוב ממשתמשים שיסייע באיתור בעיות.
        </p>

        <h2>פרטי רכז הנגישות</h2>
        <p>
          במידה ונתקלתם בבעיית נגישות, או שיש לכם שאלות והצעות בנושא נגישות,
          אתם מוזמנים לפנות אלינו:
        </p>
        <ul>
          <li><strong>שם העסק:</strong> {companyInfo.name}</li>
          <li><strong>כתובת:</strong> {companyInfo.address}</li>
          <li><strong>טלפון:</strong> <a href={`tel:${companyInfo.phone}`}>{companyInfo.phoneDisplay}</a></li>
          <li><strong>דוא"ל:</strong> <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></li>
        </ul>

        <p className="prose-note">
          אנו מתחייבים לבחון כל פנייה ולחזור למבקש/ת עם מענה בהקדם האפשרי,
          ולא יאוחר מ-45 ימים ממועד קבלת הפנייה.
        </p>

        <div className="prose-actions">
          <Link to="/contact" className="btn">צור קשר</Link>
          <Link to="/" className="btn btn-ghost">לדף הבית</Link>
        </div>
      </article>
    </section>
  );
}
