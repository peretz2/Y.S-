import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center" style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: '5rem', color: 'var(--color-accent)' }}>404</h1>
        <h2>העמוד לא נמצא</h2>
        <p className="text-muted">ייתכן שהקישור שגוי או שהעמוד הוסר.</p>
        <Link to="/" className="btn">חזרה לדף הבית</Link>
      </div>
    </section>
  );
}
