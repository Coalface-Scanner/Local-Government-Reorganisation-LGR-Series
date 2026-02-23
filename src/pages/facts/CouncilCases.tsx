import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import CollectionPageStructuredData from '../../components/CollectionPageStructuredData';
import { 
  ArrowLeft, MapPin, Building2, Calendar, FileText,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import FAQSection from '../../components/FAQSection';

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
      description: 'Surrey has an accelerated timetable and confirmed restructuring into East Surrey and West Surrey unitary authorities. Shadow elections expected May 2026, go-live May 2027.',
      keyDates: 'Shadow elections: May 2026 | Go-live: May 2027',
      status: 'In progress',
      link: '/surrey',
      details: 'Surrey represents a significant LGR case study with its fast-tracked timetable and creation of two unitary authorities. The reorganisation involves merging Surrey County Council with 11 district and borough councils.'
    },
    {
      name: 'Cambridgeshire and Peterborough',
      region: 'East of England',
      type: 'County and unitary',
      description: 'Cambridgeshire County Council with Peterborough as a unitary authority. A combined authority (Cambridgeshire and Peterborough) covers the area.',
      keyDates: '—',
      status: 'County structure',
      details: 'County and unitary arrangement with a combined authority for strategic functions including transport and housing.'
    },
    {
      name: 'Derbyshire and Derby',
      region: 'East Midlands',
      type: 'County and unitary',
      description: 'Derbyshire County Council with Derby City as a unitary authority. Two-tier districts elsewhere in the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Mixed structure: Derby became unitary in 1997; rest of Derbyshire remains two-tier.'
    },
    {
      name: 'Devon, Plymouth and Torbay',
      region: 'South West England',
      type: 'County and unitaries',
      description: 'Devon County Council with Plymouth and Torbay as unitary authorities. Two-tier districts in the rest of Devon.',
      keyDates: '—',
      status: 'County structure',
      details: 'Plymouth and Torbay became unitaries in 1998; Devon retains two-tier structure elsewhere.'
    },
    {
      name: 'East Sussex and Brighton & Hove',
      region: 'South East England',
      type: 'County and unitary',
      description: 'East Sussex County Council with Brighton & Hove as a unitary authority. Two-tier districts in the rest of East Sussex.',
      keyDates: '—',
      status: 'County structure',
      details: 'Brighton & Hove became unitary in 1997; East Sussex remains two-tier in its remaining area.'
    },
    {
      name: 'Essex with Southend-on-Sea and Thurrock',
      region: 'East of England',
      type: 'County and unitaries',
      description: 'Essex County Council with Southend-on-Sea and Thurrock as unitary authorities. Two-tier districts in the rest of Essex.',
      keyDates: '—',
      status: 'County structure',
      details: 'Southend-on-Sea and Thurrock became unitaries in 1998; Essex remains two-tier elsewhere.'
    },
    {
      name: 'Gloucestershire',
      region: 'South West England',
      type: 'Two-tier',
      description: 'Gloucestershire County Council with six district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across the whole of Gloucestershire.'
    },
    {
      name: 'Hampshire, Isle of Wight, Portsmouth and Southampton',
      region: 'South East England',
      type: 'County and unitaries',
      description: 'Hampshire County Council with Portsmouth and Southampton as unitaries; Isle of Wight is a separate unitary authority.',
      keyDates: '—',
      status: 'County structure',
      details: 'Portsmouth and Southampton became unitaries in 1997; Isle of Wight is a single unitary; rest of Hampshire is two-tier.'
    },
    {
      name: 'Hertfordshire',
      region: 'East of England',
      type: 'Two-tier',
      description: 'Hertfordshire County Council with ten district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Hertfordshire.'
    },
    {
      name: 'Kent and Medway',
      region: 'South East England',
      type: 'County and unitary',
      description: 'Kent County Council with Medway as a unitary authority. Two-tier districts in the rest of Kent.',
      keyDates: '—',
      status: 'County structure',
      details: 'Medway became a unitary authority in 1998; rest of Kent remains two-tier.'
    },
    {
      name: 'Lancashire, Blackburn with Darwen and Blackpool',
      region: 'North West England',
      type: 'County and unitaries',
      description: 'Lancashire County Council with Blackburn with Darwen and Blackpool as unitary authorities. Two-tier districts elsewhere.',
      keyDates: '—',
      status: 'County structure',
      details: 'Blackburn with Darwen and Blackpool became unitaries in 1998; rest of Lancashire is two-tier.'
    },
    {
      name: 'Leicestershire, Leicester and Rutland',
      region: 'East Midlands',
      type: 'County and unitaries',
      description: 'Leicestershire County Council with Leicester City and Rutland as unitary authorities. Two-tier districts in the rest of Leicestershire.',
      keyDates: '—',
      status: 'County structure',
      details: 'Leicester became unitary in 1997; Rutland in 1997; rest of Leicestershire remains two-tier.'
    },
    {
      name: 'Lincolnshire, North Lincolnshire and North East Lincolnshire',
      region: 'East Midlands',
      type: 'County and unitaries',
      description: 'Lincolnshire County Council with North Lincolnshire and North East Lincolnshire as unitary authorities. Two-tier districts in the rest of Lincolnshire.',
      keyDates: '—',
      status: 'County structure',
      details: 'North Lincolnshire and North East Lincolnshire became unitaries in 1996; rest of Lincolnshire is two-tier.'
    },
    {
      name: 'Norfolk',
      region: 'East of England',
      type: 'Two-tier',
      description: 'Norfolk County Council with seven district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Norfolk.'
    },
    {
      name: 'Nottinghamshire and Nottingham',
      region: 'East Midlands',
      type: 'County and unitary',
      description: 'Nottinghamshire County Council with Nottingham City as a unitary authority. Two-tier districts in the rest of Nottinghamshire.',
      keyDates: '—',
      status: 'County structure',
      details: 'Nottingham became a unitary authority in 1998; rest of Nottinghamshire remains two-tier.'
    },
    {
      name: 'Oxfordshire',
      region: 'South East England',
      type: 'Two-tier',
      description: 'Oxfordshire County Council with five district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Oxfordshire.'
    },
    {
      name: 'Staffordshire and Stoke-on-Trent',
      region: 'West Midlands',
      type: 'County and unitary',
      description: 'Staffordshire County Council with Stoke-on-Trent as a unitary authority. Two-tier districts in the rest of Staffordshire.',
      keyDates: '—',
      status: 'County structure',
      details: 'Stoke-on-Trent became a unitary authority in 1997; rest of Staffordshire remains two-tier.'
    },
    {
      name: 'Suffolk',
      region: 'East of England',
      type: 'Two-tier',
      description: 'Suffolk County Council with five district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Suffolk.'
    },
    {
      name: 'Warwickshire',
      region: 'West Midlands',
      type: 'Two-tier',
      description: 'Warwickshire County Council with five district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Warwickshire.'
    },
    {
      name: 'West Sussex',
      region: 'South East England',
      type: 'Two-tier',
      description: 'West Sussex County Council with seven district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across West Sussex.'
    },
    {
      name: 'Worcestershire',
      region: 'West Midlands',
      type: 'Two-tier',
      description: 'Worcestershire County Council with six district councils. No unitary authorities within the county.',
      keyDates: '—',
      status: 'County structure',
      details: 'Fully two-tier county structure across Worcestershire.'
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
        description="Council cases and structures across England: LGR case studies (Dorset, Buckinghamshire, Somerset, North Yorkshire, Cumbria, Surrey) plus county and two-tier areas including Cambridgeshire, Derbyshire, Devon, Essex, Hampshire, Kent, Lancashire, Lincolnshire, and more."
        keywords="LGR case studies, Local Government Reorganisation councils, Dorset reorganisation, Buckinghamshire reorganisation, Somerset reorganisation, North Yorkshire reorganisation, Cumbria reorganisation, Surrey reorganisation, unitary authority case studies, county council structures"
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
        heroSubtitle="Council cases and structures across England: completed and in-progress LGR (Dorset, Buckinghamshire, Somerset, North Yorkshire, Cumbria, Surrey) plus county and two-tier areas."
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="layout-container layout-content-hub">
        {/* In Brief Section */}
        <div className="academic-card p-8 mb-12 bg-teal-50 border-l-4 border-teal-700">
          <div className="flex items-start gap-4">
            <MapPin className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-4">
                LGR Council Cases Overview
              </h2>
              <p className="text-lg text-academic-neutral-800 leading-relaxed font-serif">
                This page covers council structures across England: completed LGR in Dorset (2019), Buckinghamshire (2020), Somerset (2023), North Yorkshire (2023), and Cumbria (2023); Surrey in progress with an accelerated timetable to East and West Surrey unitaries (shadow elections May 2026, go-live May 2027); and county and two-tier areas such as Cambridgeshire and Peterborough, Derbyshire and Derby, Devon (Plymouth and Torbay), Essex (Southend-on-Sea and Thurrock), Hampshire (Portsmouth, Southampton, Isle of Wight), Kent and Medway, Lancashire (Blackburn with Darwen, Blackpool), Leicestershire (Leicester, Rutland), Lincolnshire (North and North East Lincolnshire), Norfolk, Nottinghamshire and Nottingham, Oxfordshire, Staffordshire and Stoke-on-Trent, Suffolk, Warwickshire, West Sussex, and Worcestershire.
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
                        : case_.status === 'County structure'
                        ? 'bg-academic-neutral-100 text-academic-neutral-700'
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

      <FAQSection page="facts" />
      </div>
    </div>
  );
}
