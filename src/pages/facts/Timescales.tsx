import Timeline from '../../components/Timeline';
import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Timescales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Timescales - Facts & Data"
        description="Implementation timeline for local government reorganisation proposals across England, including final proposals, decisions, shadow councils, and go-live dates."
        keywords="LGR timeline, reorganisation schedule, unitary authority timeline, local government reorganisation dates"
      />
      
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              IMPLEMENTATION TIMELINE
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Reorganisation{' '}
            <span className="text-teal-700 font-serif italic">
              Timescales
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Three distinct pathways with different implementation schedules for local government reorganisation across England.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Timeline />
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}

