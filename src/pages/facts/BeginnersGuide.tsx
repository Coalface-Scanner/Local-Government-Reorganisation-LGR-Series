import { useState, useEffect } from 'react';
import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';
import ElectoralSystemsMap from '../../components/ElectoralSystemsMap';
import { 
  ArrowLeft, Crown, Building2, Users, Vote, MapPin, 
  Scale, FileText, Home, Gavel, Globe, CheckCircle2,
  AlertCircle, Info, ChevronRight, List, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BeginnersGuide() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'four-tier-framework',
        'the-crown',
        'parliament-vs-government',
        'devolution',
        'england-anomaly',
        'local-government-england',
        'local-government-outside',
        'hyper-local',
        'terminology',
        'electoral-systems',
        'voting-participation',
        'councillor-responsibilities'
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tocSections = [
    { id: 'four-tier-framework', label: 'The 4-Tier Framework', icon: Building2 },
    { id: 'the-crown', label: 'The Crown', icon: Crown },
    { id: 'parliament-vs-government', label: 'Parliament vs Government', icon: Scale },
    { id: 'devolution', label: 'Devolution', icon: Globe },
    { id: 'england-anomaly', label: "England's Position", icon: AlertCircle },
    { id: 'local-government-england', label: 'Local Government (England)', icon: Building2 },
    { id: 'local-government-outside', label: 'Local Government (Outside England)', icon: MapPin },
    { id: 'hyper-local', label: 'Hyper-Local Level', icon: Home },
    { id: 'terminology', label: 'Terminology', icon: FileText },
    { id: 'electoral-systems', label: 'Electoral Systems', icon: Vote },
    { id: 'voting-participation', label: 'Voting & Participation', icon: Users },
    { id: 'councillor-responsibilities', label: 'What Councillors Do', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Beginners Guide - Councilopedia"
        description="A comprehensive introduction to UK government structure, local councils, and electoral systems. Learn how government works and how councillors are elected."
        keywords="UK government structure, local councils, electoral systems, how government works, councillor elections, devolution"
      />
      
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts/councilopedia')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Councilopedia
          </button>
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              BEGINNERS GUIDE
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            A Beginners{' '}
            <span className="text-teal-700 font-serif italic">
              Guide
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Understanding UK government structure, local councils, and how councillors are elected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <List size={18} className="text-teal-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Contents</h2>
              </div>
              <nav className="space-y-1">
                {tocSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                        activeSection === section.id
                          ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Section 1: How Government is structured */}
            <section id="four-tier-framework" className="scroll-mt-8">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                      <Building2 size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">
                      How Government is structured - what do councils do?
                    </h2>
                  </div>
                  <p className="text-lg text-slate-600 italic">
                    Understanding the UK's four-tier administrative framework
                  </p>
                </div>

                {/* 4-Tier Framework Visual */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Building2 className="text-teal-700" size={28} />
                    The UK Administrative Framework
                  </h3>
                  <p className="leading-relaxed mb-6 text-slate-700">
                    The UK system is asymmetric—different parts of the country follow different rules. However, these four tiers provide the foundational structure:
                  </p>
                  
                  {/* Visual Tier Cards */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown size={24} className="text-yellow-400" />
                        <h4 className="text-xl font-bold">Tier 1: The Crown</h4>
                      </div>
                      <p className="text-slate-200">Supreme authority. Deals with national matters like foreign policy, defence, and overall economic policy.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Scale size={24} />
                        <h4 className="text-xl font-bold">Tier 2: Westminster</h4>
                      </div>
                      <p className="text-purple-100">Parliament (legislature) and Government (executive) - applies to all, but England is directly ruled here.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe size={24} />
                        <h4 className="text-xl font-bold">Tier 3: Devolved Nations</h4>
                      </div>
                      <p className="text-blue-100">Scotland, Wales, and Northern Ireland have their own parliaments for specific laws.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Building2 size={24} />
                        <h4 className="text-xl font-bold">Tier 4: Local Government</h4>
                      </div>
                      <p className="text-teal-100">Responsible for local services like waste management, social care, and housing. Operates through councils across the UK.</p>
                    </div>
                  </div>
                </div>

                {/* The Crown */}
                <div id="the-crown" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Crown size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">The Crown and The Constitution</h3>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6 mb-4">
                    <p className="leading-relaxed mb-4 text-slate-700">
                      The Monarch is the <strong>Head of State</strong>, not Head of Government. Their role is:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={18} className="text-yellow-600" />
                          <strong className="text-slate-900">Ceremonial Role</strong>
                        </div>
                        <p className="text-sm text-slate-700">Opens Parliament, performs ceremonial duties</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={18} className="text-yellow-600" />
                          <strong className="text-slate-900">Royal Assent</strong>
                        </div>
                        <p className="text-sm text-slate-700">Signs bills into law</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-teal-50 border-l-4 border-teal-700 p-4 rounded-r-lg">
                    <p className="text-slate-800 font-medium italic">
                      <strong>Key Insight:</strong> The Monarch's power is formal, not functional. Political sovereignty resides in Parliament.
                    </p>
                  </div>
                </div>

                {/* Parliament vs Government */}
                <div id="parliament-vs-government" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Scale size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Westminster: Parliament vs. Government</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <Gavel size={24} className="text-green-700" />
                        <h4 className="font-bold text-xl text-slate-900">The Legislature (Parliament)</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <strong className="text-slate-900 block mb-1">Composition:</strong>
                          <p className="text-slate-700">House of Commons (650 elected MPs) + House of Lords (Appointed peers)</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block mb-1">Function:</strong>
                          <p className="text-slate-700">Makes laws, debates issues, scrutinises the Government. Includes MPs from ALL parties.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <Users size={24} className="text-blue-700" />
                        <h4 className="font-bold text-xl text-slate-900">The Executive (Government)</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <strong className="text-slate-900 block mb-1">Composition:</strong>
                          <p className="text-slate-700">Prime Minister + Cabinet Ministers</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block mb-1">Function:</strong>
                          <p className="text-slate-700">Runs the country day-to-day. Formed by the single party with the most seats.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
                    <p className="text-slate-800 font-semibold">
                      <strong>Crucial Difference:</strong> Parliament debates and votes. The Government decides and acts.
                    </p>
                  </div>
                </div>

                {/* Devolution */}
                <div id="devolution" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <Globe size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">The Mechanics of Devolution</h3>
                  </div>
                  <p className="leading-relaxed mb-6 text-slate-700">
                    Devolution is the transfer of specific powers from the central UK Parliament to the nations. It is not total sovereignty.
                  </p>
                  
                  {/* Devolved Nations Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
                        Scotland
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Body:</strong> Scottish Parliament (Holyrood)</p>
                        <p><strong>Members:</strong> MSPs</p>
                        <p><strong>Leader:</strong> First Minister</p>
                        <p><strong>Powers:</strong> Education, Health (NHS Scotland), Police, Justice, Taxes</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white shadow-lg">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏴󠁧󠁢󠁷󠁬󠁳󠁿</span>
                        Wales
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Body:</strong> The Senedd</p>
                        <p><strong>Members:</strong> MSs</p>
                        <p><strong>Leader:</strong> First Minister</p>
                        <p><strong>Powers:</strong> Education, Health (NHS Wales), Transport, Environment</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white shadow-lg">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <div className="absolute w-full h-0.5 bg-red-500 rotate-45"></div>
                          <div className="absolute w-full h-0.5 bg-red-500 -rotate-45"></div>
                        </div>
                        Northern Ireland
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Body:</strong> NI Assembly (Stormont)</p>
                        <p><strong>Members:</strong> MLAs</p>
                        <p><strong>Leader:</strong> First Minister & deputy First Minister (Shared Power)</p>
                        <p><strong>Powers:</strong> Health, Education, Justice, Infrastructure</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* England Anomaly */}
                <div id="england-anomaly" className="scroll-mt-8 mb-12">
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={24} className="text-amber-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">The English Anomaly</h3>
                        <p className="leading-relaxed text-slate-700">
                          England is the only nation ruled directly by Westminster. England has no separate parliament, no 'English Government', and no 'English First Minister'. Laws affecting only England are voted on by the UK-wide House of Commons. Parliament voted to remove the previous system known as <a href="https://www.parliament.uk/site-information/glossary/english-votes-for-english-law-evel/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-800 underline font-medium">'English Votes for English Laws'</a> in 2021.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Local Government in England */}
                <div id="local-government-england" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Local Government in England</h3>
                  </div>
                  <p className="text-lg text-slate-700 font-medium mb-6">A Mix and Match System, which varies on where you live in England</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Building2 size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mb-2">Two-Tier System</h4>
                      <p className="text-slate-700 text-sm">County Councils (strategic services) + District Councils (local services)</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                        <Home size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mb-2">Unitary Authorities</h4>
                      <p className="text-slate-700 text-sm">Single council handles all services (Schools, Bins, Roads, Housing)</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                        <Users size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mb-2">Metro Mayors</h4>
                      <p className="text-slate-700 text-sm">Combined Authorities: Transport & Economy (e.g., Greater Manchester)</p>
                    </div>
                  </div>
                </div>

                {/* Find Your Local Councillors */}
                <div className="mb-12">
                  <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
                    <div className="bg-white rounded-lg p-4 border border-teal-200">
                      <p className="text-slate-800 font-semibold flex items-center gap-2">
                        <ChevronRight size={18} className="text-teal-600" />
                        <strong>Action:</strong> <a href="https://www.gov.uk/find-your-local-councillors" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">Find your local councillors</a>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Local Government Outside England */}
                <div id="local-government-outside" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Local Government Outside England</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                      <h4 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">🏴󠁧󠁢󠁳󠁣󠁴󠁿🏴󠁧󠁢󠁷󠁬󠁳󠁿</span>
                        Scotland & Wales
                      </h4>
                      <p className="text-slate-700 mb-2"><strong>One Stop Shop:</strong> Unitary Authorities</p>
                      <p className="text-slate-700 text-sm">The Simple System: One council handles everything (Schools, Bins, Roads, Housing)</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <h4 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <div className="absolute w-full h-0.5 bg-red-600 rotate-45"></div>
                          <div className="absolute w-full h-0.5 bg-red-600 -rotate-45"></div>
                        </div>
                        Northern Ireland
                      </h4>
                      <p className="text-slate-700 mb-2"><strong>Local:</strong> District Councils (11). Limited Powers: Bins, Parks, Burials.</p>
                      <p className="text-slate-700 text-sm"><strong>Stormont:</strong> Roads and Schools are managed centrally by the NI Assembly, NOT the local council.</p>
                    </div>
                  </div>
                </div>

                {/* Hyper-Local Level */}
                <div id="hyper-local" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Home size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">The Hyper-Local Level</h3>
                  </div>
                  <p className="leading-relaxed mb-4 text-slate-700">
                    Closest to the citizen. Often voluntary.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className="text-teal-600" />
                        <strong className="text-slate-900">England & Wales</strong>
                      </div>
                      <p className="text-sm text-slate-700">Parish & Town Councils - Maintains local amenities. Has the right to comment on planning, but not to stop it.</p>
                    </div>
                    <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-blue-600" />
                        <strong className="text-slate-900">Scotland</strong>
                      </div>
                      <p className="text-sm text-slate-700">Community Councils - Represents local opinion to the larger authorities. Fewer legal powers than Parish councils.</p>
                    </div>
                    <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info size={18} className="text-amber-600" />
                        <strong className="text-slate-900">Northern Ireland</strong>
                      </div>
                      <p className="text-sm text-slate-700">No Official Tier - Community groups exist but are not part of the formal government structure.</p>
                    </div>
                  </div>
                </div>

                {/* Terminology */}
                <div id="terminology" className="scroll-mt-8 mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Essential Terminology</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className="text-blue-600" />
                        <p className="font-bold text-slate-900">Constituency</p>
                      </div>
                      <p className="text-sm text-slate-700">The geographic map zone an MP represents.</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className="text-teal-600" />
                        <p className="font-bold text-slate-900">Ward</p>
                      </div>
                      <p className="text-sm text-slate-700">A smaller map zone a Local Councillor represents.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-purple-600" />
                        <p className="font-bold text-slate-900">Councillor</p>
                      </div>
                      <p className="text-sm text-slate-700">Elected member of a Local Council.</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-indigo-600" />
                        <p className="font-bold text-slate-900">MP / MSP / MS / MLA</p>
                      </div>
                      <p className="text-sm text-slate-700">Members of: UK Parliament, Scottish Parliament, Senedd (Wales), NI Assembly.</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-orange-600" />
                        <p className="font-bold text-slate-900">Coalition</p>
                      </div>
                      <p className="text-sm text-slate-700">Two or more parties joining forces when no single party wins &gt;50% of seats.</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 size={18} className="text-slate-600" />
                        <p className="font-bold text-slate-900">Civil Servant</p>
                      </div>
                      <p className="text-sm text-slate-700">Permanent staff who run administration. Not politicians. Do not change with elections.</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-teal-700 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-teal-700" size={24} />
                    Summary: The Asymmetric Union
                  </h3>
                  <ol className="space-y-2 ml-6 list-decimal text-slate-800">
                    <li><strong>Top-Tier Consistency:</strong> The Crown and UK Parliament apply to everyone.</li>
                    <li><strong>Devolved Variation:</strong> Scotland, Wales, and NI have separate powers; England is ruled directly by Westminster.</li>
                    <li><strong>Local Patchwork:</strong> Services are managed differently depending on whether you are in a Unitary city, a Two-Tier county, or Northern Ireland.</li>
                  </ol>
                  <p className="mt-4 text-slate-800 italic font-medium">
                    Governance in the UK is defined by where you sleep—a single nation with four distinct administrative personalities.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: How do we elect Councillors */}
            <section id="electoral-systems" className="scroll-mt-8">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <Vote size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">
                      How do we elect Councillors?
                    </h2>
                  </div>
                  <p className="text-lg text-slate-600 italic">
                    Understanding electoral systems and the democratic process
                  </p>
                </div>

                <div className="mb-8">
                  <p className="leading-relaxed mb-6 text-slate-700">
                    Elections translate individual votes into government seats using a specific mathematical formula. Different electoral systems impact representation and government stability in different ways. The UK uses different systems for different levels of government.
                  </p>
                  
                  {/* Quick Reference Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Vote size={20} className="text-blue-600" />
                        <h4 className="font-bold text-slate-900">Most Councils</h4>
                      </div>
                      <p className="text-sm text-slate-700"><strong>First Past the Post (FPTP)</strong> - the candidate with the most votes wins</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Vote size={20} className="text-purple-600" />
                        <h4 className="font-bold text-slate-900">Scottish Councils</h4>
                      </div>
                      <p className="text-sm text-slate-700"><strong>Single Transferable Vote (STV)</strong> - voters rank candidates by preference</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Vote size={20} className="text-indigo-600" />
                        <h4 className="font-bold text-slate-900">London Mayor</h4>
                      </div>
                      <p className="text-sm text-slate-700"><strong>Supplementary Vote</strong> - voters choose first and second preferences</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Vote className="text-purple-700" size={28} />
                    Interactive Electoral Systems Map
                  </h3>
                  <p className="leading-relaxed mb-6 text-slate-700">
                    Explore different electoral systems used around the world. Click on categories and systems to expand and learn more about how votes are translated into representation.
                  </p>
                  <div className="mb-6">
                    <ElectoralSystemsMap />
                  </div>
                </div>

                {/* Voting & Participation */}
                <div id="voting-participation" className="scroll-mt-8 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Civic Engagement & Voting</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <Vote size={20} className="text-green-600" />
                        Voting Age
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              16
                            </div>
                            <strong className="text-slate-900">Scotland & Wales (only)</strong>
                          </div>
                          <p className="text-sm text-slate-700 ml-14">Vote in local/devolved elections</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                              18
                            </div>
                            <strong className="text-slate-900">United Kingdom wide</strong>
                          </div>
                          <p className="text-sm text-slate-700 ml-14">Vote in General Elections</p>
                          <p className="text-xs text-slate-600 ml-14 mt-1 italic">There are proposals to extend voting to 16+, but this is not yet law</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                      <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-blue-600" />
                        Getting Involved
                      </h4>
                      <p className="text-slate-700 mb-3">You must be registered to vote to participate in elections.</p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-slate-800 font-semibold flex items-center gap-2">
                          <ChevronRight size={18} className="text-blue-600" />
                          <strong>Action:</strong> <a href="https://members.parliament.uk/FindYourMP" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Find your Constituency and MP</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What Councillors Do */}
                <div id="councillor-responsibilities" className="scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Understanding Your Vote</h3>
                  </div>
                  <p className="leading-relaxed mb-6 text-slate-700">
                    When you vote in a local council election, you're choosing who represents your ward (the area you live in) on the council. Councillors make decisions about local services:
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: '🗑️', title: 'Waste & Recycling', desc: 'Collection and recycling services' },
                      { icon: '🏗️', title: 'Planning & Development', desc: 'Building permits and development' },
                      { icon: '🏠', title: 'Social Care & Housing', desc: 'Support services and housing' },
                      { icon: '🛣️', title: 'Roads & Transport', desc: 'Infrastructure and public transport' },
                      { icon: '🌳', title: 'Parks & Leisure', desc: 'Public spaces and facilities' },
                      { icon: '📚', title: 'Education', desc: 'Schools and learning support' }
                    ].map((service, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-5 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2">{service.icon}</div>
                        <h4 className="font-bold text-slate-900 mb-1">{service.title}</h4>
                        <p className="text-sm text-slate-700">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                    <p className="text-slate-800 font-medium">
                      <strong>Key Point:</strong> The electoral system determines how votes translate into seats, which affects how representative the council is of the community's views.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}
