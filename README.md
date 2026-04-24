# י.ש. מהנדסים בע"מ — אתר אינטרנט

אתר רשמי (React + Node.js + MongoDB) עבור חברת **י.ש. מהנדסים בע"מ** (Y.SCH. Engineers Ltd), גבעת אלה.
האתר כולו בעברית ובפריסת RTL מלאה, כולל פאנל ניהול מאובטח.

## מבנה הפרויקט

```
/
├── client/   # React (Vite) – ממשק ציבורי + פאנל ניהול
├── server/   # Node.js + Express + Mongoose – REST API
└── package.json  # monorepo עם npm workspaces
```

## התקנה מהירה

```bash
npm install                              # מתקין את שני ה-workspaces
cp server/.env.example server/.env       # ערכו את ערכי הסביבה
npm run seed                             # זורע נתונים + מייצר משתמש אדמין
npm run dev                              # מריץ שרת (5500) + קליינט (5170)
```

## פקודות עיקריות

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | מריץ שרת וקליינט במקביל |
| `npm run dev:server` / `npm run dev:client` | מריץ רק צד אחד |
| `npm run seed` | זורע את בסיס הנתונים מ-`server/src/seed.js` |
| `npm run build` | build ל-production של הקליינט |
| `npm start` | מריץ את השרת (production) |

## משתני סביבה (server/.env)

ראו `server/.env.example`. חובה:
- `MONGO_URI` – חיבור ל-MongoDB (מקומי או Atlas)
- `JWT_SECRET` – סוד לחתימת טוקנים (≥32 תווים אקראיים)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – נוצרים ע"י ה-seed
- `CLIENT_ORIGIN` – רשימת origins מופרדת בפסיקים עבור CORS
- `PUBLIC_URL` – כתובת האתר לשימוש בקישורי איפוס סיסמה

אופציונליים (אך נדרשים בייצור):
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` – לשליחת מייל
- `MAIL_FROM` / `MAIL_TO` – הכתובות המוצגות במיילים
- `UPLOAD_MAX_BYTES` – ברירת מחדל 5MB

## פאנל ניהול

אחרי `npm run seed`, כנסו ל-`http://localhost:5170/admin/login` עם הפרטים שמילאתם ב-`.env`.

פיצ'רים בפאנל:
- לוח בקרה עם סטטיסטיקות
- CRUD על שירותים ופרויקטים
- העלאת תמונות (JPEG/PNG/WebP, עד 5MB, מומרות אוטומטית ל-WebP)
- תיבת פניות מטופס יצירת קשר (צפייה, סימון כנקרא, מחיקה)
- שינוי סיסמה אישית
- שכחתי סיסמה / איפוס סיסמה באמצעות קישור במייל

## אבטחה

- JWT ב-cookie מסוג `httpOnly` + `SameSite=Strict` (עמיד בפני XSS ו-CSRF)
- נעילת חשבון אחרי 5 ניסיונות כושלים ל-15 דקות
- Rate limiting על כל נקודות הקצה הרגישות (התחברות, שכחתי סיסמה, יצירת קשר, העלאות)
- Helmet, express-mongo-sanitize, ו-CORS מוגבל ע"פ origin
- אימות תכולת הקבצים שהועלו באמצעות sharp (מונע קבצים זדוניים במסכת תמונה)
- bcrypt cost = 12

לפרטים מלאים על ארכיטקטורה ומוסכמות – ראו [CLAUDE.md](./CLAUDE.md).

## פריסה (Deployment)

- הגדירו reverse proxy (nginx / Cloudflare) מול `https://` עם `X-Forwarded-Proto`
- הגדירו `NODE_ENV=production` על השרת כדי להפעיל `Secure` cookies
- מומלץ להשתמש ב-MongoDB Atlas (או MongoDB עם auth + TLS)
- למגדל הדרגתי – שמרו על upload ל-disk בלבד, למספר מופעים השתמשו ב-S3-compatible
- גבו באופן קבוע את קולקציות `users`, `services`, `projects`, `contacts`
