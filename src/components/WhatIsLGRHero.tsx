/**
 * What Is LGR hero: deep teal gradient, positioning statement, micro stat, action questions.
 * Spec: #0F4C4C → #0B3D3D, left framed panel #E8F3F3, accent #1F8A70.
 */
import { ChevronRight } from 'lucide-react';

const statementLines = [
  'One council instead of two.',
  'One decision maker instead of two tiers.',
  'A two year transition.',
];

const positioningLine =
  'A structural reset of local government across England affecting governance, accountability and service delivery.';

const microStat = 'Shadow elections begin May 2026.';

const questions = [
  { label: 'What changes?', href: '#what-lgr-does' },
  { label: 'Why now?', href: '#process' },
  { label: 'What happens next?', href: '#what-it-means' },
];

function scrollToId(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function WhatIsLGRHero() {
  return (
    <section
      className="relative hyphens-none"
      style={{
        background: `linear-gradient(180deg, var(--lgr-hero-start) 0%, var(--lgr-hero-end) 100%)`,
      }}
    >
      <div className="layout-container layout-content-sub py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Local Government Reorganisation Explained
        </h1>
        <p className="text-lg text-white/90 mb-10 max-w-2xl font-serif">
          What is changing, why it matters, and how it will reshape local decision making.
        </p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Left: framed panel */}
          <div
            className="rounded-2xl p-6 md:p-8 max-w-lg"
            style={{ backgroundColor: 'var(--lgr-panel-tint)' }}
          >
            <p className="text-xl md:text-2xl font-display font-bold text-[var(--lgr-hero-end)] leading-tight mb-4">
              {statementLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < statementLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p className="text-sm font-serif text-[var(--lgr-hero-end)]/90 leading-relaxed mb-5">
              {positioningLine}
            </p>
            <p
              className="text-base font-display font-semibold"
              style={{ color: 'var(--lgr-accent)' }}
            >
              {microStat}
            </p>
          </div>

          {/* Right: action questions */}
          <div className="flex flex-col gap-3">
            {questions.map(({ label, href }) => {
              const id = href.slice(1);
              return (
                <a
                  key={id}
                  href={href}
                  onClick={(e) => scrollToId(e, id)}
                  className="flex items-center justify-between gap-4 w-full md:max-w-sm px-5 py-4 rounded-xl bg-white transition-colors text-left group border"
                  style={{
                    borderColor: 'var(--lgr-button-border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--lgr-button-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <span className="font-display font-bold text-[var(--lgr-hero-end)] group-hover:text-[var(--lgr-accent)]">
                    {label}
                  </span>
                  <ChevronRight
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: 'var(--lgr-accent)' }}
                    aria-hidden
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
