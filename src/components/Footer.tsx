import { Link, useLocation } from 'react-router-dom';
import { Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';
import SubscriptionForm from './SubscriptionForm';
import { useFooterContent } from '../hooks/useFooterContent';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate: _onNavigate }: FooterProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { getSection } = useFooterContent();

  // Get CMS content with fallbacks
  const sponsorship = getSection('sponsorship');
  const subscriptionCta = getSection('subscription_cta');
  const disclaimer = getSection('disclaimer');
  const tagline = getSection('tagline');

  return (
    <footer className="bg-academic-charcoal text-academic-neutral-300 mt-16 border-t-4 border-academic-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle sponsorship statement - all pages */}
        <div className="py-2.5 border-b border-academic-neutral-800">
          <p className="text-academic-xs text-teal-400/70 text-center font-display">
            {sponsorship ? (
              <>
                {sponsorship.content.split('COALFACE').map((part, i, arr) => 
                  i === arr.length - 1 ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <span key={i}>
                      {part}
                      <a href={sponsorship.link_url || "https://coalfaceengagement.co.uk"} target="_blank" rel="noopener noreferrer" className="text-teal-400/90 hover:text-teal-300 transition-colors">
                        {sponsorship.link_text || 'COALFACE™'}
                      </a>
                    </span>
                  )
                )}
              </>
            ) : (
              <>The LGR Series is an Insight Project by <a href="https://coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className="text-teal-400/90 hover:text-teal-300 transition-colors">COALFACE™</a></>
            )}
          </p>
        </div>

        <div className="py-5 border-b border-academic-neutral-700 bg-teal-900/20">
          <p className="text-academic-sm text-center text-academic-neutral-200 font-serif">
            {subscriptionCta ? (
              <>
                <span className="font-semibold">{subscriptionCta.content}</span>
                {subscriptionCta.link_text && subscriptionCta.link_url && (
                  <> {' '}
                    <Link
                      to={subscriptionCta.link_url}
                      className="text-teal-400 hover:text-teal-300 underline transition-colors font-medium"
                    >
                      {subscriptionCta.link_text}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold">The LGR Series is constantly updated with new information added frequently.</span>{' '}
                <Link
                  to="/subscribe"
                  className="text-teal-400 hover:text-teal-300 underline transition-colors font-medium"
                >
                  Subscribe to stay updated with new materials
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="py-6 border-b border-academic-neutral-700">
          <p className="text-academic-xs text-academic-neutral-300 leading-relaxed font-serif">
            <strong className="text-academic-neutral-100 font-display">Disclaimer:</strong> {disclaimer?.content || 'Content on this site is for general information only and is not a substitute for technical, planning, legal or professional advice. Coalface Engagement Ltd / COALFACE™ accepts no liability for decisions made on the basis of this material. Please contact us for advice relating to specific sites, schemes or authorities.'}
          </p>
        </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <a
              href="https://coalfaceengagement.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4"
            >
              <img
                src="/insights-logo-horizontal.png"
                alt="COALFACE Insights"
                loading="lazy"
                className="h-16 w-auto"
              />
            </a>
            <p className="text-academic-xs text-academic-neutral-300 leading-relaxed italic font-serif mb-4">
              {tagline?.content || 'Planning consultation and engagement shaped by political behaviour, governance conditions and planning system realities.'}
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 mb-4" role="list" aria-label="Social media links">
              <a
                href="https://twitter.com/coalfaceengage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-academic-neutral-400 hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                aria-label="Follow on Twitter"
                role="listitem"
              >
                <Twitter size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/company/coalface-engagement"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-academic-neutral-400 hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                aria-label="Follow on LinkedIn"
                role="listitem"
              >
                <Linkedin size={18} aria-hidden="true" />
              </a>
              <a
                href="mailto:editor@localgovernmentreorganisation.co.uk"
                className="w-8 h-8 flex items-center justify-center text-academic-neutral-400 hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                aria-label="Email us at editor@localgovernmentreorganisation.co.uk"
                role="listitem"
              >
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
            {/* Newsletter Signup */}
            <div className="mt-4">
              <h4 className="text-academic-xs font-display font-bold text-white mb-2 uppercase tracking-wider">Newsletter</h4>
              <SubscriptionForm variant="compact" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-academic-sm mb-4 tracking-wider">LGR HUB</h3>
            <ul className="space-y-1.5 text-academic-xs">
              <li>
                <Link to="/lgr-hub" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/podcast" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Podcast
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-academic-sm mb-4 tracking-wider">TOPICS</h3>
            <ul className="space-y-1.5 text-academic-xs">
              <li>
                <Link to="/topics/governance-and-reform" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Governance and Reform
                </Link>
              </li>
              <li>
                <Link to="/topics/democratic-legitimacy" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Democratic Legitimacy
                </Link>
              </li>
              <li>
                <Link to="/topics/statecraft-and-system-design" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Statecraft and System Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-academic-sm mb-4 tracking-wider">RESOURCES</h3>
            <ul className="space-y-1.5 text-academic-xs">
              <li>
                <Link to="/insights" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/facts-and-data" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Facts & Data
                </Link>
              </li>
              <li>
                <Link to="/lessons" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Lessons
                </Link>
              </li>
              <li>
                <Link to="/surrey" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center font-serif">
                  Focus: Surrey
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-academic-sm mb-4 tracking-wider">ABOUT</h3>
            <p className="text-academic-xs text-academic-neutral-300 leading-relaxed mb-4 font-serif">
              The LGR Series is a dedicated research programme by COALFACE™ designed to strengthen public understanding of local government reorganisation and council reform.
            </p>
            <ul className="space-y-1.5 text-academic-xs">
              <li>
                <Link to="/about" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-1 font-serif">
                  About the LGR Series
                </Link>
              </li>
              <li>
                <Link to="/about/contributors" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-1 font-serif">
                  Contributors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-academic-neutral-300 hover:text-teal-400 transition-colors block py-1 font-serif">
                  Contact
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-white font-display font-bold text-academic-sm mb-4 tracking-wider">CONTACT</h3>
            <div className="text-academic-xs text-academic-neutral-300 space-y-1.5 mb-4 font-serif">
              <p>Coalface Engagement Ltd (11741464)</p>
              <p>Prebend House, 72 London Road</p>
              <p>Leicester, LE2 0QR</p>
              <p className="mt-2">
                <a href="mailto:LGR@coalfaceengagement.co.uk" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  LGR@coalfaceengagement.co.uk
                </a>
              </p>
              <p className="mt-2">
                <a href="mailto:editor@localgovernmentreorganisation.co.uk" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  editor@localgovernmentreorganisation.co.uk
                </a>
              </p>
            </div>
            <Link to="/contact" className="text-academic-xs text-teal-400 hover:text-teal-300 transition-colors font-display font-medium inline-flex items-center gap-1">
              Contact us
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        <div className="py-5 border-t border-academic-neutral-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-academic-xs items-center font-serif">
            <a href="https://coalfaceengagement.co.uk/privacy" target="_blank" rel="noopener noreferrer" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Privacy Policy
            </a>
            <span className="text-academic-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/accessibility" target="_blank" rel="noopener noreferrer" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Accessibility
            </a>
            <span className="text-academic-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/terms" target="_blank" rel="noopener noreferrer" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Terms & Conditions
            </a>
            <span className="text-academic-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/cookies" target="_blank" rel="noopener noreferrer" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Cookie Policy
            </a>
            <span className="text-academic-neutral-500">|</span>
            <a href="https://coalface.netlify.app/ai-statement" target="_blank" rel="noopener noreferrer" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              AI Governance
            </a>
            <span className="text-academic-neutral-500">|</span>
            <Link to="/unsubscribe" className="text-academic-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Unsubscribe
            </Link>
            <span className="text-academic-neutral-500">|</span>
            <Link 
              to="/admin/login" 
              className="text-academic-neutral-500 hover:text-academic-neutral-400 transition-colors px-3 py-2 min-h-[48px] min-w-[48px] inline-flex items-center justify-center"
              aria-label="Admin login"
            >
              •
            </Link>
          </div>
          <div className="text-academic-xs text-academic-neutral-300 font-serif">
            © {new Date().getFullYear()} Coalface Engagement Ltd. All rights reserved.
          </div>
        </div>

        {/* Full sponsorship banner - home page only */}
        {isHomePage && (
          <div className="bg-academic-charcoal border-t border-teal-700/30 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <img 
                src="/coalface-logo.png" 
                alt="COALFACE" 
                className="h-8 w-auto"
                loading="lazy"
              />
              <p className="text-academic-sm text-teal-400 font-display font-medium">
                The LGR Series is an Insight Project by <a href="https://coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200 transition-colors">COALFACE™</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
