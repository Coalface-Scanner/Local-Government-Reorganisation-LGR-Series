import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import Footer from './components/Footer';
import StayInformedBanner from './components/StayInformedBanner';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';
import BackToTop from './components/BackToTop';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import SkipLink from './components/SkipLink';
import PageLayout from './components/PageLayout';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarTocProvider } from './contexts/SidebarTocContext';
import { trackPageView } from './utils/analytics';

// Lazy load pages for code splitting - improves initial load time
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Lessons = lazy(() => import('./pages/Lessons'));
const Reasons = lazy(() => import('./pages/Reasons'));
const Interviews = lazy(() => import('./pages/Interviews'));
const Surrey = lazy(() => import('./pages/Surrey'));
const SurreyElectionTracker = lazy(() => import('./pages/SurreyElectionTracker'));
const SurreyElectionSimulator = lazy(() => import('./pages/SurreyElectionSimulator'));
const SurreyHub = lazy(() => import('./pages/SurreyHub'));
const SurreyLGRHub = lazy(() => import('./pages/SurreyLGRHub'));
const Insights = lazy(() => import('./pages/Insights'));
const Reports = lazy(() => import('./pages/insights/Reports'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const HundredDays = lazy(() => import('./pages/HundredDays'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Partnerships = lazy(() => import('./pages/Partnerships'));
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
const Reorganisations = lazy(() => import('./pages/Reorganisations'));
const Learn = lazy(() => import('./pages/Learn'));
const Discover = lazy(() => import('./pages/Discover'));
const Research = lazy(() => import('./pages/Research'));

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
const LGRTimeline = lazy(() => import('./pages/facts/LGRTimeline'));
const CouncilCases = lazy(() => import('./pages/facts/CouncilCases'));

// Lessons sub-pages - lazy loaded
const LessonsInsights = lazy(() => import('./pages/lessons/Insights'));
const LessonsCaseStudies = lazy(() => import('./pages/lessons/CaseStudies'));
const LessonsBestPractices = lazy(() => import('./pages/lessons/BestPractices'));

// About sub-pages - lazy loaded
const AboutHub = lazy(() => import('./pages/about/AboutHub'));
const AboutOverview = lazy(() => import('./pages/about/AboutOverview'));
const AboutContribute = lazy(() => import('./pages/about/Contribute'));
const AboutContributors = lazy(() => import('./pages/about/Contributors'));
const Leadership = lazy(() => import('./pages/about/Leadership'));
const LeadershipBio = lazy(() => import('./pages/about/LeadershipBio'));
const Partnership = lazy(() => import('./pages/about/Partnership'));

// Editor / leadership profile pages - lazy loaded
const RowanCole = lazy(() => import('./pages/editor/RowanCole'));
const ProfessorAmeliaHadfield = lazy(() => import('./pages/about/ProfessorAmeliaHadfield'));
const OliverDeed = lazy(() => import('./pages/about/OliverDeed'));
const MatthewMasters = lazy(() => import('./pages/about/MatthewMasters'));
const CharlieMoir = lazy(() => import('./pages/about/CharlieMoir'));

// Topic pages - lazy loaded
const LocalGovernment = lazy(() => import('./pages/topics/LocalGovernment'));
const Democracy = lazy(() => import('./pages/topics/Democracy'));
const GovernanceAndReform = lazy(() => import('./pages/topics/GovernanceAndReform'));
const DemocraticLegitimacy = lazy(() => import('./pages/topics/DemocraticLegitimacy'));
const StatecraftAndSystemDesign = lazy(() => import('./pages/topics/StatecraftAndSystemDesign'));

// Glossary pages - Next.js-style structure (lazy loaded)
const Glossary = lazy(() => import('./app/glossary/page'));
const GlossaryTerm = lazy(() => import('./app/glossary/[slug]/page'));

// 404 page - lazy loaded
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for Suspense - fills quickly so the app doesn't feel stuck
function PageLoader() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Reach ~90% in under a second, then creep to 95%
        const increment = prev < 85 ? 12 + Math.random() * 8 : 0.3 + Math.random() * 0.4;
        return Math.min(prev + increment, 95);
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-academic-cream flex items-center justify-center px-4">
      <div className="text-center w-full max-w-md">
        {/* LGR Logo */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <img 
            src="/lgr.png" 
            alt="LGR Initiative Logo" 
            className="h-24 w-auto object-contain drop-shadow-sm"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="mb-4">
          <div className="w-full bg-academic-neutral-200 rounded-full h-3 overflow-hidden shadow-inner border border-academic-neutral-300/50">
            <div
              className="h-full bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect - sliding highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Progress Percentage */}
        <p className="text-academic-neutral-600 font-serif text-sm font-medium">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view for Google Analytics
    trackPageView(pathname, document.title);
  }, [pathname]);

  return null;
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

// Redirect wrappers for canonical URLs (301-style in-app)
function RedirectArticleToInsights() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={slug ? `/insights/${slug}` : '/insights'} replace />;
}
function RedirectLeadershipToAbout() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={slug ? `/about/leadership/${slug}` : '/about/leadership'} replace />;
}
function RedirectCouncilProfilesToSurreyAreaProfile() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={slug ? `/surrey/area-profile/${slug}` : '/surrey/area-profile'} replace />;
}

