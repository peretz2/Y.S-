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

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { sendContactEmail };
