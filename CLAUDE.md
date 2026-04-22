# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Full-stack Hebrew RTL marketing site for **י.ש. מהנדסים בע"מ** (Y.SCH. Engineers Ltd, Givat Ela) — a carpentry / HPL-cladding / lobby-cladding contractor founded 2005. All user-facing text is Hebrew; the layout is `dir="rtl"` site-wide.

## Stack

- **Monorepo** via npm workspaces: `client/` (React 18 + Vite), `server/` (Express + Mongoose).
- **Database:** MongoDB via Mongoose.
- **Auth:** JWT stored in `localStorage` under `ys_token`. Single `admin` role.
- **Mail:** `nodemailer` (SMTP). If SMTP env vars are absent, the contact route silently skips email and still saves to Mongo — this is intentional, don't turn it into a hard error.
- **No TypeScript, no test framework yet.** Don't introduce either unless asked.

## Commands

Run from the repo root (they fan out to workspaces):

| Command | What it does |
|---|---|
| `npm install` | Installs deps for both workspaces |
| `npm run dev` | Runs server (`:5000`) + client (`:5173`) concurrently |
| `npm run dev:server` / `npm run dev:client` | Run one side only |
| `npm run seed` | Wipes + reseeds `services`, `projects`, upserts admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `npm run build` | Production build of the client to `client/dist` |
| `npm start` | Runs the Express server (production) |

There is no lint or test script. If the user adds one, update this section.

Before running anything, `server/.env` must exist. Start from `server/.env.example`. `MONGO_URI` and `JWT_SECRET` are required; `SMTP_*` is optional.

## Architecture

### Client → Server contract

Vite dev server proxies `/api/*` → `http://localhost:5000` (see `client/vite.config.js`). All client API calls go through `client/src/api.js`, which:
- Sets `baseURL: '/api'` (works in dev via proxy and in prod if served behind the same host).
- Attaches `Authorization: Bearer <token>` from `localStorage['ys_token']` on every request.
- Clears the token on any 401 response.

**Do not hardcode `http://localhost:5000` anywhere in the client.** Always import `api` from `src/api.js`.

The file `client/src/api.js` also exports `companyInfo` — the single source of truth for the company's address, phone, hours, etc. Reuse it in any new UI rather than re-typing the strings.

### Routing

`client/src/App.jsx` defines all routes:
- Public routes are wrapped in `<Layout>` (Navbar + Footer).
- Admin routes live under `/admin/*` and use a **separate** `<AdminLayout>` (sidebar, no public chrome).
- `/admin/login` is public; everything else under `/admin` is gated by `<RequireAuth>` (checks for `ys_token` in `localStorage`, redirects to login otherwise).

When adding a new public page: create it in `client/src/pages/`, register it inside the first `<Route element={<Layout />}>` block, and add a link to `components/Navbar.jsx` and `components/Footer.jsx`.

### Server routes

Mounted in `server/src/app.js`:
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/services` (public, active only) · `GET /api/services/all` (auth, includes inactive)
- CRUD `/api/services/:id` and `/api/projects/:id` — **public `GET`, auth-gated `POST/PUT/DELETE`**
- `POST /api/contacts` (public, rate-limited to 10/15min per IP), `GET|PATCH|DELETE` require auth
- `GET /api/health`

`requireAuth` in `server/src/middleware/auth.js` is the only gate. There's no role check beyond "token is valid" because the only role is `admin`.

### Data model

Four Mongoose models in `server/src/models/`:
- `User` — `email`, `passwordHash` (bcryptjs), `role: 'admin'`.
- `Service` — `slug` unique, `order` for display, `isActive` filters the public list.
- `Project` — `slug` unique, `order`, `isFeatured` (shown on home page), optional `imageUrl`.
- `Contact` — form submissions. `isRead` toggles in admin UI, `emailSent` records whether nodemailer succeeded.

Slugs are **not auto-generated** — the admin UI requires the user to set them. Keep it that way unless asked.

### Seeding

`server/src/seed.js` is the canonical content source. It:
1. Upserts one admin user from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
2. `deleteMany` + `insertMany` on services and projects — **running it wipes all services/projects**.

When editing default content (services list, sample projects), edit this file and rerun `npm run seed`. Do not add a migration layer for a small brochure site.

### RTL and typography

- `<html lang="he" dir="rtl">` is set in `client/index.html`. Don't flip it per component.
- Heebo is loaded from Google Fonts in `index.html`. If you need a different weight, add it to the `family=Heebo:wght@...` query string rather than importing a second font.
- `client/src/styles/global.css` owns the design tokens (CSS custom properties for colors, spacing, radii). Component CSS files sit next to the component (`Navbar.jsx` + `Navbar.css`). Prefer tokens over raw hex values.
- Avoid mixing left/right properties — use `margin-inline-start` / `padding-inline-end` when practical so the layout stays correct if someone later wants LTR.

## Conventions specific to this repo

- **All UI copy is Hebrew.** English strings leak into the final rendered page only in code identifiers (class names, route paths, slugs). When the admin enters content, assume Hebrew.
- **Error messages returned from the API are also Hebrew** (see `routes/auth.js`, `routes/contacts.js`). Keep them Hebrew since the client displays them verbatim.
- **Currency/dates formatted with `he-IL` locale** (`toLocaleString('he-IL', ...)` in `ContactsAdmin.jsx`).
- The company's real phone, address, and hours live in `companyInfo` (`client/src/api.js`). They appear in the Navbar, Footer, and Contact page — editing any of those hardcodes would desync the site.
- CommonJS on the server (`require` / `module.exports`), ES modules on the client. Don't mix.

## Git workflow

- Active development branch: `claude/add-claude-documentation-5veug`
- Default branch: `main`
- Commit and push to the feature branch; don't push to `main` without explicit permission.

## Things intentionally out of scope

These were **not** requested and should not be added without asking:
- Image uploads (project `imageUrl` is a free-text URL field on purpose).
- Multi-language / i18n. The site is Hebrew-only.
- Blog, careers, quote-wizard pages.
- Tests, CI, Docker, deploy scripts.
- Social login, password reset, user registration. The seed is the only way to provision an admin.
