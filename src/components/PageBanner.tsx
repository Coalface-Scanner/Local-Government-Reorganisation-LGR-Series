import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Twitter, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { getStandardPrimaryNavItems, getSecondaryNavItemsForPrimaryNav } from '../utils/pageNavigation';

export interface NavItem {
  label: string;
  path: string;
  active?: boolean;
}

interface PageBannerProps {
  isHomepage?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroLabel?: string;
  primaryNavItems?: NavItem[];
  secondaryNavItems?: NavItem[];
  currentPath?: string;
}

export default function PageBanner({
  isHomepage = false,
  heroTitle,
  heroSubtitle,
  heroLabel,
  primaryNavItems,
  secondaryNavItems,
  currentPath
}: PageBannerProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
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
  
  // Determine which primary nav items have dropdowns
  const hasDropdown = (navId: string): boolean => {
    return ['lgr-hub', 'topics', 'insights', 'facts', 'lessons', 'surrey', 'about'].includes(navId);
  };
  
  // Get nav ID from label/path
  const getNavId = (label: string, path: string): string => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('lgr hub') || path.includes('lgr-hub')) return 'lgr-hub';
    if (labelLower.includes('topics') || path.includes('topics')) return 'topics';
    if (labelLower.includes('insights') || path.includes('insights')) return 'insights';
    if (labelLower.includes('facts') || path.includes('facts')) return 'facts';
    if (labelLower.includes('lessons') || path.includes('lessons')) return 'lessons';
    if (labelLower.includes('surrey') || path.includes('surrey')) return 'surrey';
    if (labelLower.includes('about') || path.includes('about')) return 'about';
    return '';
  };
  
  // Determine which primary nav section the current page belongs to
  const getCurrentPrimaryNavId = (): string | null => {
    const current = currentPath || location.pathname;
    if (current === '/' || current === '/lgr-hub' || current.startsWith('/roadmap') || current.startsWith('/tools') || current.startsWith('/podcast')) return 'lgr-hub';
    if (current.startsWith('/topics')) return 'topics';
    if (current.startsWith('/insights') || current.startsWith('/news') || current.startsWith('/podcast') || current.startsWith('/interviews')) return 'insights';
    if (current.startsWith('/facts') || current.startsWith('/facts-and-data') || current.startsWith('/materials') || current.startsWith('/councils') || current.startsWith('/glossary')) return 'facts';
    if (current.startsWith('/lessons')) return 'lessons';
    if (current.startsWith('/surrey')) return 'surrey';
    if (current.startsWith('/about') || current.startsWith('/contact') || current.startsWith('/editor')) return 'about';
    return null;
  };
  
  // Determine which primary nav to show secondary nav for (only on hover, not on matching page)
  const activePrimaryNavForSecondary = hoveredPrimaryNav;
  
  // Get secondary nav items based on hovered primary nav item only
  const displaySecondaryNav = activePrimaryNavForSecondary && hasDropdown(activePrimaryNavForSecondary)
    ? getSecondaryNavItemsForPrimaryNav(activePrimaryNavForSecondary, currentPath || location.pathname)
    : [];
  
  // Check if current path matches a primary nav item
  const isActivePrimaryNav = (path: string, label: string): boolean => {
    const current = currentPath || location.pathname;
    const navId = getNavId(label, path);
    
    switch (navId) {
      case 'lgr-hub':
        // LGR HUB is active on home page or lgr-hub related pages
        return current === '/' || current === '/lgr-hub' || current.startsWith('/roadmap') || current.startsWith('/tools') || current.startsWith('/podcast');
      case 'topics':
        return current.startsWith('/topics');
      case 'insights':
        return current.startsWith('/insights') || current.startsWith('/news') || current.startsWith('/podcast') || current.startsWith('/interviews');
      case 'facts':
        return current.startsWith('/facts') || current.startsWith('/facts-and-data') || current.startsWith('/materials') || current.startsWith('/councils') || current.startsWith('/glossary');
      case 'surrey':
        return current.startsWith('/surrey');
      case 'about':
        return current.startsWith('/about') || current.startsWith('/contact') || current.startsWith('/editor');
      default:
        if (path === '/glossary') return current.startsWith('/glossary');
        if (path === '/lessons') return current.startsWith('/lessons');
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
  const missionStatement = "LGR Series offers independent analysis of local government reorganisation, governance models and service outcomes in England, with recommendations to keep residents and local decision makers at the centre.";

  return (
    <div className="bg-white border-b border-academic-neutral-300">
      {/* Top Stripe */}
      <div className="border-b border-academic-neutral-300 bg-academic-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center text-[0.625rem] md:text-[0.6875rem] tracking-wider text-academic-neutral-700 font-display font-medium" style={{ lineHeight: '1.1' }}>
            <div className="hidden md:block">
              EST. 2025 | By{' '}
              <a 
                href="https://www.coalfaceengagement.co.uk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-teal-700 hover:text-teal-800 transition-colors underline"
              >
                COALFACE
              </a>
            </div>
            <div className="md:hidden text-[0.5rem]">EST. 2025</div>
            <div className="hidden sm:block text-[0.625rem] md:text-[0.6875rem] font-display font-medium text-academic-neutral-800 text-center absolute left-1/2 -translate-x-1/2" style={{ lineHeight: '1.1' }}>
              {currentDate || 'Loading...'}
            </div>
            <div className="flex gap-2 sm:gap-3 text-[0.5rem] sm:text-[0.625rem]">
              <Link
                to="/admin/login"
                aria-label="Members login"
                className="text-teal-700 hover:text-teal-800 transition-colors px-1.5 flex items-center justify-center"
                style={{ paddingTop: '2px', paddingBottom: '2px', minHeight: 'auto', lineHeight: '1.1' }}
              >
                MEMBERS LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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

          {/* Right Side: Subscribe, Social, Search */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
            {/* Subscribe Button */}
            <Link
              to="/subscribe"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-academic-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap flex-shrink-0"
            >
              Subscribe
            </Link>

            {/* Visual Separator */}
            <div className="hidden sm:block h-6 w-px bg-academic-neutral-300 flex-shrink-0" aria-hidden="true" />

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="https://x.com/LGRSeries"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Follow on Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.linkedin.com/showcase/local-government-reorganisation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Follow on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:editor@localgovernmentreorganisation.com"
                className="w-8 h-8 flex items-center justify-center bg-teal-800 hover:bg-teal-900 text-white rounded transition-colors"
                aria-label="Email us"
              >
                <Mail size={16} />
              </a>
            </div>

            {/* Visual Separator */}
            <div className="hidden sm:block h-6 w-px bg-academic-neutral-300 flex-shrink-0" aria-hidden="true" />

            {/* Search */}
            <div className="relative flex-shrink-0">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 border border-academic-neutral-300 rounded text-academic-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-32 sm:w-40"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2 bg-teal-700 hover:bg-teal-800 text-white rounded transition-colors"
                    aria-label="Submit search"
                  >
                    <Search size={16} />
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
                  className="p-2 text-academic-neutral-600 hover:text-academic-charcoal transition-colors"
                  aria-label="Open search"
                >
                  <Search size={20} />
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
          <nav className="flex items-center justify-center gap-1 overflow-x-auto py-3 scrollbar-hide">
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
                    if (hasDropdownMenu) {
                      // Immediately update when entering a new primary nav item
                      setHoveredPrimaryNav(navId);
                    } else {
                      // Clear if entering a nav item without dropdown
                      setHoveredPrimaryNav(null);
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Check if moving to another primary nav item or secondary nav
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    const isMovingToAnotherPrimaryNav = relatedTarget?.closest('[data-primary-nav-item]');
                    const isMovingToSecondaryNav = relatedTarget?.closest('.secondary-nav');
                    
                    if (!isMovingToAnotherPrimaryNav && !isMovingToSecondaryNav) {
                      // Delay to allow moving to secondary nav
                      setTimeout(() => {
                        const secondaryNav = document.querySelector('.secondary-nav');
                        const isOverSecondaryNav = secondaryNav && (
                          secondaryNav.matches(':hover') ||
                          document.querySelector('.secondary-nav:hover') !== null
                        );
                        const isOverAnyPrimaryNav = document.querySelector('[data-primary-nav-item]:hover') !== null;
                        
                        if (!isOverSecondaryNav && !isOverAnyPrimaryNav) {
                          setHoveredPrimaryNav(null);
                        }
                      }, 150);
                    }
                  }}
                >
                  <Link
                    to={item.path}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-display font-bold tracking-wider transition-all duration-200 min-h-[20px] flex items-center justify-center gap-1 whitespace-nowrap ${
                      isActive
                        ? 'text-white border-b-2 border-teal-300'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {hasDropdownMenu && (
                      <ChevronDown 
                        size={10} 
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
            // Keep secondary nav visible when hovering over it
            setHoveredPrimaryNav(hoveredPrimaryNav);
          }}
          onMouseLeave={() => {
            // Delay to allow moving back to primary nav
            setTimeout(() => {
              const isOverPrimaryNav = document.querySelector('[data-primary-nav-item]:hover') !== null;
              const isOverSecondaryNav = document.querySelector('.secondary-nav:hover') !== null;
              
              if (!isOverPrimaryNav && !isOverSecondaryNav) {
                setHoveredPrimaryNav(null);
              }
            }, 200);
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-1 overflow-x-auto py-1 scrollbar-hide">
              {displaySecondaryNav.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`px-3 sm:px-4 py-2 text-[0.625rem] sm:text-academic-xs font-display font-bold text-academic-charcoal hover:text-teal-800 transition-colors whitespace-nowrap min-h-[24px] flex items-center justify-center ${
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
        style={isHomepage ? {
          backgroundImage: 'url("/polling_station.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {}}
      >
        {/* Gradient overlay with transparency */}
        <div 
          className={`absolute inset-0 ${isHomepage ? 'bg-gradient-to-r from-teal-800/85 via-cyan-800/85 to-teal-900/85' : 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800'}`}
        />
        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHomepage ? 'py-6 sm:py-8 md:py-10 lg:py-12' : 'py-3 sm:py-4 md:py-5 lg:py-6'}`}>
          <div className={isHomepage ? 'max-w-2xl' : 'max-w-4xl'}>
            {isHomepage ? (
              <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-left hero-banner-text" style={{ fontWeight: 500, hyphens: 'none', WebkitHyphens: 'none', MozHyphens: 'none', msHyphens: 'none' }}>
                {wrapHyphenatedWords('The LGR Series offers independent analysis of local government reorganisation, governance models & service outcomes in England, with recommendations to keep')}{' '}
                <span className="bg-white/20 px-2 py-1 rounded font-bold">residents</span>
                {' '}&{' '}
                <span className="bg-white/20 px-2 py-1 rounded font-bold">local decision makers</span>
                {' '}{wrapHyphenatedWords('at the centre.')}
              </p>
            ) : (
              <>
                {heroLabel && (
                  <div className="text-teal-200 text-xs sm:text-xs md:text-sm font-display font-bold uppercase tracking-wider mb-4">
                    {heroLabel}
                  </div>
                )}
                {heroTitle && (
                  <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-black leading-[1.1] mb-4">
                    {heroTitle}
                  </h1>
                )}
                {heroSubtitle && (
                  <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-serif">
                    {heroSubtitle}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
