# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Full-stack Hebrew RTL marketing site for **י.ש. מהנדסים בע"מ** (Y.SCH. Engineers Ltd, Givat Ela) — a carpentry / HPL-cladding / lobby-cladding contractor founded 2005. All user-facing text is Hebrew; the layout is `dir="rtl"` site-wide.

## Stack

- **Monorepo** via npm workspaces: `client/` (React 18 + Vite), `server/` (Express + Mongoose).
- **Database:** MongoDB via Mongoose.
- **Auth:** JWT in an **httpOnly, SameSite=Strict** cookie (`ys_auth`, 7d). Single `admin` role. Bearer header is also accepted for API testing.
- **Mail:** `nodemailer` (SMTP). If SMTP env vars are absent, the contact route and forgot-password route silently skip sending — this is intentional. Forgot-password logs the reset URL to the server console as a dev fallback.
- **Images:** `multer` (memory) + `sharp` (rotate/resize/webp) + random filenames on disk at `server/uploads/`, served statically from `/uploads`.
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

Before running anything, `server/.env` must exist. Start from `server/.env.example`. `MONGO_URI` and `JWT_SECRET` are required; `SMTP_*` is optional but needed for contact-form email and password reset.

## Security architecture

Take all of these as invariants — if you change one, double-check the others.

1. **Auth cookie (`ys_auth`)** is `httpOnly` + `secure` (in production) + `SameSite=Strict`. The client **never** sees the JWT. Do not move the token back into `localStorage`. The SameSite=Strict attribute is the primary CSRF defense; don't weaken it to `Lax` without adding CSRF tokens.
2. **Axios `withCredentials: true`** on the client is required for the cookie to be sent. CORS on the server is set to `credentials: true` with an explicit `CLIENT_ORIGIN` allow-list (comma-separated supported) — **never use `*`** when credentials are on.
3. **Bcrypt cost = 12** (in `routes/auth.js` and `seed.js`). Keep them in sync.
4. **Account lockout**: 5 failed logins locks for 15 minutes (`failedLoginCount`, `lockUntil` on User). The login handler returns a generic 401 on both "no user" and "bad password" to avoid user enumeration. `forgot-password` always responds 200 for the same reason.
5. **Rate limits**: 20 login attempts / 15min, 5 forgot-password / hour, 10 contact submissions / 15min, 60 uploads / 15min — all per IP. `app.set('trust proxy', 1)` is enabled so the limiter reads `X-Forwarded-For` correctly; only enable that when you're actually behind one trusted proxy.
6. **Password reset tokens** are 32 random bytes; only the SHA-256 hash is stored (`passwordResetTokenHash`). TTL = 1 hour. On successful reset the token is cleared, the auth cookie is cleared, and the user must log in again.
7. **Input validation**: every write endpoint runs through `express-validator` via the `runValidators` helper (`server/src/middleware/validate.js`). Slugs are locked to `^[a-z0-9-]+$`. When you add a new write route, wire up a validator — don't trust request bodies.
8. **NoSQL injection**: `express-mongo-sanitize` strips `$` and `.` from `req.body`/`query`/`params` globally. If you intentionally need those characters, scope an opt-out rather than removing the middleware.
9. **Uploads**:
   - Accepted MIMEs: `image/jpeg`, `image/png`, `image/webp`.
   - Sharp verifies the bytes actually decode as an image (`sharp.metadata()`), then re-encodes to WebP — this drops metadata and strips any embedded exploits.
   - Filenames are `${timestamp}-${8 random bytes}.webp`. Never trust client filename.
   - Path is validated to stay inside `UPLOAD_DIR` (prevents traversal).
   - Max 5 MB (configurable via `UPLOAD_MAX_BYTES`). Max 1 file per request.
   - The delete endpoint only accepts `/uploads/<safe-name>` URLs and re-checks the resolved path.
