import { Menu, X, ChevronDown, Search, FileText, Twitter, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navigation({ onNavigate: _onNavigate, currentPage: _currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [researchDropdownOpen, setResearchDropdownOpen] = useState(false);
  const [insightsDropdownOpen, setInsightsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [learnMobileExpanded, setLearnMobileExpanded] = useState(false);
  const [discoverMobileExpanded, setDiscoverMobileExpanded] = useState(false);
  const [researchMobileExpanded, setResearchMobileExpanded] = useState(false);
  const [insightsMobileExpanded, setInsightsMobileExpanded] = useState(false);
  const [toolsMobileExpanded, setToolsMobileExpanded] = useState(false);
  const [aboutMobileExpanded, setAboutMobileExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [_showSearchDropdown, setShowSearchDropdown] = useState(false);
  const learnDropdownRef = useRef<HTMLDivElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);
  const researchDropdownRef = useRef<HTMLDivElement>(null);
  const insightsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const topBannerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    { id: 'learn', label: 'LEARN', path: '/learn' },
    { id: 'discover', label: 'DISCOVER', path: '/discover' },
    { id: 'research', label: 'RESEARCH', path: '/research' },
    { id: 'insights', label: 'INSIGHTS', path: '/insights' },
    { id: 'tools', label: 'TOOLS', path: '/tools' },
    { id: 'about', label: 'ABOUT', path: '/about' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setLearnMobileExpanded(false);
    setDiscoverMobileExpanded(false);
    setResearchMobileExpanded(false);
    setInsightsMobileExpanded(false);
    setToolsMobileExpanded(false);
    setAboutMobileExpanded(false);
    setShowSearch(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
      setMobileMenuOpen(false);
    } else {
      // If empty, just navigate to library
      navigate('/library');
      setShowSearch(false);
      setMobileMenuOpen(false);
    }
  };

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  }, [showSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learnDropdownRef.current && !learnDropdownRef.current.contains(event.target as Node)) setLearnDropdownOpen(false);
      if (discoverDropdownRef.current && !discoverDropdownRef.current.contains(event.target as Node)) setDiscoverDropdownOpen(false);
      if (researchDropdownRef.current && !researchDropdownRef.current.contains(event.target as Node)) setResearchDropdownOpen(false);
      if (insightsDropdownRef.current && !insightsDropdownRef.current.contains(event.target as Node)) setInsightsDropdownOpen(false);
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) setToolsDropdownOpen(false);
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) setAboutDropdownOpen(false);
    };

    if (learnDropdownOpen || discoverDropdownOpen || researchDropdownOpen || insightsDropdownOpen || toolsDropdownOpen || aboutDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [learnDropdownOpen, discoverDropdownOpen, researchDropdownOpen, insightsDropdownOpen, toolsDropdownOpen, aboutDropdownOpen]);

  // Section active states for 6-hub structure
  const isLearnSection = location.pathname === '/learn' || location.pathname.startsWith('/what-is-lgr') || location.pathname.startsWith('/beginners-guide') || location.pathname.startsWith('/questions-and-answers') || location.pathname.startsWith('/glossary') || location.pathname.startsWith('/first-100-days');
  const isDiscoverSection = location.pathname === '/discover' || location.pathname.startsWith('/topics') || location.pathname.startsWith('/reorganisations') || location.pathname.startsWith('/podcast');
  const isResearchSection = location.pathname === '/research' || location.pathname.startsWith('/facts-and-data') || location.pathname.startsWith('/facts') || location.pathname.startsWith('/library') || location.pathname.startsWith('/lessons');
  const isInsightsSection = location.pathname.startsWith('/insights') || location.pathname.startsWith('/first-100-days') || location.pathname.startsWith('/news') || location.pathname.startsWith('/surrey');
  const isToolsSection = location.pathname.startsWith('/tools') || location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/library');
  const isAboutSection = location.pathname.startsWith('/about') || location.pathname.startsWith('/contact') || location.pathname.startsWith('/partnerships');

  return (
    <nav 
      ref={navRef}
      className="bg-white sticky top-0 z-50 border-b border-academic-neutral-300 relative" 
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gradient-to-r focus:from-teal-500 focus:via-cyan-500 focus:to-sky-500 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div ref={topBannerRef} className="border-b border-teal-900 bg-teal-800 py-0.5" style={{ paddingLeft: 0, paddingRight: 0, margin: 0 }}>
        <div className="layout-container relative" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="flex justify-between items-center text-[0.625rem] md:text-[0.6875rem] tracking-wider text-white/95 font-display font-medium" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>
            <div className="hidden md:block" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>EST. 2025 | Formerly the LGR Series</div>
            <div className="md:hidden text-[0.5rem]" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>EST. 2025 | Formerly the LGR Series</div>
            <div className="hidden sm:block text-[0.625rem] md:text-[0.6875rem] font-display font-medium text-white/95 text-center absolute left-1/2 -translate-x-1/2" style={{ lineHeight: '1.1' }}>{currentDate || 'Loading...'}</div>
            <div className="flex gap-2 sm:gap-3 text-[0.5rem] sm:text-[0.625rem]" style={{ margin: 0, padding: 0 }}>
              <Link
                to="/admin/login"
                aria-label="Members login"
                className="text-white hover:text-teal-200 transition-colors px-1.5 flex items-center justify-center"
                style={{ paddingTop: '2px', paddingBottom: '2px', minHeight: 'auto', lineHeight: '1.1', margin: 0 }}
              >
                MEMBERS LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div ref={mainContainerRef} className="layout-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div
          ref={logoContainerRef}
          className="flex items-center justify-between border-b border-academic-neutral-300 py-2 sm:py-3 gap-4"
          style={{ margin: 0, marginTop: '-2px' }}
        >
          <Link
            to="/"
            aria-label="LGR Initiative - Home"
            className="flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ margin: 0, padding: 0 }}
          >
            <img
              ref={logoImageRef}
              src="/LGR-Banner-Masthead.png"
              alt="LGR Initiative"
              className="nav-header-masthead-logo h-[51px] sm:h-[61px] md:h-[71px] w-auto max-h-[71px] object-contain"
              loading="eager"
              style={{ margin: 0, padding: 0, display: 'block' }}
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/subscribe"
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-[0.625rem] font-display font-bold tracking-wider rounded transition-colors whitespace-nowrap"
            >
              Subscribe
            </Link>
            <a
              href="https://x.com/LGRInitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white rounded transition-colors"
              aria-label="Follow on X (Twitter)"
            >
              <Twitter size={16} />
            </a>
            <a
              href="mailto:office@lgr-initiative.co.uk"
              className="w-8 h-8 flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white rounded transition-colors"
              aria-label="Email us"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="md:hidden py-1.5">
          <button
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="flex items-center gap-2 w-full justify-center p-3 hover:bg-academic-warm transition-colors min-h-[48px]"
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
                if (item.id === 'learn') {
                  return (
                    <div key={item.id}>
                      <button onClick={() => setLearnMobileExpanded(!learnMobileExpanded)} className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${isLearnSection ? 'text-teal-600 bg-teal-50' : 'text-academic-neutral-700 hover:bg-academic-warm'}`}>
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${learnMobileExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {learnMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link to="/what-is-lgr" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/what-is-lgr') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>What is LGR</Link>
                          <Link to="/beginners-guide" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/beginners-guide') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Beginners guide</Link>
                          <Link to="/questions-and-answers" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/questions-and-answers') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Questions and answers</Link>
                          <Link to="/glossary" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/glossary') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Glossary</Link>
                          <Link to="/first-100-days" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/first-100-days') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>First 100 Days</Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'discover') {
                  return (
                    <div key={item.id}>
                      <button onClick={() => setDiscoverMobileExpanded(!discoverMobileExpanded)} className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${isDiscoverSection ? 'text-teal-600 bg-teal-50' : 'text-academic-neutral-700 hover:bg-academic-warm'}`}>
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${discoverMobileExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {discoverMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link to="/topics" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname === '/topics' ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Topics</Link>
                          <Link to="/topics/governance-and-reform" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/topics/governance-and-reform') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Governance and Reform</Link>
                          <Link to="/topics/democratic-legitimacy" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/topics/democratic-legitimacy') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Democratic Legitimacy and Statecraft</Link>
                          <Link to="/topics/statecraft-and-system-design" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/topics/statecraft-and-system-design') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>System Design</Link>
                          <Link to="/reorganisations" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/reorganisations') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Reorganisations</Link>
                          <Link to="/podcast" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/podcast') || location.pathname.startsWith('/interviews') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Podcast</Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'research') {
                  return (
                    <div key={item.id}>
                      <button onClick={() => setResearchMobileExpanded(!researchMobileExpanded)} className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${isResearchSection ? 'text-teal-600 bg-teal-50' : 'text-academic-neutral-700 hover:bg-academic-warm'}`}>
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${researchMobileExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {researchMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link to="/facts-and-data" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname === '/facts-and-data' ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Facts and data</Link>
                          <Link to="/facts/key-facts" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/facts/key-facts') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Key facts</Link>
                          <Link to="/library" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/library') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Library</Link>
                          <Link to="/lessons" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/lessons') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Lessons</Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'insights') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setInsightsMobileExpanded(!insightsMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isInsightsSection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${insightsMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {insightsMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link to="/insights" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname === '/insights' && !location.pathname.startsWith('/insights/') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>All Insights</Link>
                          <Link to="/insights/reports" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/insights/reports') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Reports</Link>
                          <Link to="/insights" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/insights/') && !location.pathname.startsWith('/insights/reports') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Articles</Link>
                          <Link to="/news" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/news') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>News</Link>
                          <Link to="/surrey" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname === '/surrey' ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Surrey LGR Hub</Link>
                          <Link to="/surrey/lessons" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname === '/surrey/lessons' ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Lessons</Link>
                          <Link to="/surrey/area-profile" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/surrey/area-profile') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Area profile</Link>
                          <Link to="/surrey/election-tracker" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/surrey/election-tracker') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Election tracker</Link>
                          <Link to="/surrey/hub" onClick={handleNavClick} className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/surrey/hub') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Hub</Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'tools') {
                  return (
                    <div key={item.id}>
                      <button onClick={() => setToolsMobileExpanded(!toolsMobileExpanded)} className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${isToolsSection ? 'text-teal-600 bg-teal-50' : 'text-academic-neutral-700 hover:bg-academic-warm'}`}>
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${toolsMobileExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {toolsMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link to="/roadmap" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/roadmap') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Roadmap</Link>
                          <Link to="/library" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/library') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>Library</Link>
                          <Link to="/first-100-days" onClick={handleNavClick} className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${location.pathname.startsWith('/first-100-days') ? 'text-teal-700 bg-teal-100' : 'text-academic-neutral-600 hover:bg-academic-neutral-100'}`}>First 100 Days</Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'about') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setAboutMobileExpanded(!aboutMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isAboutSection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${aboutMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {aboutMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link
                            to="/about"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/about'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            About the LGR Initiative
                          </Link>
                          <Link
                            to="/about/leadership"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/about/leadership')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Leadership
                          </Link>
                          <Link
                            to="/about/partnership"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/about/partnership')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Partnership
                          </Link>
                          <Link
                            to="/about/contributors"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/about/contributors'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Contributors
                          </Link>
                          <Link
                            to="/about/contributors/contribute"
                            onClick={handleNavClick}
                            className={`block px-8 pl-12 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/about/contributors/contribute'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Contribute
                          </Link>
                          <Link
                            to="/contact"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/contact'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Contact
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Mobile Search */}
              <div className="border-t border-neutral-200 p-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search library..."
                    className="flex-1 px-3 py-2 text-sm border border-academic-neutral-300 rounded focus:outline-none focus:border-teal-500 bg-white text-academic-charcoal"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </form>
                {/* Mobile Search Dropdown Link */}
                <Link
                  to="/library"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-display font-bold tracking-wider text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded border border-academic-neutral-200"
                >
                  <FileText size={16} className="text-teal-600" />
                  <span>Materials Library</span>
                </Link>
              </div>
              
              <Link
                to="/subscribe"
                onClick={handleNavClick}
                className="mx-4 my-3 px-6 py-3 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white text-academic-sm font-display font-bold tracking-wider transition-all text-center rounded-xl shadow-md hover:shadow-xl hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98]"
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
