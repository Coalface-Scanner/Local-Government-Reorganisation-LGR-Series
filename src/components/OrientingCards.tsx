import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const cards = [
  {
    id: 'what',
    title: 'What is changing?',
    summary:
      'District and county councils are merged into a single unitary authority. One council takes on all local services—from bins and planning to schools and social care.',
    bullets: [
      'County and district councils are replaced by one unitary council.',
      'All local government services sit under one roof.',
      'Shadow authorities are elected first; then the new council goes live on vesting day.',
    ],
  },
  {
    id: 'why',
    title: 'Why is it happening?',
    summary:
      'Government and local leaders argue that a single tier simplifies decision-making, reduces duplication, and can improve services and accountability.',
    bullets: [
      'Simplify governance and reduce administrative overlap.',
      'Improve coordination between services.',
      'Create clearer accountability for residents.',
    ],
  },
  {
    id: 'when',
    title: 'When will it happen?',
    summary:
      'Timelines vary by area. Many proposals are aiming for shadow elections in 2026 and the new council going live in 2027 or 2028. Some areas, like Surrey, are on a faster track.',
    bullets: [
      'Shadow elections in May 2026 in many areas.',
      'Vesting day (new council goes live) typically 2027–2028.',
      'Full process from proposal to vesting usually 18–30 months.',
    ],
  },
];

export default function OrientingCards() {
  const [openId, setOpenId] = useState<string | null>(cards[0].id);

  return (
    <div className="grid gap-4 md:grid-cols-3 hyphens-none">
      {cards.map((card) => {
        const isOpen = openId === card.id;
        return (
          <div
            key={card.id}
            className="bg-white border border-academic-neutral-200 rounded-xl shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : card.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-academic-neutral-50/50 transition-colors"
              aria-expanded={isOpen}
            >
              <h3 className="text-lg font-display font-bold text-academic-charcoal">
                {card.title}
              </h3>
              {isOpen ? (
                <ChevronUp className="flex-shrink-0 text-teal-600" size={20} aria-hidden />
              ) : (
                <ChevronDown className="flex-shrink-0 text-teal-600" size={20} aria-hidden />
              )}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0 border-t border-academic-neutral-100">
                <p className="text-academic-neutral-700 text-base leading-relaxed mb-3 font-serif">
                  {card.summary}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-base text-academic-neutral-700 font-serif">
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
