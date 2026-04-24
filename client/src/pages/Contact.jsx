import { useState } from 'react';
import api from '../api.js';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import './Contact.css';

export default function Contact() {
  const { info: companyInfo } = useCompanyInfo();
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
      setStatus({ type: 'success', text: 'תודה! פנייתך התקבלה ונחזור אליך בהקדם.' });
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.error || 'אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="wrap page-hero">
        <div className="hero-eyebrow">
          <span className="line" /><span>§ צור קשר · שיחה ראשונית</span>
        </div>
        <h1 className="display">
          בואו נדבר.<br /><em>בגובה העיניים.</em>
        </h1>
        <div className="page-lead">
          <p>
            השאירו פרטים בטופס ונחזור אליכם תוך יום עסקים אחד — או התקשרו ישירות למפעל בגבעת אלה.
            אם אתם אדריכלים או קבלנים ראשיים, אפשר לצרף גם תכניות / קבצי CAD לפנייה.
          </p>
          <p className="mono">Response &lt; 24h · בעברית או באנגלית</p>
        </div>
      </section>

      <section className="wrap sec contact-sec">
        <div className="contact-layout">
          <form onSubmit={onSubmit} className="contact-form" noValidate>
            <div className="form-head">
              <div className="idx"><span className="n">§01</span><span className="k">טופס פנייה</span></div>
              <h2>
                ספרו לנו על<br /><em>הפרויקט.</em>
              </h2>
            </div>

            {status.type && (
              <div className={`alert alert-${status.type === 'success' ? 'success' : 'error'}`} role="status">
                {status.text}
              </div>
            )}

            <div className="form-grid">
              <div className="field full">
                <label htmlFor="c-name">שם מלא *</label>
                <input id="c-name" type="text" required autoComplete="name"
                  value={form.name} onChange={update('name')} />
              </div>
              <div className="field">
                <label htmlFor="c-phone">טלפון *</label>
                <input id="c-phone" type="tel" required autoComplete="tel"
                  value={form.phone} onChange={update('phone')} />
              </div>
              <div className="field">
                <label htmlFor="c-email">אימייל</label>
                <input id="c-email" type="email" autoComplete="email"
                  value={form.email} onChange={update('email')} />
              </div>
              <div className="field full">
                <label htmlFor="c-subject">נושא</label>
                <input id="c-subject" type="text"
                  value={form.subject} onChange={update('subject')}
                  placeholder="למשל: חיפוי לובי בבניין משרדים" />
              </div>
              <div className="field full">
                <label htmlFor="c-message">הודעה *</label>
                <textarea id="c-message" required rows={5}
                  value={form.message} onChange={update('message')} />
              </div>
            </div>

            <button type="submit" className="btn contact-submit" disabled={submitting}>
              {submitting ? 'שולח…' : 'שליחת פנייה ←'}
            </button>
          </form>

          <aside className="contact-side">
            <div className="side-block">
              <div className="mono">פרטי התקשרות</div>
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
              <div className="mono">שעות פעילות</div>
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
                <span className="muted">סגור</span>
              </div>
            </div>

            <div className="side-block side-note">
              <p>
                אדריכלים וקבלנים ראשיים — אפשר לשלוח תכניות ו/או קבצי CAD למייל, ואנחנו נחזור עם כיוון מחיר ראשוני תוך יום עסקים.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
