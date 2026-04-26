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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="חזרה לראש העמוד"
      title="חזרה לראש העמוד"
      className={`scroll-top-btn${visible ? ' visible' : ''}`}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