10. **Helmet** is on with defaults (CSP disabled because we don't have a defined CSP yet; if you add one, build it to cover Google Fonts + self). `crossOriginResourcePolicy: 'cross-origin'` is set so `/uploads` works from the public site.
11. **Error messages returned to the client are Hebrew** (user-facing) but must not leak internals — the global error handler falls back to `err.publicMessage` when present, otherwise `err.message`. Be careful not to throw errors containing secrets/paths.

### Things *not* done yet — ask before adding

- Full CSRF tokens (SameSite=Strict handles our case; add tokens if we ever need SameSite=Lax for cross-subdomain).
- 2FA / OTP.
- Password history / rotation policy.
- Audit log.
- HTTPS termination is assumed to happen at a reverse proxy (nginx / Cloudflare). `secure` cookie is set only when `NODE_ENV=production`; the proxy must forward `X-Forwarded-Proto`.

## Architecture

### Client → Server contract

Vite dev server proxies `/api/*` → `http://localhost:5000` (see `client/vite.config.js`); cookies pass through because they're same-origin from the browser's POV (both appear as `localhost:5173`). All client API calls go through `client/src/api.js` (`baseURL: '/api'`, `withCredentials: true`). **Do not hardcode `http://localhost:5000` anywhere in the client.** Always import `api`.

The file `client/src/api.js` also exports `companyInfo` — the single source of truth for the company's address, phone, hours, etc. Reuse it in any new UI rather than re-typing strings.

### Auth on the client

`client/src/auth/AuthContext.jsx` is the single source of auth truth. On mount it calls `GET /api/auth/me`; the cookie authenticates the request silently. Status is `'loading' | 'authed' | 'anon'`. `RequireAuth` shows a spinner during `loading` (do not redirect) and only redirects to `/admin/login` after `anon` resolves — this prevents a flash-redirect on refresh.

`login()` / `logout()` on the context call the server and update local state. Do not touch `localStorage` — it's intentionally unused for auth so XSS cannot steal the token.

### Routing

`client/src/App.jsx` defines all routes:
- Public routes under `<Layout>` (Navbar + Footer).
- `/admin/login`, `/admin/forgot-password`, `/admin/reset-password` are public (no wrapper).
- Everything else under `/admin` is wrapped in `<RequireAuth><AdminLayout/></RequireAuth>`.

When adding a new public page: create it in `client/src/pages/`, register inside the first `<Route element={<Layout />}>` block, and add a link to `components/Navbar.jsx` and `components/Footer.jsx`.

### Server routes

Mounted in `server/src/app.js`:
- `POST /api/auth/login` (rate-limited), `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/auth/forgot-password` (rate-limited), `POST /api/auth/reset-password`, `POST /api/auth/change-password` (auth)
- `GET /api/services` (public, active only), `GET /api/services/all` (auth, includes inactive), CRUD `/api/services/:id` — public `GET`, auth-gated write
- `GET /api/projects`, CRUD `/api/projects/:id` — same pattern
- `POST /api/contacts` (public, rate-limited), `GET|PATCH|DELETE` require auth
- `POST /api/uploads/image` (auth, rate-limited), `DELETE /api/uploads/image?url=/uploads/...` (auth)
- `GET /api/health`
- `GET /uploads/<file>` — static, public

`requireAuth` in `server/src/middleware/auth.js` is the only gate. Reads cookie first, falls back to `Authorization: Bearer <token>`. There's no role check beyond "token is valid" because the only role is `admin`.

### Data model

Four Mongoose models in `server/src/models/`:
- `User` — `email`, `passwordHash` (bcrypt), `role: 'admin'`, reset-token fields and lockout fields are `select: false` so normal reads don't leak them.
- `Service` — `slug` unique, `order` for display, `isActive` filters the public list.
- `Project` — `slug` unique, `order`, `isFeatured` (shown on home page), `imageUrl` (either `/uploads/...` or an absolute http(s) URL).
- `Contact` — form submissions. `isRead` toggles in admin UI, `emailSent` records whether nodemailer succeeded.

Slugs are **not auto-generated** — the admin UI requires the user to set them, and the server enforces `^[a-z0-9-]+$`. Keep it that way unless asked.

### Seeding

`server/src/seed.js` is the canonical content source. It:
1. Upserts one admin user from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), bcrypt cost 12.
2. `deleteMany` + `insertMany` on services and projects — **running it wipes all services/projects**.

When editing default content, edit this file and rerun `npm run seed`. Don't add a migration layer for a small brochure site.

### Image upload flow

1. Admin picks a file in `ImageUpload` (`client/src/components/ImageUpload.jsx`).
2. Client validates type + size, POSTs `multipart/form-data` to `/api/uploads/image` (cookie auth).
3. Server: multer (memory) → sharp verifies + re-encodes → random filename under `UPLOAD_DIR` → responds `{ url: '/uploads/...' }`.
4. Admin saves the project with `imageUrl` pointing at the returned URL.
5. Removing an image in the UI calls `DELETE /api/uploads/image?url=...` which unlinks the file (idempotent — ENOENT is ignored).

**Known caveat:** when a project is deleted via `/api/projects/:id`, the associated uploaded file is **not** deleted automatically. If you add that, do it in the projects route and re-use the safe-path logic from `routes/uploads.js`.

### RTL and typography

- `<html lang="he" dir="rtl">` is set in `client/index.html`. Don't flip it per component.
- Heebo is loaded from Google Fonts in `index.html`. If you need a different weight, add it to the `family=Heebo:wght=...` query string rather than importing a second font.
- `client/src/styles/global.css` owns the design tokens (CSS custom properties for colors, spacing, radii). Component CSS files sit next to the component (`Navbar.jsx` + `Navbar.css`). Prefer tokens over raw hex values.
- Avoid mixing left/right properties — use `margin-inline-start` / `padding-inline-end` when practical.

## Conventions specific to this repo

- **All UI copy is Hebrew.** English leaks only into code identifiers (class names, route paths, slugs). Server error messages are also Hebrew because the client displays them verbatim (`err.response.data.error`).
- **Currency/dates** formatted with `he-IL` locale.
- **Company info** (real phone, address, hours) lives in `companyInfo` in `client/src/api.js`. Used in Navbar, Footer, Contact page — don't duplicate.
- **CommonJS on the server** (`require` / `module.exports`), ES modules on the client. Don't mix.
- **Password strength**: enforced both client-side (minLength 8) and server-side (`passwordValidator` in `routes/auth.js`: ≥8 chars, upper+lower+digit). When adding new password inputs, wire the same server-side validator.

## Git workflow

- Active development branch: `claude/add-claude-documentation-5veug`
- Default branch: `main`
- Commit and push to the feature branch; don't push to `main` without explicit permission.

## Intentionally out of scope

Not requested yet — ask before adding:
- Multi-user admin / RBAC.
- i18n (Hebrew-only by design).
- Blog, careers, quote-wizard pages.
- Tests, CI, Docker, deploy scripts.
- Image gallery per project (single `imageUrl` is enough for now).
- Object storage (S3/R2). Uploads are local disk — fine until you need multi-instance deploy.
