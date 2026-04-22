import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('הכל');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then((r) => setProjects(r.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['הכל', ...Array.from(set)];
  }, [projects]);

  const filtered = category === 'הכל'
    ? projects
    : projects.filter((p) => p.category === category);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="badge">תיק עבודות</span>
          <h1 style={{ marginTop: '1rem' }}>הפרויקטים שלנו</h1>
          <p className="text-muted">
            מבחר מהפרויקטים שביצענו בשנים האחרונות.
          </p>
        </div>

        {!loading && categories.length > 2 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
            justifyContent: 'center', marginBottom: '2rem',
          }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={c === category ? 'btn' : 'btn btn-outline'}
                style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted">טוען…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted">אין פרויקטים להצגה.</p>
        ) : (
          <div className="grid grid-3">
            {filtered.map((p) => (
              <article key={p._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  height: 200,
                  background: p.imageUrl
                    ? `url(${p.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, #e4dcc6, #d8c9a3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {!p.imageUrl && (
                    <span style={{
                      color: '#82724b', fontWeight: 700,
                      background: 'rgba(255,255,255,0.6)',
                      padding: '0.3rem 0.9rem', borderRadius: 999,
                    }}>{p.category}</span>
                  )}
                </div>
                <div style={{ padding: '1.3rem' }}>
                  <span className="badge badge-accent">{p.category}</span>
                  <h3 style={{ marginTop: '0.6rem' }}>{p.title}</h3>
                  <p className="text-muted">{p.summary}</p>
                  {(p.location || p.year) && (
                    <small className="text-muted">
                      {[p.location, p.year].filter(Boolean).join(' · ')}
                    </small>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