function GlossaryWrapper() {
  return <Glossary />;
}

function GlossaryTermWrapper() {
  return <GlossaryTerm />;
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
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(`/${page}`);
  return (
    <div
      className="min-h-screen bg-academic-cream flex flex-col"
      style={{ minHeight: '100vh', backgroundColor: '#faf8f5' }}
    >
      <SkipLink />
      <KeyboardShortcuts />
      <main id="main-content" className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <SidebarTocProvider>
            <Routes>
              <Route element={<PageLayout />}>
                <Route path="/" element={<PageWrapper>{(_nav) => <Home onNavigate={_nav} />}</PageWrapper>} />
                <Route path="/learn" element={<PageWrapper>{(_nav) => <Learn onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/discover" element={<PageWrapper>{(_nav) => <Discover onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/research" element={<PageWrapper>{(_nav) => <Research onNavigate={_nav} />}</PageWrapper>} />
            {/* Legacy URL redirects – old paths auto-redirect to new canonical URLs */}
            <Route path="/article/:slug" element={<RedirectArticleToInsights />} />
            <Route path="/facts" element={<Navigate to="/facts/key-facts" replace />} />
            <Route path="/facts/facts" element={<Navigate to="/facts/key-facts" replace />} />
            <Route path="/facts/what-is-lgr" element={<Navigate to="/what-is-lgr" replace />} />
            <Route path="/facts/councilopedia/beginners-guide" element={<Navigate to="/beginners-guide" replace />} />
            <Route path="/facts/questions-and-answers" element={<Navigate to="/questions-and-answers" replace />} />
            <Route path="/materials" element={<Navigate to="/library" replace />} />
            <Route path="/lgr-journey-2026" element={<Navigate to="/roadmap" replace />} />
            <Route path="/100days" element={<Navigate to="/first-100-days" replace />} />
            <Route path="/interviews" element={<Navigate to="/podcast" replace />} />
            <Route path="/leadership" element={<Navigate to="/about/leadership" replace />} />
            <Route path="/leadership/:slug" element={<RedirectLeadershipToAbout />} />
            <Route path="/library" element={<PageWrapper>{(_nav) => <Search onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/facts/timescales" element={<Timescales />} />
            <Route path="/facts/councils-involved" element={<CouncilsInvolved />} />
            <Route path="/facts/key-facts" element={<KeyFacts />} />
            <Route path="/facts/methodology" element={<Methodology />} />
            <Route path="/facts/sources" element={<Sources />} />
            <Route path="/facts/further-reading" element={<FurtherReading />} />
            <Route path="/facts/councilopedia" element={<Councilopedia />} />
            <Route path="/facts/lgr-timeline" element={<LGRTimeline />} />
            <Route path="/facts/council-cases" element={<CouncilCases />} />
            <Route path="/facts/:slug" element={<FactDetail />} />
            <Route path="/what-is-lgr" element={<WhatIsLGR />} />
            <Route path="/beginners-guide" element={<BeginnersGuide />} />
            <Route path="/questions-and-answers" element={<QuestionsAndAnswers />} />
            <Route path="/councilopedia" element={<Councilopedia />} />
            <Route path="/hundred-days" element={<Navigate to="/first-100-days" replace />} />
            <Route path="/first-100-days" element={<PageWrapper>{(_nav) => <HundredDays onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/roadmap" element={<PageWrapper>{(_nav) => <JourneyMap onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/lgr-hub" element={<PageWrapper>{(_nav) => <LGRHub onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/facts-and-data" element={<PageWrapper>{(_nav) => <FactsAndData onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/reorganisations" element={<PageWrapper>{(_nav) => <Reorganisations onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="/lessons/insights" element={<PageWrapper>{(_nav) => <LessonsInsights />}</PageWrapper>} />
            <Route path="/lessons/case-studies" element={<PageWrapper>{(_nav) => <LessonsCaseStudies />}</PageWrapper>} />
            <Route path="/lessons/best-practices" element={<PageWrapper>{(_nav) => <LessonsBestPractices />}</PageWrapper>} />
            <Route path="/lessons" element={<PageWrapper>{(_nav) => <Lessons onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/reasons" element={<PageWrapper>{(_nav) => <Reasons onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about" element={<PageWrapper>{(_nav) => <AboutHub onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about/overview" element={<PageWrapper>{(_nav) => <AboutOverview onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/partnerships" element={<PageWrapper>{(_nav) => <Partnerships />}</PageWrapper>} />
            <Route path="/about/methodology" element={<Navigate to="/about/overview#methodology" replace />} />
            <Route path="/contribute" element={<Navigate to="/about/contributors/contribute" replace />} />
            <Route path="/about/contribute" element={<Navigate to="/about/contributors/contribute" replace />} />
            <Route path="/about/coalface" element={<Navigate to="/about/partnership" replace />} />
            <Route path="/about/contributors" element={<PageWrapper>{(_nav) => <AboutContributors onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about/contributors/contribute" element={<PageWrapper>{(_nav) => <AboutContribute onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about/leadership" element={<PageWrapper>{(_nav) => <Leadership onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about/partnership" element={<PageWrapper>{(_nav) => <Partnership onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/about/leadership/rowan-cole" element={<Navigate to="/rowan-cole-local-government-reorganisation" replace />} />
            <Route path="/about/leadership/amelia-hadfield" element={<Navigate to="/professor-amelia-hadfield-governance-reform" replace />} />
            <Route path="/about/leadership/oliver-deed" element={<Navigate to="/oliver-deed-strategic-communications-local-government" replace />} />
            <Route path="/about/leadership/matthew-masters" element={<Navigate to="/matthew-masters-local-government-leadership" replace />} />
            <Route path="/about/leadership/charlie-moir" element={<Navigate to="/charlie-moir-digital-engagement-local-government" replace />} />
            <Route path="/about/leadership/:slug" element={<LeadershipBio />} />
            <Route path="/rowan-cole-local-government-reorganisation" element={<PageWrapper>{(_nav) => <RowanCole onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/professor-amelia-hadfield-governance-reform" element={<ProfessorAmeliaHadfield />} />
            <Route path="/oliver-deed-strategic-communications-local-government" element={<OliverDeed />} />
            <Route path="/matthew-masters-local-government-leadership" element={<MatthewMasters />} />
            <Route path="/charlie-moir-digital-engagement-local-government" element={<CharlieMoir />} />
            <Route path="/editor/rowan-cole" element={<Navigate to="/rowan-cole-local-government-reorganisation" replace />} />
            <Route path="/podcast" element={<PageWrapper>{(_nav) => <Interviews onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/surrey/lessons" element={<PageWrapper>{(_nav) => <Surrey onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/surrey/area-profile" element={<CouncilProfiles />} />
            <Route path="/surrey/area-profile/:slug" element={<CouncilProfileDetail />} />
            <Route path="/surrey/election-tracker" element={<PageWrapper>{(_nav) => <SurreyElectionTracker onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/surrey/election-tracker/simulator" element={<PageWrapper>{(_nav) => <SurreyElectionSimulator onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/surrey/hub" element={<PageWrapper>{(_nav) => <SurreyHub onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/surrey" element={<PageWrapper>{(_nav) => <SurreyLGRHub onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/contact" element={<PageWrapper>{(_nav) => <Contact onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/councils" element={<Navigate to="/surrey/area-profile" replace />} />
            <Route path="/council-profiles" element={<Navigate to="/surrey/area-profile" replace />} />
            <Route path="/council-profiles/:slug" element={<RedirectCouncilProfilesToSurreyAreaProfile />} />
            <Route path="/subscribe" element={<PageWrapper>{(_nav) => <Subscribe onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/news" element={<News />} />
            <Route path="/insights" element={<PageWrapper>{(_nav) => <Insights onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/insights/reports" element={<PageWrapper>{(_nav) => <Reports onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/insights/:slug" element={<ArticleViewWrapper />} />
            <Route path="/topics" element={<PageWrapper>{(_nav) => <Topics onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/topics/local-government" element={<PageWrapper>{(_nav) => <LocalGovernment onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/topics/democracy" element={<PageWrapper>{(_nav) => <Democracy onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/topics/governance-and-reform" element={<PageWrapper>{(_nav) => <GovernanceAndReform onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/topics/democratic-legitimacy" element={<PageWrapper>{(_nav) => <DemocraticLegitimacy onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/topics/statecraft-and-system-design" element={<PageWrapper>{(_nav) => <StatecraftAndSystemDesign onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/tools" element={<PageWrapper>{(_nav) => <Tools onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/glossary" element={<GlossaryWrapper />} />
            <Route path="/glossary/:slug" element={<GlossaryTermWrapper />} />
            <Route path="/admin/login" element={<PageWrapper>{(_nav) => <AdminLogin onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper>{(_nav) => <AdminDashboard onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/admin/articles/login" element={<PageWrapper>{(_nav) => <AdminArticleLogin onNavigate={_nav} />}</PageWrapper>} />
            <Route path="/admin/articles" element={<PageWrapper>{(_nav) => <AdminArticles onNavigate={_nav} />}</PageWrapper>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SidebarTocProvider>
        </Suspense>
      </main>
      <StayInformedBanner />
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
