import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import ArticleStructuredData from '../../components/ArticleStructuredData';
import WhoseJobQuiz from '../../components/WhoseJobQuiz';
import LGRProcessTimeline from '../../components/LGRProcessTimeline';
import QuickFactsStrip from '../../components/QuickFactsStrip';
import WhatIsLGRAnchorBar from '../../components/WhatIsLGRAnchorBar';
import WhyThisMattersNow from '../../components/WhyThisMattersNow';
import LGRDataStatementBlock from '../../components/LGRDataStatementBlock';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Building2,
  Users,
  ChevronRight,
  Target,
  User,
  Landmark,
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const audienceRoutes = [
  { id: 'residents', label: 'Residents', icon: User, route: '/beginners-guide', description: 'Understand how local government works and what’s changing in your area.' },
  { id: 'councillors', label: 'Councillors', icon: Landmark, route: '/first-100-days', description: 'Guidance for leaders and members in new authorities.' },
  { id: 'officers', label: 'Officers', icon: Briefcase, route: '/lgr-journey-2026', description: 'Interactive roadmap: milestones and what to do now.' },
  { id: 'researchers', label: 'Researchers', icon: Search, route: '/materials', description: 'Research, reports, and evidence from the LGRI.' },
];

export default function WhatIsLGR() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Local Government Reorganisation Explained"
        heroSubtitle="What is changing, why it matters, and how it will reshape local decision making."
        currentPath={location.pathname}
      />
      <div data-page-nav className="bg-academic-cream">
        <div className="layout-container py-1.5">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
        </div>
      </div>

      <div data-page-main className="min-h-screen hyphens-none">
        <MetaTags
          title="What is Local Government Reorganisation? (LGR)"
          description="What is changing, why it matters, and how it will reshape local decision making. LGR explained with a clear point of view."
          keywords="What is LGR, Local Government Reorganisation, LGR definition, LGR governance, LGR timetable 2026, unitary authorities, council reorganisation, local government reform"
        />
        <ArticleStructuredData
          title="What is Local Government Reorganisation? (LGR)"
          description="What is changing, why it matters, and how it will reshape local decision making."
          author="LGRI Editorial Team"
          publishedDate={currentDate}
          updatedDate={currentDate}
          slug="what-is-lgr"
        />

        <WhatIsLGRAnchorBar />

        <WhyThisMattersNow />

        {/* What LGR does and does not – green/red contrast, takeaway lines */}
        <section id="what-lgr-does" className="py-10 md:py-14 scroll-mt-24 hyphens-none" style={{ backgroundColor: 'var(--lgr-section-neutral)' }}>
          <div className="layout-container layout-content-sub max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-academic-charcoal mb-8">
              What LGR does and does not do
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-md border-l-4" style={{ borderLeftColor: 'var(--lgr-accent)' }}>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-4">What LGR does</h3>
                <ul className="list-disc pl-5 space-y-2 text-academic-charcoal font-serif text-base mb-5">
                  <li>Merges <Link to="/glossary/two-tier-system" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">district and county councils</Link></li>
                  <li>Creates a single unitary authority</li>
                  <li>Centralises service responsibility</li>
                  <li>Simplifies accountability</li>
                </ul>
                <p className="font-display font-bold text-academic-charcoal text-sm border-t pt-4" style={{ borderColor: 'var(--lgr-button-border)' }}>
                  LGR simplifies structure. It does not automatically reduce cost.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-md border-l-4" style={{ borderLeftColor: 'var(--lgr-does-not-border)' }}>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-4">What it does not do</h3>
                <ul className="list-disc pl-5 space-y-2 text-academic-charcoal font-serif text-base mb-5">
                  <li>It is not <Link to="/glossary/devolution" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">devolution</Link></li>
                  <li>It does not automatically reduce council tax</li>
                  <li>It does not remove all local representation</li>
                </ul>
                <p className="text-academic-neutral-600 font-serif text-sm border-t pt-4" style={{ borderColor: 'var(--lgr-button-border)' }}>
                  Policy design and political leadership determine outcomes.
                </p>
              </div>
            </div>
            <h3 className="text-lg font-display font-bold text-academic-charcoal mb-3">At a glance</h3>
            <QuickFactsStrip />
          </div>
        </section>

        <LGRDataStatementBlock />

        {/* How it happens */}
        <section id="process" className="bg-white py-10 md:py-14 scroll-mt-24">
          <div className="layout-container layout-content-sub max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-academic-charcoal mb-2 text-center">How it happens</h2>
            <p className="text-academic-neutral-700 text-base text-center mb-8 font-serif max-w-xl mx-auto">Six stages from proposal to launch.</p>
            <LGRProcessTimeline hideDurationCallout />
          </div>
        </section>

        {/* Quiz – after process for engagement mid-page */}
        <section id="overview" className="py-10 md:py-14 scroll-mt-24" style={{ backgroundColor: 'var(--lgr-quiz-bg)' }}>
          <div className="layout-container layout-content-sub max-w-4xl">
            <WhoseJobQuiz />
          </div>
        </section>

        {/* What it means 2026 – two lines + two strong buttons */}
        <section id="what-it-means" className="bg-white py-10 md:py-14 scroll-mt-24">
          <div className="layout-container layout-content-sub max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-academic-charcoal mb-6">What it means for your area in 2026</h2>
            <p className="text-academic-charcoal font-serif text-base mb-2 max-w-prose"><Link to="/glossary/shadow-elections" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Shadow elections</Link> in May 2026. New unitaries live in 2027 to 2028.</p>
            <p className="text-academic-neutral-700 font-serif text-base mb-8 max-w-prose">The <Link to="/glossary/transition-period" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">transition period</Link> determines whether services remain stable. The first 100 days set the tone.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/facts/lgr-timeline"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-display font-semibold rounded-xl shadow-md hover:opacity-95 transition"
                style={{ backgroundColor: 'var(--lgr-accent)' }}
              >
                View the 2026 Timeline
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/first-100-days"
                className="inline-flex items-center gap-2 px-6 py-3 font-display font-semibold rounded-xl border-2 transition border-[var(--lgr-accent)] text-[var(--lgr-accent)] hover:bg-[var(--lgr-button-hover)]"
              >
                Read the First 100 Days Playbook
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Who is this for */}
        <section id="who-its-for" className="py-10 md:py-14 scroll-mt-24" style={{ backgroundColor: 'var(--lgr-section-neutral)' }}>
          <div className="layout-container layout-content-sub max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-academic-charcoal mb-6">Who is this for?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {audienceRoutes.map(({ id, label, icon: Icon, route, description }) => (
                <Link
                  key={id}
                  to={route}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-left group hyphens-none hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--lgr-button-border)', borderWidth: 1 }}
                >
                  <Icon className="w-8 h-8 mb-3 group-hover:opacity-80" style={{ color: 'var(--lgr-accent)' }} aria-hidden />
                  <h3 className="font-display font-bold text-academic-charcoal mb-2 text-lg">{label}</h3>
                  <p className="text-sm text-academic-neutral-700 font-serif leading-snug">{description}</p>
                  <span className="inline-flex items-center gap-1 font-medium text-sm mt-3" style={{ color: 'var(--lgr-accent)' }}>
                    Go
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Closing statement – end with intent */}
        <section
          className="py-14 md:py-20 text-white hyphens-none"
          style={{ backgroundColor: 'var(--lgr-hero-start)' }}
        >
          <div className="layout-container layout-content-sub text-center max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight">
              Reorganisation reshapes how local decisions are made for a generation.
            </p>
            <p className="text-white/90 font-serif text-base mb-10">The structure may change once. The consequences endure.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/facts/lgr-timeline"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--lgr-hero-start)] font-display font-semibold rounded-xl shadow-md hover:opacity-95 transition"
              >
                Explore the Timeline
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/first-100-days"
                className="inline-flex items-center gap-2 px-6 py-3 font-display font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 transition"
              >
                Access the 100 Days Playbook
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section id="tools" className="bg-white py-10 md:py-14 scroll-mt-24">
          <div className="layout-container layout-content-sub max-w-4xl">
            <FAQSection page="what-is-lgr" />
          </div>
        </section>
      </div>
    </>
  );
}
