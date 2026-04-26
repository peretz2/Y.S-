import { Link } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import Editable from '../content/Editable.jsx';
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
            {companyInfo.nameEn} — <Editable contentKey="footer.tagline" as="span" multiline>{t('footer.tagline', 'נגרות וחיפויים בגובה העיניים')}</Editable>. מייצרים ומתקינים מגבעת אלה מאז {companyInfo.founded}.
          </p>
        </div>
        <div>
          <h4><Editable contentKey="footer.quickLinks" as="span">{t('footer.quickLinks', 'ניווט')}</Editable></h4>
          <ul>
            <li><Link to="/"><Editable contentKey="nav.home" as="span">{t('nav.home', 'דף הבית')}</Editable></Link></li>
            <li><Link to="/about"><Editable contentKey="nav.about" as="span">{t('nav.about', 'אודות')}</Editable></Link></li>
            <li><Link to="/services"><Editable contentKey="nav.services" as="span">{t('nav.services', 'שירותים')}</Editable></Link></li>
            <li><Link to="/projects"><Editable contentKey="nav.projects" as="span">{t('nav.projects', 'פרויקטים')}</Editable></Link></li>
            <li><Link to="/contact"><Editable contentKey="nav.contact" as="span">{t('nav.contact', 'צור קשר')}</Editable></Link></li>
          </ul>
        </div>
        <div>
          <h4><Editable contentKey="footer.contact" as="span">{t('footer.contact', 'יצירת קשר')}</Editable></h4>
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
        <span>© {year} {companyInfo.name} · <Editable contentKey="footer.rights" as="span">{t('footer.rights', 'כל הזכויות שמורות')}</Editable></span>
        <nav aria-label="חוקי">
          <Link to="/terms"><Editable contentKey="footer.terms" as="span">{t('footer.terms', 'תנאי שימוש')}</Editable></Link>
          <Link to="/privacy"><Editable contentKey="footer.privacy" as="span">{t('footer.privacy', 'פרטיות')}</Editable></Link>
          <Link to="/accessibility"><Editable contentKey="footer.accessibility" as="span">{t('footer.accessibility', 'נגישות')}</Editable></Link>
        </nav>
      </div>
    </footer>
  );
}
