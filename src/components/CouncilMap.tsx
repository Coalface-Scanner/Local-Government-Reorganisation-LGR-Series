import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CouncilFeature {
  type: 'Feature';
  properties: {
    LAD13CD?: string;
    LAD13NM?: string;
    LAD23CD?: string;
    LAD23NM?: string;
    LGD2014CODE?: string;
    LGD2014NAME?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: CouncilFeature[];
}

export default function CouncilMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<string | null>(null);
  const [councilsByCountry, setCouncilsByCountry] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([54.5, -4.0], 6);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const fetchCouncilData = async () => {
      try {
        setLoading(true);
        setError(null);

        const sources = [
          {
            url: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/eng/lad.json',
            country: 'England',
          },
          {
            url: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/sco/lad.json',
            country: 'Scotland',
          },
          {
            url: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/wal/lad.json',
            country: 'Wales',
          },
          {
            url: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/nir/lgd.json',
            country: 'Northern Ireland',
          },
        ];

        const responses = await Promise.all(
          sources.map(source => fetch(source.url).then(res => res.json()))
        );

        const councilsByCountryTemp: Record<string, string[]> = {
          'England': [],
          'Scotland': [],
          'Wales': [],
          'Northern Ireland': []
        };

        responses.forEach((data: GeoJSONData, index) => {
          const country = sources[index].country;
          const countryColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index];

          L.geoJSON(data as GeoJSONData, {
            style: {
              fillColor: countryColor,
              fillOpacity: 0.3,
              color: '#1e293b',
              weight: 1.5,
            },
            onEachFeature: (feature, layer: L.Layer) => {
              const props = feature.properties;
              const councilName =
                props.LAD23NM || props.LAD13NM || props.LGD2014NAME || 'Unknown';
              const councilCode =
                props.LAD23CD || props.LAD13CD || props.LGD2014CODE || '';

              // Collect council names for crawlable text
              if (councilName !== 'Unknown' && !councilsByCountryTemp[country].includes(councilName)) {
                councilsByCountryTemp[country].push(councilName);
              }

              if (layer instanceof L.Path) {
                layer.on({
                  mouseover: (e) => {
                    const target = e.target;
                    target.setStyle({
                      fillOpacity: 0.6,
                      weight: 3,
                    });
                    setSelectedCouncil(councilName);
                  },
                  mouseout: (e) => {
                    const target = e.target;
                    target.setStyle({
                      fillOpacity: 0.3,
                      weight: 1.5,
                    });
                    setSelectedCouncil(null);
                  },
                  click: () => {
                    setSelectedCouncil(councilName);
                  },
                });
              }

              layer.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-lg">${councilName}</h3>
                  <p class="text-sm text-gray-600">${councilCode}</p>
                  <p class="text-sm text-gray-500 mt-1">${country}</p>
                </div>
              `);
            },
          }).addTo(map);
        });

        // Sort council names alphabetically
        Object.keys(councilsByCountryTemp).forEach(country => {
          councilsByCountryTemp[country].sort();
        });
        setCouncilsByCountry(councilsByCountryTemp);

        setLoading(false);
      } catch (_err) {
        setError('Failed to load council boundary data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCouncilData();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading council boundaries...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md z-50">
          {error}
        </div>
      )}

      {selectedCouncil && !loading && (
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white shadow-lg rounded-lg p-3 sm:p-4 max-w-[calc(100%-2rem)] sm:max-w-xs z-50">
          <h3 className="font-bold text-sm sm:text-lg">{selectedCouncil}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Click on the map for more details</p>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-2 sm:p-4 z-50">
        <h4 className="font-bold text-xs sm:text-sm mb-1 sm:mb-2">Legend</h4>
        <div className="space-y-1 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 opacity-50 border border-gray-700"></div>
            <span>England</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 opacity-50 border border-gray-700"></div>
            <span>Scotland</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 opacity-50 border border-gray-700"></div>
            <span>Wales</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 opacity-50 border border-gray-700"></div>
            <span>N. Ireland</span>
          </div>
        </div>
      </div>

      {/* Crawlable text content for SEO - hidden visually but accessible to search engines */}
      <div className="sr-only" aria-hidden="false">
        <h2>UK Local Authority Districts</h2>
        <p>
          This interactive map displays Local Authority Districts (LADs) across England, Scotland, Wales, and Northern Ireland. 
          The map shows current council boundaries and can be used to explore geographic coverage of local government reorganisation 
          proposals and unitary authority structures.
        </p>
        
        {Object.keys(councilsByCountry).length > 0 && (
          <>
            {Object.entries(councilsByCountry).map(([country, councils]) => (
              <div key={country} className="mt-4">
                <h3>{country} Councils</h3>
                <p>
                  {country} has {councils.length} local authority districts. 
                  {country === 'England' && ' Many areas are undergoing local government reorganisation to form new unitary authorities.'}
                  {country === 'Scotland' && ' All councils are unitary authorities established in 1996.'}
                  {country === 'Wales' && ' Councils provide all local government services including education, social care, and planning.'}
                  {country === 'Northern Ireland' && ' Councils operate under a different structure from Great Britain.'}
                </p>
                <ul>
                  {councils.slice(0, 50).map((council, index) => (
                    <li key={index}>{council}</li>
                  ))}
                  {councils.length > 50 && (
                    <li>... and {councils.length - 50} more councils</li>
                  )}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}