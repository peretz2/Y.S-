import { Link } from 'react-router-dom';
import { companyInfo } from '../api.js';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{companyInfo.name}</h3>
          <p className="text-muted">{companyInfo.tagline}</p>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            {companyInfo.nameEn}
          </p>
        </div>

        <div>
          <h4>ניווט</h4>
          <ul>
            <li><Link to="/">דף הבית</Link></li>
            <li><Link to="/about">אודות</Link></li>
            <li><Link to="/services">שירותים</Link></li>
            <li><Link to="/projects">פרויקטים</Link></li>
            <li><Link to="/contact">צור קשר</Link></li>
          </ul>
        </div>

        <div>
          <h4>יצירת קשר</h4>
          <ul>
            <li>📍 {companyInfo.address}</li>
            <li>📞 <a href={`tel:${companyInfo.phone}`}>{companyInfo.phoneDisplay}</a></li>
            <li>📠 {companyInfo.fax}</li>
            <li>✉️ <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></li>
          </ul>
        </div>

        <div>
          <h4>שעות פעילות</h4>
          <ul>
            <li>{companyInfo.hours.weekdays}</li>
            <li>{companyInfo.hours.friday}</li>
            <li>שבת: סגור</li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <nav aria-label="קישורי מדיניות">
            <Link to="/support">שירות ותמיכה</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms">תנאי שימוש</Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy">מדיניות פרטיות</Link>
            <span aria-hidden="true">·</span>
            <Link to="/accessibility">הצהרת נגישות</Link>
          </nav>
          <span className="footer-copy">
            © {year} {companyInfo.name}. כל הזכויות שמורות.
          </span>
        </div>
      </div>
    </footer>
  );
}
