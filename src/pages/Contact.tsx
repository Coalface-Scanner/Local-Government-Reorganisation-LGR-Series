import { Mail, Send, MessageSquare, FileText, ArrowRight, Phone, Twitter } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { usePageContent } from '../hooks/usePageContent';
import FAQSection from '../components/FAQSection';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const location = useLocation();
  const { getSection } = usePageContent('contact');

  // Get CMS content with fallbacks
  const heroLabel = getSection('hero_label');
  const heroTitle = getSection('hero_title');
  const heroDescription = getSection('hero_description');
  const formTitle = getSection('form_title');
  const formDescription = getSection('form_description');
  const cardEditorialTitle = getSection('card_editorial_title');
  const cardEditorialDescription = getSection('card_editorial_description');
  const cardEditorialEmail = getSection('card_editorial_email');
  const cardSubscribeTitle = getSection('card_subscribe_title');
  const cardSubscribeDescription = getSection('card_subscribe_description');
  const cardSubscribeLink = getSection('card_subscribe_link');
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Contact - Editorial Team & Inquiries"
        description="Get in touch with the LGRI editorial team. For editorial inquiries, research questions, contributions, or newsletter subscriptions."
        keywords="LGR contact, editorial inquiries, research questions, contribute to LGRI, newsletter subscription, local government reorganisation"
      />
      <PageBanner
        heroLabel={heroLabel?.content || 'GET IN TOUCH'}
        heroTitle={`${heroTitle?.title || 'Contact'} ${heroTitle?.content || 'the Series'}`}
        heroSubtitle={heroDescription?.content || "Have questions about the research, want to contribute insights, or need to discuss specific reorganisation challenges? We're here to help."}
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        {/* Contact details at top – three boxes */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="academic-card p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center mb-4">
              <Phone size={32} className="text-white" />
            </div>
            <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
              Call us
            </h3>
            <a
              href="tel:+4420712347056"
              className="text-academic-lg font-serif text-teal-700 hover:text-teal-800 underline underline-offset-2 transition-colors"
            >
              0207 1234 7056
            </a>
          </div>
          <div className="academic-card p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center mb-4">
              <Mail size={32} className="text-white" />
            </div>
            <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
              Email us
            </h3>
            <a
              href="mailto:contact@lgr-Initiative.co.uk"
              className="text-academic-lg font-serif text-teal-700 hover:text-teal-800 underline underline-offset-2 transition-colors break-all"
            >
              contact@lgr-Initiative.co.uk
            </a>
          </div>
          <div className="academic-card p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center mb-4">
              <Twitter size={32} className="text-white" />
            </div>
            <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
              Tweet us
            </h3>
            <a
              href="https://twitter.com/LGRInitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-lg font-serif text-teal-700 hover:text-teal-800 underline underline-offset-2 transition-colors"
            >
              @LGRInitiative
            </a>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <section className="academic-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center">
                  <Send size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-academic-2xl font-display font-black text-academic-charcoal">
                    {formTitle?.title || formTitle?.content || 'Send Us a Message'}
                  </h2>
                  <p className="text-academic-sm text-academic-neutral-600 font-serif mt-1">
                    {formDescription?.content || "Fill out the form below and we'll get back to you"}
                  </p>
                </div>
              </div>
              <ContactForm />
            </section>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="academic-card p-8 hover:border-teal-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Mail size={28} className="text-white" />
                  </div>
                  <h2 className="text-academic-2xl font-display font-black text-academic-charcoal">
                    {cardEditorialTitle?.title || cardEditorialTitle?.content || 'Editorial Team'}
                  </h2>
                </div>
                <p className="text-academic-base text-academic-neutral-700 mb-6 font-serif leading-relaxed">
                  {cardEditorialDescription?.content || 'For editorial inquiries, research questions, or to contribute case studies:'}
                </p>
                <a
                  href={`mailto:${cardEditorialEmail?.content || 'editor@localgovernmentreorganisation.com'}`}
                  className="inline-flex items-center gap-2 text-teal-700 font-display font-bold hover:text-teal-800 transition-colors text-academic-base"
                >
                  {cardEditorialEmail?.content || 'editor@localgovernmentreorganisation.com'}
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="academic-card p-8 hover:border-teal-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Send size={28} className="text-white" />
                  </div>
                  <h2 className="text-academic-2xl font-display font-black text-academic-charcoal">
                    {cardSubscribeTitle?.title || cardSubscribeTitle?.content || 'Subscribe'}
                  </h2>
                </div>
                <p className="text-academic-base text-academic-neutral-700 mb-6 font-serif leading-relaxed">
                  {cardSubscribeDescription?.content || "Receive new insights as they're published, plus access to case material and the 100 Day Playbook:"}
                </p>
                <button
                  onClick={() => onNavigate('subscribe')}
                  className="inline-flex items-center gap-2 text-teal-700 font-display font-bold hover:text-teal-800 transition-colors text-academic-base"
                >
                  {cardSubscribeLink?.content || 'Subscribe to LGR Insights & Updates'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <section className="academic-card p-8">
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Quick Links
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  to="/about/contribute"
                  className="group flex items-start gap-4 p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-1 group-hover:text-teal-700 transition-colors">
                      Contribute
                    </h3>
                    <p className="text-academic-sm text-academic-neutral-700 font-serif">
                      Share your experience or suggest topics
                    </p>
                  </div>
                </Link>

                <Link
                  to="/about/methodology"
                  className="group flex items-start gap-4 p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-1 group-hover:text-teal-700 transition-colors">
                      Methodology
                    </h3>
                    <p className="text-academic-sm text-academic-neutral-700 font-serif">
                      Learn about our research approach
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* About COALFACE */}
            <section className="academic-card p-8 bg-teal-900 text-white border-0">
              <h2 className="text-academic-2xl font-display font-black mb-4 text-white">
                About COALFACE Insights
              </h2>
              <p className="text-academic-base text-white/90 leading-relaxed mb-6 font-serif">
                COALFACE Insights produces research-driven analysis on local government, planning, and
                place-making. Our work combines data from the COALFACE Council Scanner™ with evidence
                from real reorganisations to support better decision-making.
              </p>
              <Link
                to="/about/coalface"
                className="inline-flex items-center gap-2 text-teal-300 font-display font-bold hover:text-teal-200 transition-colors text-academic-base"
              >
                Learn more about COALFACE
                <ArrowRight size={16} />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 border border-academic-neutral-300 rounded-sm shadow-sm">
                <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
                  LGR Insights & Updates
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                  Receive our regular update direct to your inbox. Subscribe here.
                </p>
                <Link
                  to="/subscribe"
                  className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  Subscribe
                </Link>
              </div>

              <div className="academic-card p-6">
                <h4 className="font-display font-bold text-academic-charcoal mb-4 text-sm tracking-wider border-b-2 border-academic-neutral-300 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('insights')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    View Insights & Analysis →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    Lessons from Reorganisation →
                  </button>
                </div>
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
                    to="/about/leadership/rowan-cole"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Editor Profile
                  </Link>
                  <Link
                    to="/about/methodology"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Methodology
                  </Link>
                  <Link
                    to="/about/contribute"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
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
      <FAQSection page="contact" />
    </div>
  );
}
