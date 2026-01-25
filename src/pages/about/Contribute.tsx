import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Lightbulb, Database, MessageSquare } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import SubscriptionForm from '../../components/SubscriptionForm';
import LastUpdated from '../../components/LastUpdated';
import { useAboutPage } from '../../hooks/useAboutPage';

interface ContributeProps {
  onNavigate: (page: string) => void;
}

export default function Contribute({ onNavigate: _onNavigate }: ContributeProps) {
  const { page: cmsPage, loading } = useAboutPage('contribute');
  const waysToContribute = [
    {
      icon: <Share2 size={24} className="text-teal-700" />,
      title: 'Share Your Experience',
      description: "If you've been involved in reorganisation processes, we'd like to hear about practical challenges, governance issues, or lessons learned that could inform the wider sector."
    },
    {
      icon: <Lightbulb size={24} className="text-teal-700" />,
      title: 'Suggest Topics',
      description: 'Recommend areas of analysis, case studies, or specific questions that would benefit from deeper investigation within the Series.'
    },
    {
      icon: <Database size={24} className="text-teal-700" />,
      title: 'Provide Data',
      description: 'Help expand our evidence base by sharing governance documents, performance data, or other publicly available material from authorities undergoing reorganisation.'
    },
    {
      icon: <MessageSquare size={24} className="text-teal-700" />,
      title: 'Expert Commentary',
      description: 'Contribute analysis, opinion pieces, or technical commentary on specific aspects of LGR and its impact on planning and governance.'
    }
  ];

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="How to Contribute - LGR Series"
        description="Get involved in the LGR Series by sharing your experience, suggesting topics, providing data, or contributing expert commentary."
        keywords="contribute to LGR series, share experience, suggest topics, provide data, expert commentary"
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">ABOUT</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              How to{' '}
              <span className="text-teal-700 font-serif italic">
                Contribute
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Get involved in the LGR Series by sharing your experience, suggesting topics, or contributing to our research.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-academic-sm text-academic-neutral-600">
              <Link to="/about" className="hover:text-teal-700 transition-colors">About</Link>
              <span>/</span>
              <span className="text-academic-neutral-900">Contribute</span>
            </nav>

            {/* Introduction */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose">
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
                ) : (
                  <>
                    <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                      Get Involved
                    </h2>
                    <p className="mb-6">
                      The LGR Series welcomes contributions from practitioners, local authority officers, elected members, developers, and other stakeholders involved in local government reorganisation and planning.
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* Ways to Contribute */}
            <section>
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Ways to Contribute
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {waysToContribute.map((way, index) => (
                  <div key={index} className="academic-card p-6 hover:border-teal-700 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-50 flex items-center justify-center rounded-lg">
                        {way.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">
                          {way.title}
                        </h3>
                        <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">
                          {way.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section className="academic-card p-8 md:p-10 bg-teal-50 border-teal-200">
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                Get in Touch
              </h2>
              <p className="text-academic-base text-academic-neutral-700 mb-4 font-serif">
                To discuss contributions or suggest topics, please contact:
              </p>
              <p className="text-academic-lg font-display font-semibold text-teal-700 mb-6">
                <a href="mailto:editor@localgovernmentreorganisation.co.uk" className="hover:text-teal-800 transition-colors">
                  editor@localgovernmentreorganisation.co.uk
                </a>
              </p>
              <p className="text-academic-sm text-academic-neutral-600 font-serif">
                We welcome all forms of contribution and are happy to discuss how your experience or expertise can help strengthen the Series.
              </p>
            </section>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-academic-neutral-300">
              <Link
                to="/about"
                className="flex items-center gap-2 text-academic-sm font-display font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to About
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 border border-academic-neutral-300 rounded-sm shadow-sm">
                <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
                  The Dispatch
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="academic-card p-6">
                <h4 className="font-display font-bold text-academic-charcoal mb-4 text-sm tracking-wider border-b-2 border-academic-neutral-300 pb-3">
                  ABOUT SECTIONS
                </h4>
                <nav className="space-y-2">
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Overview
                  </Link>
                  <Link
                    to="/about/editor"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Editor's Letter
                  </Link>
                  <Link
                    to="/about/methodology"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Methodology
                  </Link>
                  <Link
                    to="/about/contribute"
                    className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded"
                  >
                    Contribute
                  </Link>
                  <Link
                    to="/about/coalface"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    About COALFACE
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <LastUpdated />
    </div>
  );
}
