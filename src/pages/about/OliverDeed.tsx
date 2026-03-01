import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OLIVER_FAQS = [
  {
    question: 'What is Oliver Deed\'s role in the Local Government Reorganisation Initiative?',
    answer: 'Oliver Deed contributes strategic communications and stakeholder engagement expertise to the Initiative, focusing on how governance reform and council restructuring are communicated to residents and stakeholders.',
  },
  {
    question: 'What experience does Oliver Deed have in public sector communications?',
    answer: 'He has led communications and engagement strategies for local authorities, regeneration bodies and infrastructure projects in the United Kingdom and Australia.',
  },
  {
    question: 'Why is communications strategy important during Local Government Reorganisation?',
    answer: 'Structural reform can create uncertainty and political sensitivity. Clear, consistent communication helps maintain public confidence, democratic legitimacy and stakeholder trust during transition.',
  },
  {
    question: 'What sectors has Oliver Deed worked across?',
    answer: 'He has worked across residential development, infrastructure, regeneration and public sector projects, advising both public authorities and private sector partners.',
  },
];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oliver Deed',
  jobTitle: 'Managing Director',
  worksFor: { '@type': 'Organization', name: 'Local Government Reorganisation Initiative' },
  description: 'Oliver Deed is Managing Director and Co Founder of ECF and contributor to the Local Government Reorganisation Initiative, specialising in strategic communications, political engagement and infrastructure consultation.',
  areaOfExpertise: [
    'Strategic communications',
    'Local Government Reorganisation communications',
    'Political engagement',
    'Infrastructure consultation',
    'Stakeholder management',
  ],
  areaServed: 'United Kingdom',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: OLIVER_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function OliverDeed() {
  const location = useLocation();
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  return (
    <div className="bg-academic-cream min-h-screen">
      <SEOHead page="oliverDeed" />
      <MetaTags
        title="Oliver Deed | Managing Director ECF | Local Government Reorganisation Initiative"
        description="Oliver Deed is Managing Director and Co Founder of ECF and contributor to the Local Government Reorganisation Initiative, specialising in strategic communications, political engagement and infrastructure consultation."
        keywords="Oliver Deed, ECF, Local Government Reorganisation Initiative, strategic communications, political engagement, infrastructure consultation"
        ogTitle="Oliver Deed | Managing Director ECF | Local Government Reorganisation Initiative"
        ogDescription="Oliver Deed is Managing Director and Co Founder of ECF and contributor to the Local Government Reorganisation Initiative, specialising in strategic communications, political engagement and infrastructure consultation."
        ogImage="/Images/leadership/oliver-deed.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Oliver Deed"
        heroSubtitle="Managing Director, Local Government Reorganisation Initiative Contributor"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="academic-card p-8 md:p-10">
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/Images/leadership/oliver-deed.jpg"
                    alt="Oliver Deed, Managing Director ECF and contributor to the Local Government Reorganisation Initiative"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-2">
                    Oliver Deed
                  </h1>
                  <p className="text-academic-lg text-academic-neutral-700 mb-8 font-serif">
                    Managing Director, Local Government Reorganisation Initiative Contributor
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Role within the Local Government Reorganisation Initiative
                  </h2>
                  <p className="mb-4">
                    Oliver Deed contributes strategic communications and engagement expertise to the Local Government Reorganisation Initiative. His focus within the LGR Series is the interface between governance reform, political engagement and public legitimacy during periods of structural change.
                  </p>
                  <p className="mb-6">
                    He advises on how Local Government Reorganisation, unitary authority creation and council restructuring are communicated to residents, stakeholders and institutional partners. His work examines how public narrative, stakeholder confidence and political relations influence the success of governance transition.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Professional Background
                  </h2>
                  <p className="mb-4">
                    Oliver Deed is Co Founder and Managing Director of ECF. He is a strategic communications and engagement specialist with over ten years of experience in the United Kingdom and Australia.
                  </p>
                  <p className="mb-4">
                    He has led communications programmes across residential development, infrastructure, regeneration and public sector environments. His work integrates political engagement, stakeholder management and strategic narrative design within complex and high profile projects.
                  </p>
                  <p className="mb-6">
                    His experience includes advisory work for local authorities, development corporations, infrastructure providers and major regeneration clients.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Areas of Expertise
                  </h2>
                  <ul className="list-disc pl-6 space-y-1 mb-6">
                    <li>Strategic communications in local government environments</li>
                    <li>Political engagement and stakeholder management</li>
                    <li>Infrastructure and regeneration consultation</li>
                    <li>Public legitimacy during institutional transition</li>
                    <li>Governance reform communications strategy</li>
                    <li>Community engagement in contested development contexts</li>
                    <li>Executive level narrative development</li>
                  </ul>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Relevance to Local Government Reorganisation
                  </h2>
                  <p className="mb-4">
                    Local Government Reorganisation in England creates institutional uncertainty for residents, staff and elected members. Clear communication, political sequencing and stakeholder assurance are essential to maintain confidence during transition.
                  </p>
                  <p className="mb-8">
                    Oliver's experience in public sector communications and political engagement provides practical insight into how governance reform can be communicated transparently, lawfully and effectively. His contribution strengthens the Initiative's focus on public trust, delivery credibility and reputational resilience during structural change.
                  </p>
                </div>
              </div>
            </section>

            <section className="academic-card p-8 md:p-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {OLIVER_FAQS.map((faq, i) => (
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
                  <Link to="/oliver-deed-strategic-communications-local-government" className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded">
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
