import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Building2, Home, TrendingUp, AlertCircle, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import { getCouncilBySlug, surreyCouncils } from '../data/surreyCouncils';
import FAQSection from '../components/FAQSection';
import LastUpdated from '../components/LastUpdated';
import CouncilProfilesPasswordProtection from '../components/CouncilProfilesPasswordProtection';
import Breadcrumbs from '../components/Breadcrumbs';
import LocalPlaceStructuredData from '../components/LocalPlaceStructuredData';

export default function CouncilProfileDetail() {
  const { slug } = useParams<{ slug: string }>();
  const council = slug ? getCouncilBySlug(slug) : undefined;

  if (!council) {
    return (
      <CouncilProfilesPasswordProtection>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black text-neutral-900 mb-4">Council Not Found</h1>
            <p className="text-neutral-600 mb-6">The council profile you're looking for doesn't exist.</p>
            <Link
              to="/council-profiles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Council Profiles
            </Link>
          </div>
        </div>
      </CouncilProfilesPasswordProtection>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Borough':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'District':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'County':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getUnitaryColor = (unitary: string) => {
    switch (unitary) {
      case 'East Surrey':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'West Surrey':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'County':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Calculate demographics visualization
  const maxDemographic = council.demographics?.ageGroups.reduce((max, group) => 
    Math.max(max, group.percentage), 0) || 0;

  // Related councils in same unitary
  const relatedCouncils = surreyCouncils.filter(
    c => c.futureUnitary === council.futureUnitary && c.id !== council.id
  );

  return (
    <CouncilProfilesPasswordProtection>
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title={(() => {
          const title = `${council.name} Profile - Surrey Council Profiles`;
          const maxTitleLength = 56; // 70 - 14 (" | LGR Series")
          return title.length > maxTitleLength ? title.substring(0, maxTitleLength - 3) + '...' : title;
        })()}
        description={(() => {
          let desc = council.description || `Profile of ${council.name}, a ${council.type.toLowerCase()} council in Surrey.`;
          if (desc.length < 25) {
            desc = `Profile of ${council.name}, a ${council.type.toLowerCase()} council in Surrey. Key statistics and information.`;
          }
          if (desc.length > 160) {
            desc = desc.substring(0, 157) + '...';
          }
          return desc;
        })()}
        keywords={`${council.name}, Surrey council, ${council.type}, local authority profile, council statistics`}
      />
      <LocalPlaceStructuredData
        name={council.name}
        description={council.description}
        type="AdministrativeArea"
        address={{
          addressLocality: council.name.replace(' Council', '').replace(' Borough', '').replace(' District', ''),
          addressRegion: "Surrey",
          addressCountry: "GB"
        }}
        containedInPlace={{
          name: "Surrey",
          type: "AdministrativeArea"
        }}
        areaServed={[council.name.replace(' Council', '')]}
        url={`/council-profiles/${council.slug}`}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Council Profiles', path: '/council-profiles' },
              { label: council.name.replace(' Council', '') }
            ]}
            className="mb-6"
          />
          <Link
            to="/council-profiles"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Council Profiles
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-4 py-2 text-sm font-bold rounded-full border ${getTypeColor(council.type)}`}>
              {council.type}
            </span>
            {council.futureUnitary && council.futureUnitary !== 'County' && (
              <span className={`px-4 py-2 text-sm font-bold rounded-full border ${getUnitaryColor(council.futureUnitary)}`}>
                Future: {council.futureUnitary} Unitary
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[0.95] mb-4">
            {council.name.replace(' Council', '')}
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            {council.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Statistics */}
            {council.keyStats && (
              <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-teal-700" size={24} />
                  Key Statistics
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {council.keyStats.map((stat, index) => (
                    <div key={index} className="border-l-4 border-teal-700 pl-4">
                      <div className="text-sm font-medium text-neutral-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demographics */}
            {council.demographics && (
              <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                  <Users className="text-teal-700" size={24} />
                  Demographics
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                    <div className="text-sm font-medium text-teal-700 mb-2">Employment Rate</div>
                    <div className="text-3xl font-black text-teal-900">{council.demographics.employment}%</div>
                    <div className="w-full bg-teal-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-teal-700 h-2 rounded-full transition-all"
                        style={{ width: `${council.demographics.employment}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="text-sm font-medium text-blue-700 mb-2">Higher Education</div>
                    <div className="text-3xl font-black text-blue-900">{council.demographics.education}%</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-blue-700 h-2 rounded-full transition-all"
                        style={{ width: `${council.demographics.education}%` }}
                      ></div>
                    </div>
                  </div>
                  {council.housing && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <div className="text-sm font-medium text-purple-700 mb-2">Avg. House Price</div>
                      <div className="text-3xl font-black text-purple-900">£{(council.housing.averageHousePrice / 1000).toFixed(0)}k</div>
                    </div>
                  )}
                </div>

                {/* Age Groups Visualization */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Age Distribution</h3>
                  <div className="space-y-4">
                    {council.demographics.ageGroups.map((group, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-700">{group.label}</span>
                          <span className="text-sm font-bold text-neutral-900">{group.percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-teal-700 h-4 rounded-full transition-all"
                            style={{ width: `${(group.percentage / maxDemographic) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Housing */}
            {council.housing && (
              <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                  <Home className="text-teal-700" size={24} />
                  Housing
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border-l-4 border-teal-700 pl-4">
                    <div className="text-sm font-medium text-neutral-600 mb-1">Total Housing</div>
                    <div className="text-2xl font-black text-neutral-900">{council.housing.totalHousing.toLocaleString()}</div>
                  </div>
                  <div className="border-l-4 border-green-700 pl-4">
                    <div className="text-sm font-medium text-neutral-600 mb-1">Affordable Housing</div>
                    <div className="text-2xl font-black text-neutral-900">{council.housing.affordableHousing.toLocaleString()}</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {((council.housing.affordableHousing / council.housing.totalHousing) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="border-l-4 border-purple-700 pl-4">
                    <div className="text-sm font-medium text-neutral-600 mb-1">Average Price</div>
                    <div className="text-2xl font-black text-neutral-900">£{(council.housing.averageHousePrice / 1000).toFixed(0)}k</div>
                  </div>
                </div>

                {/* Affordable Housing Visualization */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-700">Affordable Housing Share</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {((council.housing.affordableHousing / council.housing.totalHousing) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-6 overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${(council.housing.affordableHousing / council.housing.totalHousing) * 100}%` }}
                    >
                      Affordable
                    </div>
                    <div 
                      className="bg-gradient-to-r from-neutral-400 to-neutral-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${((council.housing.totalHousing - council.housing.affordableHousing) / council.housing.totalHousing) * 100}%` }}
                    >
                      Market
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Services */}
            {council.services && council.services.length > 0 && (
              <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                  <Building2 className="text-teal-700" size={24} />
                  Services
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {council.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-teal-50 rounded-lg px-4 py-3 border border-teal-200 text-sm font-medium text-teal-900"
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Challenges & Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
              {council.challenges && council.challenges.length > 0 && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                  <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={24} />
                    Key Challenges
                  </h2>
                  <ul className="space-y-3">
                    {council.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 leading-relaxed">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {council.opportunities && council.opportunities.length > 0 && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                  <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={24} />
                    Opportunities
                  </h2>
                  <ul className="space-y-3">
                    {council.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 leading-relaxed">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Future Unitary Info */}
              {council.futureUnitary && council.futureUnitary !== 'County' && (
                <div className={`bg-white rounded-xl p-6 shadow-sm border-2 ${getUnitaryColor(council.futureUnitary)}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="text-teal-700" size={20} />
                    <h3 className="font-black text-neutral-900">Future Unitary</h3>
                  </div>
                  <div className="text-2xl font-black mb-2">{council.futureUnitary}</div>
                  <p className="text-sm text-neutral-600">
                    This council will become part of the {council.futureUnitary} unitary authority from 1 April 2027.
                  </p>
                </div>
              )}

              {/* Related Councils */}
              {relatedCouncils.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                  <h3 className="font-black text-neutral-900 mb-4">Related Councils</h3>
                  <div className="space-y-2">
                    {relatedCouncils.map((related) => (
                      <Link
                        key={related.id}
                        to={`/council-profiles/${related.slug}`}
                        className="block p-3 rounded-lg hover:bg-teal-50 border border-neutral-200 hover:border-teal-300 transition-all"
                      >
                        <div className="font-bold text-sm text-neutral-900 mb-1">
                          {related.name.replace(' Council', '')}
                        </div>
                        <div className="text-xs text-neutral-600">{related.type}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 shadow-sm border border-teal-200">
                <h3 className="font-black text-neutral-900 mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  {council.population && (
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-teal-700" />
                      <span className="font-medium text-neutral-700">Population:</span>
                      <span className="font-bold text-neutral-900">{council.population.toLocaleString()}</span>
                    </div>
                  )}
                  {council.area && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-teal-700" />
                      <span className="font-medium text-neutral-700">Area:</span>
                      <span className="font-bold text-neutral-900">{council.area} km²</span>
                    </div>
                  )}
                  {council.services && (
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-teal-700" />
                      <span className="font-medium text-neutral-700">Services:</span>
                      <span className="font-bold text-neutral-900">{council.services.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="council-profile" />
      <LastUpdated />
    </div>
    </CouncilProfilesPasswordProtection>
  );
}
