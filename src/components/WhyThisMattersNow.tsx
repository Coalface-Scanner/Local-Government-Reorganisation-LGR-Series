import { Link } from 'react-router-dom';

/**
 * "Why this matters now" – urgency and purpose immediately after hero/nav.
 * Glossary links: first occurrence only (unitary authorities, first 100 days, Reorganisation).
 */
export default function WhyThisMattersNow() {
  return (
    <section id="why-it-matters" className="bg-white py-10 md:py-14 scroll-mt-24 hyphens-none">
      <div className="layout-container layout-content-sub max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-academic-charcoal mb-6">
          Why this matters now
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6 font-display font-semibold text-academic-charcoal">
          <li>Large scale structural reform across England.</li>
          <li>
            New <Link to="/glossary/unitary-authority" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">unitary authorities</Link> forming from 2026 onwards.
          </li>
          <li>
            Governance decisions in the <Link to="/glossary/first-100-days" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">first 100 days</Link> shape long term outcomes.
          </li>
        </ul>
        <p className="text-academic-neutral-700 font-serif text-base leading-relaxed">
          <Link to="/glossary/local-government-reorganisation-lgr" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Reorganisation</Link> is not administrative tidying. It redefines how local power operates.
        </p>
      </div>
    </section>
  );
}
