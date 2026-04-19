import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

interface WhitePaperProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const paperSections = [
  {
    part: 'Part One',
    title: 'Context and Programme Design',
    body: 'The national LGR programme, the legislative framework, and why governance design matters as much as structural footprints.',
  },
  {
    part: 'Part Two',
    title: 'Primary Research — The Surrey Resident Survey',
    body: 'Full findings from 1,047 residents: awareness, trust, engagement paradoxes, attitudinal analysis, and demographic variation.',
  },
  {
    part: 'Part Three',
    title: 'Comparative Evidence',
    body: 'Lessons from past reorganisations — what worked, what failed, and what new authorities can learn from councils that have been through it before.',
  },
  {
    part: 'Part Four',
    title: 'Governance and Democratic Legitimacy',
    body: 'Committee vs cabinet systems, councillor–resident ratios, ward boundary design, and the practical architecture of local accountability.',
  },
  {
    part: 'Part Five',
    title: 'AI, Data and Governance',
    body: 'Five specific risk categories for new authorities adopting AI, and a governance framework covering disclosure, human oversight, bias monitoring, procurement, and resident rights.',
  },
  {
    part: 'Part Six',
    title: 'Devolution and the Long-Run Opportunity',
    body: 'What reorganisation can achieve when it is treated as a platform for devolution — not just a cost-saving exercise.',
  },
];

export default function WhitePaper({ onNavigate: _onNavigate }: WhitePaperProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="researchWhitePaper" />
      <MetaTags
        title="White Paper: Governance, Legitimacy and the First 100 Days | LGR Initiative"
        description="The LGR Initiative White Paper — original survey data, practitioner evidence and policy recommendations on governance design for England's new unitary authorities."
        keywords="LGR white paper, local government reorganisation, governance design, democratic legitimacy, unitary authorities, Surrey survey"
      />

      <PageBanner
        heroVariant="research"
        heroLabel="RESEARCH — WHITE PAPER"
        heroTitle="Local Government Reorganisation: Governance, Legitimacy and the First 100 Days"
        heroSubtitle="Original survey data, practitioner evidence, and policy recommendations for England's new unitary authorities."
        currentPath={location.pathname}
      />

      <ContentContainer variant="article">
        {/* Partnership tags */}
        <section className="layout-section">
          <div className="flex flex-wrap gap-3 mb-8">
            {['LGR Initiative', 'University of Surrey — Centre for Britain and Europe', 'April 2026'].map((tag) => (
              <span key={tag} className="inline-block px-3 py-1.5 rounded border border-teal-200 bg-teal-50 text-xs font-display font-medium text-teal-800 tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">Summary</h2>
          <div className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 space-y-4 max-w-2xl">
            <p>
              England is undertaking the most ambitious programme of local government reorganisation in a generation. Across Surrey, Essex, Hampshire, Norfolk, Suffolk and fourteen further areas, two-tier council structures are being replaced by new unitary authorities — with elections, governance design, and service continuity proceeding simultaneously and at pace.
            </p>
            <p>
              This White Paper, published by the LGR Initiative in partnership with the University of Surrey's Centre for Britain and Europe, examines what that process means in practice for the communities and councillors at its centre. It presents original survey data from 1,047 Surrey residents alongside practitioner evidence, comparative analysis, and specific policy recommendations addressed to MHCLG.
            </p>
            <p>
              The central argument is that structural change without deliberate attention to governance design, democratic engagement, and institutional culture will reproduce the weaknesses of the system it replaces — at greater scale and with fewer points of accountability.
            </p>
          </div>
        </section>

        {/* Contents grid */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">What the Paper Covers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paperSections.map((section) => (
              <div key={section.part} className="academic-card p-5 border-t-3 border-teal-700">
                <p className="text-xs font-display font-bold text-amber-700 uppercase tracking-wider mb-1">{section.part}</p>
                <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">{section.title}</h3>
                <p className="text-academic-sm font-serif text-academic-neutral-600 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Authors */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">Authors and Partnership</h2>
          <div className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 space-y-4 max-w-2xl">
            <p>
              The White Paper is published by the LGR Initiative, delivered by COALFACE in partnership with the Centre for Britain and Europe at the University of Surrey. Academic partners are Professors Amelia Hadfield and Theofanis Exadaktylos. Strategic partners include ECF, Commonplace, and Truth About Local Government.
            </p>
            <p>
              The work was conducted independently and was not commissioned by or shared with any local authority, government department, or political organisation prior to publication.
            </p>
          </div>
        </section>

        {/* Download CTA */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <div className="academic-card p-8 bg-teal-50 border border-teal-100 text-center">
            <FileText className="w-10 h-10 text-teal-700 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-academic-xl font-display font-bold text-teal-800 mb-2">Full Paper — Coming Soon</h3>
            <p className="text-academic-base font-serif text-academic-neutral-700 max-w-md mx-auto mb-6">
              The full White Paper will be available to download as a PDF from this page. Subscribe to be notified when it is published.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/subscribe"
                className="inline-flex items-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-display font-semibold text-sm rounded-lg transition-colors"
              >
                Subscribe for Updates
              </Link>
              <Link
                to="/surrey/survey-results"
                className="inline-flex items-center px-5 py-2.5 border-2 border-teal-700 text-teal-700 hover:bg-teal-50 font-display font-semibold text-sm rounded-lg transition-colors"
              >
                View Survey Headlines
              </Link>
            </div>
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="research" />
    </div>
  );
}
