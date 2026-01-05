import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CouncilFeature {
  type: string;
  properties: {
    LAD13CD?: string;
    LAD13NM?: string;
    LAD23CD?: string;
    LAD23NM?: string;
    LGD2014CODE?: string;
    LGD2014NAME?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONData {
  type: string;
  features: CouncilFeature[];
}

export default function CouncilMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<string | null>(null);

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

        responses.forEach((data: GeoJSONData, index) => {
          const countryColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index];

          L.geoJSON(data as any, {
            style: {
              fillColor: countryColor,
              fillOpacity: 0.3,
              color: '#1e293b',
              weight: 1.5,
            },
            onEachFeature: (feature: any, layer: L.Layer) => {
              const props = feature.properties;
              const councilName =
                props.LAD23NM || props.LAD13NM || props.LGD2014NAME || 'Unknown';
              const councilCode =
                props.LAD23CD || props.LAD13CD || props.LGD2014CODE || '';

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
                  <p class="text-sm text-gray-500 mt-1">${sources[index].country}</p>
                </div>
              `);
            },
          }).addTo(map);
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading council data:', err);
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
    </div>
  );
}