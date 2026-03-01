import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { getLeadershipProfile } from '../../data/leadershipProfiles';
import { User, ArrowLeft } from 'lucide-react';

export default function LeadershipBio() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = slug ? getLeadershipProfile(slug) : undefined;

  if (!profile) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center px-4">
        <div className="academic-card p-8 max-w-md text-center">
          <h1 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">Profile not found</h1>
          <p className="text-academic-neutral-600 mb-6 font-serif">The leadership profile you're looking for doesn't exist.</p>
          <Link to="/about/leadership" className="academic-button academic-button-primary">
            Back to Leadership
          </Link>
        </div>
      </div>
    );
  }

  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    worksFor: { '@type': 'Organization', name: profile.organisation },
    description: profile.bio_sections?.biography ?? '',
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead
        page="aboutLeadership"
        overrides={{
          title: `${profile.name} | LGR Initiative`,
          description: `${profile.name} profile for the LGR Initiative, including role, organisational affiliation, and full biography.`,
          path: `/about/leadership/${slug}`,
        }}
      />
      <MetaTags
        title={profile.name}
        description={`${profile.name} profile for the LGR Initiative, including role, organisational affiliation, and full biography.`}
        keywords={`${profile.name}, LGR Initiative, ${profile.organisation}, leadership, local government reorganisation`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
      />
      <PageBanner
        heroLabel="ABOUT"
        heroTitle={profile.name}
        heroSubtitle={`${profile.title} · ${profile.organisation}`}
        currentPath={location.pathname}
        breadcrumbCurrentLabel={profile.name}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/about/leadership')}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Leadership
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg overflow-hidden bg-academic-neutral-200">
                <img
                  src={profile.headshot}
                  alt={`Headshot of ${profile.name}, ${profile.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="absolute inset-0 w-full h-full bg-teal-100 flex items-center justify-center hidden">
                  <User className="w-16 h-16 text-teal-700" />
                </div>
              </div>
              <div className="absolute -top-2 -right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-academic-neutral-200 overflow-hidden flex items-center justify-center shadow-md">
                {profile.organisationLogo ? (
                  <img src={profile.organisationLogo} alt={profile.organisation} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-academic-neutral-400 text-sm sm:text-base font-bold">{profile.organisation.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 academic-prose">
            {profile.bio_sections?.role_and_responsibilities && (
              <section className="mb-6">
                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">Role and responsibilities</h2>
                <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
                  {profile.bio_sections.role_and_responsibilities}
                </p>
              </section>
            )}
            {profile.bio_sections?.biography && (
              <section className="mb-6">
                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">Biography</h2>
                <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
                  {profile.bio_sections.biography}
                </p>
              </section>
            )}
            {profile.bio_sections?.areas_of_focus && profile.bio_sections.areas_of_focus.length > 0 && (
              <section className="mb-6">
                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">Areas of focus</h2>
                <ul className="list-disc pl-6 space-y-1 text-academic-base font-serif text-academic-neutral-700">
                  {profile.bio_sections.areas_of_focus.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </section>
            )}
            {profile.bio_sections?.links && profile.bio_sections.links.length > 0 && (
              <section>
                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">Links</h2>
                <ul className="space-y-2">
                  {profile.bio_sections.links.map((link) => (
                    <li key={link.url}>
                      <Link to={link.url} className="text-teal-700 hover:text-teal-800 font-medium underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      <FAQSection page="about-leadership" />
    </div>
  );
}
