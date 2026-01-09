import { Link } from 'react-router-dom';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate: _onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20 border-t-4 border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 border-b border-neutral-700 bg-teal-900/20">
          <p className="text-sm text-center text-neutral-200">
            <span className="font-semibold">The LGR Series is being constantly updated and added to.</span>{' '}
            <Link
              to="/subscribe"
              className="text-teal-400 hover:text-teal-300 underline transition-colors font-medium"
            >
              Subscribe to stay updated with new information
            </Link>
          </p>
        </div>

        <div className="py-6 border-b border-neutral-700">
          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-neutral-100">Disclaimer:</strong> Content on this site is for general information only and is not a substitute for technical, planning, legal or professional advice. Coalface Engagement Ltd / COALFACE™ accepts no liability for decisions made on the basis of this material. Please contact us for advice relating to specific sites, schemes or authorities.
          </p>
        </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <img
              src="/insights-logo-horizontal.png"
              alt="COALFACE Insights"
              loading="lazy"
              className="h-12 w-auto mb-4"
            />
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              Planning consultation and engagement shaped by political behaviour, governance conditions and planning system realities.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider">LGR SERIES</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/facts" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  Facts & Data
                </Link>
              </li>
              <li>
                <Link to="/lessons" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  Lessons
                </Link>
              </li>
              <li>
                <Link to="/100days" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  100 Days
                </Link>
              </li>
              <li>
                <Link to="/surrey" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  Focus: Surrey
                </Link>
              </li>
              <li>
                <Link to="/materials" className="text-neutral-300 hover:text-teal-400 transition-colors block py-2 min-h-[48px] flex items-center">
                  Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider">ABOUT</h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              The LGR Series is a dedicated research programme by COALFACE designed to strengthen public understanding of local government reorganisation.
            </p>
            <Link to="/about" aria-label="Read more about the LGR Series" className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
              Read more →
            </Link>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider">CONTACT</h3>
            <div className="text-xs text-neutral-300 space-y-1 mb-4">
              <p>Coalface Engagement Ltd (11741464)</p>
              <p>Prebend House, 72 London Road</p>
              <p>Leicester, LE2 0QR</p>
              <p className="mt-2">
                <a href="mailto:info@coalfaceengagement.co.uk" className="hover:text-teal-400 transition-colors">
                  info@coalfaceengagement.co.uk
                </a>
              </p>
            </div>
            <Link to="/contact" className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
              Contact us →
            </Link>
          </div>
        </div>

        <div className="py-4 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs items-center">
            <a href="https://coalfaceengagement.co.uk/privacy" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Privacy Policy
            </a>
            <span className="text-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/accessibility" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Accessibility
            </a>
            <span className="text-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/terms" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Terms & Conditions
            </a>
            <span className="text-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/cookies" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Cookie Policy
            </a>
            <span className="text-neutral-500">|</span>
            <a href="https://coalfaceengagement.co.uk/accessibility" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              AI Statement
            </a>
            <span className="text-neutral-500">|</span>
            <Link to="/unsubscribe" className="text-neutral-300 hover:text-teal-400 transition-colors px-3 py-2 min-h-[48px] inline-flex items-center">
              Unsubscribe
            </Link>
            <span className="text-neutral-500">|</span>
            <Link 
              to="/admin/login" 
              className="text-neutral-500 hover:text-neutral-400 transition-colors px-3 py-2 min-h-[48px] min-w-[48px] inline-flex items-center justify-center"
              aria-label="Admin login"
            >
              •
            </Link>
          </div>
          <div className="text-xs text-neutral-300">
            © {new Date().getFullYear()} Coalface Engagement Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
