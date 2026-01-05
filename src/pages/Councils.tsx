import { MapPin } from 'lucide-react';
import CouncilMap from '../components/CouncilMap';
import FAQSection from '../components/FAQSection';

export default function Councils() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">UK Councils Map</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Interactive map of Local Authority Districts across England, Scotland, Wales, and Northern Ireland
          </p>
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