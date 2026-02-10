import Timeline from '../../components/Timeline';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Timescales() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Timescales - Facts & Data"
        description="Implementation timeline for local government reorganisation proposals across England, including final proposals, decisions, shadow councils, and go-live dates."
        keywords="LGR timeline, reorganisation schedule, unitary authority timeline, local government reorganisation dates"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Reorganisation Timescales"
        heroSubtitle="Three distinct pathways with different implementation schedules for local government reorganisation across England."
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
        <Timeline />
      </div>

      <FAQSection page="facts" />
    </div>
  );
}

