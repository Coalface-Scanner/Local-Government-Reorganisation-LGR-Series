import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CHARLIE_FAQS = [
  {
    question: 'What is Charlie Moir\'s role in the Local Government Reorganisation Initiative?',
    answer: 'Charlie Moir contributes digital participation and resident insight expertise, supporting evidence based engagement during council restructuring.',
  },
  {
    question: 'Why is digital engagement important during Local Government Reorganisation?',
    answer: 'Structural reform can create uncertainty. Digital tools enable transparent, accessible and measurable participation, helping councils understand community priorities during transition.',
  },
  {
    question: 'What expertise does Charlie Moir bring to local government reform?',
    answer: 'He works with councils to design data led engagement strategies and structured feedback systems that inform policy and service design.',
  },
  {
    question: 'How does resident insight strengthen new unitary authorities?',
    answer: 'Structured community insight improves legitimacy, informs decision making and strengthens public trust during governance reform.',
  },
];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Charlie Moir',
  jobTitle: 'Digital Participation Adviser',
  worksFor: { '@type': 'Organization', name: 'Local Government Reorganisation Initiative' },
  description: 'Charlie Moir contributes digital participation and resident insight expertise to the Local Government Reorganisation Initiative, specialising in data led engagement and community insight during local government reform.',
  areaOfExpertise: [
    'Digital engagement',
    'Resident insight',
    'Local Government Reorganisation engagement',
    'Data led participation',
    'Community consultation',
  ],
  areaServed: 'United Kingdom',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CHARLIE_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function CharlieMoir() {
  const location = useLocation();
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  return (
    <div className="bg-academic-cream min-h-screen">
      <SEOHead page="charlieMoir" />
      <MetaTags
        title="Charlie Moir | Digital Participation Adviser | Local Government Reorganisation Initiative"
        description="Charlie Moir contributes digital engagement and resident insight expertise to the Local Government Reorganisation Initiative, specialising in data led participation and community insight in local government reform."
        keywords="Charlie Moir, Local Government Reorganisation Initiative, digital engagement, resident insight, participation, Commonplace"
        ogTitle="Charlie Moir | Digital Participation Adviser | Local Government Reorganisation Initiative"
        ogDescription="Charlie Moir contributes digital engagement and resident insight expertise to the Local Government Reorganisation Initiative, specialising in data led participation and community insight in local government reform."
        ogImage="/Images/leadership/charlie_moir.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Charlie Moir"
        heroSubtitle="Digital Participation Adviser, Local Government Reorganisation Initiative"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="academic-card p-8 md:p-10">
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/Images/leadership/charlie_moir.jpg"
                    alt="Charlie Moir, Digital Participation Adviser to the Local Government Reorganisation Initiative"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-2">
                    Charlie Moir
                  </h1>
                  <p className="text-academic-lg text-academic-neutral-700 mb-8 font-serif">
                    Digital Participation Adviser, Local Government Reorganisation Initiative
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Role within the Local Government Reorganisation Initiative
                  </h2>
                  <p className="mb-4">
                    Charlie Moir contributes digital participation and resident insight expertise to the Local Government Reorganisation Initiative. His focus is on how Local Government Reorganisation in England can be informed by transparent, data led engagement and meaningful public participation.
                  </p>
                  <p className="mb-6">
                    He supports the Initiative's emphasis on modern engagement practice, structured feedback analysis and evidence based understanding of communities during council restructuring.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Professional Background
                  </h2>
                  <p className="mb-4">
                    Charlie is Public Sector Partnerships Lead at Commonplace. He works with local authorities to design and implement digital engagement strategies that place resident voices at the centre of decision making.
                  </p>
                  <p className="mb-6">
                    His experience spans community consultation, participatory design and data driven engagement platforms. He supports councils in translating digital insight into actionable policy and service reform decisions.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Areas of Expertise
                  </h2>
                  <ul className="list-disc pl-6 space-y-1 mb-6">
                    <li>Digital engagement and participation design</li>
                    <li>Resident insight and structured feedback analysis</li>
                    <li>Data led decision making in local government</li>
                    <li>Public participation during structural reform</li>
                    <li>Community trust and transparency</li>
                    <li>Evidence based consultation frameworks</li>
                  </ul>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Relevance to Local Government Reorganisation
                  </h2>
                  <p className="mb-4">
                    Local Government Reorganisation creates an opportunity to reset how councils engage with residents. Digital participation tools enable broader inclusion, clearer insight and transparent reporting of community priorities.
                  </p>
                  <p className="mb-8">
                    Charlie's contribution strengthens the Initiative's focus on resident centred reform, ensuring that governance transition is informed by measurable and structured community feedback rather than informal consultation alone.
                  </p>
                </div>
              </div>
            </section>

            <section className="academic-card p-8 md:p-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {CHARLIE_FAQS.map((faq, i) => (
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
                  <Link to="/rowan-cole-local-government-reorganisation" className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded">
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
                  <Link to="/charlie-moir-digital-engagement-local-government" className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded">
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
