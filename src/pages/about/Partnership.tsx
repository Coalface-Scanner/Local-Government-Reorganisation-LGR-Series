import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import { useSidebarToc } from '../../contexts/SidebarTocContext';

interface PartnershipProps {
  onNavigate: (page: string) => void;
}

const partnershipToc = [
  { id: 'our-partnership', text: 'Our Partnership', level: 2 },
  { id: 'how-partnership-works', text: 'How the Partnership Works', level: 2 },
  { id: 'shared-commitment', text: 'Shared Commitment', level: 2 },
  { id: 'supporting-better-governance', text: 'Supporting Better Governance', level: 2 },
  { id: 'editorial-policy', text: 'Editorial policy and independence', level: 2 },
  { id: 'coalface', text: 'COALFACE Engagement Ltd', level: 2 },
  { id: 'centre-britain-europe', text: 'Centre for Britain and Europe', level: 2 },
  { id: 'ecf', text: 'ECF – Engage Communicate Facilitate', level: 2 },
  { id: 'commonplace', text: 'Commonplace', level: 2 },
  { id: 'truth-about-local-government', text: 'Truth About Local Government', level: 2 },
];

export default function Partnership({ onNavigate: _onNavigate }: PartnershipProps) {
  const location = useLocation();
  const [, setTocItems] = useSidebarToc();

  useEffect(() => {
    setTocItems(partnershipToc);
    return () => setTocItems([]);
  }, [setTocItems]);

  const sectionClass = 'mb-10 scroll-mt-24';
  const h2Class = 'text-academic-2xl font-display font-bold text-academic-charcoal mb-4';
  const pClass = 'text-academic-base font-serif text-academic-neutral-700 leading-relaxed mb-4';
  const ulClass = 'list-disc pl-6 space-y-1 text-academic-base font-serif text-academic-neutral-700 mb-4';
  const linkClass = 'text-teal-700 hover:text-teal-800 underline transition-colors';
  const anchorClass = 'text-inherit no-underline hover:text-academic-charcoal hover:underline';
  const logoBase = '/Images/leadership/logos';
  const logoImgClass = 'max-h-24 w-auto object-contain';
  const logoImgClassLg = 'max-h-40 w-auto object-contain';
  const partnerSectionLayout = 'grid grid-cols-1 md:grid-cols-[1fr_14rem] gap-4 md:gap-6 md:items-center';
  const partnerContentClass = 'min-w-0';
  const partnerLogoWrapClass = 'flex shrink-0 flex-wrap items-center justify-center gap-3';

  return (
    <>
      <SEOHead page="aboutPartnership" />
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Our Partnership"
        heroSubtitle="Lead and Strategic Partners delivering the Local Government Reorganisation Initiative."
        currentPath={location.pathname}
      />
      <div data-page-main className="min-h-screen bg-academic-cream">
        <MetaTags
          title="Our Partnership | Local Government Reorganisation Initiative"
          description="The LGR Initiative is delivered through a formal partnership of organisations with expertise in governance, public policy, academic research, practitioner insight and citizen engagement."
          keywords="LGR partnership, COALFACE, Centre for Britain and Europe, Commonplace, Truth About Local Government, local government reform"
        />
        <div className="layout-container layout-content-hub">
          <main className="min-w-0">
            <section id="our-partnership" className={sectionClass}>
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                <div className="flex shrink-0 flex justify-center md:justify-start">
                  <img
                    src={`${logoBase}/Local-Governement-Reorganisation-Initiative-Logo.png`}
                    alt="Local Government Reorganisation Initiative"
                    className="max-h-96 md:max-h-[28rem] w-auto object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className={h2Class}>Our Partnership</h2>
                  <p className={pClass}>
                    <strong>Lead and Strategic Partners</strong>
                  </p>
                  <p className={pClass}>
                    The Local Government Reorganisation Initiative is delivered through a formal partnership of organisations with complementary expertise in governance, public policy, academic research, practitioner insight and citizen engagement.
                  </p>
                  <p className={`${pClass} mb-2`}>Our partners are:</p>
                  <ul className={ulClass}>
                    <li><a href="#coalface" className={anchorClass}>COALFACE Engagement Ltd</a></li>
                    <li><a href="#centre-britain-europe" className={anchorClass}>Centre for Britain and Europe (University of Surrey)</a></li>
                    <li><a href="#ecf" className={anchorClass}>ECF – Engage Communicate Facilitate</a></li>
                    <li><a href="#commonplace" className={anchorClass}>Commonplace</a></li>
                    <li><a href="#truth-about-local-government" className={anchorClass}>Truth About Local Government</a></li>
                  </ul>
                  <p className={pClass}>
                    Together, these partners ensure that the Initiative combines academic strength, practical insight, community engagement technology and sector-wide perspective.
                  </p>
                </div>
              </div>
            </section>

            <section id="how-partnership-works" className={sectionClass}>
              <h2 className={h2Class}>How the Partnership Works</h2>
              <p className={pClass}>
                The partnership operates on defined principles that ensure quality, relevance and institutional integrity:
              </p>
              <ul className={ulClass}>
                <li><strong>Independence and role clarity:</strong> Each partner retains its own governance and decision-making structures, contributing discreet expertise without compromising autonomy.</li>
                <li><strong>Structured collaboration:</strong> Outputs are developed through staged review with clear allocation of research, drafting, engagement and dissemination responsibilities.</li>
                <li><strong>Integrated expertise:</strong> Academic research, practice-led insight, technology-enabled engagement and sector perspectives are combined to produce outputs that are credible, practical and widely relevant.</li>
              </ul>
            </section>

            <section id="shared-commitment" className={sectionClass}>
              <h2 className={h2Class}>Shared Commitment</h2>
              <p className={pClass}>
                This partnership is united by a commitment to:
              </p>
              <ul className={ulClass}>
                <li><strong>Rigorous evidence:</strong> Producing analysis that withstands academic and policy scrutiny.</li>
                <li><strong>Practical relevance:</strong> Informing decision-making across government, civil society and communities.</li>
                <li><strong>Inclusive engagement:</strong> Leveraging technology and best practice to ensure broad representation of resident voices.</li>
                <li><strong>Transparent process:</strong> Clear governance and transparent collaboration in all outputs.</li>
              </ul>
            </section>

            <section id="supporting-better-governance" className={sectionClass}>
              <h2 className={h2Class}>Supporting Better Governance</h2>
              <p className={pClass}>
                Through this partnership, the LGR Initiative ensures that local government reform is evaluated and guided using robust evidence, sector insight, community engagement technologies and leadership-oriented resources. This strengthens the capacity of decision-makers and communities to navigate change with clarity, coherence and public trust.
              </p>
            </section>

            <section id="editorial-policy" className={sectionClass}>
              <h2 className={h2Class}>Editorial policy and independence</h2>
              <p className={pClass}>
                The LGR Initiative operates a clear separation between partner contribution and editorial decision making. Partner input is welcomed and used to improve accuracy, completeness and usefulness, including through suggestions, factual checks, and specialist review. Coalface remains accountable for the final content that appears on the site, including how sources are used, how methodology is applied, and how outputs are presented and updated over time. The Centre for Britain and Europe provides academic support to strengthen rigour, support transparency, and reinforce an evidence led approach.
              </p>
              <p className={pClass}>
                Partners are encouraged to input, challenge and contribute within their area of expertise, including by informing research questions, highlighting sources, and participating in structured review. Editorial decisions, publication judgements, and final wording remain the responsibility of Coalface.
              </p>
            </section>

            <section id="coalface" className={sectionClass}>
              <div className={partnerSectionLayout}>
                <div className={partnerContentClass}>
                  <h2 className={h2Class}>COALFACE Engagement Ltd</h2>
                  <p className={pClass}>
                    COALFACE Engagement Ltd is a UK-based communications consultancy specialising in stakeholder engagement, public consultation and strategic insight for planning and governance reforms. COALFACE publishes the Local Government Reorganisation (LGR) Series, providing independent analysis of structural reform, governance models and service outcomes in England. Its expertise supports evidence-informed debate that centres residents and decision makers.
                  </p>
                  <p className="text-academic-sm font-serif text-academic-neutral-600">
                    <a href="https://coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Visit coalfaceengagement.co.uk
                    </a>
                  </p>
                </div>
                <a href="https://coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className={partnerLogoWrapClass}>
                  <img src={`${logoBase}/coalface.png`} alt="COALFACE Engagement Ltd" className={logoImgClassLg} />
                </a>
              </div>
            </section>

            <section id="centre-britain-europe" className={sectionClass}>
              <div className={partnerSectionLayout}>
                <div className={partnerContentClass}>
                  <h2 className={h2Class}>Centre for Britain and Europe (University of Surrey)</h2>
                  <p className={pClass}>
                    The Centre for Britain and Europe is a research centre within the School of Politics and International Relations at the University of Surrey. It conducts high-quality policy research on governance, public administration and the UK’s role within evolving political systems. The Centre brings analytic rigour, peer review capability and academic depth to the partnership’s work.
                  </p>
                  <p className="text-academic-sm font-serif text-academic-neutral-600">
                    <a href="https://surrey.ac.uk/centre-britain-and-europe" target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Visit surrey.ac.uk/centre-britain-and-europe
                    </a>
                  </p>
                </div>
                <div className={`${partnerLogoWrapClass} flex-col`}>
                  <img src={`${logoBase}/CBE%20Battersea%20Blue%20logo.png`} alt="Centre for Britain and Europe" className={logoImgClass} />
                  <img src={`${logoBase}/Pol%20and%20IR%20Logo.jpg`} alt="School of Politics and International Relations, University of Surrey" className={logoImgClass} />
                </div>
              </div>
            </section>

            <section id="ecf" className={sectionClass}>
              <div className={partnerSectionLayout}>
                <div className={partnerContentClass}>
                  <h2 className={h2Class}>ECF – Engage Communicate Facilitate</h2>
                  <p className={pClass}>
                    ECF (Engage Communicate Facilitate) is a specialist communications and engagement consultancy working across the United Kingdom and Australia. The organisation supports clients in delivering integrated engagement and communications programmes for complex, built environment, infrastructure, planning and regeneration projects. ECF combines advisory services, strategic communications design and facilitation to help clients connect with communities, stakeholders and decision-makers. Their practice blends digital tools with deliberative and in-person engagement techniques, enhancing participation and insight in public decision-making processes.
                  </p>
                  <p className="text-academic-sm font-serif text-academic-neutral-600">
                    <a href="https://englishcitiesfund.co.uk" target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Visit englishcitiesfund.co.uk
                    </a>
                  </p>
                </div>
                <a href="https://englishcitiesfund.co.uk" target="_blank" rel="noopener noreferrer" className={partnerLogoWrapClass}>
                  <img src={`${logoBase}/ecf.png`} alt="ECF – Engage Communicate Facilitate" className={logoImgClassLg} />
                </a>
              </div>
            </section>

            <section id="commonplace" className={sectionClass}>
              <div className={partnerSectionLayout}>
                <div className={partnerContentClass}>
                  <h2 className={h2Class}>Commonplace</h2>
                  <p className={pClass}>
                    Commonplace is a digital citizen engagement and community insight platform now part of Zencity. It is used by over 250 local authorities, developers and community organisations to connect residents with planning, policy and place-making decision-making processes. The platform combines interactive tools with analytics to convert resident feedback into actionable insights that support inclusive public consultation and evidence-led decision-making.
                  </p>
                  <p className="text-academic-sm font-serif text-academic-neutral-600">
                    <a href="https://www.commonplace.is" target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Visit commonplace.is
                    </a>
                  </p>
                </div>
                <a href="https://www.commonplace.is" target="_blank" rel="noopener noreferrer" className={partnerLogoWrapClass}>
                  <img src={`${logoBase}/commonplace.png`} alt="Commonplace" className={logoImgClassLg} />
                </a>
              </div>
            </section>

            <section id="truth-about-local-government" className={sectionClass}>
              <div className={partnerSectionLayout}>
                <div className={partnerContentClass}>
                  <h2 className={h2Class}>Truth About Local Government</h2>
                  <p className={pClass}>
                    Truth About Local Government is a UK-focused sector resource and leadership platform that supports local government officers, councillors and stakeholders through leadership development, practical insights and thought leadership. It hosts a leading podcast and publishes analysis, courses and resources designed to build resilience, improve governance practice and support professional growth within local government. The organisation engages with core challenges facing councils, including transformation, governance design and democratic accountability.
                  </p>
                  <p className="text-academic-sm font-serif text-academic-neutral-600">
                    <a href="https://www.truthaboutlocalgovernment.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Visit truthaboutlocalgovernment.com
                    </a>
                  </p>
                </div>
                <a href="https://www.truthaboutlocalgovernment.com" target="_blank" rel="noopener noreferrer" className={partnerLogoWrapClass}>
                  <img src={`${logoBase}/truth-about-local-government.png`} alt="Truth About Local Government" className={logoImgClassLg} />
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
