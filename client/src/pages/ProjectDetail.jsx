import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setActiveIndex(0);
    api.get(`/projects/slug/${slug}`)
      .then(({ data }) => {
        if (!alive) return;
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.response?.status === 404 ? 'הפרויקט לא נמצא' : 'שגיאה בטעינת הפרויקט');
        setLoading(false);
      });
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <section className="wrap" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
        <p className="text-muted">טוען...</p>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="wrap" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
        <h1 className="display" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {error || 'לא נמצא'}
        </h1>
        <Link to="/projects" className="btn">חזרה לפרויקטים</Link>
      </section>
    );
  }

  const images = project.images && project.images.length > 0
    ? [...project.images].sort((a, b) => (a.order || 0) - (b.order || 0))
    : project.imageUrl
      ? [{ url: project.imageUrl, caption: '', order: 0 }]
      : [];

  const activeImage = images[activeIndex];

  return (
    <>
      <section className="wrap" style={{ paddingBlock: '3rem 2rem' }}>
        <Link
          to="/projects"
          style={{
            display: 'inline-block', marginBottom: '1.5rem',
            color: 'inherit', opacity: 0.6,
            textDecoration: 'none', fontSize: '0.9rem',
          }}
        >
          ← חזרה לפרויקטים
        </Link>

        <h1
          className="display"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem', lineHeight: 1.1 }}
        >
          {project.title}
        </h1>

        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          marginBottom: '2rem', opacity: 0.7,
          fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
        }}>
          {project.category && <span>{project.category}</span>}
          {project.location && <><span>·</span><span>{project.location}</span></>}
          {project.year && <><span>·</span><span>{project.year}</span></>}
        </div>

        {project.summary && (
          <p style={{ maxWidth: '60ch', marginBottom: '2rem', opacity: 0.8, lineHeight: 1.6 }}>
            {project.summary}
          </p>
        )}
      </section>

      {images.length > 0 && (
        <section className="wrap" style={{ paddingBlock: '0 2rem' }}>
          {/* Main image */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="פתח את התמונה במסך מלא"
            style={{
              display: 'block', width: '100%',
              aspectRatio: '16/9',
              background: `url(${activeImage.url}) center/cover no-repeat`,
              border: 'none', padding: 0, margin: 0,
              cursor: 'zoom-in', borderRadius: '4px',
            }}
          />

          {activeImage.caption && (
            <p style={{
              marginTop: '0.75rem', fontSize: '0.85rem',
              opacity: 0.65, fontFamily: 'var(--font-mono)',
            }}>
              {activeImage.caption}
            </p>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '0.5rem',
              marginTop: '1rem',
            }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`תמונה ${idx + 1} מתוך ${images.length}`}
                  style={{
                    width: '100%', aspectRatio: '1',
                    background: `url(${img.url}) center/cover no-repeat`,
                    border: idx === activeIndex ? '2px solid currentColor' : '2px solid transparent',
                    padding: 0, margin: 0,
                    cursor: 'pointer', borderRadius: '4px',
                    opacity: idx === activeIndex ? 1 : 0.55,
                    transition: 'opacity 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => { if (idx !== activeIndex) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { if (idx !== activeIndex) e.currentTarget.style.opacity = '0.55'; }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {project.description && (
        <section className="wrap" style={{ paddingBlock: '2rem 4rem' }}>
          <div style={{ maxWidth: '70ch', whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
            {project.description}
          </div>
        </section>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

function Lightbox({ images, activeIndex, onIndexChange, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndexChange((activeIndex + 1) % images.length);
      else if (e.key === 'ArrowLeft') onIndexChange((activeIndex - 1 + images.length) % images.length);
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, images.length, onIndexChange, onClose]);

  const activeImage = images[activeIndex];

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Counter */}
      <div style={{
        position: 'absolute', top: '1rem', insetInlineStart: '1rem',
        color: 'rgba(255,255,255,0.65)',
        fontSize: '0.85rem', fontFamily: 'monospace',
      }}>
        {activeIndex + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="סגור"
        style={{
          position: 'absolute', top: '1rem', insetInlineEnd: '1rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', width: 40, height: 40,
          borderRadius: '50%', cursor: 'pointer',
          fontSize: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >×</button>

      {/* Image */}
      <img
        src={activeImage.url}
        alt={activeImage.caption || `תמונה ${activeIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '85vh',
          objectFit: 'contain', cursor: 'default',
        }}
      />

      {/* Caption */}
      {activeImage.caption && (
        <div style={{
          position: 'absolute', bottom: '1.5rem',
          insetInline: 0, textAlign: 'center',
          color: 'rgba(255,255,255,0.85)',
          padding: '0 2rem', fontSize: '0.95rem',
        }}>
          {activeImage.caption}
        </div>
      )}

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onIndexChange((activeIndex - 1 + images.length) % images.length); }}
            aria-label="הקודם"
            style={navBtnStyle('end')}
          >→</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onIndexChange((activeIndex + 1) % images.length); }}
            aria-label="הבא"
            style={navBtnStyle('start')}
          >←</button>
        </>
      )}
    </div>,
    document.body
  );
}

function navBtnStyle(side) {
  return {
    position: 'absolute', top: '50%',
    [side === 'end' ? 'insetInlineEnd' : 'insetInlineStart']: '1rem',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white', width: 48, height: 48,
    borderRadius: '50%', cursor: 'pointer',
    fontSize: '22px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}
