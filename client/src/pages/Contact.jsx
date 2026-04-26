import { useState } from 'react';
import api from '../api.js';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import Editable from '../content/Editable.jsx';
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
          <span className="line" /><span><Editable contentKey="contact.eyebrow" as="span">{t('contact.eyebrow', '§ צור קשר · שיחה ראשונית')}</Editable></span>
        </div>
        <h1 className="display">
          <Editable contentKey="contact.title.1" as="span">{t('contact.title.1', 'בואו נדבר.')}</Editable><br />
          <em><Editable contentKey="contact.title.2" as="span">{t('contact.title.2', 'בגובה העיניים.')}</Editable></em>
        </h1>
        <div className="page-lead">
          <p><Editable contentKey="contact.lead.1" as="span" multiline>{t('contact.lead.1', 'השאירו פרטים בטופס ונחזור אליכם תוך יום עסקים אחד — או התקשרו ישירות למפעל בגבעת אלה. אם אתם אדריכלים או קבלנים ראשיים, אפשר לצרף גם תכניות / קבצי CAD לפנייה.')}</Editable></p>
          <p className="mono"><Editable contentKey="contact.lead.2" as="span">{t('contact.lead.2', 'Response < 24h · בעברית או באנגלית')}</Editable></p>
        </div>
      </section>

      <section className="wrap sec contact-sec">
        <div className="contact-layout">
          <form onSubmit={onSubmit} className="contact-form" noValidate>
            <div className="form-head">
              <div className="idx"><span className="n">§01</span><span className="k"><Editable contentKey="contact.form.section.label" as="span">{t('contact.form.section.label', 'טופס פנייה')}</Editable></span></div>
              <h2>
                <Editable contentKey="contact.form.heading" as="span">{t('contact.form.heading', 'ספרו לנו על')}</Editable><br />
                <em><Editable contentKey="contact.form.heading.em" as="span">{t('contact.form.heading.em', 'הפרויקט.')}</Editable></em>
              </h2>
            </div>

            {status.type && (
              <div className={`alert alert-${status.type === 'success' ? 'success' : 'error'}`} role="status">
                {status.text}
              </div>
            )}

            <div className="form-grid">
              <div className="field full">
                <label htmlFor="c-name"><Editable contentKey="contact.form.name.label" as="span">{t('contact.form.name.label', 'שם מלא *')}</Editable></label>
                <input id="c-name" type="text" required autoComplete="name"
                  value={form.name} onChange={update('name')} />
              </div>
              <div className="field">
                <label htmlFor="c-phone"><Editable contentKey="contact.form.phone.label" as="span">{t('contact.form.phone.label', 'טלפון *')}</Editable></label>
                <input id="c-phone" type="tel" required autoComplete="tel"
                  value={form.phone} onChange={update('phone')} />
              </div>
              <div className="field">
                <label htmlFor="c-email"><Editable contentKey="contact.form.email.label" as="span">{t('contact.form.email.label', 'אימייל')}</Editable></label>
                <input id="c-email" type="email" autoComplete="email"
                  value={form.email} onChange={update('email')} />
              </div>
              <div className="field full">
                <label htmlFor="c-subject"><Editable contentKey="contact.form.subject.label" as="span">{t('contact.form.subject.label', 'נושא')}</Editable></label>
                <input id="c-subject" type="text"
                  value={form.subject} onChange={update('subject')}
                  placeholder={t('contact.form.subject.placeholder', 'למשל: חיפוי לובי בבניין משרדים')} />
              </div>
              <div className="field full">
                <label htmlFor="c-message"><Editable contentKey="contact.form.message.label" as="span">{t('contact.form.message.label', 'הודעה *')}</Editable></label>
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
              <div className="mono"><Editable contentKey="contact.side.contact.label" as="span">{t('contact.side.contact.label', 'פרטי התקשרות')}</Editable></div>
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
              <div className="mono"><Editable contentKey="contact.side.hours.label" as="span">{t('contact.side.hours.label', 'שעות פעילות')}</Editable></div>
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
                <span className="muted"><Editable contentKey="contact.side.hours.saturday" as="span">{t('contact.side.hours.saturday', 'סגור')}</Editable></span>
              </div>
            </div>

            <div className="side-block side-note">
              <p><Editable contentKey="contact.side.note" as="span" multiline>{t('contact.side.note', 'אדריכלים וקבלנים ראשיים — אפשר לשלוח תכניות ו/או קבצי CAD למייל, ואנחנו נחזור עם כיוון מחיר ראשוני תוך יום עסקים.')}</Editable></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
