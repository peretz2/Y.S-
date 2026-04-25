export default function ContentPreview({ value, previewType }) {
  const display = value && value.trim() ? value : null;
  const muted = <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>(ריק)</span>;

  let inner;
  switch (previewType) {
    case 'display-title':
      inner = (
        <span style={{ fontFamily: 'inherit', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1, color: 'var(--color-text-primary)' }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'heading':
      inner = (
        <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'paragraph':
      inner = (
        <span style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', maxWidth: '60ch', display: 'block' }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'button-primary':
      inner = (
        <span style={{ padding: '0.75rem 1.5rem', background: 'var(--color-text-primary)', color: 'var(--color-bg-primary)', borderRadius: 'var(--border-radius-pill)', display: 'inline-block', fontWeight: 500 }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'button-ghost':
      inner = (
        <span style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--border-radius-pill)', display: 'inline-block', fontWeight: 500 }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'nav-link':
      inner = (
        <span style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', padding: '0.5rem 0.75rem', display: 'inline-block' }}>
          {display ?? muted}
        </span>
      );
      break;
    case 'eyebrow':
      inner = (
        <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 12, height: 1, background: 'var(--color-text-secondary)', display: 'inline-block', flexShrink: 0 }} />
          {display ?? muted}
        </span>
      );
      break;
    case 'mono':
      inner = (
        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {display ?? muted}
        </span>
      );
      break;
    default:
      inner = (
        <span style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>
          {display ?? muted}
        </span>
      );
  }

  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px dashed var(--color-border-secondary)',
      borderRadius: 'var(--border-radius-md)',
      padding: '1.5rem',
      minHeight: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {inner}
    </div>
  );
}
