import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  slug: string;
  type: string;
  published_date: string;
  featured: boolean;
}

interface RollingBannerProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function RollingBanner({ onNavigate }: RollingBannerProps) {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchLatestMaterials();
  }, []);

  const fetchLatestMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('id, title, slug, type, published_date, featured')
      .eq('featured', true)
      .order('published_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching materials:', error);
      return;
    }

    if (data && data.length > 0) {
      setMaterials([...data, ...data]);
    }
  };

  if (materials.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-4 overflow-hidden border-y border-slate-700">
      <div className="flex items-center gap-2 mb-2 px-4 sm:px-6 lg:px-8">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <span className="text-cyan-400 font-bold text-xs tracking-wide uppercase">Latest Articles</span>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

        <div className="flex animate-scroll">
          {materials.map((material, index) => (
            <button
              key={`${material.id}-${index}`}
              onClick={() => onNavigate('article', material.slug)}
              className="group flex-shrink-0 mx-4 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 flex items-center gap-4 min-w-[300px]"
            >
              <div className="flex-1 text-left">
                <div className="text-xs text-cyan-400 font-semibold mb-1">{material.type}</div>
                <div className="text-white font-medium text-sm line-clamp-1">{material.title}</div>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
