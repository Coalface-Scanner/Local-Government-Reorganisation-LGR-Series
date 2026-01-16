import { MapPin } from 'lucide-react';
import CouncilMap from '../components/CouncilMap';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import LocalPlaceStructuredData from '../components/LocalPlaceStructuredData';

export default function Councils() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MetaTags
        title="UK Councils Map - Interactive Authority Directory"
        description="Interactive map of Local Authority Districts across England, Scotland, Wales, and Northern Ireland. Explore council boundaries, profiles, and reorganisation status."
        keywords="UK councils map, local authority districts, council boundaries, England councils, Scotland councils, Wales councils, Northern Ireland councils"
      />
      <LocalPlaceStructuredData
        name="United Kingdom"
        description="Interactive map of Local Authority Districts across England, Scotland, Wales, and Northern Ireland."
        type="Place"
        address={{
          addressCountry: "GB"
        }}
        areaServed={["England", "Scotland", "Wales", "Northern Ireland"]}
        url="/councils"
      />
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">UK Councils Map</h1>
          </div>
          <p className="text-gray-600 text-lg mb-4">
            Interactive map of Local Authority Districts across England, Scotland, Wales, and Northern Ireland
          </p>
          <section className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Local Authority Districts by Region</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">England</h3>
                <p className="text-gray-600">
                  England has 317 local authority districts including metropolitan boroughs, unitary authorities, 
                  London boroughs, and district councils. Many areas are undergoing local government reorganisation 
                  to form new unitary authorities.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Scotland</h3>
                <p className="text-gray-600">
                  Scotland has 32 council areas, all unitary authorities established in 1996. These councils 
                  provide all local government services including education, social care, and planning.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Wales</h3>
                <p className="text-gray-600">
                  Wales has 22 principal areas, all unitary authorities since 1996. These councils are responsible 
                  for all local government functions including education, social services, and planning.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Northern Ireland</h3>
                <p className="text-gray-600">
                  Northern Ireland has 11 local government districts established in 2015. These districts provide 
                  a range of services including planning, waste management, and community services.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Reorganisation Status</h3>
              <p className="text-gray-600 text-sm">
                Local government reorganisation is ongoing across England, with proposals to create new unitary 
                authorities in areas including Surrey, Norfolk, Suffolk, and others. These reorganisations aim to 
                improve service delivery and reduce costs by consolidating district and county councils.
              </p>
            </div>
          </section>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <CouncilMap />
        </div>
      </main>

      <div className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-6">
          <p className="text-sm text-gray-500 text-center">
            Data source:{' '}
            <a
              href="https://github.com/martinjc/UK-GeoJSON"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              UK-GeoJSON
            </a>
            {' '}(ONS Geography Data)
          </p>
        </div>
      </div>

      <FAQSection page="councils" />
    </div>
  );
}