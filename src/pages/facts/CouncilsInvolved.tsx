import CouncilsList from '../../components/CouncilsList';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CouncilsInvolved() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="factsCouncilsInvolved" />
      <MetaTags
        title="Councils Involved - Facts & Data"
        description="Overview of councils affected by local government reorganisation proposals across England, organised by region."
        keywords="LGR councils, reorganisation scope, unitary authorities, local government reorganisation areas"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Councils Involved"
        heroSubtitle="The current reorganisation proposals affect councils across England, encompassing multiple regions and governance structures."
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
        <CouncilsList />
      </div>

      <FAQSection page="facts" />
    </div>
  );
}

