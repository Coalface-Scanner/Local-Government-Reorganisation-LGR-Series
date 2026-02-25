import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MATTHEW_FAQS = [
  {
    question: 'What is Matthew Masters\' role in the Local Government Reorganisation Initiative?',
    answer: 'Matthew Masters contributes leadership and workforce expertise to the Initiative, focusing on executive capability, organisational culture and workforce resilience during council restructuring.',
  },
  {
    question: 'Why is workforce strategy important during Local Government Reorganisation?',
    answer: 'Structural reform requires integration of teams, redesign of operating models and continuity of leadership. Without effective workforce planning, governance reform can undermine delivery capacity.',
  },
  {
    question: 'What experience does Matthew Masters bring to local government leadership?',
    answer: 'He leads executive search and workforce solutions for councils and public sector organisations, supporting the appointment of senior leaders and specialist roles across complex environments.',
  },
  {
    question: 'How does organisational culture affect new unitary authorities?',
    answer: 'Cultural alignment influences staff morale, leadership stability and performance outcomes. During reorganisation, culture design is critical to sustaining public service delivery.',
  },
];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Matthew Masters',
  jobTitle: 'Leadership and Workforce Adviser',
  worksFor: { '@type': 'Organization', name: 'Local Government Reorganisation Initiative' },
  description: 'Matthew Masters contributes leadership and workforce expertise to the Local Government Reorganisation Initiative, specialising in executive recruitment, workforce resilience and organisational culture in local government.',
  areaOfExpertise: [
    'Local Government Reorganisation workforce strategy',
    'Executive recruitment in local authorities',
    'Organisational culture',
    'Workforce resilience',
    'Leadership capability',
  ],
  areaServed: 'England',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MATTHEW_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function MatthewMasters() {
  const location = useLocation();
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Matthew Masters | Leadership and Workforce Adviser | Local Government Reorganisation Initiative"
        description="Matthew Masters contributes leadership and workforce expertise to the Local Government Reorganisation Initiative, specialising in executive recruitment, workforce resilience and organisational culture in local government."
        keywords="Matthew Masters, Local Government Reorganisation Initiative, leadership, workforce, executive recruitment, organisational culture"
        ogTitle="Matthew Masters | Leadership and Workforce Adviser | Local Government Reorganisation Initiative"
        ogDescription="Matthew Masters contributes leadership and workforce expertise to the Local Government Reorganisation Initiative, specialising in executive recruitment, workforce resilience and organisational culture in local government."
        ogImage="/Images/leadership/matthew-masters.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Matthew Masters"
        heroSubtitle="Leadership and Workforce Adviser, Local Government Reorganisation Initiative"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="academic-card p-8 md:p-10">
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/Images/leadership/matthew-masters.jpg"
                    alt="Matthew Masters, Leadership and Workforce Adviser to the Local Government Reorganisation Initiative"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-2">
                    Matthew Masters
                  </h1>
                  <p className="text-academic-lg text-academic-neutral-700 mb-8 font-serif">
                    Leadership and Workforce Adviser, Local Government Reorganisation Initiative
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Role within the Local Government Reorganisation Initiative
                  </h2>
                  <p className="mb-4">
                    Matthew Masters contributes leadership, culture and workforce capability insight to the Local Government Reorganisation Initiative. His focus within the LGR Series is how council restructuring and unitary authority creation are experienced in practice by senior leadership teams, managers and the wider workforce.
                  </p>
                  <p className="mb-6">
                    He provides perspective on organisational design, executive capability, workforce resilience and culture during Local Government Reorganisation in England.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Professional Background
                  </h2>
                  <p className="mb-4">
                    Matthew is Head of Executive Workforce Solutions at OPUS People Solutions, a local authority trading company. He leads executive interim and permanent search activity and supports councils in securing senior leadership and specialist capability across complex public sector environments.
                  </p>
                  <p className="mb-4">
                    He is also host of the Truth About Local Government podcast and a leadership coach and culture consultant, with particular expertise in neurodivergent leadership and inclusive organisational practice.
                  </p>
                  <p className="mb-6">
                    His work centres on strengthening leadership pipelines, building resilient workforce models and improving organisational effectiveness across local government.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Areas of Expertise
                  </h2>
                  <ul className="list-disc pl-6 space-y-1 mb-6">
                    <li>Leadership capability during Local Government Reorganisation</li>
                    <li>Workforce strategy and organisational design</li>
                    <li>Executive recruitment in local authorities</li>
                    <li>Workforce capacity assessment and resilience planning</li>
                    <li>Organisational culture and performance</li>
                    <li>Neurodivergent leadership and inclusive practice</li>
                    <li>Value for money in public sector workforce models</li>
                  </ul>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Relevance to Local Government Reorganisation
                  </h2>
                  <p className="mb-4">
                    Local Government Reorganisation creates significant organisational uncertainty. Leadership transitions, workforce integration and cultural alignment are central to whether new unitary authorities succeed.
                  </p>
                  <p className="mb-8">
                    Matthew's work focuses on evidence based workforce strategy, executive capability assessment and culture design. His contribution strengthens the Initiative's analysis of how governance reform translates into practical organisational performance.
                  </p>
                </div>
              </div>
            </section>

            <section className="academic-card p-8 md:p-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {MATTHEW_FAQS.map((faq, i) => (
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
                  <Link to="/matthew-masters-local-government-leadership" className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded">
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
