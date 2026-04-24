# Deploy guide — Render (API) + Vercel (client)

This repo is pre-wired for a **Render + Vercel** split: Render runs the Express API with a persistent disk for uploads, Vercel serves the React build. Vercel rewrites `/api/*` and `/uploads/*` to Render so the browser sees everything as same-origin — keeping `SameSite=Strict` cookies intact.

**Heads up on cost:** Render's free Web Service tier does **not** support persistent disks, so uploads would vanish on every deploy. `render.yaml` is set to the **Starter plan ($7/mo)** plus a 1 GB disk (~$0.25/mo). Atlas M0 is free. Vercel Hobby is free. Total: **~$7/mo**.

---

## One-time setup

### 1. MongoDB Atlas (free)
1. Create a free M0 cluster.
2. Database Access → add a user with "Read and write to any database".
3. Network Access → add `0.0.0.0/0` (or Render's outbound IPs, see their docs).
4. Clusters → Connect → "Connect your application" → copy the `mongodb+srv://...` URI. Replace `<password>` and append `/ys_engineers` as the db name.

### 2. SMTP credentials
Either:
- **Gmail**: enable 2FA, then generate an App Password (Account → Security → App passwords). User = your Gmail address, pass = the 16-char code.
- **Resend / SendGrid / Postmark**: sign up, verify a sender, grab SMTP creds.

### 3. Render — API service
1. Push the repo to GitHub.
2. Render dashboard → New → **Blueprint** → select this repo. Render reads `render.yaml` and creates `ys-engineers-api`.
3. In the service's **Environment** tab, fill the blanks (the `sync: false` keys):
   - `MONGO_URI` → from Atlas
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` → your admin login (must be ≥ 8 chars, upper + lower + digit)
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO` → from step 2
   - `CLIENT_ORIGIN` and `PUBLIC_URL` → leave blank for now, we'll fill them after Vercel goes live
4. First deploy will fail or CORS-block; that's fine. Note the URL Render assigns — e.g. `https://ys-engineers-api-abc1.onrender.com`.
5. Open the shell in Render ("Shell" tab) and run `node src/seed.js` once to create the admin user + seed content. (Or just wait — seeding on first deploy can be added later.)

### 4. Vercel — client
1. Update `client/vercel.json`: replace `REPLACE-WITH-RENDER-SERVICE-NAME` (both places) with your actual Render subdomain. Commit and push.
2. Vercel dashboard → New Project → import the repo.
3. **Root Directory** → `client`  *(critical — Vercel will otherwise try to build the whole monorepo)*
4. Framework: auto-detected as Vite. Leave build/output defaults alone.
5. Deploy. Note the URL — e.g. `https://ys-engineers.vercel.app`.

### 5. Wire Render back to Vercel
Back in Render → Environment, set:
- `CLIENT_ORIGIN` = `https://ys-engineers.vercel.app`
- `PUBLIC_URL` = `https://ys-engineers.vercel.app`

Save — Render restarts automatically. Password-reset emails and CORS now use the correct URL.

---

## Verifying it works

1. Visit your Vercel URL — the public site should render.
2. Submit the contact form → check Render logs for `[contacts]` and your inbox for the email.
3. `/admin/login` with the admin credentials you set.
4. Upload an image under Projects → check that the image URL resolves.
5. Use "שכחתי סיסמה" on the login page → check email → reset → log back in.

## Custom domain

When you buy a domain (let's say `ys-engineers.co.il`):

1. Vercel → project → Domains → add `ys-engineers.co.il`. Vercel tells you a DNS record to create.
2. Update Render env vars:
   - `CLIENT_ORIGIN` → `https://ys-engineers.co.il`
   - `PUBLIC_URL` → `https://ys-engineers.co.il`
3. No changes to `vercel.json` needed — the rewrites still target the Render URL, but the browser sees only the custom domain.

## Pitfalls

- **Render free plan** won't work — no persistent disk. Uploads disappear on every deploy. Stick with Starter or move uploads to S3/R2.
- **Render cold starts** on the Starter plan are ~1 s. If you downgrade to Free, services spin down after 15 min of inactivity and take ~30 s to wake up.
- **`REPLACE-WITH-RENDER-SERVICE-NAME`** in `vercel.json` is a live placeholder — if you forget to swap it, every `/api` call on the live site will 404 with a clear message.
- **Preview deployments** on Vercel will get their own URL (`ys-engineers-git-branch.vercel.app`). They'll be CORS-blocked by Render unless you add them to `CLIENT_ORIGIN` (comma-separated).
- **Atlas IP allowlist**: if you scoped it to Render's IPs and Render later rotates them, the API will start getting DB connection errors. Re-check periodically.

## Alternative: skip Render disk, use S3/R2

If you'd rather not pay for a Render disk, swap the uploads pipeline to object storage:
- Add `@aws-sdk/client-s3` and a small adapter in `server/src/routes/uploads.js`.
- Serve images from the bucket's public URL (set bucket CORS for your domain).
- Delete the `disk:` block from `render.yaml` and downgrade to the free plan if you want.

Ask and I can wire this up — it's a self-contained change to one route.
