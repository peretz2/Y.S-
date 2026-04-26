import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 400;
          setVisible(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  if (!mounted) return null;

  const buttonStyles = {
    position: 'fixed',
    bottom: '24px',
    insetInlineEnd: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'rgb(17, 17, 17)',
    color: 'rgb(255, 255, 255)',
    border: '2px solid rgb(255, 255, 255)',
    cursor: 'pointer',
    display: visible ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: 1,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
    zIndex: 999,
    padding: 0,
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  return createPortal(
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="חזרה לראש העמוד"
      title="חזרה לראש העמוד"
      style={buttonStyles}
      data-testid="scroll-top-btn"
    >
      ↑
    </button>,
    document.body
  );
}
