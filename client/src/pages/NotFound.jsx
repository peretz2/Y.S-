import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="wrap">
      <article className="prose" style={{ textAlign: 'start' }}>
        <div className="prose-eyebrow">
          <span className="line" /><span>§ 404 · Page not found</span>
        </div>
        <h1 style={{ fontSize: 'clamp(80px, 14vw, 180px)', lineHeight: 0.95 }}>
          404<em>.</em>
        </h1>
        <p>
          העמוד שחיפשתם לא נמצא — ייתכן שהקישור שגוי או שהעמוד הוסר.
        </p>
        <div className="prose-actions">
          <Link to="/" className="btn">חזרה לדף הבית</Link>
          <Link to="/contact" className="btn btn-ghost">יצירת קשר</Link>
        </div>
      </article>
    </section>
  );
}
