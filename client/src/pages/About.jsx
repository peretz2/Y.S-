import { companyInfo } from '../api.js';

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="badge badge-accent">אודות החברה</span>
          <h1 style={{ marginTop: '1rem' }}>מי אנחנו?</h1>
          <p style={{ fontSize: '1.1rem' }}>
            חברת <strong>{companyInfo.name}</strong> פועלת מאז שנת {companyInfo.founded}
            {' '}ממפעלה בגבעת אלה, ומתמחה בעבודות נגרות לבניין, חיפויי HPL וחיפויי לובי
            בפרויקטים פרטיים, מסחריים וציבוריים. הצוות שלנו מונה בין 11 ל-20 עובדים –
            מהנדסים, טכנאים ונגרים מקצועיים, המעניקים שירות מקצה לקצה: מהתכנון והייצור
            ועד להתקנה באתר.
          </p>

          <div className="grid grid-2" style={{ margin: '2.5rem 0' }}>
            <div className="card">
              <h3>החזון שלנו</h3>
              <p className="text-muted">
                לספק פתרונות נגרות וחיפוי שמשלבים אסתטיקה, עמידות ויעילות כלכלית –
                מתוך הקפדה בלתי מתפשרת על פרטים ואיכות גמר.
              </p>
            </div>
            <div className="card">
              <h3>מה מייחד אותנו</h3>
              <p className="text-muted">
                שילוב של מפעל ייצור מודרני עם צוות הנדסי מנוסה. אנו לוקחים אחריות מלאה
                על כל שלב בפרויקט – תכנון, רכש, ייצור, לוגיסטיקה והתקנה.
              </p>
            </div>
          </div>

          <h2>התמחויות מרכזיות</h2>
          <ul style={{ lineHeight: 2 }}>
            <li><strong>נגרות לבניין</strong> – דלתות, ארונות, מטבחים, ספריות ורהיטים בהזמנה אישית.</li>
            <li><strong>חיפויי HPL פנים וחוץ</strong> – חזיתות בניינים, לובאים ומשרדים בעמידות גבוהה.</li>
            <li><strong>חיפוי לובאים</strong> – שילוב עץ, HPL, קוריאן ומתכת לעיצוב ייחודי.</li>
            <li><strong>ייצור מוצרי עץ מותאמים</strong> – מפעל CNC לפרויקטים מורכבים ובלוחות זמנים צפופים.</li>
            <li><strong>ליווי הנדסי</strong> – עבודה צמודה עם אדריכלים, קבלנים ומזמינים.</li>
          </ul>

          <h2 style={{ marginTop: '2.5rem' }}>ערכי הליבה</h2>
          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            <div className="card text-center">
              <div style={{ fontSize: '2rem' }}>🎯</div>
              <h3>מקצועיות</h3>
              <p className="text-muted">הקפדה על תקנים, פרטים ואיכות גמר בכל פרויקט.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '2rem' }}>🤝</div>
              <h3>אמינות</h3>
              <p className="text-muted">עמידה בלוחות זמנים ובתקציב – ללא הפתעות.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '2rem' }}>💡</div>
              <h3>חדשנות</h3>
              <p className="text-muted">שימוש בטכנולוגיות ייצור מתקדמות ובחומרים איכותיים.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
