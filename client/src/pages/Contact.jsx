import { useState } from 'react';
import api, { companyInfo } from '../api.js';

export default function Contact() {
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
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="badge badge-accent">צור קשר</span>
          <h1 style={{ marginTop: '1rem' }}>בואו נדבר</h1>
          <p className="text-muted">
            השאירו פרטים ונחזור אליכם תוך יום עסקים – או התקשרו אלינו ישירות.
          </p>
        </div>

        <div className="contact-grid">
          <form onSubmit={onSubmit} className="card" style={{ padding: '2rem' }}>
            {status.type && (
              <div className={`alert alert-${status.type}`}>{status.text}</div>
            )}
            <div className="form-group">
              <label>שם מלא *</label>
              <input type="text" required value={form.name} onChange={update('name')} />
            </div>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label>טלפון *</label>
                <input type="tel" required value={form.phone} onChange={update('phone')} />
              </div>
              <div className="form-group">
                <label>אימייל</label>
                <input type="email" value={form.email} onChange={update('email')} />
              </div>
            </div>
            <div className="form-group">
              <label>נושא</label>
              <input type="text" value={form.subject} onChange={update('subject')} placeholder="למשל: חיפוי לובי" />
            </div>
            <div className="form-group">
              <label>הודעה *</label>
              <textarea required value={form.message} onChange={update('message')} />
            </div>
            <button type="submit" className="btn btn-accent" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'שולח…' : 'שליחת פנייה'}
            </button>
          </form>

          <aside>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3>פרטי התקשרות</h3>
              <p style={{ margin: '0.3rem 0' }}>
                📍 <strong>{companyInfo.address}</strong><br />
                <small className="text-muted">מיקוד {companyInfo.postal}</small>
              </p>
              <p style={{ margin: '0.8rem 0' }}>
                📞 <a href={`tel:${companyInfo.phone}`}>{companyInfo.phoneDisplay}</a>
              </p>
              <p style={{ margin: '0.8rem 0' }}>
                📠 {companyInfo.fax}
              </p>
              <p style={{ margin: '0.8rem 0' }}>
                ✉️ <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
              </p>
            </div>
            <div className="card">
              <h3>שעות פעילות</h3>
              <p>{companyInfo.hours.weekdays}</p>
              <p>{companyInfo.hours.friday}</p>
              <p className="text-muted">שבת: סגור</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
