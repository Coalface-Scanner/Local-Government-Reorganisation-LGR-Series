import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import ServiceCard from '../../components/ServiceCard';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const serviceCards = [
  {
    id: 'beginners-guide',
    title: 'A beginners guide',
    description: 'An introduction to UK government structure, local councils, and how councillors are elected. Learn the basics of governance and electoral systems.',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-600',
    route: '/facts/councilopedia/beginners-guide'
  }
];

export default function Councilopedia() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="factsCouncilopedia" />
      <MetaTags
        title="Councylopedia - Facts & Data"
        description="Comprehensive guide to local government reorganisation terminology, concepts, and resources."
        keywords="councilopedia, LGR glossary, local government terms, reorganisation guide"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Councilopedia"
        heroSubtitle="Your comprehensive guide to local government reorganisation terminology, concepts, and resources."
        currentPath={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch">
          {serviceCards.map((card) => (
            <ServiceCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              color={card.color}
              route={card.route}
              disabled={card.disabled}
            />
          ))}
        </div>
      </div>

      <FAQSection page="facts" />
    </div>
  );
}
