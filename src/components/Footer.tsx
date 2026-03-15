import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Mail } from 'lucide-react';
import { useFooterContent } from '../hooks/useFooterContent';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate: _onNavigate }: FooterProps) {
  const { getSection } = useFooterContent();
  void getSection; // CMS content available for future use

  return (
    <footer className="bg-academic-charcoal/95 text-academic-neutral-300 mt-16">
      {/* Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Coalface Engagement Ltd",
            alternateName: "COALFACE®",
            url: "https://coalfaceengagement.co.uk",
            logo: "https://localgovernmentreorganisation.co.uk/logo.png",
            description: "Communications and stakeholder engagement consultancy specialising in planning, local government strategy and political communications.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Prebend House, 72 London Road",
              addressLocality: "Leicester",
              postalCode: "LE2 0QR",
              addressCountry: "GB"
            },
            sameAs: [
              "https://x.com/LGRInitiative",
              "https://www.linkedin.com/showcase/local-government-reorganisation",
              "https://find-and-update.company-information.service.gov.uk/company/11741464"
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "office@lgr-initiative.co.uk",
              contactType: "general enquiries"
            }
          })
        }}
      />
      <div className="layout-container">
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Navigation Sections */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-3">LGR Hub</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lgr-hub" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/podcast" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Podcast
                </Link>
              </li>
              <li>
                <Link to="/first-100-days" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  100 Days Playbook
                </Link>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-academic-xs text-academic-neutral-200 font-serif mb-2">
                LGR Insights & Updates
              </p>
              <Link
                to="/subscribe"
                className="inline-block bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-display font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/insights" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Library
                </Link>
              </li>
              <li>
                <Link to="/facts-and-data" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Facts & Data
                </Link>
              </li>
              <li>
                <Link to="/lessons" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Lessons
                </Link>
              </li>
              <li>
                <Link to="/reorganisations" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Reorganisations
                </Link>
              </li>
              <li>
                <Link to="/surrey" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Focus: Surrey
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Glossary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-3">About</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link to="/about" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  About the LGR Initiative
                </Link>
              </li>
              <li>
                <Link to="/rowan-cole-local-government-reorganisation" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Editor
                </Link>
              </li>
              <li>
                <Link to="/about/overview#methodology" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Methodology
                </Link>
              </li>
              <li>
                <Link to="/about/contributors" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Contributors
                </Link>
              </li>
              <li>
                <Link to="/about/contributors/contribute" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Contribute
                </Link>
              </li>
              <li>
                <Link to="/about/partnership" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Partnership
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-academic-neutral-200 hover:text-teal-400 transition-colors font-serif">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-3">Published by:</h3>
            <div className="text-sm text-academic-neutral-200 space-y-2 font-serif">
              <p className="whitespace-nowrap">Coalface Engagement Ltd</p>
              <p className="text-academic-xs text-academic-neutral-300">
                <a
                  href="https://find-and-update.company-information.service.gov.uk/company/11741464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors"
                  aria-label="View Coalface Engagement Ltd on Companies House"
                >
                  (11741464)
                </a>
              </p>
              <p>Prebend House, 72 London Road</p>
              <p>Leicester, LE2 0QR</p>
              <div className="pt-2 space-y-1">
                <a href="mailto:office@lgr-initiative.co.uk" className="text-teal-400 hover:text-teal-300 transition-colors block text-xs">
                  office@lgr-initiative.co.uk
                </a>
              </div>
            </div>
            <ul className="flex items-center gap-3 mt-4" aria-label="Social media links">
              <li>
                <a
                  href="https://x.com/LGRInitiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] w-10 h-10 flex items-center justify-center text-academic-neutral-200 hover:text-teal-400 transition-colors"
                  aria-label="Follow on X (formerly Twitter)"
                >
                  <Twitter size={18} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/showcase/local-government-reorganisation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] w-10 h-10 flex items-center justify-center text-academic-neutral-200 hover:text-teal-400 transition-colors"
                  aria-label="Follow on LinkedIn"
                >
                  <Linkedin size={18} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:office@lgr-initiative.co.uk"
                  className="min-w-[44px] min-h-[44px] w-10 h-10 flex items-center justify-center text-academic-neutral-200 hover:text-teal-400 transition-colors"
                  aria-label="Email us"
                >
                  <Mail size={18} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-academic-neutral-800 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Disclaimer - spans columns 1, 2, 3 */}
            <div className="lg:col-span-3 text-xs text-academic-neutral-200 leading-relaxed font-serif">
              <span className="font-semibold text-academic-neutral-100">Disclaimer:</span> Content on this site is for general information only and is not a substitute for technical, planning, legal or professional advice. Coalface Engagement Ltd / COALFACE® and its partners accepts no liability for decisions made on the basis of this material. Please contact us for advice relating to specific sites, schemes or authorities.
            </div>

            {/* Legal Links - spans columns 4, 5 */}
            <div className="lg:col-span-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-academic-neutral-200">
              <a href="https://coalfaceengagement.co.uk/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                Privacy
              </a>
              <a href="https://coalfaceengagement.co.uk/accessibility" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                Accessibility
              </a>
              <a href="https://coalfaceengagement.co.uk/terms" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                Terms
              </a>
              <a href="https://coalfaceengagement.co.uk/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                Cookies
              </a>
              <a href="https://coalface.netlify.app/ai-statement" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                AI Governance
              </a>
              <Link to="/unsubscribe" className="hover:text-teal-400 transition-colors">
                Unsubscribe
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 border-t border-academic-neutral-800 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p className="text-xs text-academic-neutral-200 font-serif">
                © {new Date().getFullYear()} Coalface Engagement Ltd. All rights reserved.
              </p>
              <Link 
                to="/admin/login" 
                className="text-academic-neutral-300 hover:text-academic-neutral-100 transition-colors text-xs"
                aria-label="Admin login"
              >
                Admin
              </Link>
            </div>
            <p className="text-xs text-academic-neutral-500 font-serif">
              Formerly the LGR Series
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
