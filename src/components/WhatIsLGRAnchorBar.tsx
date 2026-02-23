/**
 * Sticky anchor bar for What Is LGR page. Active state from scroll position.
 */
import { useEffect, useState } from 'react';

const links = [
  { label: 'Overview', href: '#overview' },
  { label: 'Why It Matters', href: '#why-it-matters' },
  { label: 'Process', href: '#process' },
  { label: 'Timeline', href: '#what-it-means' },
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'Tools', href: '#tools' },
];

function scrollToId(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function WhatIsLGRAnchorBar() {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="sticky top-0 z-20 bg-white border-b shadow-sm"
      style={{ borderBottomColor: 'var(--lgr-nav-border)' }}
      aria-label="Page sections"
    >
      <div className="layout-container layout-content-sub">
        <div className="flex flex-wrap items-center justify-center gap-1 py-3 md:gap-4 md:py-4">
          {links.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={href}
                onClick={(e) => scrollToId(e, id)}
                className={`px-3 py-1.5 text-sm font-display font-semibold rounded-lg transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-[var(--lgr-accent)] text-[var(--lgr-accent)]'
                    : 'border-transparent text-academic-neutral-600 hover:text-[var(--lgr-accent)] hover:bg-[var(--lgr-button-hover)]'
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
