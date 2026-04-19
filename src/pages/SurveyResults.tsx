import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BarChart3, Users, ShieldAlert, Vote } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

interface SurveyResultsProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const awarenessStats = [
  { figure: '64%', label: 'Unaware of changes', detail: 'of residents did not know that changes to their local council were planned' },
  { figure: '71%', label: 'Not contacted', detail: 'had not been contacted about reorganisation by any channel' },
  { figure: '82%', label: 'Want more information', detail: 'said they wanted more information about what is happening' },
];

const paradoxStats = [
  { figure: '89.8%', label: 'Intend to vote', detail: 'of respondents say they plan to vote in the May 2026 elections' },
  { figure: '44.2%', label: 'Know what they\'re voting for', detail: 'say they know exactly what elections are happening on 7 May' },
];

const trustStats = [
  { figure: '7.3%', label: 'Trust the new structure', detail: 'express any level of trust in the proposed new councils' },
  { figure: '56.6%', label: 'Actively distrust', detail: 'actively distrust the new council structure to represent their community' },
  { figure: '54%', label: 'Expect quality of life to worsen', detail: 'believe reorganisation will worsen quality of life in their community' },
];

const priorityStats = [
  { figure: '58%', label: 'Want greater devolution', detail: 'want greater powers devolved to local government' },
  { figure: '55%', label: 'Want referendums', detail: 'say residents should have the final say via referendum on major local decisions' },
  { figure: '81%', label: 'Better services as top priority', detail: 'selected better local services as the top priority for reorganisation' },
  { figure: '65%', label: 'Electoral reform needed', detail: 'believe the electoral system needs some form of reform' },
];

const qualitativeThemes = [
  {
    title: 'Woking\'s financial position',
    body: 'Neighbouring districts and boroughs expressed strong resistance to absorbing Woking\'s debt burden under the new unitary structure.',
  },
  {
    title: 'Decisions imposed on residents',
    body: 'A recurring sense that reorganisation is being done to communities rather than with them — that the pace and process has not allowed meaningful public input.',
  },
  {
    title: 'Erosion of democratic accountability',
    body: 'Concerns about fewer elected representatives covering larger areas, and the practical implications for the councillor–resident relationship.',
  },
];

interface StatBlockProps {
  figure: string;
  label: string;
  detail: string;
}

function StatCard({ figure, label, detail }: StatBlockProps) {
  return (
    <div className="academic-card p-6 border-l-4 border-teal-700">
      <p className="text-4xl font-display font-bold text-teal-700 leading-none mb-1">{figure}</p>
      <p className="text-xs font-display font-bold text-academic-charcoal uppercase tracking-wider mb-2">{label}</p>
      <p className="text-academic-sm font-serif text-academic-neutral-600 leading-relaxed">{detail}</p>
    </div>
  );
}

