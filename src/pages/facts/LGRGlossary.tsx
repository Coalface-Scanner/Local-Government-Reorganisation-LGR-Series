import { useState } from 'react';
import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import CollectionPageStructuredData from '../../components/CollectionPageStructuredData';
import { 
  ArrowLeft, BookOpen, Search, Building2, Calendar, Users,
  Scale, FileText, Target, Route, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  relatedLink?: string;
  icon?: typeof Building2;
}

export default function LGRGlossary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: 'Local Government Reorganisation (LGR)',
      definition: 'The process of restructuring local government structures in England, typically merging district and county councils to create unitary authorities. LGR aims to simplify governance, improve service delivery, and enable strategic decision-making at the right scale.',
      relatedTerms: ['Unitary authority', 'Shadow authority', 'Vesting day'],
      relatedLink: '/facts/what-is-lgr',
      icon: Building2
    },
    {
      term: 'Unitary Authority',
      definition: 'A single-tier local authority that is responsible for all local government functions within its area. Unitary authorities combine the responsibilities of both county and district councils, providing a single point of accountability for local services.',
      relatedTerms: ['LGR', 'Two-tier system'],
      icon: Building2
    },
    {
      term: 'Shadow Authority',
      definition: 'A newly elected council that operates in parallel with existing authorities before vesting day. Shadow authorities plan the transition, make key strategic decisions, and prepare for taking full control of services. They work alongside existing councils during the transition period.',
      relatedTerms: ['Vesting day', 'Shadow elections', 'Transition'],
      icon: Users
    },
    {
      term: 'Vesting Day',
      definition: 'The date when a new unitary authority takes full legal and operational control of all local government services. On vesting day, the old authorities are dissolved and the new unitary council becomes the sole local authority for its area.',
      relatedTerms: ['Shadow authority', 'Transition', 'Go-live'],
      icon: Calendar
    },
    {
      term: 'LGR Timetable 2026',
      definition: 'The schedule of Local Government Reorganisation activities planned for 2026, including shadow elections, transition planning, and preparation for vesting days in 2027-2028. This represents a significant wave of reorganisations across England.',
      relatedTerms: ['Shadow elections', 'Vesting day', 'LGR'],
      relatedLink: '/facts/lgr-timeline',
      icon: Calendar
    },
    {
      term: 'Shadow Elections',
      definition: 'Elections held to elect councillors to the new shadow authority before vesting day. These elections typically take place months or years before the new unitary authority takes full control, allowing time for transition planning.',
      relatedTerms: ['Shadow authority', 'Vesting day', 'LGR timetable 2026'],
      icon: Users
    },
    {
      term: 'LGR Governance',
      definition: 'The systems, processes, and structures for managing Local Government Reorganisation effectively. This includes managing the transition period, ensuring continuity of services, addressing councillor transitions, and maintaining democratic legitimacy throughout the process.',
      relatedTerms: ['Shadow authority', 'Transition', 'Governance'],
      relatedLink: '/interviews',
      icon: Scale
    },
    {
      term: 'Two-Tier System',
      definition: 'The local government structure where responsibilities are split between county councils (strategic services like education and social care) and district councils (local services like housing and planning). LGR typically converts this to a unitary system.',
      relatedTerms: ['Unitary authority', 'County council', 'District council'],
      icon: Building2
    },
    {
      term: 'County Council',
      definition: 'The upper tier of local government in a two-tier system, responsible for strategic services such as education, social care, highways, waste disposal, and public health.',
      relatedTerms: ['District council', 'Two-tier system', 'Unitary authority'],
      icon: Building2
    },
    {
      term: 'District Council',
      definition: 'The lower tier of local government in a two-tier system, responsible for local services such as housing, planning, waste collection, licensing, and environmental health.',
      relatedTerms: ['County council', 'Two-tier system', 'Unitary authority'],
      icon: Building2
    },
    {
      term: 'Transition Period',
      definition: 'The time between the election of a shadow authority and vesting day, during which both old and new authorities operate in parallel. This period involves extensive planning, service transfer preparation, and strategic decision-making.',
      relatedTerms: ['Shadow authority', 'Vesting day', 'Transition'],
      icon: Route
    },
    {
      term: 'Go-Live',
      definition: 'Another term for vesting day, when the new unitary authority becomes fully operational and takes control of all services.',
      relatedTerms: ['Vesting day', 'Transition'],
      icon: CheckCircle2
    },
    {
      term: 'Lame Duck Councillors',
      definition: 'Councillors in existing authorities who will not be standing for election to the new unitary authority, or whose wards are being abolished. They may have reduced influence during the transition period.',
      relatedTerms: ['Shadow authority', 'Transition', 'Councillors'],
      icon: AlertCircle
    },
    {
      term: 'Devolution',
      definition: 'The transfer of powers and responsibilities from central government to local or regional authorities. Unlike LGR, which restructures local government, devolution transfers new powers to local authorities.',
      relatedTerms: ['LGR', 'Local government'],
      icon: Scale
    },
    {
      term: 'Reorganisation Proposal',
      definition: 'A formal proposal to restructure local government in a specific area, typically submitted to central government for approval. Proposals may come from local authorities, combined authorities, or central government itself.',
      relatedTerms: ['LGR', 'Consultation', 'Decision'],
      icon: FileText
    },
    {
      term: 'First 100 Days',
      definition: 'The critical period immediately after vesting day when a new unitary authority establishes its governance structures, priorities, and operational systems. This period is crucial for setting the foundation for effective service delivery.',
      relatedTerms: ['Vesting day', 'Transition', 'LGR governance'],
      relatedLink: '/100days',
      icon: Target
    }
  ];

  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Glossary - Local Government Reorganisation Terms"
        description="Comprehensive glossary of Local Government Reorganisation (LGR) terms and definitions. Learn about shadow authorities, vesting day, unitary councils, LGR timetable, and more key LGR concepts."
        keywords="LGR glossary, Local Government Reorganisation terms, shadow authority definition, vesting day, unitary authority, LGR timetable, LGR governance terms"
      />
      <CollectionPageStructuredData
        name="LGR Glossary"
        description="Comprehensive glossary of Local Government Reorganisation (LGR) terms and definitions."
        url="/facts/lgr-glossary"
        numberOfItems={glossaryTerms.length}
        items={glossaryTerms.map(term => ({
          name: term.term,
          description: term.definition
        }))}
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">LGR SERIES</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Local Government Reorganisation{' '}
              <span className="text-teal-700 font-serif italic">
                Glossary
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Key terms and definitions for understanding Local Government Reorganisation (LGR), LGR governance, and the reorganisation process.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search glossary terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-academic-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-academic-charcoal"
            />
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-6">
          {filteredTerms.map((term, index) => {
            const IconComponent = term.icon || BookOpen;
            return (
              <div key={index} className="academic-card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <IconComponent className="text-teal-700" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-3">
                      {term.term}
                    </h2>
                    <p className="text-lg text-academic-neutral-700 leading-relaxed font-serif mb-4">
                      {term.definition}
                    </p>
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-academic-neutral-200">
                        <p className="text-sm font-medium text-academic-neutral-600 mb-2">
                          Related terms:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-teal-50 text-teal-700 rounded-md text-sm font-medium"
                            >
                              {relatedTerm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {term.relatedLink && (
                      <div className="mt-4">
                        <button
                          onClick={() => navigate(term.relatedLink!)}
                          className="text-teal-700 hover:text-teal-800 font-medium text-sm flex items-center gap-2 group"
                        >
                          Learn more
                          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTerms.length === 0 && (
          <div className="academic-card p-12 text-center">
            <p className="text-lg text-academic-neutral-600 font-serif">
              No terms found matching "{searchQuery}". Try a different search term.
            </p>
          </div>
        )}

        <div className="mt-12 academic-card p-8 bg-teal-50">
          <div className="flex items-start gap-4">
            <BookOpen className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">
                Need More Help?
              </h3>
              <p className="text-academic-neutral-700 font-serif mb-4">
                Explore our comprehensive guide to understanding Local Government Reorganisation.
              </p>
              <button
                onClick={() => navigate('/facts/what-is-lgr')}
                className="academic-button academic-button-primary"
              >
                What is LGR?
              </button>
            </div>
          </div>
        </div>

        <LastUpdated />
      </div>
    </div>
  );
}
