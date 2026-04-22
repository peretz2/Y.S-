import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { companyInfo } from '../api.js';
import ThemeToggle from './ThemeToggle.jsx';
import './Navbar.css';

const links = [
  { to: '/', label: 'דף הבית', end: true },
  { to: '/about', label: 'אודות' },
  { to: '/services', label: 'שירותים' },
  { to: '/projects', label: 'פרויקטים' },
  { to: '/contact', label: 'צור קשר' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">י.ש</span>
          <span className="brand-text">
            <strong>{companyInfo.name}</strong>
            <small>נגרות וחיפויים</small>
          </span>
        </Link>

        <div className="nav-right">
          <ThemeToggle className="nav-theme-toggle" />
          <button
            className="nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            aria-controls="main-nav"
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        <nav id="main-nav" className={`nav-links ${open ? 'open' : ''}`} aria-label="תפריט ראשי">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
          <a href={`tel:${companyInfo.phone}`} className="nav-cta">
            📞 {companyInfo.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
