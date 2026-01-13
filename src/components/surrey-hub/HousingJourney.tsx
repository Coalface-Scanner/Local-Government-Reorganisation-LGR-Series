import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function HousingJourney() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeSection, setActiveSection] = useState('jh1-intro');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([51.2362, -0.5704], 10);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    L.circle([51.2362, -0.5704], {
      color: 'green',
      fillColor: '#22c55e',
      fillOpacity: 0.2,
      radius: 5000,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll('.story-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);


  return (
    <section className="relative pt-10">
      <div className="hidden md:flex flex-col fixed left-8 top-24 bottom-20 w-12 lg:w-16 items-center justify-between z-40">
        <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-orange-500 to-yellow-500 -z-10 rounded-full opacity-30"></div>
        <div
          id="jh1-intro-node"
          className="map-node border-white"
          data-color="#fff"
          style={{
            backgroundColor: activeSection === 'jh1-intro' ? '#fff' : '#0f172a',
            borderColor: activeSection === 'jh1-intro' ? '#fff' : '#64748b',
            transform: activeSection === 'jh1-intro' ? 'scale(1.5)' : 'scale(1)',
          }}
        ></div>
        <div
          id="jh1-map-node"
          className="map-node border-green-500"
          data-color="#22c55e"
          style={{
            backgroundColor: activeSection === 'jh1-map' ? '#22c55e' : '#0f172a',
            borderColor: activeSection === 'jh1-map' ? '#22c55e' : '#64748b',
            transform: activeSection === 'jh1-map' ? 'scale(1.5)' : 'scale(1)',
          }}
        ></div>
        <div
          id="jh1-end-node"
          className="map-node border-yellow-400"
          data-color="#facc15"
          style={{
            backgroundColor: activeSection === 'jh1-end' ? '#facc15' : '#0f172a',
            borderColor: activeSection === 'jh1-end' ? '#facc15' : '#64748b',
            transform: activeSection === 'jh1-end' ? 'scale(1.5)' : 'scale(1)',
          }}
        ></div>
      </div>
      <div className="w-full max-w-4xl mx-auto px-6 md:pl-24 md:pr-8 pb-20">
        <div
          id="jh1-intro"
          className={`story-section flex-col justify-center text-center ${
            activeSection === 'jh1-intro' ? 'active' : ''
          }`}
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-500 mb-4">
            The Grey Belt Revolution
          </h1>
          <p className="text-xl text-slate-400">
            Where will Surrey put 40,000 new homes? The friction between Green Belt protection and
            Grey Belt reform.
          </p>
        </div>
        <div
          id="jh1-map"
          className={`story-section flex-col ${activeSection === 'jh1-map' ? 'active' : ''}`}
        >
          <div className="w-full mb-6">
            <h2 className="text-3xl font-bold text-green-400 mb-2">Live Conflict Map</h2>
            <p className="text-slate-400">
              Zoom in to see <span className="text-green-400">Green Belt</span> vs{' '}
              <span className="text-orange-400">Grey Belt</span> opportunities.
            </p>
          </div>
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-xl border border-slate-600 shadow-2xl relative z-10 bg-slate-900"
          ></div>
        </div>
        <div
          id="jh1-end"
          className={`story-section flex-col justify-center text-center ${
            activeSection === 'jh1-end' ? 'active' : ''
          }`}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Conclusion</h2>
          <p className="text-slate-400">
            With 94% Green Belt, East Surrey faces the highest pressure. Re-designating 'Grey Belt'
            sites like car parks and golf courses is the only path to the 40k target.
          </p>
        </div>
      </div>
    </section>
  );
}
