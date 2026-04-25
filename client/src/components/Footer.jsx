import { Link } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import './Footer.css';

export default function Footer() {
  const { info: companyInfo } = useCompanyInfo();
  const { t } = useContent();
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="ft">
      <div className="wrap ft-top">
        <div>
          <h3>{companyInfo.name}</h3>
          <p className="ft-tag">
            {companyInfo.nameEn} — {t('footer.tagline', 'נגרות וחיפויים בגובה העיניים')}. מייצרים ומתקינים מגבעת אלה מאז {companyInfo.founded}.
          </p>
        </div>
        <div>
          <h4>{t('footer.quickLinks', 'ניווט')}</h4>
          <ul>
            <li><Link to="/">{t('nav.home', 'דף הבית')}</Link></li>
            <li><Link to="/about">{t('nav.about', 'אודות')}</Link></li>
            <li><Link to="/services">{t('nav.services', 'שירותים')}</Link></li>
            <li><Link to="/projects">{t('nav.projects', 'פרויקטים')}</Link></li>
            <li><Link to="/contact">{t('nav.contact', 'צור קשר')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.contact', 'יצירת קשר')}</h4>
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
        <span>© {year} {companyInfo.name} · {t('footer.rights', 'כל הזכויות שמורות')}</span>
        <nav aria-label="חוקי">
          <Link to="/terms">{t('footer.terms', 'תנאי שימוש')}</Link>
          <Link to="/privacy">{t('footer.privacy', 'פרטיות')}</Link>
          <Link to="/accessibility">{t('footer.accessibility', 'נגישות')}</Link>
        </nav>
      </div>
    </footer>
  );
}
