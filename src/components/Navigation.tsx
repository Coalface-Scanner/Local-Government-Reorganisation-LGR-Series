import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navigation({ onNavigate: _onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [surreyDropdownOpen, setSurreyDropdownOpen] = useState(false);
  const [surreyMobileExpanded, setSurreyMobileExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const surreyDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setCurrentDate(formatted);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'news', label: 'NEWS', path: '/news' },
    { id: 'insights', label: 'INSIGHTS', path: '/insights' },
    { id: 'facts', label: 'FACTS & DATA', path: '/facts' },
    { id: 'lessons', label: 'LESSONS', path: '/lessons' },
    { id: '100days', label: '100 DAYS', path: '/100days' },
    { id: 'surrey', label: 'FOCUS: SURREY', path: '/surrey' },
    { id: 'about', label: 'ABOUT / CONTACT', path: '/about' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setSurreyMobileExpanded(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (surreyDropdownRef.current && !surreyDropdownRef.current.contains(event.target as Node)) {
        setSurreyDropdownOpen(false);
      }
    };

    if (surreyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [surreyDropdownOpen]);

  // Check if current page is under surrey section
  const isSurreySection = location.pathname.startsWith('/surrey');

  return (
    <nav 
      className="bg-white shadow-sm sticky top-0 z-50 border-b border-neutral-200 relative" 
      style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(0,0,0,0.006) 0.5px, transparent 0)
        `,
        backgroundSize: '32px 32px',
        backgroundColor: '#fefefe'
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-700 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0.5">
          <div className="flex justify-between items-center text-xs tracking-wider text-neutral-700 font-medium">
            <div className="hidden md:block">EST. 2025 | A <a href="https://www.coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors underline">COALFACE</a> Insight Project</div>
            <div className="md:hidden text-[10px]">EST. 2025</div>
            <div className="hidden sm:block text-xs font-medium text-neutral-600 text-center flex-1 mx-4">{currentDate || 'Loading...'}</div>
            <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-xs">
              <Link
                to="/admin/login"
                aria-label="Members login"
                className="hover:text-neutral-900 transition-colors px-3 py-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                MEMBERS LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-1.5 border-b border-neutral-200">
          <Link
            to="/"
            aria-label="Go to homepage"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight mb-0.5 text-center leading-tight">
              <span className="block sm:inline">Local Government </span>
              <span className="block sm:inline font-serif italic text-teal-700">Reorganisation</span>
            </h1>
          </Link>
          <div className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest text-neutral-700 mt-0.5 font-medium text-center max-w-6xl mx-auto px-4">
            <div className="sm:whitespace-nowrap">Putting communities and councillors back at the heart of local decision making</div>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center space-x-1 py-1.5">
          {navItems.map((item) => {
            if (item.id === 'surrey') {
              return (
                <div
                  key={item.id}
                  ref={surreyDropdownRef}
                  className="relative"
                  onMouseEnter={() => setSurreyDropdownOpen(true)}
                  onMouseLeave={() => setSurreyDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-3 text-xs font-bold tracking-wider transition-all duration-200 min-h-[48px] flex items-center justify-center gap-1 ${
                      isSurreySection
                        ? 'text-teal-700 border-b-2 border-teal-700'
                        : 'text-neutral-700 hover:text-neutral-900'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${surreyDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {surreyDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/surrey"
                        className={`block px-4 py-2 text-xs font-bold tracking-wider transition-colors ${
                          location.pathname === '/surrey'
                            ? 'text-teal-700 bg-teal-50'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        Focus: Surrey
                      </Link>
                      <Link
                        to="/surrey/election-tracker"
                        className={`block px-4 py-2 text-xs font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/surrey/election-tracker')
                            ? 'text-teal-700 bg-teal-50'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        Election Tracker
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-3 text-xs font-bold tracking-wider transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center ${
                  currentPage === item.id
                    ? 'text-teal-700 border-b-2 border-teal-700'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/subscribe"
            className="ml-4 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wider rounded-full transition-all min-h-[48px] flex items-center justify-center"
          >
            SUBSCRIBE
          </Link>
        </div>

        <div className="md:hidden py-1.5">
          <button
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="flex items-center gap-2 w-full justify-center p-3 hover:bg-neutral-50 rounded transition-colors min-h-[48px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="text-sm font-medium">MENU</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-200">
            <div className="flex flex-col">
              {navItems.map((item) => {
                if (item.id === 'surrey') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setSurreyMobileExpanded(!surreyMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isSurreySection
                            ? 'text-teal-700 bg-teal-50'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${surreyMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {surreyMobileExpanded && (
                        <div className="bg-neutral-50 border-b border-neutral-100">
                          <Link
                            to="/surrey"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/surrey'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            Focus: Surrey
                          </Link>
                          <Link
                            to="/surrey/election-tracker"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/surrey/election-tracker')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            Election Tracker
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors ${
                      currentPage === item.id
                        ? 'text-teal-700 bg-teal-50'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/subscribe"
                onClick={handleNavClick}
                className="mx-4 my-3 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold tracking-wider rounded-full transition-all text-center"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
