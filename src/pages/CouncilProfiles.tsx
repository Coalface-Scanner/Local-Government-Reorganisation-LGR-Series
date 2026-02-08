import { Link, useLocation } from 'react-router-dom';
import { MapPin, Users, Building2, ArrowRight } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { surreyCouncils } from '../data/surreyCouncils';
import FAQSection from '../components/FAQSection';
import LastUpdated from '../components/LastUpdated';
import CouncilProfilesPasswordProtection from '../components/CouncilProfilesPasswordProtection';

export default function CouncilProfiles() {
  const eastSurrey = surreyCouncils.filter(c => c.futureUnitary === 'East Surrey');
  const westSurrey = surreyCouncils.filter(c => c.futureUnitary === 'West Surrey');
  const county = surreyCouncils.filter(c => c.futureUnitary === 'County');

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

  // Removed unused _getUnitaryColor function

  const location = useLocation();

  return (
    <CouncilProfilesPasswordProtection>
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Surrey Council Profiles"
        description="Profiles of all 12 Surrey councils: 11 boroughs and districts plus Surrey County Council. Key statistics, demographics, and future unitary arrangements."
        keywords="Surrey councils, borough profiles, district councils, Surrey County Council, local authority profiles, council statistics"
      />
      <PageBanner
        heroLabel="SURREY REORGANISATION"
        heroTitle="Council Profiles"
        heroSubtitle="Detailed profiles of all 12 Surrey councils, including key statistics, demographics, services, and their future roles in the East and West Surrey unitary authorities"
        currentPath={location.pathname}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-academic-neutral-200 academic-card">
            <div className="text-3xl font-black text-teal-700 mb-2 font-display">12</div>
          <div className="text-sm font-medium text-academic-neutral-600 font-serif">Total Councils</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-academic-neutral-200 academic-card">
            <div className="text-3xl font-black text-green-700 mb-2 font-display">5</div>
            <div className="text-sm font-medium text-academic-neutral-600 font-serif">East Surrey</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-academic-neutral-200 academic-card">
            <div className="text-3xl font-black text-purple-700 mb-2 font-display">6</div>
            <div className="text-sm font-medium text-academic-neutral-600 font-serif">West Surrey</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-academic-neutral-200 academic-card">
            <div className="text-3xl font-black text-amber-700 mb-2 font-display">1.2M</div>
            <div className="text-sm font-medium text-academic-neutral-600 font-serif">Total Population</div>
          </div>
        </div>

        {/* East Surrey Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-green-600"></div>
            <h2 className="text-3xl font-black text-academic-charcoal font-display">East Surrey Unitary</h2>
            <div className="h-px flex-grow bg-academic-neutral-300"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eastSurrey.map((council) => (
              <Link
                key={council.id}
                to={`/council-profiles/${council.slug}`}
                className="group bg-white rounded-xl shadow-sm border-2 border-academic-neutral-200 hover:border-teal-700 overflow-hidden transition-all hover:shadow-lg academic-card"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getTypeColor(council.type)}`}>
                      {council.type}
                    </span>
                    <ArrowRight size={20} className="text-neutral-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-3 group-hover:text-teal-700 transition-colors leading-tight">
                    {council.name.replace(' Council', '')}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                    {council.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                    {council.population && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{council.population.toLocaleString()}</span>
                      </div>
                    )}
                    {council.area && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{council.area} km²</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* West Surrey Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-purple-600"></div>
            <h2 className="text-3xl font-black text-neutral-900">West Surrey Unitary</h2>
            <div className="h-px flex-grow bg-neutral-300"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {westSurrey.map((council) => (
              <Link
                key={council.id}
                to={`/council-profiles/${council.slug}`}
                className="group bg-white rounded-xl shadow-sm border-2 border-neutral-200 hover:border-teal-700 overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getTypeColor(council.type)}`}>
                      {council.type}
                    </span>
                    <ArrowRight size={20} className="text-neutral-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-3 group-hover:text-teal-700 transition-colors leading-tight">
                    {council.name.replace(' Council', '')}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                    {council.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                    {council.population && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{council.population.toLocaleString()}</span>
                      </div>
                    )}
                    {council.area && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{council.area} km²</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* County Council Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-amber-600"></div>
            <h2 className="text-3xl font-black text-neutral-900">Surrey County Council</h2>
            <div className="h-px flex-grow bg-neutral-300"></div>
          </div>
          <div className="grid md:grid-cols-1 gap-6">
            {county.map((council) => (
              <Link
                key={council.id}
                to={`/council-profiles/${council.slug}`}
                className="group bg-white rounded-xl shadow-sm border-2 border-neutral-200 hover:border-amber-700 overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <span className={`px-4 py-2 text-sm font-bold rounded-full border ${getTypeColor(council.type)}`}>
                      {council.type} Council
                    </span>
                    <ArrowRight size={24} className="text-neutral-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4 group-hover:text-amber-700 transition-colors leading-tight">
                    {council.name.replace(' Council', '')}
                  </h3>
                  <p className="text-base text-neutral-600 mb-6 leading-relaxed max-w-3xl">
                    {council.description}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                    {council.population && (
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="font-semibold">{council.population.toLocaleString()} people</span>
                      </div>
                    )}
                    {council.area && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="font-semibold">{council.area} km²</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      <span className="font-semibold">{council.services?.length || 0} services</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <FAQSection page="council-profiles" />
      <LastUpdated />
    </div>
    </CouncilProfilesPasswordProtection>
  );
}
