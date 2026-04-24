import { Link } from 'react-router-dom';
import { companyInfo } from '../api.js';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ft">
      <div className="wrap ft-top">
        <div>
          <h3>{companyInfo.name}</h3>
          <p className="ft-tag">
            {companyInfo.nameEn} — נגרות וחיפויים ברמה אדריכלית. מייצרים ומתקינים מגבעת אלה מאז {companyInfo.founded}.
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
            <li>{companyInfo.address}</li>
            <li><a href={`tel:${companyInfo.phone}`} className="ltr">{companyInfo.phoneDisplay}</a></li>
            <li><a href={`mailto:${companyInfo.email}`} className="ltr">{companyInfo.email}</a></li>
          </ul>
        </div>
        <div>
          <h4>שעות</h4>
          <ul>
            <li>{companyInfo.hours.weekdays}</li>
            <li>{companyInfo.hours.friday}</li>
            <li className="ft-muted">שבת · סגור</li>
          </ul>
        </div>
      </div>
      <div className="wrap ft-bot">
        <span>© {year} {companyInfo.name} · כל הזכויות שמורות</span>
        <nav aria-label="חוקי">
          <Link to="/terms">תנאי שימוש</Link>
          <Link to="/privacy">פרטיות</Link>
          <Link to="/accessibility">נגישות</Link>
        </nav>
      </div>
    </footer>
  );
}
