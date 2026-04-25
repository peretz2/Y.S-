import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCompanyInfo } from '../company/CompanyInfoContext.jsx';
import { useContent } from '../content/SiteContentContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import './Navbar.css';

export default function Navbar() {
  const { info: companyInfo } = useCompanyInfo();
  const { t } = useContent();

  const LINKS = [
    { to: '/', label: t('nav.home', 'דף הבית'), end: true },
    { to: '/about', label: t('nav.about', 'אודות') },
    { to: '/services', label: t('nav.services', 'שירותים') },
    { to: '/projects', label: t('nav.projects', 'פרויקטים') },
    { to: '/contact', label: t('nav.contact', 'צור קשר') },
  ];
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close mobile nav on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // lock body scroll when mobile nav open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [open]);

  return (
    <header className="hdr">
      <div className="hdr-inner wrap">
        <Link to="/" className="brand" aria-label={companyInfo.name}>
          <span className="brand-mark">י.ש. מהנדסים</span>
          <span className="brand-sub">Est. {companyInfo.founded} · גבעת אלה</span>
        </Link>

        <nav className={`primary ${open ? 'open' : ''}`} aria-label="ניווט ראשי">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr-cta">
          <a href={`tel:${companyInfo.phone}`} className="phone ltr" aria-label="טלפון">
            {companyInfo.phoneDisplay}
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="burger"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
