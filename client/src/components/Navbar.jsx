import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { companyInfo } from '../api.js';
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
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">י.ש</span>
          <span className="brand-text">
            <strong>{companyInfo.name}</strong>
            <small>נגרות וחיפויים</small>
          </span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="תפריט"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
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
