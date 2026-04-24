import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ services: 0, projects: 0, contacts: 0, unread: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [services, projects, contacts] = await Promise.all([
          api.get('/services/all'),
          api.get('/projects'),
          api.get('/contacts'),
        ]);
        setStats({
          services: services.data.length,
          projects: projects.data.length,
          contacts: contacts.data.length,
          unread: contacts.data.filter((c) => !c.isRead).length,
        });
      } catch (_err) {
        /* no-op */
      }
    })();
  }, []);

  return (
    <>
      <div className="admin-header">
        <h1>לוח בקרה</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <strong>{stats.services}</strong>
          <span>שירותים</span>
        </div>
        <div className="stat-box">
          <strong>{stats.projects}</strong>
          <span>פרויקטים</span>
        </div>
        <div className="stat-box">
          <strong>{stats.contacts}</strong>
          <span>סה״כ פניות</span>
        </div>
        <div className="stat-box">
          <strong style={{ color: stats.unread ? 'var(--color-accent)' : undefined }}>
            {stats.unread}
          </strong>
          <span>פניות שלא נקראו</span>
        </div>
      </div>

      <div className="grid grid-3">
        <Link to="/admin/services" className="card">
          <h3>ניהול שירותים</h3>
          <p className="text-muted">הוספה, עריכה ומחיקה של שירותים.</p>
        </Link>
        <Link to="/admin/projects" className="card">
          <h3>ניהול פרויקטים</h3>
          <p className="text-muted">הוספת פרויקטים חדשים וסידור תיק העבודות.</p>
        </Link>
        <Link to="/admin/contacts" className="card">
          <h3>פניות מהאתר</h3>
          <p className="text-muted">צפייה בפניות חדשות מטופס יצירת קשר.</p>
        </Link>
      </div>
    </>
  );
}
