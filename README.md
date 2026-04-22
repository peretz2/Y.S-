# י.ש. מהנדסים בע"מ — אתר אינטרנט

אתר רשמי (React + Node.js + MongoDB) עבור חברת **י.ש. מהנדסים בע"מ** (Y.SCH. Engineers Ltd), גבעת אלה.
האתר כולו בעברית ובפריסת RTL מלאה.

## מבנה הפרויקט

```
/
├── client/   # React (Vite) – ממשק ציבורי + פאנל ניהול
├── server/   # Node.js + Express + Mongoose – REST API
└── package.json  # monorepo עם npm workspaces
```

## התקנה מהירה

```bash
npm install               # מתקין את שני ה-workspaces
cp server/.env.example server/.env   # מלאו את משתני הסביבה
npm run seed              # זורע נתוני שירותים, פרויקטים ומשתמש אדמין
npm run dev               # מריץ שרת (5000) + קליינט (5173) במקביל
```

## פקודות עיקריות

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | מריץ שרת וקליינט במקביל (concurrently) |
| `npm run dev:server` | מריץ רק את השרת |
| `npm run dev:client` | מריץ רק את הקליינט |
| `npm run seed` | זורע את בסיס הנתונים מ-`server/src/seed.js` |
| `npm run build` | build ל-production של הקליינט |
| `npm start` | מריץ את השרת (production) |

## משתני סביבה (server/.env)

ראו `server/.env.example`. חובה:
- `MONGO_URI` – חיבור ל-MongoDB (מקומי או Atlas)
- `JWT_SECRET` – סוד לחתימת טוקנים
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – נוצרים ע"י ה-seed
- `SMTP_*` – לשליחת מייל מטופס יצירת קשר (אופציונלי)

## ארכיטקטורה

לפרטים על ארכיטקטורה, מוסכמות ונקודות חשובות – ראו [CLAUDE.md](./CLAUDE.md).
