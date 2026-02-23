import { Link } from 'react-router-dom';
import { Search, FileText, Wrench } from 'lucide-react';

const tiles = [
  {
    title: 'Search everything',
    path: '/library',
    description: 'Search and browse the LGR library of reports and materials.',
    icon: Search,
  },
  {
    title: 'Facts hub',
    path: '/facts-and-data',
    description: 'Evidence, timelines, key facts, and data on LGR.',
    icon: FileText,
  },
  {
    title: 'First 100 Days toolkit',
    path: '/first-100-days',
    description: 'Practical toolkit for the first 100 days of a new authority.',
    icon: Wrench,
  },
];

export default function WhereNextTiles() {
  return (
    <section className="bg-academic-warm py-12 border-t border-academic-neutral-300">
      <div className="layout-container">
        <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
          Where next?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.path}
                to={tile.path}
                className="academic-card p-6 hover:shadow-xl hover:border-teal-200 transition-all duration-200 group flex flex-col border-2 border-transparent"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Icon size={28} className="text-teal-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal group-hover:text-teal-700">
                    {tile.title}
                  </h3>
                </div>
                <p className="text-academic-base text-academic-neutral-700 font-serif flex-grow">
                  {tile.description}
                </p>
                <span className="text-base font-display font-semibold text-teal-800 mt-3 inline-flex items-center gap-1 underline underline-offset-3 group-hover:text-teal-600">
                  Go to {tile.title} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
