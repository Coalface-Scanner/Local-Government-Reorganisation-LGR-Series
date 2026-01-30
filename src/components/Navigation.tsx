import { Menu, X, ChevronDown, Search, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navigation({ onNavigate: _onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lgrHubDropdownOpen, setLgrHubDropdownOpen] = useState(false);
  const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);
  const [insightsDropdownOpen, setInsightsDropdownOpen] = useState(false);
  const [factsDropdownOpen, setFactsDropdownOpen] = useState(false);
  const [surreyDropdownOpen, setSurreyDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [lgrHubMobileExpanded, setLgrHubMobileExpanded] = useState(false);
  const [topicsMobileExpanded, setTopicsMobileExpanded] = useState(false);
  const [insightsMobileExpanded, setInsightsMobileExpanded] = useState(false);
  const [factsMobileExpanded, setFactsMobileExpanded] = useState(false);
  const [surreyMobileExpanded, setSurreyMobileExpanded] = useState(false);
  const [aboutMobileExpanded, setAboutMobileExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const lgrHubDropdownRef = useRef<HTMLDivElement>(null);
  const topicsDropdownRef = useRef<HTMLDivElement>(null);
  const insightsDropdownRef = useRef<HTMLDivElement>(null);
  const factsDropdownRef = useRef<HTMLDivElement>(null);
  const surreyDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const localGovernmentRef = useRef<HTMLHeadingElement>(null);
  const reorganisationRef = useRef<HTMLHeadingElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
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

  // Match Reorganisation width to Local Government width and align first/last letters
  useEffect(() => {
    const matchWidths = () => {
      if (localGovernmentRef.current && reorganisationRef.current) {
        const targetWidth = localGovernmentRef.current.offsetWidth;
        reorganisationRef.current.style.width = `${targetWidth}px`;
        
        // Calculate letter spacing to make both rows align at ends
        const reorgText = reorganisationRef.current.textContent || '';
        
        // Get computed styles
        const reorgStyle = window.getComputedStyle(reorganisationRef.current);
        
        // Calculate current widths without letter spacing
        const reorgChars = reorgText.length;
        
        // Adjust letter spacing to match widths
        
        // Calculate required letter spacing for reorganisation to match width
        const reorgCurrentLS = parseFloat(reorgStyle.letterSpacing) || 0;
        const reorgWidth = reorganisationRef.current.scrollWidth;
        
        if (reorgWidth < targetWidth && reorgChars > 0) {
          const additionalSpacing = (targetWidth - reorgWidth) / (reorgChars - 1);
          const newLS = reorgCurrentLS + additionalSpacing;
          reorganisationRef.current.style.letterSpacing = `${newLS}px`;
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      matchWidths();
      setTimeout(matchWidths, 100); // Also run after a short delay to ensure fonts loaded
    });
    
    window.addEventListener('resize', matchWidths);
    return () => window.removeEventListener('resize', matchWidths);
  }, []);


  const navItems = [
    { id: 'lgr-hub', label: 'LGR HUB', path: '/lgr-hub' },
    { id: 'topics', label: 'TOPICS', path: '/topics' },
    { id: 'insights', label: 'INSIGHTS', path: '/insights' },
    { id: 'facts', label: 'FACTS & DATA', path: '/facts-and-data' },
    { id: 'lessons', label: 'LESSONS', path: '/lessons' },
    { id: 'surrey', label: 'FOCUS: SURREY', path: '/surrey' },
    { id: 'about', label: 'ABOUT', path: '/about' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setLgrHubMobileExpanded(false);
    setTopicsMobileExpanded(false);
    setInsightsMobileExpanded(false);
    setFactsMobileExpanded(false);
    setSurreyMobileExpanded(false);
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

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
      setSearchQuery('');
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
      if (lgrHubDropdownRef.current && !lgrHubDropdownRef.current.contains(event.target as Node)) {
        setLgrHubDropdownOpen(false);
      }
      if (topicsDropdownRef.current && !topicsDropdownRef.current.contains(event.target as Node)) {
        setTopicsDropdownOpen(false);
      }
      if (insightsDropdownRef.current && !insightsDropdownRef.current.contains(event.target as Node)) {
        setInsightsDropdownOpen(false);
      }
      if (factsDropdownRef.current && !factsDropdownRef.current.contains(event.target as Node)) {
        setFactsDropdownOpen(false);
      }
      if (surreyDropdownRef.current && !surreyDropdownRef.current.contains(event.target as Node)) {
        setSurreyDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };

    if (lgrHubDropdownOpen || topicsDropdownOpen || insightsDropdownOpen || factsDropdownOpen || surreyDropdownOpen || aboutDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lgrHubDropdownOpen, topicsDropdownOpen, insightsDropdownOpen, factsDropdownOpen, surreyDropdownOpen, aboutDropdownOpen]);

  // Check if current page is under LGR Hub section
  const isLGRHubSection = location.pathname.startsWith('/lgr-hub') || location.pathname.startsWith('/lgr-journey-2026') || location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/tools') || location.pathname.startsWith('/interviews') || location.pathname.startsWith('/podcast') || location.pathname === '/';
  // Check if current page is under topics section
  const isTopicsSection = location.pathname.startsWith('/topics');
  // Check if current page is under insights section
  const isInsightsSection = location.pathname.startsWith('/insights') || location.pathname.startsWith('/100days') || location.pathname.startsWith('/news');
  // Check if current page is under facts section (check /facts-and-data first to avoid matching /facts)
  const isFactsSection = location.pathname.startsWith('/facts-and-data') || (location.pathname.startsWith('/facts') && !location.pathname.startsWith('/facts-and-data')) || location.pathname.startsWith('/materials') || location.pathname.startsWith('/councils');
  // Check if current page is under surrey section
  const isSurreySection = location.pathname.startsWith('/surrey');
  // Check if current page is under about section
  const isAboutSection = location.pathname.startsWith('/about') || location.pathname.startsWith('/contact');

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
      <div ref={topBannerRef} className="border-b border-academic-neutral-300 bg-academic-warm" style={{ padding: 0, margin: 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="flex justify-between items-center text-[0.625rem] md:text-[0.6875rem] tracking-wider text-academic-neutral-700 font-display font-medium" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>
            <div className="hidden md:block" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>EST. 2025 | A <a href="https://www.coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-academic-charcoal transition-colors underline">COALFACE</a> Insight Project</div>
            <div className="md:hidden text-[0.5rem]" style={{ lineHeight: '1.1', margin: 0, padding: 0 }}>EST. 2025</div>
            <div className="hidden sm:block text-[0.625rem] md:text-[0.6875rem] font-display font-medium text-academic-neutral-600 text-center absolute left-1/2 -translate-x-1/2" style={{ lineHeight: '1.1' }}>{currentDate || 'Loading...'}</div>
            <div className="flex gap-2 sm:gap-3 text-[0.5rem] sm:text-[0.625rem]" style={{ margin: 0, padding: 0 }}>
              <Link
                to="/admin/login"
                aria-label="Members login"
                className="hover:text-academic-charcoal transition-colors px-1.5 flex items-center justify-center"
                style={{ paddingTop: '2px', paddingBottom: '2px', minHeight: 'auto', lineHeight: '1.1', margin: 0 }}
              >
                MEMBERS LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div ref={mainContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div 
          ref={logoContainerRef}
          className="flex items-center justify-center border-b border-academic-neutral-300" 
          style={{ paddingTop: 0, paddingBottom: 0, margin: 0, marginTop: '-2px' }}
        >
          <Link
            to="/"
            aria-label="Go to homepage"
            className="flex items-center hover:opacity-90 transition-opacity"
            style={{ margin: 0, padding: 0, gap: '0.5rem' }}
          >
            {/* LGR High Red Logo */}
            <div className="flex-shrink-0 flex items-center" style={{ margin: 0, padding: 0 }}>
              <img 
                src="/LGR_HighRed_Logo.png" 
                alt="LGR High Red Logo" 
                className="h-[2.4rem] sm:h-[3rem] md:h-[3.6rem] w-auto object-contain"
                loading="eager"
                style={{ display: 'block', margin: 0, padding: 0 }}
              />
            </div>
            
            {/* LGR Logo */}
            <div className="flex-shrink-0 flex items-center h-[3.6rem] sm:h-[4.5rem] md:h-[5.4rem] overflow-hidden relative" style={{ margin: 0, padding: 0 }}>
              <div style={{ position: 'absolute', top: '-20%', left: 0, right: 0, height: '140%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  ref={logoImageRef}
                  src="/LGR Podcast Logo Trial.png" 
                  alt="LGR Logo" 
                  className="h-[6rem] sm:h-[7.5rem] md:h-[9rem] w-auto object-contain"
                  loading="eager"
                  style={{ display: 'block', margin: 0, padding: 0 }}
                />
              </div>
            </div>
            
            {/* Text Stack */}
            <div className="flex flex-col justify-center gap-1">
              <h1 
                ref={localGovernmentRef}
                className="text-base sm:text-lg md:text-xl font-display font-black text-academic-charcoal whitespace-nowrap"
                style={{ letterSpacing: '0.05em', lineHeight: '1', margin: 0, padding: 0 }}
              >
                Local Government
              </h1>
              <h2 
                ref={reorganisationRef}
                className="text-base sm:text-lg md:text-xl text-teal-700 whitespace-nowrap"
                style={{ textAlign: 'left', lineHeight: '1', margin: 0, padding: 0 }}
              >
                <span className="font-serif italic">Reorganisation</span>{' '}
                <span className="font-display not-italic">|</span>{' '}
                <span className="font-serif italic">LGR Series</span>
              </h2>
            </div>
          </Link>
        </div>

        <div ref={menuBarRef} className="hidden md:flex justify-center items-center space-x-0.5 flex-nowrap" style={{ paddingTop: 0, paddingBottom: '1px', margin: 0, marginTop: '-1px' }}>
          {navItems.map((item) => {
            if (item.id === 'lgr-hub') {
              return (
                <div
                  key={item.id}
                  ref={lgrHubDropdownRef}
                  className="relative"
                  onMouseEnter={() => setLgrHubDropdownOpen(true)}
                  onMouseLeave={() => setLgrHubDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isLGRHubSection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${lgrHubDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {lgrHubDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/lgr-hub"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/lgr-hub' || location.pathname === '/'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Overview
                      </Link>
                      <Link
                        to="/roadmap"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/lgr-journey-2026')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Roadmap
                      </Link>
                      <Link
                        to="/tools"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/tools')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Tools
                      </Link>
                      <Link
                        to="/podcast"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/podcast') || location.pathname.startsWith('/interviews')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Podcast
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            if (item.id === 'topics') {
              return (
                <div
                  key={item.id}
                  ref={topicsDropdownRef}
                  className="relative"
                  onMouseEnter={() => setTopicsDropdownOpen(true)}
                  onMouseLeave={() => setTopicsDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isTopicsSection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${topicsDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {topicsDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/topics/governance-and-reform"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/topics/governance-and-reform'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Governance and Reform
                      </Link>
                      <Link
                        to="/topics/democratic-legitimacy"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/topics/democratic-legitimacy'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Democratic Legitimacy
                      </Link>
                      <Link
                        to="/topics/statecraft-and-system-design"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/topics/statecraft-and-system-design'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Statecraft and System Design
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <Link
                        to="/topics"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/topics'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        By geography
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            if (item.id === 'insights') {
              return (
                <div
                  key={item.id}
                  ref={insightsDropdownRef}
                  className="relative"
                  onMouseEnter={() => setInsightsDropdownOpen(true)}
                  onMouseLeave={() => setInsightsDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isInsightsSection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${insightsDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {insightsDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/insights"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/insights' && !location.pathname.startsWith('/insights/reports') && !location.pathname.startsWith('/insights/')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        All Insights
                      </Link>
                      <Link
                        to="/insights"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/insights/') && !location.pathname.startsWith('/insights/reports')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Articles
                      </Link>
                      <Link
                        to="/news"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/news')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        News
                      </Link>
                      <Link
                        to="/podcast"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/podcast') || location.pathname.startsWith('/interviews')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Interviews
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            if (item.id === 'facts') {
              return (
                <div
                  key={item.id}
                  ref={factsDropdownRef}
                  className="relative"
                  onMouseEnter={() => setFactsDropdownOpen(true)}
                  onMouseLeave={() => setFactsDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isFactsSection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${factsDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {factsDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/facts"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/facts') && !location.pathname.startsWith('/facts-and-data')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Key Facts
                      </Link>
                      <Link
                        to="/materials"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/materials')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Materials & Datasets
                      </Link>
                      <Link
                        to="/councils"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/councils')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Council Map & Profiles
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
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
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isSurreySection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${surreyDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {surreyDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/surrey"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/surrey'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Overview
                      </Link>
                      <Link
                        to="/surrey/election-tracker"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/surrey/election-tracker')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Election Tracker
                      </Link>
                      <Link
                        to="/surrey/hub"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname.startsWith('/surrey/hub')
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Surrey Hub
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            if (item.id === 'about') {
              return (
                <div
                  key={item.id}
                  ref={aboutDropdownRef}
                  className="relative"
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center gap-0.5 whitespace-nowrap ${
                      isAboutSection
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-academic-neutral-700 hover:text-academic-charcoal'
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  
                  {aboutDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-neutral-200/50 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/about"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/about'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        About the LGR Series
                      </Link>
                      <Link
                        to="/editor/rowan-cole"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/editor/rowan-cole'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Editor Profile
                      </Link>
                      <Link
                        to="/about/contributors"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/about/contributors'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Contributors
                      </Link>
                      <Link
                        to="/contact"
                        className={`block px-4 py-2 text-academic-xs font-display font-bold tracking-wider transition-colors ${
                          location.pathname === '/contact'
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        Contact
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            // Lessons - no dropdown
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`px-2 py-1.5 text-[0.625rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[24px] flex items-center justify-center whitespace-nowrap ${
                  location.pathname.startsWith('/lessons')
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-academic-neutral-700 hover:text-academic-charcoal'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          {/* Search Button */}
          <div className="relative ml-2">
            {showSearch ? (
              <div className="relative" onMouseLeave={() => {
                if (!searchQuery.trim()) {
                  setTimeout(() => {
                    setShowSearch(false);
                    setShowSearchDropdown(false);
                  }, 200);
                }
              }}>
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => setShowSearchDropdown(true)}
                    onBlur={(e) => {
                      // Don't close if clicking on dropdown
                      const relatedTarget = e.relatedTarget as Node;
                      const dropdown = e.currentTarget.parentElement?.querySelector('[data-search-dropdown]');
                      if (dropdown && dropdown.contains(relatedTarget)) {
                        return;
                      }
                      if (!searchQuery.trim()) {
                        setTimeout(() => {
                          setShowSearch(false);
                          setShowSearchDropdown(false);
                        }, 200);
                      }
                    }}
                    placeholder="Search..."
                    className="px-2 py-1 text-[0.625rem] font-display font-bold tracking-wider border border-academic-neutral-300 rounded focus:outline-none focus:border-teal-500 bg-white text-academic-charcoal min-w-[120px]"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-academic-neutral-700 hover:text-teal-600 transition-colors"
                    aria-label="Submit search"
                  >
                    <Search size={14} />
                  </button>
                </form>
                {/* Search Dropdown */}
                {showSearchDropdown && (
                  <div 
                    data-search-dropdown
                    className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-academic-neutral-200 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Link
                      to="/materials"
                      onClick={() => {
                        setShowSearch(false);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-academic-xs font-display font-bold tracking-wider text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      <FileText size={14} className="text-teal-600" />
                      <span>Materials Library</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="px-2 py-1.5 text-academic-neutral-700 hover:text-academic-charcoal transition-colors min-h-[24px] flex items-center justify-center"
                aria-label="Open search"
              >
                <Search size={14} />
              </button>
            )}
          </div>
          
          <Link
            to="/subscribe"
            className="ml-2 px-3 py-1.5 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white text-[0.625rem] font-display font-bold tracking-wider transition-all min-h-[24px] flex items-center justify-center whitespace-nowrap rounded-xl shadow-md hover:shadow-xl hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            SUBSCRIBE
          </Link>
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
                if (item.id === 'lgr-hub') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setLgrHubMobileExpanded(!lgrHubMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isLGRHubSection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${lgrHubMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {lgrHubMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link
                            to="/lgr-hub"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/lgr-hub' || location.pathname === '/'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Overview
                          </Link>
                          <Link
                            to="/roadmap"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/lgr-journey-2026')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Roadmap
                          </Link>
                          <Link
                            to="/tools"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/tools')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Tools
                          </Link>
                          <Link
                            to="/podcast"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/podcast') || location.pathname.startsWith('/interviews')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Podcast
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'topics') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setTopicsMobileExpanded(!topicsMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isTopicsSection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${topicsMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {topicsMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link
                            to="/topics/governance-and-reform"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/topics/governance-and-reform'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Governance and Reform
                          </Link>
                          <Link
                            to="/topics/democratic-legitimacy"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/topics/democratic-legitimacy'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Democratic Legitimacy
                          </Link>
                          <Link
                            to="/topics/statecraft-and-system-design"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/topics/statecraft-and-system-design'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Statecraft and System Design
                          </Link>
                          <div className="border-t border-academic-neutral-300 my-1" />
                          <Link
                            to="/topics"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/topics'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            By geography
                          </Link>
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
                          <Link
                            to="/insights"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/insights' && !location.pathname.startsWith('/insights/')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            All Insights
                          </Link>
                          <Link
                            to="/insights"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/insights/') && !location.pathname.startsWith('/insights/reports')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Articles
                          </Link>
                          <Link
                            to="/news"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/news')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            News
                          </Link>
                          <Link
                            to="/podcast"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/podcast') || location.pathname.startsWith('/interviews')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Interviews
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'facts') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setFactsMobileExpanded(!factsMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isFactsSection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${factsMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {factsMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link
                            to="/facts"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/facts') && !location.pathname.startsWith('/facts-and-data')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Key Facts
                          </Link>
                          <Link
                            to="/materials"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/materials')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Materials & Datasets
                          </Link>
                          <Link
                            to="/councils"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/councils')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Council Map & Profiles
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.id === 'surrey') {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setSurreyMobileExpanded(!surreyMobileExpanded)}
                        className={`w-full px-4 py-3 text-sm font-bold tracking-wider text-left border-b border-neutral-100 transition-colors flex items-center justify-between ${
                          isSurreySection
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-academic-neutral-700 hover:bg-academic-warm'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${surreyMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {surreyMobileExpanded && (
                        <div className="bg-academic-warm border-b border-academic-neutral-200">
                          <Link
                            to="/surrey"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/surrey'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Overview
                          </Link>
                          <Link
                            to="/surrey/election-tracker"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/surrey/election-tracker')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Election Tracker
                          </Link>
                          <Link
                            to="/surrey/hub"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname.startsWith('/surrey/hub')
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Surrey Hub
                          </Link>
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
                            About the LGR Series
                          </Link>
                          <Link
                            to="/editor/rowan-cole"
                            onClick={handleNavClick}
                            className={`block px-8 py-2 text-sm font-bold tracking-wider text-left transition-colors ${
                              location.pathname === '/editor/rowan-cole'
                                ? 'text-teal-700 bg-teal-100'
                                : 'text-academic-neutral-600 hover:bg-academic-neutral-100'
                            }`}
                          >
                            Editor Profile
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
                // Lessons - no dropdown
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`px-4 py-3 text-academic-sm font-display font-bold tracking-wider text-left border-b border-academic-neutral-200 transition-colors ${
                      location.pathname.startsWith('/lessons')
                        ? 'text-teal-700 bg-teal-50'
                        : 'text-academic-neutral-700 hover:bg-academic-warm'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
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
                  to="/materials"
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
