import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Twitter, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { getStandardPrimaryNavItems, getSecondaryNavItemsForPrimaryNav } from '../utils/pageNavigation';
import { getBreadcrumbItems } from '../utils/breadcrumbRoutes';
import Breadcrumbs from './Breadcrumbs';

export interface NavItem {
  label: string;
  path: string;
  active?: boolean;
}

export interface HeroCta {
  label: string;
  to: string;
}

interface PageBannerProps {
  isHomepage?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroLabel?: string;
  /** Learn hub: supporting line below subtitle (lighter weight) */
  heroSupportingLine?: string;
  /** Learn hub: primary CTA (accent button) */
  heroPrimaryCta?: HeroCta;
  /** Learn hub: secondary CTA (ghost/outline) */
  heroSecondaryCta?: HeroCta;
  /** When a hub key, hero uses hub bg image, deep teal overlay, max-width 1100px, and optional CTAs */
  heroVariant?: 'default' | 'learn' | 'discover' | 'research' | 'tools' | 'about';
  primaryNavItems?: NavItem[];
  secondaryNavItems?: NavItem[];
  currentPath?: string;
  /** Label for the current page in breadcrumbs (e.g. article title, person name, glossary term) */
  breadcrumbCurrentLabel?: string;
}

export default function PageBanner({
  isHomepage = false,
  heroTitle,
  heroSubtitle,
  heroLabel,
  heroSupportingLine,
  heroPrimaryCta,
  heroSecondaryCta,
  heroVariant = 'default',
  primaryNavItems,
  secondaryNavItems,
  currentPath,
  breadcrumbCurrentLabel,
  breadcrumbVariant = 'full',
}: PageBannerProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const navHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelNavHide = () => {
    if (navHideTimeoutRef.current) {
      clearTimeout(navHideTimeoutRef.current);
      navHideTimeoutRef.current = null;
    }
  };

  const scheduleNavHide = () => {
    cancelNavHide();
    navHideTimeoutRef.current = setTimeout(() => {
      const isOverPrimary = document.querySelector('[data-primary-nav-item]:hover') !== null;
      const isOverSecondary = document.querySelector('.secondary-nav:hover') !== null;
      if (!isOverPrimary && !isOverSecondary) {
        setHoveredPrimaryNav(null);
      }
      navHideTimeoutRef.current = null;
    }, 350);
  };
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-GB', options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Helper function to wrap hyphenated words in non-breaking spans
  const wrapHyphenatedWords = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    // Match words with hyphens (e.g., "re-organisation", "decision-makers")
    const regex = /\b(\w+-\w+(?:-\w+)*)\b/g;
    let lastIndex = 0;
    let match;
    let keyCounter = 0;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the hyphenated word wrapped in a span
      parts.push(
        <span key={`hyphen-${keyCounter++}`} data-hyphenated style={{ whiteSpace: 'nowrap' }}>
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : [text];
  };
  
  // Use standard primary nav items if not provided
  const standardPrimaryNav = getStandardPrimaryNavItems();
  const displayPrimaryNav = primaryNavItems && primaryNavItems.length > 0 ? primaryNavItems : standardPrimaryNav;

  // Wide hero (70vw) only on content pages; narrow (max-w-4xl) on home, hub, and special pages
  const pathname = location?.pathname ?? '';
  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  const hubPaths = new Set(['/', '/learn', '/discover', '/research', '/lgr-hub', '/surrey/hub', '/about', '/lessons', '/facts-and-data', '/insights', '/topics', '/library', '/subscribe', '/surrey']);
  const isHubOrSpecial = isHomepage || hubPaths.has(pathname) || ['admin', 'councils', 'council-profiles', 'contact', 'unsubscribe'].includes(firstSegment);
  const heroTextMaxWidth = isHubOrSpecial ? 'max-w-4xl' : 'max-w-[70vw]';
  
  // All six hubs have dropdowns (grey sub-nav)
  const hasDropdown = (navId: string): boolean => {
    return ['learn', 'discover', 'research', 'insights', 'tools', 'about'].includes(navId);
  };

  // Get nav ID from label/path (six hubs)
  const getNavId = (label: string, path: string): string => {
    const labelLower = label.toLowerCase();
    if (labelLower === 'learn' || path === '/learn') return 'learn';
    if (labelLower === 'discover' || path === '/discover') return 'discover';
    if (labelLower === 'research' || path === '/research') return 'research';
    if (labelLower === 'insights' || path === '/insights') return 'insights';
    if (labelLower === 'tools' || path === '/tools') return 'tools';
    if (labelLower === 'about' || path === '/about') return 'about';
    return '';
  };

  // Determine which primary nav section the current page belongs to (six hubs)
  const getCurrentPrimaryNavId = (): string | null => {
    const current = currentPath || location.pathname;
    if (current === '/learn' || current.startsWith('/what-is-lgr') || current.startsWith('/beginners-guide') || current.startsWith('/questions-and-answers') || current.startsWith('/glossary') || current.startsWith('/first-100-days')) return 'learn';
    if (current === '/tools' || current.startsWith('/roadmap') || current.startsWith('/surrey/election-tracker') || current.startsWith('/surrey/simulator')) return 'tools';
    if (current === '/discover' || current.startsWith('/topics') || current.startsWith('/reorganisations') || current.startsWith('/councils') || current.startsWith('/council-profiles') || current.startsWith('/surrey')) return 'discover';
    if (current === '/research' || current.startsWith('/facts-and-data') || current.startsWith('/facts') || current.startsWith('/library') || current.startsWith('/lessons')) return 'research';
    if (current.startsWith('/insights') || current.startsWith('/news') || current.startsWith('/podcast') || current.startsWith('/interviews')) return 'insights';
    if (current.startsWith('/about') || current.startsWith('/contact') || current.startsWith('/subscribe')) return 'about';
    if (current === '/') return null;
    return null;
  };
  
  // Determine which primary nav to show secondary nav for (only on hover, not on matching page)
  const activePrimaryNavForSecondary = hoveredPrimaryNav;
  
  // Get secondary nav items based on hovered primary nav item only
  const displaySecondaryNav = activePrimaryNavForSecondary && hasDropdown(activePrimaryNavForSecondary)
    ? getSecondaryNavItemsForPrimaryNav(activePrimaryNavForSecondary, currentPath || location.pathname)
    : [];
  
  // Check if current path matches a primary nav item (six hubs)
  const isActivePrimaryNav = (path: string, label: string): boolean => {
    const current = currentPath || location.pathname;
    const navId = getNavId(label, path);

    switch (navId) {
      case 'learn':
        return current === '/learn' || current.startsWith('/what-is-lgr') || current.startsWith('/beginners-guide') || current.startsWith('/questions-and-answers') || current.startsWith('/glossary') || current.startsWith('/first-100-days');
      case 'discover':
        return current === '/discover' || current.startsWith('/topics') || current.startsWith('/reorganisations') || current.startsWith('/councils') || current.startsWith('/council-profiles') || current.startsWith('/surrey');
      case 'research':
        return current === '/research' || current.startsWith('/facts-and-data') || current.startsWith('/facts') || current.startsWith('/library') || current.startsWith('/lessons');
      case 'insights':
        return current.startsWith('/insights') || current.startsWith('/news') || current.startsWith('/podcast') || current.startsWith('/interviews');
      case 'tools':
        return current === '/tools' || current.startsWith('/roadmap') || current.startsWith('/surrey/election-tracker') || current.startsWith('/surrey/simulator');
      case 'about':
        return current.startsWith('/about') || current.startsWith('/contact') || current.startsWith('/subscribe');
      default:
        return current === path || current.startsWith(path + '/');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    } else {
      navigate('/library');
      setShowSearch(false);
    }
  };

  // Mission statement for homepage
  const missionStatement = "The LGR Initiative provides independent analysis of local government reorganisation, ensuring new unitary councils are governable, legitimate and capable of delivering services sustainably, creating the conditions for meaningful devolution.";

  return (
    <div className="banner-full-width" data-full-width-banner>
      <div className="bg-white border-b border-academic-neutral-300">
      {/* Top Stripe - same dark green as nav bar */}
      <div className="border-b border-teal-900 bg-teal-800 py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center text-[0.625rem] md:text-[0.6875rem] tracking-wider text-white/90 font-display font-medium" style={{ lineHeight: '1.1' }}>
            <div className="hidden md:block">
              EST. 2005 AS{' '}
              <Link
                to="/about"
                className="text-white hover:text-white/80 transition-colors underline"
              >
                LGR SERIES
              </Link>
            </div>
            <div className="md:hidden text-[0.5rem]">EST. 2005 AS <Link to="/about" className="text-white underline">LGR SERIES</Link></div>
            <div className="hidden sm:block text-[0.625rem] md:text-[0.6875rem] font-display font-medium text-white/90 text-center absolute left-1/2 -translate-x-1/2" style={{ lineHeight: '1.1' }}>
              {currentDate || 'Loading...'}
            </div>
            <div className="flex gap-2 sm:gap-3 text-[0.5rem] sm:text-[0.625rem]">
              <Link
                to="/admin/login"
                aria-label="Members login"
                className="text-white hover:text-white/80 transition-colors px-1.5 flex items-center justify-center"
                style={{ paddingTop: '2px', paddingBottom: '2px', minHeight: 'auto', lineHeight: '1.1' }}
              >
                MEMBERS LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0">
              <img 
                src="/LGR_HighRed_Logo.png" 
                alt="LGR Series" 
                className="lgr-highred-logo h-7 sm:h-8 w-auto"
                loading="eager"
                decoding="sync"
                style={{
                  height: '28px',
                  maxHeight: '28px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Link>
            <div className="hidden sm:block border-l border-academic-neutral-300 pl-3 sm:pl-4 min-w-0">
              <p className="text-academic-xs sm:text-academic-sm text-academic-neutral-600 font-serif italic truncate">
                Insight on local governance reform & devolution
              </p>
            </div>
          </div>

          {/* Right Side: Subscribe, Social, Search - enlarged */}
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end flex-shrink-0">
            {/* Subscribe Button */}
            <Link
              to="/subscribe"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-sm sm:text-base uppercase tracking-wider rounded transition-colors whitespace-nowrap flex-shrink-0"
            >
              Subscribe
            </Link>

            {/* Visual Separator */}
            <div className="hidden sm:block h-5 w-px bg-academic-neutral-300 flex-shrink-0" aria-hidden="true" />

            {/* Social Media Icons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href="https://x.com/LGRSeries"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Follow on Twitter"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://www.linkedin.com/showcase/local-government-reorganisation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Follow on LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="mailto:editor@localgovernmentreorganisation.com"
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Email us"
              >
                <Mail size={14} />
              </a>
            </div>

            {/* Visual Separator */}
            <div className="hidden sm:block h-5 w-px bg-academic-neutral-300 flex-shrink-0" aria-hidden="true" />

            {/* Search */}
            <div className="relative flex-shrink-0">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-2 py-1.5 border border-academic-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-28 sm:w-36"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded transition-colors"
                    aria-label="Submit search"
                  >
                    <Search size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="p-2 text-academic-neutral-600 hover:text-academic-charcoal transition-colors text-xl leading-none"
                    aria-label="Close search"
                  >
                    ×
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-1.5 text-academic-neutral-600 hover:text-academic-charcoal transition-colors"
                  aria-label="Open search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div 
        className="bg-teal-800 border-b border-teal-900 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-2.5 scrollbar-hide">
            {displayPrimaryNav.map((item, index) => {
              const navId = getNavId(item.label, item.path);
              const hasDropdownMenu = hasDropdown(navId);
              const isActive = isActivePrimaryNav(item.path, item.label);
              const isHovered = hoveredPrimaryNav === navId;
              
              return (
                <div
                  key={index}
                  className="relative"
                  data-primary-nav-item={hasDropdownMenu ? navId : undefined}
                  onMouseEnter={() => {
                    cancelNavHide();
                    if (hasDropdownMenu) {
                      setHoveredPrimaryNav(navId);
                    } else {
                      setHoveredPrimaryNav(null);
                    }
                  }}
                  onMouseLeave={() => {
                    scheduleNavHide();
                  }}
                >
                  <Link
                    to={item.path}
                    className={`px-3 sm:px-4 py-1.5 text-[0.75rem] sm:text-[0.8125rem] font-display font-bold tracking-wider transition-all duration-200 min-h-[28px] flex items-center justify-center gap-1 whitespace-nowrap ${
                      isActive
                        ? 'text-white border-b-2 border-teal-300'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {hasDropdownMenu && (
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-200 flex-shrink-0 ${isHovered ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Secondary Navigation Bar - Show only when hovering over primary nav with dropdown */}
      {hoveredPrimaryNav && displaySecondaryNav.length > 0 && (
        <div 
          className="bg-academic-neutral-200 border-b border-academic-neutral-300 secondary-nav"
          onMouseEnter={() => {
            cancelNavHide();
            setHoveredPrimaryNav(hoveredPrimaryNav);
          }}
          onMouseLeave={() => {
            scheduleNavHide();
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-1 overflow-x-auto py-1.5 sm:py-2 scrollbar-hide">
              {displaySecondaryNav.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`px-3 sm:px-4 py-1.5 text-[0.6875rem] sm:text-[0.75rem] font-display font-bold text-academic-charcoal hover:text-teal-800 transition-colors whitespace-nowrap min-h-[22px] flex items-center justify-center ${
                    index < displaySecondaryNav.length - 1 ? 'border-r border-academic-neutral-400' : ''
                  } ${item.active || (currentPath && item.path === currentPath) ? 'text-teal-700 font-bold' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div 
        className={`relative overflow-hidden ${isHomepage ? 'min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]' : ''}`}
      >
        {/* Background image with filter */}
        {isHomepage && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/polling-station-background.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.9) saturate(1.1) contrast(1.05)',
            }}
          />
        )}
        {/* Gradient overlay with transparency + minimal glass effect */}
        <div 
          className={`absolute inset-0 backdrop-blur-sm ${isHomepage ? 'bg-gradient-to-r from-teal-800/85 via-cyan-800/85 to-teal-900/85' : 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800'}`}
        />
        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHomepage ? 'py-8 sm:py-10 md:py-12 lg:py-14' : 'py-3 sm:py-4 md:py-5 lg:py-6'}`}>
          <div className={heroTextMaxWidth}>
            {isHomepage ? (
              <div className="hero-banner-intro max-w-full" style={{ display: 'table', width: 'auto' }}>
                <h1
                  className="hero-banner-headline text-white font-display text-left hero-banner-text mb-6 tracking-wider text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black"
                  style={{
                    hyphens: 'none',
                    WebkitHyphens: 'none',
                    MozHyphens: 'none',
                    msHyphens: 'none',
                    lineHeight: 1.08,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.5)',
                  }}
                >
                  {wrapHyphenatedWords('Local Government Reorganisation (LGR) Initiative')}
                </h1>
                <p className="hero-banner-intro-body text-white/90 text-[0.79rem] sm:text-[0.9rem] md:text-[1.01rem] lg:text-[1.13rem] leading-relaxed font-display hero-banner-text max-w-full my-10">
                  {wrapHyphenatedWords('The LGR Initiative provides independent analysis of local government reorganisation, ensuring new unitary councils are governable, legitimate and capable of delivering services sustainably, creating the conditions for meaningful devolution.')}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link
                    to="/facts/what-is-lgr"
                    className="min-w-[180px] sm:min-w-[200px] px-2.5 py-1 sm:px-3 sm:py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-[0.73rem] sm:text-[0.84rem] uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center justify-center"
                  >
                    What is LGR?
                  </Link>
                  <Link
                    to="/tools"
                    className="min-w-[180px] sm:min-w-[200px] px-2.5 py-1 sm:px-3 sm:py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-[0.73rem] sm:text-[0.84rem] uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center justify-center"
                  >
                    Helpful Toolkits
                  </Link>
                  <Link
                    to="/surrey/election-tracker"
                    className="min-w-[180px] sm:min-w-[200px] px-2.5 py-1 sm:px-3 sm:py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-[0.73rem] sm:text-[0.84rem] uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center justify-center"
                  >
                    Track Surrey&apos;s LGR
                  </Link>
                </div>
                <p className="mt-10 text-white/80 text-[0.7rem] sm:text-[0.75rem] leading-relaxed font-display max-w-[72%]">
                  The LGR Initiative was formed by a partnership between Coalface Engagement Ltd and the Centre for Britain and Europe, University of Surrey, along with others. To learn more{' '}
                  <Link to="/partnerships" className="text-teal-200 hover:text-white underline transition-colors">
                    click here
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <>
                {heroLabel && (
                  <div className={`font-display font-bold uppercase tracking-wider hub-label-uppercase mb-4 ${['learn', 'discover', 'research', 'tools', 'about'].includes(heroVariant ?? '') ? 'text-white text-[0.75rem] sm:text-[0.8125rem]' : 'text-teal-200 text-[0.79rem] sm:text-[0.9rem]'}`}>
                    {heroLabel}
                  </div>
                )}
                {heroTitle && (
                  <h1
                    className={`hero-banner-headline text-white font-display text-left tracking-wider font-bold ${['learn', 'discover', 'research', 'tools', 'about'].includes(heroVariant ?? '') ? 'mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem]' : 'mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl'}`}
                    style={{
                      hyphens: 'none',
                      WebkitHyphens: 'none',
                      MozHyphens: 'none',
                      msHyphens: 'none',
                      lineHeight: 1.08,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    {typeof heroTitle === 'string' ? wrapHyphenatedWords(heroTitle) : heroTitle}
                  </h1>
                )}
                {heroSubtitle && (
                  <p className={`hero-banner-intro-body text-white font-display max-w-full ${['learn', 'discover', 'research', 'tools', 'about'].includes(heroVariant ?? '') ? 'text-base sm:text-lg md:text-xl leading-relaxed text-white/95' : 'text-white/90 text-[0.79rem] sm:text-[0.9rem] md:text-[1.01rem] lg:text-[1.13rem] leading-relaxed'}`}>
                    {typeof heroSubtitle === 'string' ? wrapHyphenatedWords(heroSubtitle) : heroSubtitle}
                  </p>
                )}
                {['learn', 'discover', 'research', 'tools', 'about'].includes(heroVariant ?? '') && heroSupportingLine && (
                  <p className="mt-3 text-white/85 font-serif text-sm sm:text-base font-normal leading-relaxed">
                    {heroSupportingLine}
                  </p>
                )}
                {['learn', 'discover', 'research', 'tools', 'about'].includes(heroVariant ?? '') && (heroPrimaryCta || heroSecondaryCta) && (
                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                    {heroPrimaryCta && (
                      <Link
                        to={heroPrimaryCta.to}
                        className="inline-flex items-center justify-center px-5 py-2.5 font-display font-bold text-sm uppercase tracking-wider text-white rounded transition-opacity hover:opacity-95"
                        style={{ backgroundColor: '#1F8A70' }}
                      >
                        {heroPrimaryCta.label}
                      </Link>
                    )}
                    {heroSecondaryCta && (
                      <Link
                        to={heroSecondaryCta.to}
                        className="inline-flex items-center justify-center px-5 py-2.5 font-display font-bold text-sm uppercase tracking-wider text-white border-2 border-white rounded transition-opacity hover:opacity-90"
                      >
                        {heroSecondaryCta.label}
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb strip – route map under the banner */}
      <div className="bg-academic-neutral-100 border-b border-academic-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <Breadcrumbs
            items={getBreadcrumbItems(location?.pathname ?? '/', breadcrumbCurrentLabel)}
            className="text-academic-neutral-600"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
