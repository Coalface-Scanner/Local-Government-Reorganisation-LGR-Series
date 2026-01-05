import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';
import BackToTop from './components/BackToTop';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Materials from './pages/Materials';
import Facts from './pages/Facts';
import Lessons from './pages/Lessons';
import Reasons from './pages/Reasons';
import Interviews from './pages/Interviews';
import Surrey from './pages/Surrey';
import Article from './pages/Article';
import Insights from './pages/Insights';
import Councils from './pages/Councils';
import Subscribe from './pages/Subscribe';
import Unsubscribe from './pages/Unsubscribe';
import HundredDays from './pages/HundredDays';
import Contact from './pages/Contact';
import News from './pages/News';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticleLogin from './pages/admin/AdminArticleLogin';
import AdminArticles from './pages/admin/AdminArticles';
import ArticleView from './pages/ArticleView';

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
        <Routes>
          <Route path="/" element={<PageWrapper>{(nav) => <Home onNavigate={nav} />}</PageWrapper>} />
          <Route path="/library" element={<PageWrapper>{(nav) => <Search onNavigate={nav} />}</PageWrapper>} />
          <Route path="/materials" element={<PageWrapper>{(nav) => <Materials onNavigate={nav} />}</PageWrapper>} />
          <Route path="/facts" element={<PageWrapper>{(nav) => <Facts onNavigate={nav} />}</PageWrapper>} />
          <Route path="/lessons" element={<PageWrapper>{(nav) => <Lessons onNavigate={nav} />}</PageWrapper>} />
          <Route path="/reasons" element={<PageWrapper>{(nav) => <Reasons onNavigate={nav} />}</PageWrapper>} />
          <Route path="/about" element={<PageWrapper>{(nav) => <Reasons onNavigate={nav} />}</PageWrapper>} />
          <Route path="/interviews" element={<PageWrapper>{(nav) => <Interviews onNavigate={nav} />}</PageWrapper>} />
          <Route path="/surrey" element={<PageWrapper>{(nav) => <Surrey onNavigate={nav} />}</PageWrapper>} />
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
