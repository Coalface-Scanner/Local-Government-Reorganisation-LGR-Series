import { ArrowRight, Calendar, BookOpen, Headphones, Route } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';

interface LGRHubProps {
  onNavigate: (page: string, slug?: string) => void;
}

const hubSections = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Welcome to the LGR Hub - your central resource for Local Government Reorganisation. Explore roadmap, tools, and podcast content.',
    route: '/lgr-hub',
    icon: Route,
    color: 'from-teal-600 to-cyan-700'
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Interactive journey map visualizing the LGR journey for 2026, navigating key milestones, decisions, and transitions.',
    route: '/lgr-journey-2026',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Practical tools and resources including the LGR Timetable, Election Models, First 100 Days Playbook, and Lessons Library.',
    route: '/tools',
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'podcast',
    title: 'Podcast',
    description: 'Conversations with leaders, practitioners and academics on how Local Government Reorganisation works in practice.',
    route: '/interviews',
    icon: Headphones,
    color: 'from-violet-500 to-purple-600'
  }
];

export default function LGRHub({ onNavigate }: LGRHubProps) {
  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Hub - Local Government Reorganisation Resources"
        description="Your central hub for Local Government Reorganisation (LGR) resources. Access roadmap, tools, podcast, and practical guidance for council reorganisation."
        keywords="LGR hub, local government reorganisation hub, LGR roadmap, LGR tools, LGR podcast, council reorganisation resources"
      />
      <CollectionPageStructuredData
        name="LGR Hub"
        description="Central hub for Local Government Reorganisation resources including roadmap, tools, and podcast content."
        url="/lgr-hub"
        numberOfItems={hubSections.length}
        items={hubSections.map(section => ({
          name: section.title,
          url: section.route,
          description: section.description
        }))}
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        {/* Colored gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">LGR HUB</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Local Government Reorganisation{' '}
              <span className="text-teal-700 font-serif italic">
                Hub
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Your central resource for Local Government Reorganisation. Explore roadmap, tools, podcast, and practical guidance for council reorganisation.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {hubSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => {
                  if (section.route === '/lgr-hub') {
                    // Already on hub page
                    return;
                  }
                  onNavigate(section.route.replace('/', ''));
                }}
                className={`group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300 ${
                  section.id === 'overview' ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className={`bg-gradient-to-br ${section.color} p-6 text-white min-h-[180px] flex flex-col justify-between mb-4 rounded-lg`}>
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-4 transition-transform rounded-lg group-hover:scale-110">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h2 className="text-academic-lg md:text-academic-xl font-display font-bold text-white leading-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif leading-relaxed">
                  {section.description}
                </p>
                {section.id !== 'overview' && (
                  <div className="flex items-center gap-2 text-teal-700 font-display font-semibold group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-teal-800 text-white p-8">
            <h3 className="text-academic-xl font-display font-bold text-white mb-4">
              The Dispatch
            </h3>
            <p className="text-academic-sm text-white mb-5 font-serif">
              Get the LGR Series directly in your inbox. No fluff, just deep analysis.
            </p>
            <SubscriptionForm variant="compact" />
          </div>
        </div>
      </div>

      <LastUpdated />
    </div>
  );
}
