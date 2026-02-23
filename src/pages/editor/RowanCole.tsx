import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Linkedin, ExternalLink } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import { useAboutPage } from '../../hooks/useAboutPage';
import { sanitizeHtmlContent } from '../../lib/htmlSanitizer';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ROWAN_FAQS = [
  {
    question: 'What is Rowan Cole\'s role in Local Government Reorganisation analysis?',
    answer: 'Rowan Cole serves as Editorial Lead of the Local Government Reorganisation Initiative, overseeing research and policy analysis on unitary authority creation and council restructuring in England.',
  },
  {
    question: 'What experience does Rowan Cole bring to council restructuring?',
    answer: 'His experience spans elected office, senior advisory roles, planning policy communications and governance consultancy, providing practical insight into executive leadership, scrutiny and planning committee decision making.',
  },
  {
    question: 'Does Rowan Cole advise on Section 114 contexts?',
    answer: 'He advises on managing internal stakeholders and external communications in Section 114 and other high-pressure contexts. He specialises in communications, engagement and accountability.',
  },
  {
    question: 'How does planning reform intersect with Local Government Reorganisation?',
    answer: 'He examines how restructuring affects Local Plan timetables, development management performance and democratic accountability within planning systems.',
  },
];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rowan Cole',
  jobTitle: 'Editorial Lead',
  worksFor: { '@type': 'Organization', name: 'Local Government Reorganisation Initiative' },
  description: 'Rowan Cole is Editorial Lead of the Local Government Reorganisation Initiative, specialising in Local Government Reorganisation in England, unitary authority governance, Section 114 contexts and planning reform.',
  areaOfExpertise: [
    'Local Government Reorganisation in England',
    'Unitary authority governance',
    'Stakeholder and external communications in Section 114 contexts',
    'Planning reform',
    'Council restructuring',
  ],
  areaServed: 'England',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ROWAN_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

interface RowanColeProps {
  onNavigate: (page: string) => void;
}

