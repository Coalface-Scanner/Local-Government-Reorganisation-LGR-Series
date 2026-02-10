import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import CollectionPageStructuredData from '../../components/CollectionPageStructuredData';
import { 
  ArrowLeft, MapPin, Building2, Calendar, FileText,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CouncilCase {
  name: string;
  region: string;
  type: string;
  description: string;
  keyDates: string;
  status: string;
  link?: string;
  details: string;
}

export default function CouncilCases() {
  const navigate = useNavigate();
  const location = useLocation();

  const councilCases: CouncilCase[] = [
    {
      name: 'Surrey',
      region: 'South East England',
      type: 'Two unitaries (East & West Surrey)',
      description: 'Surrey is being fast-tracked through LGR to form East Surrey and West Surrey unitary authorities. Shadow elections expected May 2026, go-live May 2027.',
      keyDates: 'Shadow elections: May 2026 | Go-live: May 2027',
      status: 'In progress',
      link: '/surrey',
      details: 'Surrey represents a significant LGR case study with its fast-tracked timetable and creation of two unitary authorities. The reorganisation involves merging Surrey County Council with 11 district and borough councils.'
    },
    {
      name: 'Dorset',
      region: 'South West England',
      type: 'Unitary authority',
      description: 'Dorset reorganisation created two unitary authorities: Bournemouth, Christchurch and Poole (BCP) Council, and Dorset Council. Completed in 2019.',
      keyDates: 'Go-live: April 2019',
      status: 'Completed',
      details: 'Dorset was one of the first major reorganisations in recent years, creating two unitary authorities from the previous county and district structure. This case study provides valuable lessons on transition management and service integration.'
    },
    {
      name: 'Buckinghamshire',
      region: 'South East England',
      type: 'Unitary authority',
      description: 'Buckinghamshire reorganisation merged the county council with four district councils to create a single unitary authority. Completed in 2020.',
      keyDates: 'Go-live: April 2020',
      status: 'Completed',
      details: 'Buckinghamshire\'s reorganisation created one of the largest unitary authorities in England. The transition involved significant service integration and provides insights into managing large-scale reorganisations.'
    },
    {
      name: 'Somerset',
      region: 'South West England',
      type: 'Unitary authority',
      description: 'Somerset reorganisation merged the county council with four district councils to create Somerset Council. Completed in 2023.',
      keyDates: 'Go-live: April 2023',
      status: 'Completed',
      details: 'Somerset\'s recent reorganisation offers contemporary insights into LGR processes, shadow authority management, and the challenges of service integration in a rural context.'
    },
    {
      name: 'North Yorkshire',
      region: 'Yorkshire and the Humber',
      type: 'Unitary authority',
      description: 'North Yorkshire reorganisation merged the county council with seven district councils to create North Yorkshire Council. Completed in 2023.',
      keyDates: 'Go-live: April 2023',
      status: 'Completed',
      details: 'North Yorkshire created one of the largest unitary authorities in England, covering a vast rural area. The reorganisation provides lessons on managing geographic scale and rural service delivery.'
    },
    {
      name: 'Cumbria',
      region: 'North West England',
      type: 'Two unitaries',
      description: 'Cumbria reorganisation split into two unitary authorities: Cumberland Council and Westmorland and Furness Council. Completed in 2023.',
      keyDates: 'Go-live: April 2023',
      status: 'Completed',
      details: 'Cumbria\'s reorganisation created two unitary authorities from the previous county structure, offering insights into managing split reorganisations and maintaining service continuity across large geographic areas.'
    }
  ];

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Council Cases - Local Government Reorganisation Case Studies"
        description="Case studies of councils involved in Local Government Reorganisation (LGR) including Dorset, Buckinghamshire, Somerset, North Yorkshire, Cumbria, and Surrey. Learn from recent LGR transitions and reorganisations."
        keywords="LGR case studies, Local Government Reorganisation councils, Dorset reorganisation, Buckinghamshire reorganisation, Somerset reorganisation, North Yorkshire reorganisation, Cumbria reorganisation, Surrey reorganisation, unitary authority case studies"
      />
      <CollectionPageStructuredData
        name="LGR Council Cases"
        description="Case studies of councils involved in Local Government Reorganisation (LGR)."
        url="/facts/council-cases"
        numberOfItems={councilCases.length}
        items={councilCases.map(case_ => ({
          name: case_.name,
          description: case_.description,
          url: case_.link || `/facts/council-cases#${case_.name.toLowerCase().replace(/\s+/g, '-')}`
        }))}
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Council Cases"
        heroSubtitle="Case studies of councils involved in LGR, including recent reorganisations and those in progress. Learn from Dorset, Buckinghamshire, Somerset, North Yorkshire, Cumbria, and Surrey."
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* In Brief Section */}
        <div className="academic-card p-8 mb-12 bg-teal-50 border-l-4 border-teal-700">
          <div className="flex items-start gap-4">
            <MapPin className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-4">
                LGR Council Cases Overview
              </h2>
              <p className="text-lg text-academic-neutral-800 leading-relaxed font-serif">
                Recent Local Government Reorganisation has seen significant changes across England. Completed reorganisations in Dorset (2019), Buckinghamshire (2020), Somerset (2023), North Yorkshire (2023), and Cumbria (2023) provide valuable case studies. Surrey is currently progressing through the LGR timetable 2026, with shadow elections scheduled for May 2026. These cases illustrate different approaches to reorganisation, from single unitary authorities to split structures.
              </p>
            </div>
          </div>
        </div>

        {/* Council Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {councilCases.map((case_, index) => (
            <div key={index} className="academic-card p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="text-teal-700" size={24} />
                    <h2 className="text-2xl font-display font-bold text-academic-charcoal">
                      {case_.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-md text-sm font-medium">
                      {case_.region}
                    </span>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                      case_.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {case_.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-academic-neutral-700 mb-4 font-serif leading-relaxed">
                {case_.description}
              </p>

              <div className="mb-4 p-4 bg-academic-neutral-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Calendar className="text-academic-neutral-600 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-academic-neutral-700 mb-1">
                      Key Dates
                    </p>
                    <p className="text-sm text-academic-neutral-600 font-serif">
                      {case_.keyDates}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-academic-neutral-700 mb-4 font-serif">
                {case_.details}
              </p>

              {case_.link && (
                <button
                  onClick={() => navigate(case_.link!)}
                  className="academic-button academic-button-primary w-full sm:w-auto"
                >
                  View Analysis
                  <ChevronRight size={16} className="ml-2" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Related Resources */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-display font-bold text-academic-charcoal mb-6">
            Related Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/facts/what-is-lgr')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <FileText className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    What is LGR?
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Learn about Local Government Reorganisation and how it works.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/facts/lgr-timeline')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <Calendar className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    LGR Timeline 2026
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Comprehensive timeline of LGR processes and key dates.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/facts/sources')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <FileText className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    Sources & Evidence
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Evidence from recent reorganisations including these case studies.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/interviews')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <FileText className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    LGR Governance Interviews
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Expert perspectives from those who have experienced LGR firsthand.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
