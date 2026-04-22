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
      <div className="footer-bottom">
        <div className="container">
          © {year} {companyInfo.name}. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