export default function SurveyResults({ onNavigate: _onNavigate }: SurveyResultsProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="surreySurveyResults" />
      <MetaTags
        title="Surrey Resident Survey — Headline Results | LGR Initiative"
        description="Headline findings from the LGR Initiative's survey of 1,047 Surrey residents on awareness, trust, and attitudes towards local government reorganisation."
        keywords="Surrey LGR survey, resident survey results, local government reorganisation awareness, Surrey unitary authorities"
      />

      <PageBanner
        heroVariant="insights"
        heroLabel="SURREY LGR HUB — PRIMARY RESEARCH"
        heroTitle="Surrey Resident Survey: Headline Results"
        heroSubtitle="1,047 residents surveyed across Surrey in February 2026. The most comprehensive independent assessment of public awareness and attitudes towards reorganisation."
        currentPath={location.pathname}
      />

      {/* Survey closed banner */}
      <div className="bg-amber-50 border-b-2 border-amber-400 px-6 py-3 text-center">
        <p className="text-sm font-display font-semibold text-amber-800">
          This survey is now closed. The full report — including methodology, demographic breakdowns, and qualitative analysis — will be published shortly.
        </p>
      </div>

      {/* Methodology badges */}
      <ContentContainer variant="article">
        <section className="layout-section">
          <div className="flex flex-wrap gap-3 mb-8">
            {['n = 1,047', 'Representative sample', 'February 2026', '95% confidence intervals'].map((tag) => (
              <span key={tag} className="inline-block px-3 py-1.5 rounded border border-teal-200 bg-teal-50 text-xs font-display font-medium text-teal-800 tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          <div className="academic-card p-6 mb-8 bg-white">
            <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700">
              In February 2026, the LGR Initiative surveyed 1,047 residents across Surrey — the most advanced Devolution Priority Programme area — to assess public awareness, understanding, and attitudes towards the planned reorganisation. Surrey is the only area where the Secretary of State's decision had already been confirmed at the time of fieldwork. These headline findings are published ahead of the full report.
            </p>
          </div>
        </section>

        {/* Awareness */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-teal-700" strokeWidth={1.5} />
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Awareness and Understanding</h2>
          </div>
          <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 mb-6 max-w-2xl">
            The most striking finding is the scale of public unawareness — in an area where the reorganisation decision has already been made and implementation is underway.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {awarenessStats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* Engagement Paradox */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <Vote className="w-6 h-6 text-teal-700" strokeWidth={1.5} />
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">The Engagement Paradox</h2>
          </div>
          <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 mb-6 max-w-2xl">
            Turnout intent is high — but understanding of what residents are voting for is not. The gap between democratic willingness and institutional understanding is the defining challenge for the new authorities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paradoxStats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* Trust */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-teal-700" strokeWidth={1.5} />
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Trust and Confidence</h2>
          </div>
          <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 mb-6 max-w-2xl">
            Confidence in the new structure is exceptionally low. These respondents are disproportionately politically aware — self-selecting, engaged, and paying attention. If trust is this low among them, the picture across the broader electorate is considerably harder.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trustStats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* Priorities */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-teal-700" strokeWidth={1.5} />
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Resident Priorities</h2>
          </div>
          <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 mb-6 max-w-2xl">
            Residents have clear views on what reorganisation should deliver — and how decisions about their area should be made.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priorityStats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* Qualitative themes */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-2">What Residents Said</h2>
          <p className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 mb-6 max-w-2xl">
            508 respondents provided written reform suggestions. Three themes dominated the open-text responses:
          </p>
          <div className="flex flex-col gap-4">
            {qualitativeThemes.map((theme) => (
              <div key={theme.title} className="academic-card p-5 bg-teal-50 border border-teal-100">
                <h3 className="text-academic-lg font-display font-bold text-teal-800 mb-1">{theme.title}</h3>
                <p className="text-academic-sm font-serif text-academic-neutral-700 leading-relaxed">{theme.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="layout-section border-t border-academic-neutral-200 pt-10">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">About This Survey</h2>
          <div className="text-academic-base font-serif leading-relaxed text-academic-neutral-700 space-y-4 max-w-2xl">
            <p>
              The survey was designed and analysed by the LGR Initiative research team in partnership with the University of Surrey's Centre for Britain and Europe. The sample was drawn to be representative of the Surrey adult population across age, gender, tenure, ethnicity, political identification, and geography.
            </p>
            <p>
              Full methodology, survey instrument, and data tables will be published with the complete report. The survey was conducted independently and was not commissioned by or shared with any local authority, government department, or political organisation prior to publication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/surrey"
              className="inline-flex items-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-display font-semibold text-sm rounded-lg transition-colors"
            >
              Back to Surrey Hub
            </Link>
            <Link
              to="/research/white-paper"
              className="inline-flex items-center px-5 py-2.5 border-2 border-teal-700 text-teal-700 hover:bg-teal-50 font-display font-semibold text-sm rounded-lg transition-colors"
            >
              Read the White Paper
            </Link>
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="surrey" />
    </div>
  );
}
