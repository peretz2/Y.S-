import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ services: 0, projects: 0, contacts: 0, unread: 0 });
  const [recent, setRecent] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [services, projects, contacts] = await Promise.all([
          api.get('/services/all'),
          api.get('/projects'),
          api.get('/contacts'),
        ]);
        const sortedContacts = [...contacts.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setStats({
          services: services.data.length,
          projects: projects.data.length,
          contacts: contacts.data.length,
          unread: contacts.data.filter((c) => !c.isRead).length,
        });
        setRecent(sortedContacts.slice(0, 5));
      } catch (error) {
        setErr(error.response?.data?.error || 'שגיאה בטעינת הנתונים');
      }
    })();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'בוקר טוב';
    if (h < 18) return 'צהריים טובים';
    return 'ערב טוב';
  })();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{greeting}.</h1>
          <div className="admin-header-meta">
            {user?.email && <span>מחובר כ-{user.email}</span>}
          </div>
        </div>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <div className="admin-kpis">
        <Link to="/admin/services" className="kpi">
          <span className="kpi-k">שירותים</span>
          <span className="kpi-v">{String(stats.services).padStart(2, '0')}</span>
          <span className="kpi-n">פעילים באתר</span>
        </Link>
        <Link to="/admin/projects" className="kpi">
          <span className="kpi-k">פרויקטים</span>
          <span className="kpi-v">{String(stats.projects).padStart(2, '0')}</span>
          <span className="kpi-n">בתיק העבודות</span>
        </Link>
        <Link to="/admin/contacts" className={`kpi ${stats.unread ? 'kpi-attention' : ''}`}>
          <span className="kpi-k">פניות חדשות</span>
          <span className="kpi-v">{String(stats.unread).padStart(2, '0')}</span>
          <span className="kpi-n">{stats.contacts} סה״כ</span>
        </Link>
      </div>

      <section className="admin-section">
        <header className="admin-section-head">
          <span className="mono">פעולות מהירות</span>
          <h2>מה תרצה לעשות?</h2>
        </header>
        <div className="admin-shortcuts">
          <Link to="/admin/services" className="shortcut">
            <h3>ניהול שירותים</h3>
            <p>הוספה, עריכה ומחיקה של שירותים שמוצגים באתר.</p>
            <span className="arrow">פתח →</span>
          </Link>
          <Link to="/admin/projects" className="shortcut">
            <h3>תיק העבודות</h3>
            <p>פרויקטים חדשים, סידור התצוגה, החלפת תמונות.</p>
            <span className="arrow">פתח →</span>
          </Link>
          <Link to="/admin/contacts" className="shortcut">
            <h3>פניות מהאתר</h3>
            <p>צפייה בפניות שהתקבלו דרך טופס יצירת קשר.</p>
            <span className="arrow">פתח →</span>
          </Link>
          <Link to="/admin/users" className="shortcut">
            <h3>משתמשי אדמין</h3>
            <p>הוספה ומחיקה של מנהלים נוספים בעלי גישה לפאנל.</p>
            <span className="arrow">פתח →</span>
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="admin-section">
          <header className="admin-section-head">
            <span className="mono">פניות אחרונות</span>
            <h2>5 הפניות האחרונות</h2>
          </header>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>שם</th>
                  <th>טלפון</th>
                  <th>נושא</th>
                  <th>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c._id}>
                    <td>
                      {new Date(c.createdAt).toLocaleDateString('he-IL', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })}
                    </td>
                    <td>{c.name}</td>
                    <td className="ltr"><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                    <td>{c.subject || '—'}</td>
                    <td>
                      {c.isRead
                        ? <span className="text-muted">נקרא</span>
                        : <strong style={{ color: 'var(--color-accent)' }}>חדש</strong>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
