import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then((r) => setServices(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="badge">השירותים שלנו</span>
          <h1 style={{ marginTop: '1rem' }}>מה אנחנו עושים</h1>
          <p className="text-muted">
            מגוון רחב של שירותי נגרות וחיפוי – מהתכנון ועד ההתקנה באתר.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted">טוען…</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted">לא נמצאו שירותים.</p>
        ) : (
          <div className="grid grid-2">
            {services.map((s) => (
              <article key={s._id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: 'linear-gradient(135deg, #f5efe1, #fff)',
                    border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', flexShrink: 0,
                  }}>{s.icon || '🔧'}</div>
                  <h3 style={{ margin: 0 }}>{s.title}</h3>
                </div>
                <p style={{ fontWeight: 500 }}>{s.shortDescription}</p>
                <p className="text-muted">{s.description}</p>
              </article>
            ))}
          </div>
        )}

        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/contact" className="btn btn-accent">מעוניינים בשירות? צרו קשר</Link>
        </div>
      </div>
    </section>
  );
}
