import { Link } from 'react-router-dom';

/**
 * At-a-glance facts strip for the What is LGR page.
 * Single row (or 2x2 on small screens): duration, legal mechanism, decision maker, outcome.
 * Glossary links: first occurrence only (Structural Change Order, Secretary of State).
 */
export default function QuickFactsStrip() {
  const facts = [
    {
      label: 'Average duration',
      value: '18–30 months',
    },
    {
      label: 'Legal mechanism',
      value: (
        <Link to="/glossary/structural-change-order" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">
          Structural Change Order
        </Link>
      ),
    },
    {
      label: 'Key decision maker',
      value: (
        <Link to="/glossary/secretary-of-state" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">
          Secretary of State
        </Link>
      ),
    },
    {
      label: 'Outcome',
      value: 'Unitary authority replaces district and county councils',
    },
  ];

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 hyphens-none">
      {facts.map(({ label, value }) => (
        <div
          key={label}
          className="bg-white border rounded-lg px-4 py-3 shadow-sm"
          style={{ borderColor: 'var(--lgr-button-border)' }}
        >
          <dt className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--lgr-accent)' }}>
            {label}
          </dt>
          <dd className="text-academic-charcoal font-medium text-sm leading-snug">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
