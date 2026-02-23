import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MetaTags from '../../components/MetaTags';
import CollectionPageStructuredData from '../../components/CollectionPageStructuredData';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { useSidebarToc } from '../../contexts/SidebarTocContext';
import { leadershipProfiles } from '../../data/leadershipProfiles';
import { User, FileText, Users, Mail, Info } from 'lucide-react';

interface LeadershipProps {
  onNavigate: (page: string) => void;
}

const keyLinksList = [
  { label: 'Methodology', url: '/about/methodology', icon: FileText },
  { label: 'Contributors', url: '/about/contributors', icon: Users },
  { label: 'Contribute', url: '/about/contribute', icon: User },
  { label: 'Partnerships', url: '/partnerships', icon: Users },
  { label: 'Contact', url: '/contact', icon: Mail },
];

const leadershipToc = [
  { id: 'lead-partners', text: 'Lead Partners', level: 2 },
  { id: 'strategic-specialist-partners', text: 'Strategic/Specialist Partners', level: 2 },
  { id: 'editorial-policy', text: 'Editorial Policy & Independence', level: 2 },
  { id: 'getting-in-touch', text: 'Getting in Touch', level: 2 },
  { id: 'qas', text: 'Q&As', level: 2 },
];

export default function Leadership({ onNavigate: _onNavigate }: LeadershipProps) {
  const location = useLocation();
  const [, setTocItems] = useSidebarToc();

  useEffect(() => {
    setTocItems(leadershipToc);
    return () => setTocItems([]);
  }, [setTocItems]);

  return (
    <>
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="LGRI Leadership"
        heroSubtitle="Who is responsible for the LGRI, how editorial accountability operates, and who to contact on partnerships and content queries."
        currentPath={location.pathname}
      />
      <div data-page-main className="min-h-screen bg-academic-cream">
        <MetaTags
          title="LGRI Leadership"
          description="Meet the leadership behind the LGRI, including editorial accountability, research support and partner organisations. View short profiles and open full biographies."
          keywords="LGRI leadership, editorial team, LGR contributors, Rowan Cole, local government reorganisation"
        />
        <CollectionPageStructuredData
          name="LGRI Leadership"
          description="Who is responsible for the LGRI, how editorial accountability operates, and who to contact on partnerships, content queries and methodology."
          url="/about/leadership"
          numberOfItems={leadershipProfiles.length}
          items={leadershipProfiles.map((p) => ({ name: p.name, url: p.link, description: p.title }))}
        />
        <div className="layout-container layout-content-hub">
        <main className="min-w-0">
        <section id="lead-partners" className="mb-10 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4 group relative">
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal">Lead Partners</h3>
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-teal-600 bg-teal-50 text-teal-700 cursor-help flex-shrink-0 hover:bg-teal-100 hover:border-teal-700 transition-colors" aria-label="More about lead partners">
              <Info className="w-3 h-3" />
            </span>
            <div className="absolute left-0 top-full mt-2 z-10 w-full max-w-lg p-4 bg-white border border-academic-neutral-200 rounded-lg shadow-lg text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
              <p className="text-academic-sm font-serif text-academic-neutral-700 leading-relaxed mb-3">
                Lead partners may support the Initiative through convening power, access to expertise, and institutional backing. As the founder of the LGR Series, Coalface retains editorial control and responsibility for all published content, methodology and final outputs. The Centre for Britain and Europe, University of Surrey supports the Initiative by strengthening rigour, ensuring work is evidence led and methodologically transparent. All partners are able to contribute input and challenge within their area of expertise, including through structured review, but partners do not direct editorial decisions.
              </p>
              <h4 className="text-academic-sm font-display font-bold text-academic-charcoal mb-2">What lead partnership typically includes</h4>
              <ul className="list-disc pl-5 space-y-1 text-academic-sm font-serif text-academic-neutral-700">
                <li>Senior level support to programme direction and standards</li>
                <li>Support for methodology, transparency and quality assurance</li>
                <li>Practical enablement through networks, expertise, or delivery capacity</li>
                <li>Visible endorsement and longer term programme alignment</li>
              </ul>
            </div>
          </div>
          <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed mb-6">
            Lead partners are the principal institutional supporters of the LGRI. They provide high level support to programme direction, credibility, and delivery capacity, helping ensure outputs are rigorous, balanced and consistent over time.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {leadershipProfiles.filter((p) => p.partnerType === 'lead').map((profile) => (
            <Link
              key={profile.slug}
              to={profile.link}
              className="group academic-card p-6 block hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative flex-shrink-0 mb-4">
                  <div className="w-48 h-48 rounded-full bg-academic-neutral-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={profile.headshot}
                      alt={`Headshot of ${profile.name}, ${profile.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-4 w-20 h-20 rounded-full bg-white border-2 border-academic-neutral-200 overflow-hidden flex items-center justify-center shadow-sm">
                    {profile.organisationLogo ? (
                      <img src={profile.organisationLogo} alt={profile.organisation} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-academic-neutral-400 text-xs font-bold">{profile.organisation.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-academic-sm font-display font-bold text-academic-charcoal group-hover:text-teal-700 whitespace-nowrap">
                  {profile.name}
                </h3>
                <p className="text-academic-sm text-teal-700 font-medium whitespace-nowrap">{profile.title}</p>
                <p className="text-academic-sm text-academic-neutral-600 font-serif">{profile.organisation}</p>
              </div>
            </Link>
          ))}
          </div>
        </section>

        <section id="strategic-specialist-partners" className="scroll-mt-24">
          <div className="flex items-center gap-2 mb-4 group relative">
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal">Strategic & Specialist Partners</h3>
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-teal-600 bg-teal-50 text-teal-700 cursor-help flex-shrink-0 hover:bg-teal-100 hover:border-teal-700 transition-colors" aria-label="More about strategic and specialist partners">
              <Info className="w-3 h-3" />
            </span>
            <div className="absolute left-0 top-full mt-2 z-10 w-full max-w-lg p-4 bg-white border border-academic-neutral-200 rounded-lg shadow-lg text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
              <p className="text-academic-sm font-serif text-academic-neutral-700 leading-relaxed mb-3">
                Each partner&apos;s role is defined and presented on the site through a short contribution statement and tagged areas of work, so users can see what each partner supports and where it connects to content or tools.
              </p>
              <h4 className="text-academic-sm font-display font-bold text-academic-charcoal mb-2">What this partnership typically includes</h4>
              <ul className="list-disc pl-5 space-y-1 text-academic-sm font-serif text-academic-neutral-700">
                <li>Input to a specific theme, geography, dataset, tool, or publication</li>
                <li>Technical capability or platform support where relevant</li>
                <li>Distribution, convening, or network support to extend reach</li>
                <li>Structured review input limited to their area of contribution</li>
              </ul>
            </div>
          </div>
          <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed mb-6">
            Strategic and Specialist partners support the programme through defined contributions. This may include subject matter expertise, technical capability, data and insight support, convening, communications reach, or delivery input to specific tools, themes, or outputs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {(['oliver-deed', 'matthew-masters', 'charlie-moir'] as const).map((slug) => {
              const profile = leadershipProfiles.find((p) => p.slug === slug);
              if (!profile) return null;
              return (
            <Link
              key={profile.slug}
              to={profile.link}
              className="group academic-card p-6 block hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative flex-shrink-0 mb-4">
                  <div className="w-48 h-48 rounded-full bg-academic-neutral-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={profile.headshot}
                      alt={`Headshot of ${profile.name}, ${profile.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-4 w-20 h-20 rounded-full bg-white border-2 border-academic-neutral-200 overflow-hidden flex items-center justify-center shadow-sm">
                    {profile.organisationLogo ? (
                      <img src={profile.organisationLogo} alt={profile.organisation} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-academic-neutral-400 text-xs font-bold">{profile.organisation.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-academic-sm font-display font-bold text-academic-charcoal group-hover:text-teal-700 whitespace-nowrap">
                  {profile.name}
                </h3>
                <p className="text-academic-sm text-teal-700 font-medium whitespace-nowrap">{profile.title}</p>
                <p className="text-academic-sm text-academic-neutral-600 font-serif">{profile.organisation}</p>
              </div>
            </Link>
          );
            })}
          </div>
        </section>

        <section id="editorial-policy" className="mt-10 scroll-mt-24">
          <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-4">Editorial policy and independence</h3>
          <div className="academic-card p-6 md:p-8">
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed mb-6">
              The LGRI operates a clear separation between partner contribution and editorial decision making. Partner input is welcomed and used to improve accuracy, completeness and usefulness, including through suggestions, factual checks, and specialist review. Coalface remains accountable for the final content that appears on the site, including how sources are used, how methodology is applied, and how outputs are presented and updated over time. The Centre for Britain and Europe provides academic support to strengthen rigour, support transparency, and reinforce an evidence led approach.
            </p>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              Partners are encouraged to input, challenge and contribute within their area of expertise, including by informing research questions, highlighting sources, and participating in structured review. Editorial decisions, publication judgements, and final wording remain the responsibility of Coalface.
            </p>
          </div>
        </section>

        <section id="getting-in-touch" className="mt-10 scroll-mt-24">
          <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-4">Getting in Touch</h3>
          <div className="academic-card p-8">
            <ul className="space-y-3">
              {keyLinksList.map((item) => (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 text-academic-base font-serif text-teal-700 hover:text-teal-800 group"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 text-teal-600" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="qas" className="mt-10 scroll-mt-24">
          <FAQSection page="about-leadership" />
        </section>
        </main>
        </div>
      </div>
    </>
  );
}
