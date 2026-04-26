import { useState } from 'react';
import api from '../api.js';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import './Contact.css';

export default function Contact() {
  const { info: companyInfo } = useCompanyInfo();
  const { t } = useContent();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: null, text: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: null, text: '' });
    setSubmitting(true);
    try {
      await api.post('/contacts', form);
      setStatus({ type: 'success', text: t('contact.form.success', 'תודה! פנייתך התקבלה ונחזור אליך בהקדם.') });
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.error || t('contact.form.error.generic', 'אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו.'),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>{t('contact.eyebrow', '§ צור קשר · שיחה ראשונית')}</span>
        </div>
        <h1 className="display">
          {t('contact.title.1', 'בואו נדבר.')}<br /><em>{t('contact.title.2', 'בגובה העיניים.')}</em>
        </h1>
        <div className="page-lead">
          <p>{t('contact.lead.1', 'השאירו פרטים בטופס ונחזור אליכם תוך יום עסקים אחד — או התקשרו ישירות למפעל בגבעת אלה. אם אתם אדריכלים או קבלנים ראשיים, אפשר לצרף גם תכניות / קבצי CAD לפנייה.')}</p>
          <p className="mono">{t('contact.lead.2', 'Response < 24h · בעברית או באנגלית')}</p>
        </div>
      </section>

      <section className="wrap sec contact-sec">
        <div className="contact-layout">
          <form onSubmit={onSubmit} className="contact-form" noValidate>
            <div className="form-head">
              <div className="idx"><span className="n">§01</span><span className="k">{t('contact.form.section.label', 'טופס פנייה')}</span></div>
              <h2>
                {t('contact.form.heading', 'ספרו לנו על')}<br /><em>{t('contact.form.heading.em', 'הפרויקט.')}</em>
              </h2>
            </div>

            {status.type && (
              <div className={`alert alert-${status.type === 'success' ? 'success' : 'error'}`} role="status">
                {status.text}
              </div>
            )}

            <div className="form-grid">
              <div className="field full">
                <label htmlFor="c-name">{t('contact.form.name.label', 'שם מלא *')}</label>
                <input id="c-name" type="text" required autoComplete="name"
                  value={form.name} onChange={update('name')} />
              </div>
              <div className="field">
                <label htmlFor="c-phone">{t('contact.form.phone.label', 'טלפון *')}</label>
                <input id="c-phone" type="tel" required autoComplete="tel"
                  value={form.phone} onChange={update('phone')} />
              </div>
              <div className="field">
                <label htmlFor="c-email">{t('contact.form.email.label', 'אימייל')}</label>
                <input id="c-email" type="email" autoComplete="email"
                  value={form.email} onChange={update('email')} />
              </div>
              <div className="field full">
                <label htmlFor="c-subject">{t('contact.form.subject.label', 'נושא')}</label>
                <input id="c-subject" type="text"
                  value={form.subject} onChange={update('subject')}
                  placeholder={t('contact.form.subject.placeholder', 'למשל: חיפוי לובי בבניין משרדים')} />
              </div>
              <div className="field full">
                <label htmlFor="c-message">{t('contact.form.message.label', 'הודעה *')}</label>
                <textarea id="c-message" required rows={5}
                  value={form.message} onChange={update('message')} />
              </div>
            </div>

            <button type="submit" className="btn contact-submit" disabled={submitting}>
              {submitting ? t('contact.form.submitting', 'שולח…') : t('contact.form.submit', 'שליחת פנייה ←')}
            </button>
          </form>

          <aside className="contact-side">
            <div className="side-block">
              <div className="mono">{t('contact.side.contact.label', 'פרטי התקשרות')}</div>
              <address>
                <div className="side-line">
                  <span className="side-k">Phone</span>
                  <a href={`tel:${companyInfo.phone}`} className="ltr">{companyInfo.phoneDisplay}</a>
                </div>
                <div className="side-line">
                  <span className="side-k">Fax</span>
                  <span className="ltr">{companyInfo.fax}</span>
                </div>
                <div className="side-line">
                  <span className="side-k">Email</span>
                  <a href={`mailto:${companyInfo.email}`} className="ltr">{companyInfo.email}</a>
                </div>
                <div className="side-line">
                  <span className="side-k">Address</span>
                  <span>{companyInfo.address}<br /><span className="muted">מיקוד {companyInfo.postal}</span></span>
                </div>
              </address>
            </div>

            <div className="side-block">
              <div className="mono">{t('contact.side.hours.label', 'שעות פעילות')}</div>
              <div className="side-line">
                <span className="side-k">א׳ – ה׳</span>
                <span>{companyInfo.hours.weekdays.split(':').slice(1).join(':').trim()}</span>
              </div>
              <div className="side-line">
                <span className="side-k">ו׳</span>
                <span>{companyInfo.hours.friday.split(':').slice(1).join(':').trim()}</span>
              </div>
              <div className="side-line">
                <span className="side-k">שבת</span>
                <span className="muted">{t('contact.side.hours.saturday', 'סגור')}</span>
              </div>
            </div>

            <div className="side-block side-note">
              <p>{t('contact.side.note', 'אדריכלים וקבלנים ראשיים — אפשר לשלוח תכניות ו/או קבצי CAD למייל, ואנחנו נחזור עם כיוון מחיר ראשוני תוך יום עסקים.')}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
