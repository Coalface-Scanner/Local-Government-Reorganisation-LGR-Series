import { useState, useEffect } from 'react';
import { LogOut, Home, FileText, List, BookOpen, MessageSquare, Video, Layout, Bell, HelpCircle, Newspaper } from 'lucide-react';
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

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
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
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'updates', label: 'Site Updates', icon: Bell },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'facts', label: 'Facts', icon: List },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'reasons', label: 'Reasons', icon: MessageSquare },
    { id: 'interviews', label: 'Interviews', icon: Video },
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-64 bg-slate-900 min-h-screen text-white p-6 fixed left-0 top-0">
          <div className="mb-8">
            <h1 className="text-xl font-bold">CMS Admin</h1>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-white text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <button
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">View Website</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
