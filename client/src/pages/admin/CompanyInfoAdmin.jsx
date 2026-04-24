import { useEffect, useState } from 'react';
import { useCompanyInfo } from '../../company/CompanyInfoContext.jsx';

export default function CompanyInfoAdmin() {
  const { info, update, refresh } = useCompanyInfo();
  const [form, setForm] = useState(info);
  const [msg, setMsg] = useState({ type: null, text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(info); }, [info]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setMsg({ type: null, text: '' });
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        nameEn: form.nameEn,
        tagline: form.tagline,
        address: form.address,
        postal: form.postal,
        phone: form.phone,
        phoneDisplay: form.phoneDisplay,
        fax: form.fax,
        email: form.email,
        hoursWeekdays: form.hoursWeekdays,
        hoursFriday: form.hoursFriday,
        founded: form.founded ? Number(form.founded) : null,
        whatsapp: form.whatsapp,
      };
      await update(payload);
      setMsg({ type: 'success', text: 'הפרטים נשמרו ועודכנו באתר.' });
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.error || 'שגיאה בשמירה' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>פרטי החברה</h1>
          <div className="admin-header-meta">מידע שמופיע בכל מקום באתר</div>
        </div>
      </div>

      <p className="help" style={{ maxWidth: 640, marginBottom: 28 }}>
        שינוי כאן משפיע על Navbar, Footer, עמוד יצירת קשר, עמוד שירות ותמיכה ועל כל מקום שמופיע בו טלפון או כתובת.
        השמירה מיידית.
      </p>

      <form onSubmit={save} className="admin-section" style={{ maxWidth: 880 }}>
        <header className="admin-section-head">
          <span className="mono">פרטים בסיסיים</span>
          <h2>זהות החברה</h2>
        </header>

        {msg.type && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="grid grid-2">
          <div className="form-group">
            <label>שם החברה (עברית) <span className="req">*</span></label>
            <input required value={form.name || ''} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label>שם החברה (אנגלית)</label>
            <input value={form.nameEn || ''} onChange={set('nameEn')} dir="ltr" />
          </div>
        </div>

        <div className="form-group">
          <label>סלוגן / תיאור קצר</label>
          <input value={form.tagline || ''} onChange={set('tagline')}
                 placeholder="למשל: נגרות וחיפויים ברמה אדריכלית — מאז 2005" />
        </div>

        <div className="form-group">
          <label>שנת ייסוד</label>
          <input type="number" min="1900" max="2100"
                 value={form.founded || ''} onChange={set('founded')} dir="ltr" />
        </div>

        <header className="admin-section-head" style={{ marginTop: 32 }}>
          <span className="mono">יצירת קשר</span>
          <h2>טלפון ומייל</h2>
        </header>

        <div className="grid grid-2">
          <div className="form-group">
            <label>טלפון (לחיוג, ללא רווחים)</label>
            <input value={form.phone || ''} onChange={set('phone')} dir="ltr"
                   placeholder="054-2201199" />
            <div className="help">משמש בלינק tel: — בלי רווחים או סוגריים</div>
          </div>
          <div className="form-group">
            <label>טלפון (לתצוגה)</label>
            <input value={form.phoneDisplay || ''} onChange={set('phoneDisplay')} dir="ltr"
                   placeholder="054-220-1199" />
            <div className="help">איך הטלפון מוצג למשתמש</div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>פקס</label>
            <input value={form.fax || ''} onChange={set('fax')} dir="ltr" />
          </div>
          <div className="form-group">
            <label>מספר WhatsApp (אופציונלי)</label>
            <input value={form.whatsapp || ''} onChange={set('whatsapp')} dir="ltr"
                   placeholder="972542201199" />
            <div className="help">פורמט בינלאומי בלי + (לכפתור WhatsApp)</div>
          </div>
        </div>

        <div className="form-group">
          <label>אימייל</label>
          <input type="email" value={form.email || ''} onChange={set('email')} dir="ltr" />
        </div>

        <header className="admin-section-head" style={{ marginTop: 32 }}>
          <span className="mono">מיקום</span>
          <h2>כתובת ומפעל</h2>
        </header>

        <div className="grid grid-2">
          <div className="form-group">
            <label>כתובת</label>
            <input value={form.address || ''} onChange={set('address')} />
          </div>
          <div className="form-group">
            <label>מיקוד</label>
            <input value={form.postal || ''} onChange={set('postal')} dir="ltr" />
          </div>
        </div>

        <header className="admin-section-head" style={{ marginTop: 32 }}>
          <span className="mono">שעות</span>
          <h2>שעות פעילות</h2>
        </header>

        <div className="form-group">
          <label>ראשון–חמישי</label>
          <input value={form.hoursWeekdays || ''} onChange={set('hoursWeekdays')}
                 placeholder="א׳–ה׳: 07:30–19:30" />
        </div>

        <div className="form-group">
          <label>שישי</label>
          <input value={form.hoursFriday || ''} onChange={set('hoursFriday')}
                 placeholder="ו׳: 09:00–13:00" />
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'שומר…' : 'שמירה ועדכון האתר'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => { refresh(); setMsg({ type: null, text: '' }); }}>
            רענון מהשרת
          </button>
        </div>
      </form>
    </>
  );
}
