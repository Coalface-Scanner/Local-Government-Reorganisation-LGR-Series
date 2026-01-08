import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';
import BackToTop from './components/BackToTop';
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
const SurreyElectionSimulator = lazy(() => import('./pages/SurreyElectionSimulator'));
const Article = lazy(() => import('./pages/Article'));
const Insights = lazy(() => import('./pages/Insights'));
const Councils = lazy(() => import('./pages/Councils'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const HundredDays = lazy(() => import('./pages/HundredDays'));
const Contact = lazy(() => import('./pages/Contact'));
const News = lazy(() => import('./pages/News'));
const ArticleView = lazy(() => import('./pages/ArticleView'));
const FactDetail = lazy(() => import('./pages/FactDetail'));

// Admin pages - lazy loaded (less frequently accessed)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminArticleLogin = lazy(() => import('./pages/admin/AdminArticleLogin'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));

// Facts sub-pages - lazy loaded
const Timescales = lazy(() => import('./pages/facts/Timescales'));
const CouncilsInvolved = lazy(() => import('./pages/facts/CouncilsInvolved'));
const KeyFacts = lazy(() => import('./pages/facts/KeyFacts'));
const Methodology = lazy(() => import('./pages/facts/Methodology'));
const Sources = lazy(() => import('./pages/facts/Sources'));
const FurtherReading = lazy(() => import('./pages/facts/FurtherReading'));

// Loading component for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-slate-600">Loading...</p>
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
  const handleNavigate = (page: string) => navigate(`/${page}`);

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
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
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
            <Route path="/facts/methodology" element={<Methodology />} />
            <Route path="/facts/sources" element={<Sources />} />
            <Route path="/facts/further-reading" element={<FurtherReading />} />
            <Route path="/facts/:slug" element={<FactDetail />} />
            <Route path="/lessons" element={<PageWrapper>{(nav) => <Lessons onNavigate={nav} />}</PageWrapper>} />
            <Route path="/reasons" element={<PageWrapper>{(nav) => <Reasons onNavigate={nav} />}</PageWrapper>} />
            <Route path="/about" element={<PageWrapper>{(nav) => <Reasons onNavigate={nav} />}</PageWrapper>} />
            <Route path="/interviews" element={<PageWrapper>{(nav) => <Interviews onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey" element={<PageWrapper>{(nav) => <Surrey onNavigate={nav} />}</PageWrapper>} />
            <Route path="/surrey/election-simulator" element={<PageWrapper>{(nav) => <SurreyElectionSimulator onNavigate={nav} />}</PageWrapper>} />
            <Route path="/100days" element={<PageWrapper>{(nav) => <HundredDays onNavigate={nav} />}</PageWrapper>} />
            <Route path="/contact" element={<PageWrapper>{(nav) => <Contact onNavigate={nav} />}</PageWrapper>} />
            <Route path="/councils" element={<Councils />} />
            <Route path="/subscribe" element={<PageWrapper>{(nav) => <Subscribe onNavigate={nav} />}</PageWrapper>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/news" element={<News />} />
            <Route path="/article/:slug" element={<ArticleWrapper />} />
            <Route path="/insights" element={<PageWrapper>{(nav) => <Insights onNavigate={nav} />}</PageWrapper>} />
            <Route path="/insights/:slug" element={<ArticleViewWrapper />} />
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
