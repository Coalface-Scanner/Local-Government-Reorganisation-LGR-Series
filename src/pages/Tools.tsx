import { ArrowRight, Calendar, Vote, BookOpen, Quote, Headphones } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import ThemeChip from '../components/ThemeChip';

interface ToolsProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Tools({ onNavigate }: ToolsProps) {
  const location = useLocation();
  
  return (
    <div className="bg-academic-cream">
      <MetaTags
        title="Tools and Practical Resources - LGR Series"
        description="Practical tools and resources for Local Government Reorganisation including the LGR Timetable & Governance Roadmap, Election & Representation Models, First 100 Days Playbook, Lessons Library, and Podcast."
        keywords="LGR tools, local government reorganisation resources, LGR roadmap, election models, first 100 days playbook, LGR lessons, LGR podcast"
      />
      
      <PageBanner
        heroLabel="TOOLS & RESOURCES"
        heroTitle="Tools and Practical Resources"
        heroSubtitle="Practical tools, guides, and resources to support Local Government Reorganisation planning, implementation, and governance."
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Tools Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => onNavigate('lgr-journey-2026')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Calendar size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                LGR Timetable & Governance Roadmap
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Overview of key milestones from proposal to vesting day.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Governance and Reform" variant="secondary" href="/topics/governance-and-reform" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Open roadmap →
              </div>
            </button>

            <button
              onClick={() => onNavigate('surrey/election-tracker/simulator')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Vote size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                Election & Representation Models
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                How ward patterns and election timings change representation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Democratic Legitimacy" variant="secondary" href="/topics/democratic-legitimacy" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Explore models →
              </div>
            </button>

            <button
              onClick={() => onNavigate('100days')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                First 100 Days Playbook
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Guidance for leaders, cabinet members and senior officers in new authorities.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Statecraft and System Design" variant="secondary" href="/topics/statecraft-and-system-design" />
                <ThemeChip theme="Governance and Reform" variant="secondary" href="/topics/governance-and-reform" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Read playbook →
              </div>
            </button>

            <button
              onClick={() => onNavigate('lessons')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Quote size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                Lessons Library
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Curated reflections and case studies from recent reorganisations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="All themes" variant="secondary" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Browse lessons →
              </div>
            </button>
          </div>

          {/* Additional Tools Row */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 items-stretch">
            {/* LGR Podcast and Audio Card */}
            <button
              onClick={() => onNavigate('interviews')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Headphones size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                LGR Podcast and Audio
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif flex-grow">
                Conversations with leaders, practitioners and academics on how LGR works in practice.
              </p>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                View all episodes →
              </div>
            </button>
          </div>
        </section>

        {/* Navigation Links */}
        <section className="mb-16">
          <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-600">
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
              Explore More
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('')}
                className="academic-button academic-button-outline inline-flex items-center gap-2"
              >
                Back to LGR Hub
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('topics')}
                className="academic-button academic-button-outline inline-flex items-center gap-2"
              >
                View All Topics
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