export default function RowanCole({ onNavigate: _onNavigate }: RowanColeProps) {
  const { page: cmsPage, loading } = useAboutPage('editor');
  const location = useLocation();
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Rowan Cole | Editorial Lead | Local Government Reorganisation Initiative"
        description="Rowan Cole is Editorial Lead of the Local Government Reorganisation Initiative, specialising in Local Government Reorganisation in England, unitary authority governance, Section 114 contexts and planning reform."
        keywords="Rowan Cole, Editorial Lead, Local Government Reorganisation Initiative, unitary authority governance, Section 114, planning reform, LGR"
        ogTitle="Rowan Cole | Editorial Lead | Local Government Reorganisation Initiative"
        ogDescription="Rowan Cole is Editorial Lead of the Local Government Reorganisation Initiative, specialising in Local Government Reorganisation in England, unitary authority governance, Section 114 contexts and planning reform."
        ogImage="/rowan-cole-editor-lgr-series.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Rowan Cole"
        heroSubtitle="Editorial Lead, Local Government Reorganisation Initiative"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile */}
            <section className="academic-card p-8 md:p-10">
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/rowan-cole-editor-lgr-series.jpg"
                    alt="Rowan Cole, Editorial Lead of the Local Government Reorganisation Initiative"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-2">Rowan Cole</h1>
                  <p className="text-academic-lg text-academic-neutral-700 mb-8 font-serif">
                    Editorial Lead, Local Government Reorganisation Initiative
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Role within the Local Government Reorganisation Initiative
                  </h2>
                  <p className="mb-4">
                    Rowan Cole serves as Editorial Lead of the Local Government Reorganisation Initiative, a policy platform examining Local Government Reorganisation in England, unitary authority creation and council restructuring.
                  </p>
                  <p className="mb-4">
                    He leads editorial strategy, research commissioning and analytical standards across the LGR Series. His work focuses on governance transition, democratic accountability, planning system performance, and advising on internal stakeholder management and external communications in Section 114 and other high-pressure contexts.
                  </p>
                  <p className="mb-6">
                    His remit includes analysis of executive governance models, scrutiny arrangements, planning committee stability and the design of resilient governance frameworks for newly formed unitary authorities.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Professional Background
                  </h2>
                  <p className="mb-4">
                    Rowan is a UK governance and public affairs specialist with senior experience across local government, planning reform in England and politically sensitive development environments.
                  </p>
                  <p className="mb-4">
                    He is Founder of Coalface Engagement Ltd. He also serves as Associate Director within major UK regeneration and consultancy settings and holds communications responsibilities within a London borough's Planning and Planning Policy functions.
                  </p>
                  <p className="mb-6">
                    His career spans elected office, senior political advisory roles, council officer positions and consultancy leadership. This breadth of experience provides operational insight into how council restructuring, executive leadership and statutory planning processes function in practice.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Areas of Expertise
                  </h2>
                  <ul className="list-disc pl-6 space-y-1 mb-6">
                    <li>Local Government Reorganisation in England</li>
                    <li>Unitary authority governance and transition design</li>
                    <li>Stakeholder and external communications in Section 114 contexts</li>
                    <li>Planning reform and Local Plan consultation</li>
                    <li>Political behaviour in planning committees</li>
                    <li>Democratic accountability and institutional legitimacy</li>
                    <li>Governance resilience during structural reform</li>
                    <li>AI governance considerations within local authorities</li>
                  </ul>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Policy Focus
                  </h2>
                  <p className="mb-8">
                    Rowan's analysis examines how structural reform affects service delivery, statutory planning performance, financial governance and public trust. His work prioritises lawful decision making, procedural clarity and governance stability during periods of institutional transition.
                  </p>

                  {/* Social Links */}
                  <div className="mt-8 pt-6 border-t border-academic-neutral-300 space-y-4">
                    <div>
                      <span className="text-academic-neutral-700 font-semibold mb-2 block">Author ID: </span>
                      <a
                        href="https://orcid.org/0009-0008-1064-9037"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center align-top hover:underline text-teal-700"
                      >
                        <img
                          src="https://orcid.org/sites/default/files/images/orcid_16x16.png"
                          width="16"
                          height="16"
                          alt="ORCID iD icon"
                          className="mr-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        https://orcid.org/0009-0008-1064-9037
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://www.linkedin.com/in/rowancole/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
                        style={{ color: '#ffffff' }}
                      >
                        <Linkedin size={18} style={{ color: '#ffffff' }} />
                        <span style={{ color: '#ffffff' }}>LinkedIn</span>
                        <ExternalLink size={14} style={{ color: '#ffffff' }} />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://coalfaceengagement.co.uk/rowan-cole"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-semibold hover:underline"
                      >
                        COALFACE Profile
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Editor's Letter */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose max-w-4xl">
                <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                  Editor's Letter
                </h2>
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(cmsPage.content) }} />
                ) : (
                  <>
                    <p className="text-academic-lg font-semibold text-teal-700 mb-6 leading-relaxed">
                      A golden opportunity for meaningful change, or a governance stress test for public trust and planning?
                    </p>
                    <p className="mb-6 italic">
                      Personal thoughts and reflections as we begin to launch the LGR Series, exploring the intricacies of the most far reaching restructuring of English local government in a generation.
                    </p>
                    <p className="mb-6">
                      <span className="font-semibold">Local Government Reorganisation: Decisions, Power and Place</span> examines a programme that will reshape not only how planning authorities operate, but how the wider local government system functions around them.
                    </p>
                    <p className="mb-8">
                      Our objective is to equip the sector to make the former a reality. Thank you to everyone who has already contributed, and to those who will take part as the Initiative develops.
                    </p>
                  </>
                )}
                <div className="mt-8 mb-6">
                  <img src="/signature_-_rowan_cole.png" alt="Rowan Cole Signature" className="h-16 mb-2" />
                  <p className="text-academic-charcoal font-semibold text-lg">Rowan Cole</p>
                  <p className="text-academic-neutral-600">LGR Initiative</p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="academic-card p-8 md:p-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {ROWAN_FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-academic-neutral-300 rounded-lg overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedFaqId(expandedFaqId === i ? null : i)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-academic-warm transition-colors group"
                      aria-expanded={expandedFaqId === i ? 'true' : 'false'}
                    >
                      <h3 className="text-academic-lg font-display font-bold text-academic-charcoal pr-4 group-hover:text-teal-700">
                        {faq.question}
                      </h3>
                      {expandedFaqId === i ? (
                        <ChevronUp className="w-5 h-5 text-teal-600" aria-hidden />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-academic-neutral-400 group-hover:text-teal-600" aria-hidden />
                      )}
                    </button>
                    {expandedFaqId === i && (
                      <div className="px-6 pb-5 pt-2 border-t border-academic-neutral-200">
                        <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

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
                  ABOUT SECTIONS
                </h4>
                <nav className="space-y-2">
                  <Link to="/about" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Overview
                  </Link>
                  <Link to="/rowan-cole-local-government-reorganisation" className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded">
                    Editor Profile
                  </Link>
                  <Link to="/professor-amelia-hadfield-governance-reform" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Professor Amelia Hadfield
                  </Link>
                  <Link to="/oliver-deed-strategic-communications-local-government" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Oliver Deed
                  </Link>
                  <Link to="/matthew-masters-local-government-leadership" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Matthew Masters
                  </Link>
                  <Link to="/charlie-moir-digital-engagement-local-government" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Charlie Moir
                  </Link>
                  <Link to="/about/overview#methodology" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Methodology
                  </Link>
                  <Link to="/about/contributors/contribute" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    Contribute
                  </Link>
                  <Link to="/about/partnership" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
                    About COALFACE
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
