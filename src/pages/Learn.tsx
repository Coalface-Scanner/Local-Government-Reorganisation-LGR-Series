import { BookOpen, HelpCircle, MessageCircleQuestion, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';

interface LearnProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const learnSections = [
  {
    id: 'what-is-lgr',
    title: 'What Is LGR?',
    description: 'Start with a clear introduction to Local Government Reorganisation and what it changes.',
    route: 'what-is-lgr',
    icon: BookOpen,
  },
  {
    id: 'beginners-guide',
    title: 'Beginners Guide',
    description: 'A practical guide to structures, roles, and decision points in the LGR process.',
    route: 'beginners-guide',
    icon: HelpCircle,
  },
  {
    id: 'questions-and-answers',
    title: 'Questions & Answers',
    description: 'Quick answers to common policy, governance, and delivery questions.',
    route: 'questions-and-answers',
    icon: MessageCircleQuestion,
  },
  {
    id: 'first-100-days',
    title: 'First 100 Days',
    description: 'Implementation priorities and sequencing for new unitary councils.',
    route: 'first-100-days',
    icon: Clock,
  },
];

export default function Learn({ onNavigate }: LearnProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Learn - Local Government Reorganisation"
        description="Foundational guides to Local Government Reorganisation, including what LGR is, beginner guidance, FAQs, and first-100-days planning."
        keywords="learn LGR, what is LGR, local government reorganisation guide, beginners guide, LGR FAQ"
      />

      <PageBanner
        heroVariant="learn"
        heroLabel="LEARN"
        heroTitle="Learn Local Government Reorganisation"
        heroSubtitle="Foundational guides and explanations to help you understand LGR quickly and clearly."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-hub py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {learnSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.route)}
                className="academic-card p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={20} className="text-teal-700" />
                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal">{section.title}</h2>
                </div>
                <p className="text-academic-neutral-700 font-serif">{section.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
