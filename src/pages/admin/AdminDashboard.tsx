import { useState, useEffect } from 'react';
import { LogOut, Home, FileText, List, BookOpen, MessageSquare, Video, Layout, Bell, HelpCircle, Newspaper, Edit3, Menu, X, Settings, Globe, Tag, Archive } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MaterialsEditor from './MaterialsEditor';
import HomeContentEditor from './HomeContentEditor';
import FactsEditor from './FactsEditor';
import LessonsEditor from './LessonsEditor';
import ReasonsEditor from './ReasonsEditor';
import InterviewsEditor from './InterviewsEditor';
import SiteUpdatesEditor from './SiteUpdatesEditor';
import FAQsEditor from './FAQsEditor';
import NewsEditor from './NewsEditor';
import AdminArticles from './AdminArticles';
import FooterEditor from './FooterEditor';
import PageContentEditor from './PageContentEditor';
import TopicPagesEditor from './TopicPagesEditor';
import AboutPagesEditor from './AboutPagesEditor';
import ContactPageEditor from './ContactPageEditor';
import SubscribePageEditor from './SubscribePageEditor';
import ArchiveManager from './ArchiveManager';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      onNavigate('admin/login');
    }
  }, [user, loading, onNavigate]);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'articles', label: 'Articles', icon: Edit3 },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'updates', label: 'Site Updates', icon: Bell },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'facts', label: 'Facts', icon: List },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'reasons', label: 'Reasons', icon: MessageSquare },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'footer', label: 'Footer', icon: Settings },
    { id: 'page-content', label: 'Page Content', icon: Globe },
    { id: 'topics', label: 'Topic Pages', icon: Tag },
    { id: 'about', label: 'About Pages', icon: BookOpen },
    { id: 'contact', label: 'Contact Page', icon: MessageSquare },
    { id: 'subscribe', label: 'Subscribe Page', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Welcome to the Admin Dashboard</h2>
            <p className="text-slate-600 text-lg">
              Manage all website content from this centralized dashboard. Select a section from the menu to get started.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {menuItems.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-slate-400 transition-all text-left group"
                  >
                    <Icon className="w-8 h-8 text-slate-600 group-hover:text-slate-900 mb-3" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.label}</h3>
                    <p className="text-sm text-slate-600">Manage {item.label.toLowerCase()} content</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'articles':
        return <AdminArticles onNavigate={onNavigate} />;
      case 'home':
        return <HomeContentEditor />;
      case 'news':
        return <NewsEditor />;
      case 'updates':
        return <SiteUpdatesEditor />;
      case 'faqs':
        return <FAQsEditor />;
      case 'materials':
        return <MaterialsEditor />;
      case 'facts':
        return <FactsEditor />;
      case 'lessons':
        return <LessonsEditor />;
      case 'reasons':
        return <ReasonsEditor />;
      case 'interviews':
        return <InterviewsEditor />;
      case 'archive':
        return <ArchiveManager />;
      case 'footer':
        return <FooterEditor />;
      case 'page-content':
        return <PageContentEditor />;
      case 'topics':
        return <TopicPagesEditor />;
      case 'about':
        return <AboutPagesEditor />;
      case 'contact':
        return <ContactPageEditor />;
      case 'subscribe':
        return <SubscribePageEditor />;
      default:
        return null;
    }
  };

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-bold">CMS Admin</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          className={`w-64 bg-slate-900 min-h-screen text-white p-6 fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="mb-8">
            <h1 className="text-xl font-bold">CMS Admin</h1>
            <p className="text-sm text-slate-400 mt-1 break-words">{user.email}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] ${
                    activeSection === item.id
                      ? 'bg-white text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all min-h-[48px]"
            >
              <Home className="w-5 h-5 shrink-0" />
              <span className="font-medium">View Website</span>
            </button>
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all min-h-[48px]"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="lg:ml-64 flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
