import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';
import BackToTop from './components/BackToTop';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import SkipLink from './components/SkipLink';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages for code splitting - improves initial load time
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Materials = lazy(() => import('./pages/Materials'));
const Facts = lazy(() => import('./pages/Facts'));
const Lessons = lazy(() => import('./pages/Lessons'));
const Reasons = lazy(() => import('./pages/Reasons'));
const Interviews = lazy(() => import('./pages/Interviews'));
const Surrey = lazy(() => import('./pages/Surrey'));
const SurreyElectionTracker = lazy(() => import('./pages/SurreyElectionTracker'));
const SurreyElectionSimulator = lazy(() => import('./pages/SurreyElectionSimulator'));
const SurreyHub = lazy(() => import('./pages/SurreyHub'));
const Article = lazy(() => import('./pages/Article'));
const Insights = lazy(() => import('./pages/Insights'));
const Reports = lazy(() => import('./pages/insights/Reports'));
const Councils = lazy(() => import('./pages/Councils'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const HundredDays = lazy(() => import('./pages/HundredDays'));
const Contact = lazy(() => import('./pages/Contact'));
const News = lazy(() => import('./pages/News'));
const ArticleView = lazy(() => import('./pages/ArticleView'));
const FactDetail = lazy(() => import('./pages/FactDetail'));
const CouncilProfiles = lazy(() => import('./pages/CouncilProfiles'));
const CouncilProfileDetail = lazy(() => import('./pages/CouncilProfileDetail'));
const JourneyMap = lazy(() => import('./pages/JourneyMap'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const Topics = lazy(() => import('./pages/Topics'));
const Tools = lazy(() => import('./pages/Tools'));
const LGRHub = lazy(() => import('./pages/LGRHub'));
const FactsAndData = lazy(() => import('./pages/FactsAndData'));

// Admin pages - lazy loaded (less frequently accessed)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminArticleLogin = lazy(() => import('./pages/admin/AdminArticleLogin'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));

// Facts sub-pages - lazy loaded
const Timescales = lazy(() => import('./pages/facts/Timescales'));
const CouncilsInvolved = lazy(() => import('./pages/facts/CouncilsInvolved'));
const KeyFacts = lazy(() => import('./pages/facts/KeyFacts'));
const QuestionsAndAnswers = lazy(() => import('./pages/facts/QuestionsAndAnswers'));
const Methodology = lazy(() => import('./pages/facts/Methodology'));
const Sources = lazy(() => import('./pages/facts/Sources'));
const FurtherReading = lazy(() => import('./pages/facts/FurtherReading'));
const Councilopedia = lazy(() => import('./pages/facts/Councilopedia'));
const BeginnersGuide = lazy(() => import('./pages/facts/BeginnersGuide'));
const WhatIsLGR = lazy(() => import('./pages/facts/WhatIsLGR'));
const LGRGlossary = lazy(() => import('./pages/facts/LGRGlossary'));
const LGRTimeline = lazy(() => import('./pages/facts/LGRTimeline'));
const CouncilCases = lazy(() => import('./pages/facts/CouncilCases'));

// About sub-pages - lazy loaded
const About = lazy(() => import('./pages/about/About'));
const AboutEditor = lazy(() => import('./pages/about/Editor'));
const AboutMethodology = lazy(() => import('./pages/about/Methodology'));
const AboutContribute = lazy(() => import('./pages/about/Contribute'));
const AboutCoalface = lazy(() => import('./pages/about/Coalface'));
const AboutContributors = lazy(() => import('./pages/about/Contributors'));

// Topic pages - lazy loaded
const LocalGovernment = lazy(() => import('./pages/topics/LocalGovernment'));
const Democracy = lazy(() => import('./pages/topics/Democracy'));
const GovernanceAndReform = lazy(() => import('./pages/topics/GovernanceAndReform'));
const DemocraticLegitimacy = lazy(() => import('./pages/topics/DemocraticLegitimacy'));
const StatecraftAndSystemDesign = lazy(() => import('./pages/topics/StatecraftAndSystemDesign'));

// Loading component for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen bg-academic-cream flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
        <p className="text-academic-neutral-600 font-serif">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ArticleWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(`/${page}`);

  return <Article slug={slug} onNavigate={handleNavigate} />;
}

function ArticleViewWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const handleNavigate = (page: string, data?: unknown) => {
    if (typeof data === 'string') {
      navigate(`/${page}/${data}`);
    } else if (data && typeof data === 'object' && 'slug' in data) {
      navigate(`/${page}/${(data as { slug: string }).slug}`);
    } else {
      navigate(`/${page}`);
    }
  };

  return <ArticleView slug={slug} onNavigate={handleNavigate} />;
}

function PageWrapper({ children }: { children: (onNavigate: (page: string, data?: unknown) => void) => JSX.Element }) {
  const navigate = useNavigate();

  const handleNavigate = (page: string, data?: unknown) => {
    if (typeof data === 'string') {
      navigate(`/${page}/${data}`);
    } else if (data && typeof data === 'object' && 'slug' in data) {
      navigate(`/${page}/${(data as { slug: string }).slug}`);
    } else {
      navigate(`/${page}`);
    }
  };

  return children(handleNavigate);
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => navigate(`/${page}`);
  const getCurrentPage = () => {
    const path = location.pathname.split('/')[1] || 'home';
    return path;
  };

  return (
    <div className="min-h-screen bg-academic-cream flex flex-col">
      <SkipLink />
      <KeyboardShortcuts />
      <Navigation onNavigate={handleNavigate} currentPage={getCurrentPage()} />
      <main id="main-content" className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PageWrapper>{(nav) => <Home onNavigate={nav} />}</PageWrapper>} />
            <Route path="/library" element={<PageWrapper>{(nav) => <Search onNavigate={nav} />}</PageWrapper>} />
            <Route path="/materials" element={<PageWrapper>{(nav) => <Materials onNavigate={nav} />}</PageWrapper>} />
            <Route path="/facts" element={<PageWrapper>{(nav) => <Facts onNavigate={nav} />}</PageWrapper>} />
            <Route path="/facts/timescales" element={<Timescales />} />
            <Route path="/facts/councils-involved" element={<CouncilsInvolved />} />
            <Route path="/facts/key-facts" element={<KeyFacts />} />
            <Route path="/facts/questions-and-answers" element={<QuestionsAndAnswers />} />
            <Route path="/facts/methodology" element={<Methodology />} />
            <Route path="/facts/sources" element={<Sources />} />
            <Route path="/facts/further-reading" element={<FurtherReading />} />
            <Route path="/facts/councilopedia" element={<Councilopedia />} />
            <Route path="/facts/councilopedia/beginners-guide" element={<BeginnersGuide />} />
            <Route path="/facts/what-is-lgr" element={<WhatIsLGR />} />
            <Route path="/what-is-lgr" element={<WhatIsLGR />} />
            <Route path="/facts/lgr-glossary" element={<LGRGlossary />} />
            <Route path="/facts/lgr-timeline" element={<LGRTimeline />} />
            <Route path="/facts/council-cases" element={<CouncilCases />} />
            <Route path="/facts/:slug" element={<FactDetail />} />
            <Route path="/lgr-journey-2026" element={<PageWrapper>{(nav) => <JourneyMap onNavigate={nav} />}</PageWrapper>} />
            <Route path="/roadmap" element={<PageWrapper>{(nav) => <JourneyMap onNavigate={nav} />}</PageWrapper>} />
            <Route path="/lgr-hub" element={<PageWrapper>{(nav) => <LGRHub onNavigate={nav} />}</PageWrapper>} />
            <Route path="/facts-and-data" element={<PageWrapper>{(nav) => <FactsAndData onNavigate={nav} />}</PageWrapper>} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="/lessons" element={<PageWrapper>{(nav) => <Lessons onNavigate={nav} />}</PageWrapper>} />
            <Route path="/reasons" element={<PageWrapper>{(nav) => <Reasons onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about" element={<PageWrapper>{(nav) => <About onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about/editor" element={<PageWrapper>{(nav) => <AboutEditor onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about/methodology" element={<PageWrapper>{(nav) => <AboutMethodology onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about/contribute" element={<PageWrapper>{(nav) => <AboutContribute onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about/coalface" element={<PageWrapper>{(nav) => <AboutCoalface onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about/contributors" element={<PageWrapper>{(nav) => <AboutContributors onNavigate={nav} />}</PageWrapper>} />
            <Route path="/interviews" element={<PageWrapper>{(nav) => <Interviews onNavigate={nav} />}</PageWrapper>} />
            <Route path="/podcast" element={<PageWrapper>{(nav) => <Interviews onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey" element={<PageWrapper>{(nav) => <Surrey onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey/election-tracker" element={<PageWrapper>{(nav) => <SurreyElectionTracker onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey/election-tracker/simulator" element={<PageWrapper>{(nav) => <SurreyElectionSimulator onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey/hub" element={<PageWrapper>{(nav) => <SurreyHub onNavigate={nav} />}</PageWrapper>} />
            <Route path="/100days" element={<PageWrapper>{(nav) => <HundredDays onNavigate={nav} />}</PageWrapper>} />
            <Route path="/contact" element={<PageWrapper>{(nav) => <Contact onNavigate={nav} />}</PageWrapper>} />
            <Route path="/councils" element={<Councils />} />
            <Route path="/council-profiles" element={<CouncilProfiles />} />
            <Route path="/council-profiles/:slug" element={<CouncilProfileDetail />} />
            <Route path="/subscribe" element={<PageWrapper>{(nav) => <Subscribe onNavigate={nav} />}</PageWrapper>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/news" element={<News />} />
            <Route path="/article/:slug" element={<ArticleWrapper />} />
            <Route path="/insights" element={<PageWrapper>{(nav) => <Insights onNavigate={nav} />}</PageWrapper>} />
            <Route path="/insights/reports" element={<PageWrapper>{(nav) => <Reports onNavigate={nav} />}</PageWrapper>} />
            <Route path="/insights/:slug" element={<ArticleViewWrapper />} />
            <Route path="/topics" element={<PageWrapper>{(nav) => <Topics onNavigate={nav} />}</PageWrapper>} />
            <Route path="/topics/local-government" element={<PageWrapper>{(nav) => <LocalGovernment onNavigate={nav} />}</PageWrapper>} />
            <Route path="/topics/democracy" element={<PageWrapper>{(nav) => <Democracy onNavigate={nav} />}</PageWrapper>} />
            <Route path="/topics/governance-and-reform" element={<PageWrapper>{(nav) => <GovernanceAndReform onNavigate={nav} />}</PageWrapper>} />
            <Route path="/topics/democratic-legitimacy" element={<PageWrapper>{(nav) => <DemocraticLegitimacy onNavigate={nav} />}</PageWrapper>} />
            <Route path="/topics/statecraft-and-system-design" element={<PageWrapper>{(nav) => <StatecraftAndSystemDesign onNavigate={nav} />}</PageWrapper>} />
            <Route path="/tools" element={<PageWrapper>{(nav) => <Tools onNavigate={nav} />}</PageWrapper>} />
            <Route path="/admin/login" element={<PageWrapper>{(nav) => <AdminLogin onNavigate={nav} />}</PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper>{(nav) => <AdminDashboard onNavigate={nav} />}</PageWrapper>} />
            <Route path="/admin/articles/login" element={<PageWrapper>{(nav) => <AdminArticleLogin onNavigate={nav} />}</PageWrapper>} />
            <Route path="/admin/articles" element={<PageWrapper>{(nav) => <AdminArticles onNavigate={nav} />}</PageWrapper>} />
          </Routes>
        </Suspense>
      </main>
      <Footer onNavigate={handleNavigate} />
      <CookieBanner />
      <BackToTop />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
