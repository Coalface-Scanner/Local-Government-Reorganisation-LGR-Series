import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AMELIA_FAQS = [
  {
    question: 'What is Professor Amelia Hadfield\'s role in the Local Government Reorganisation Initiative?',
    answer: 'She serves as Senior Academic and Policy Adviser, providing comparative governance expertise and academic oversight.',
  },
  {
    question: 'What expertise does Professor Hadfield contribute to Local Government Reorganisation analysis?',
    answer: 'Her scholarship covers sovereignty, institutional restructuring and multi level governance systems, offering comparative perspective on structural reform in the United Kingdom.',
  },
  {
    question: 'Why is comparative governance relevant to English council restructuring?',
    answer: 'Comparative analysis demonstrates how institutional design choices affect democratic accountability, executive authority and public legitimacy during structural transition.',
  },
  {
    question: 'What is Professor Hadfield\'s experience in policy advisory environments?',
    answer: 'She holds senior university leadership roles and contributes to international governance and sustainability initiatives, linking academic research with applied policy contexts.',
  },
];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Professor Amelia Hadfield',
  jobTitle: 'Senior Academic and Policy Adviser',
  worksFor: { '@type': 'Organization', name: 'Local Government Reorganisation Initiative' },
  description: 'Professor Amelia Hadfield is Senior Academic and Policy Adviser to the Local Government Reorganisation Initiative, specialising in governance reform, institutional restructuring and democratic legitimacy.',
  areaOfExpertise: [
    'Governance reform',
    'Institutional restructuring',
    'Sovereignty',
    'Multi level governance',
    'Democratic legitimacy',
  ],
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: AMELIA_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function ProfessorAmeliaHadfield() {
  const location = useLocation();
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Professor Amelia Hadfield | Senior Academic and Policy Adviser | LGRI"
        description="Professor Amelia Hadfield is Senior Academic and Policy Adviser to the Local Government Reorganisation Initiative, specialising in governance reform, institutional restructuring and democratic legitimacy."
        keywords="Professor Amelia Hadfield, LGRI, governance reform, institutional restructuring, democratic legitimacy, Local Government Reorganisation"
        ogTitle="Professor Amelia Hadfield | Senior Academic and Policy Adviser | LGRI"
        ogDescription="Professor Amelia Hadfield is Senior Academic and Policy Adviser to the Local Government Reorganisation Initiative, specialising in governance reform, institutional restructuring and democratic legitimacy."
        ogImage="/Images/leadership/amelia-hadfield.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Professor Amelia Hadfield"
        heroSubtitle="Senior Academic and Policy Adviser, Local Government Reorganisation Initiative"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="academic-card p-8 md:p-10">
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/Images/leadership/amelia-hadfield.jpg"
                    alt="Professor Amelia Hadfield, Senior Academic and Policy Adviser to the Local Government Reorganisation Initiative"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-2">
                    Professor Amelia Hadfield
                  </h1>
                  <p className="text-academic-lg text-academic-neutral-700 mb-8 font-serif">
                    Senior Academic and Policy Adviser, Local Government Reorganisation Initiative
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Role within the Local Government Reorganisation Initiative
                  </h2>
                  <p className="mb-4">
                    Professor Amelia Hadfield serves as Senior Academic and Policy Adviser to the Local Government Reorganisation Initiative. She provides academic oversight and comparative governance expertise, ensuring that analysis of Local Government Reorganisation in England is grounded in established research on sovereignty, institutional transition and democratic legitimacy.
                  </p>
                  <p className="mb-6">
                    Her contribution strengthens the Initiative's evidence base in relation to governance reform, unitary authority design and institutional resilience during structural change.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Academic Leadership
                  </h2>
                  <p className="mb-4">
                    Professor Hadfield is Chair in European and International Affairs at the University of Surrey. She has served as Head of Department, Dean International and Associate Vice President of External Engagement.
                  </p>
                  <p className="mb-4">
                    She is a Jean Monnet Chair in European Foreign Affairs and founder of the Centre for Britain and Europe, a Jean Monnet Centre of Excellence.
                  </p>
                  <p className="mb-6">
                    She is inaugural Director of the CIFAL Surrey Centre, established in partnership with the United Nations Institute for Training and Research, focusing on climate leadership and sustainability governance.
                  </p>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Research and Policy Expertise
                  </h2>
                  <ul className="list-disc pl-6 space-y-1 mb-6">
                    <li>Sovereignty and institutional restructuring</li>
                    <li>Multi level governance systems</li>
                    <li>Public authority design and legitimacy</li>
                    <li>Comparative governance reform</li>
                    <li>Democratic accountability frameworks</li>
                    <li>International political economy</li>
                    <li>Public policy analysis</li>
                  </ul>

                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mt-8 mb-3">
                    Relevance to English Local Government Reform
                  </h2>
                  <p className="mb-4">
                    Professor Hadfield's research on sovereignty, governance integration and institutional evolution provides comparative perspective on the creation of unitary authorities and structural reform in England.
                  </p>
                  <p className="mb-8">
                    Her expertise strengthens the Initiative's analytical framework by situating local government reorganisation within wider scholarship on institutional design and democratic accountability.
                  </p>
                </div>
              </div>
            </section>

            <section className="academic-card p-8 md:p-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {AMELIA_FAQS.map((faq, i) => (
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
                  <Link to="/professor-amelia-hadfield-governance-reform" className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded">
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
