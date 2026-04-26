import { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newVisible = window.scrollY > 100;
          console.log('[ScrollToTop]', { scrollY: window.scrollY, visible: newVisible });
          setVisible(newVisible);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  // INLINE styles — no class dependency
  const btnStyle = {
    position: 'fixed',
    bottom: '24px',
    insetInlineStart: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#111',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    opacity: visible ? 1 : 0,
    visibility: visible ? 'visible' : 'hidden',
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease',
    zIndex: 90,
    padding: 0,
    margin: 0,
    pointerEvents: visible ? 'auto' : 'none',
  };

  console.log('[ScrollToTop] RENDERING button, visible:', visible);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="חזרה לראש העמוד"
      title="חזרה לראש העמוד"
      style={btnStyle}
      data-testid="scroll-top-btn"
    >
      ↑
    </button>
  );
}
