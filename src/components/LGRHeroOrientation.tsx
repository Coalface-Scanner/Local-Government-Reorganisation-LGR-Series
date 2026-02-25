/**
 * Hero orientation block: left = punchy statement, right = three tappable questions.
 * Creates contrast and direction; reduces visual weight vs equal accordion panels.
 */
import { ChevronRight } from 'lucide-react';

const statementLines = [
  'One council instead of two.',
  'One decision-maker instead of two tiers.',
  'A two-year transition.',
];

const questions = [
  { label: 'What changes?', href: '#what-lgr-does' },
  { label: 'Why now?', href: '#process' },
  { label: 'What happens next?', href: '#what-it-means' },
];

function scrollToId(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LGRHeroOrientation() {
  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center hyphens-none">
      <div className="space-y-4">
        <p className="text-xl md:text-2xl font-display font-bold text-academic-charcoal leading-tight max-w-md">
          {statementLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < statementLines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {questions.map(({ label, href }) => {
          const id = href.slice(1);
          return (
            <a
              key={id}
              href={href}
              onClick={(e) => scrollToId(e, id)}
              className="flex items-center justify-between gap-4 w-full md:max-w-sm px-5 py-4 rounded-xl border-2 border-academic-neutral-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 transition-colors text-left group"
            >
              <span className="font-display font-bold text-academic-charcoal group-hover:text-teal-800">
                {label}
              </span>
              <ChevronRight className="w-5 h-5 text-teal-600 flex-shrink-0" aria-hidden />
            </a>
          );
        })}
      </div>
    </div>
  );
}
