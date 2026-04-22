const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE) === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendContactEmail(contact) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] SMTP not configured – skipping email send');
    return false;
  }
  const to = process.env.MAIL_TO || process.env.SMTP_USER;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject = `פנייה חדשה מהאתר – ${contact.name}`;
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>פנייה חדשה מטופס יצירת קשר</h2>
      <p><strong>שם:</strong> ${escapeHtml(contact.name)}</p>
      <p><strong>טלפון:</strong> ${escapeHtml(contact.phone)}</p>
      ${contact.email ? `<p><strong>אימייל:</strong> ${escapeHtml(contact.email)}</p>` : ''}
      ${contact.subject ? `<p><strong>נושא:</strong> ${escapeHtml(contact.subject)}</p>` : ''}
      <p><strong>הודעה:</strong></p>
      <p>${escapeHtml(contact.message).replace(/\n/g, '<br/>')}</p>
    </div>
  `;
  await t.sendMail({ from, to, subject, html, replyTo: contact.email || undefined });
  return true;
}

async function sendPasswordResetEmail({ to, resetUrl }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] SMTP not configured – password reset URL:', resetUrl);
    return false;
  }
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject = 'איפוס סיסמה – י.ש. מהנדסים';
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 560px;">
      <h2>בקשת איפוס סיסמה</h2>
      <p>קיבלנו בקשה לאפס את הסיסמה לחשבון המנהל שלך.</p>
      <p>לחץ על הכפתור כדי להגדיר סיסמה חדשה (הקישור תקף לשעה אחת בלבד):</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}"
           style="background:#c98a2e;color:#fff;padding:12px 24px;
                  border-radius:6px;text-decoration:none;display:inline-block;">
          איפוס סיסמה
        </a>
      </p>
      <p style="color:#555;font-size:0.9em;">
        או העתק את הכתובת: <br/>
        <code style="direction:ltr;display:inline-block;">${escapeHtml(resetUrl)}</code>
      </p>
      <p style="color:#555;font-size:0.9em;">
        אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם מההודעה.
      </p>
    </div>
  `;
  await t.sendMail({ from, to, subject, html });
  return true;
}

module.exports = { sendContactEmail, sendPasswordResetEmail };
