import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';
import ArticleStructuredData from '../../components/ArticleStructuredData';
import InBriefSection from '../../components/InBriefSection';
import { 
  ArrowLeft, BookOpen, Calendar, MapPin, Building2, Users,
  ChevronRight, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhatIsLGR() {
  const navigate = useNavigate();

  const relatedResources = [
    {
      title: 'LGR Glossary',
      description: 'Key terms and definitions for Local Government Reorganisation',
      route: '/facts/lgr-glossary',
      icon: BookOpen
    },
    {
      title: 'LGR Timeline 2026',
      description: 'Comprehensive timeline of LGR processes and key dates',
      route: '/facts/lgr-timeline',
      icon: Calendar
    },
    {
      title: 'Council Cases',
      description: 'Case studies of councils involved in LGR',
      route: '/facts/council-cases',
      icon: MapPin
    },
    {
      title: 'Surrey Reorganisation Analysis',
      description: 'Detailed analysis of Surrey\'s LGR transition',
      route: '/surrey',
      icon: Building2
    },
    {
      title: 'LGR Governance Interviews',
      description: 'Expert perspectives on local government reorganisation',
      route: '/interviews',
      icon: Users
    },
    {
      title: 'First 100 Days Playbook',
      description: 'Strategic framework for unitary transition',
      route: '/100days',
      icon: Target
    }
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="What is Local Government Reorganisation? (LGR)"
        description="Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically creating unitary authorities. Learn about LGR governance, LGR timetable 2026, and how reorganisation works."
        keywords="What is LGR, Local Government Reorganisation, LGR definition, LGR governance, LGR timetable 2026, unitary authorities, council reorganisation, local government reform"
      />
      <ArticleStructuredData
        title="What is Local Government Reorganisation? (LGR)"
        description="Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically creating unitary authorities. Learn about LGR governance, LGR timetable 2026, and how reorganisation works."
        author="LGR Series Editorial Team"
        publishedDate={currentDate}
        updatedDate={currentDate}
        slug="what-is-lgr"
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
            <div className="academic-section-label">LGR SERIES HUB</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              What is Local Government{' '}
              <span className="text-teal-700 font-serif italic">
                Reorganisation? (LGR)
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* In Brief Section - Optimized for Featured Snippets */}
        <InBriefSection content="Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically merging district and county councils to create unitary authorities. LGR aims to simplify governance, improve service delivery, and enable strategic decision-making at the right scale. The process involves shadow authorities, elections, and a transition period before the new unitary councils take full control on vesting day." />

        {/* Detailed Explanation */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <div className="academic-prose max-w-none">
            <h2 className="text-3xl font-display font-bold text-academic-charcoal mb-6">
              Understanding Local Government Reorganisation
            </h2>
            
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              Local Government Reorganisation (LGR) represents a fundamental restructuring of how local government operates in England. Unlike devolution, which transfers powers from central to local government, LGR focuses on simplifying and rationalising the structure of local authorities themselves.
            </p>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              The Two-Tier System
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              Much of England operates under a two-tier system where responsibilities are split between:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-academic-neutral-700 font-serif">
              <li><strong>County councils</strong> - responsible for strategic services like education, social care, highways, and waste disposal</li>
              <li><strong>District councils</strong> - responsible for local services like housing, planning, waste collection, and licensing</li>
            </ul>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              Moving to Unitary Authorities
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              LGR typically involves merging these two tiers into a single <strong>unitary authority</strong> that takes on all local government responsibilities. This simplification aims to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-academic-neutral-700 font-serif">
              <li>Reduce administrative complexity and costs</li>
              <li>Improve coordination between services</li>
              <li>Enable strategic decision-making at the right geographic scale</li>
              <li>Create clearer accountability for residents</li>
            </ul>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              The LGR Process
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              The LGR process follows several key stages:
            </p>
            <ol className="list-decimal pl-6 mb-6 space-y-3 text-academic-neutral-700 font-serif">
              <li><strong>Proposal</strong> - Government or local authorities propose reorganisation</li>
              <li><strong>Consultation</strong> - Public and stakeholder consultation on proposals</li>
              <li><strong>Decision</strong> - Government makes final decision on reorganisation</li>
              <li><strong>Shadow Authority</strong> - New unitary council is elected and begins planning</li>
              <li><strong>Vesting Day</strong> - New unitary authority takes full control of services</li>
              <li><strong>Transition</strong> - Ongoing integration and service consolidation</li>
            </ol>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              LGR Timetable 2026
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              The <strong>LGR timetable 2026</strong> represents a significant wave of reorganisations across England. Key milestones include shadow elections in 2026, with many new unitary authorities taking full control in 2027 or 2028. Areas like Surrey are being fast-tracked through this process, creating both opportunities and challenges for effective governance.
            </p>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              LGR Governance
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              Effective <strong>LGR governance</strong> requires careful management of the transition period. This includes managing relationships between old and new authorities, ensuring continuity of services, addressing councillor transitions, and maintaining democratic legitimacy throughout the process. The first 100 days after vesting are particularly critical for establishing effective governance structures.
            </p>

            <h3 className="text-2xl font-display font-bold text-academic-charcoal mt-8 mb-4">
              Why LGR Matters
            </h3>
            <p className="text-lg text-academic-neutral-700 mb-6 leading-relaxed font-serif">
              Local Government Reorganisation is not just a technical exercise—it fundamentally reshapes how decisions are made, how services are delivered, and how communities are represented. Understanding LGR is essential for anyone involved in local government, planning, development, or public policy in England.
            </p>
          </div>
        </div>

        {/* Related Resources */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-display font-bold text-academic-charcoal mb-6">
            Explore More from the LGR Series
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedResources.map((resource, index) => (
              <button
                key={index}
                onClick={() => navigate(resource.route)}
                className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <resource.icon className="text-teal-700 group-hover:text-teal-800" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-academic-neutral-600 font-serif">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 text-teal-700 mt-4 font-medium text-sm">
                      Learn more
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection page="what-is-lgr" />

        <LastUpdated />
      </div>
    </div>
  );
}
