import ReactMarkdown from 'react-markdown';

export default function MarkdownContent({ children, className = '' }) {
  if (!children) return null;
  return (
    <div className={`markdown-content ${className}`.trim()}>
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren, ...props }) => {
            const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {linkChildren}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
