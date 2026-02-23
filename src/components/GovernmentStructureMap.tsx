import React, { useState } from 'react';
import { Crown, Scale, Globe, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface TierConfig {
  id: string;
  tier: number;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  detail?: { title: string; items: string[] }[];
}

const tiers: TierConfig[] = [
  {
    id: 'crown',
    tier: 1,
    label: 'The Crown',
    shortLabel: 'Tier 1',
    description: 'Supreme authority. National matters: foreign policy, defence, overall economic policy.',
    icon: Crown,
    iconBg: 'from-amber-400 to-yellow-600',
    gradient: 'from-slate-900 to-slate-800',
    detail: [
      { title: 'Role', items: ['Head of State (not Head of Government)', 'Ceremonial duties', 'Royal Assent to legislation'] },
      { title: 'Key point', items: ['Power is formal, not functional. Political sovereignty resides in Parliament.'] }
    ]
  },
  {
    id: 'westminster',
    tier: 2,
    label: 'Westminster',
    shortLabel: 'Tier 2',
    description: 'Parliament (legislature) and Government (executive). England is directly ruled here.',
    icon: Scale,
    iconBg: 'from-purple-500 to-indigo-600',
    gradient: 'from-purple-600 to-purple-800',
    detail: [
      { title: 'Parliament', items: ['House of Commons (650 MPs)', 'House of Lords', 'Makes laws, scrutinises Government'] },
      { title: 'Government', items: ['Prime Minister + Cabinet', 'Runs the country day-to-day', 'Formed by the party with most seats'] }
    ]
  },
  {
    id: 'devolved',
    tier: 3,
    label: 'Devolved Nations',
    shortLabel: 'Tier 3',
    description: 'Scotland, Wales, and Northern Ireland have their own parliaments for specific laws.',
    icon: Globe,
    iconBg: 'from-blue-500 to-blue-700',
    gradient: 'from-blue-600 to-blue-800',
    detail: [
      { title: 'Scotland', items: ['Scottish Parliament (Holyrood)', 'MSPs', 'First Minister'] },
      { title: 'Wales', items: ['The Senedd', 'MSs', 'First Minister'] },
      { title: 'Northern Ireland', items: ['NI Assembly (Stormont)', 'MLAs', 'Shared First Minister & deputy'] }
    ]
  },
  {
    id: 'local',
    tier: 4,
    label: 'Local Government',
    shortLabel: 'Tier 4',
    description: 'Councils across the UK. Services: waste, social care, housing, planning, education.',
    icon: Building2,
    iconBg: 'from-teal-500 to-cyan-600',
    gradient: 'from-teal-600 to-cyan-600',
    detail: [
      { title: 'England', items: ['Two-tier (county + district) or unitary', 'Metro mayors (combined authorities)'] },
      { title: 'Scotland & Wales', items: ['Unitary authorities only'] },
      { title: 'Northern Ireland', items: ['11 district councils', 'Limited powers; many services from Stormont'] }
    ]
  }
];

export default function GovernmentStructureMap() {
  const [expandedId, setExpandedId] = useState<string | null>('crown');

  return (
    <div className="relative w-full rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
          <Building2 size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">UK Government Structure</h3>
          <p className="text-slate-400 text-xs uppercase tracking-wider">Interactive map — click a tier to expand</p>
        </div>
      </div>

      {/* Vertical flow */}
      <div className="p-6 sm:p-8 space-y-0">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          const isExpanded = expandedId === tier.id;

          return (
            <React.Fragment key={tier.id}>
              {/* Connector line between tiers */}
              {index > 0 && (
                <div className="flex justify-center py-0">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-slate-600 to-slate-500 rounded-full" />
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : tier.id)}
                  className={`
                    w-full text-left rounded-xl p-5 sm:p-6 transition-all duration-300
                    bg-gradient-to-br ${tier.gradient} border-2
                    hover:shadow-lg hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${isExpanded ? 'border-teal-400 shadow-lg shadow-teal-500/20' : 'border-slate-600 hover:border-slate-500'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.iconBg} flex items-center justify-center shadow-inner shrink-0`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{tier.shortLabel}</span>
                      <h4 className="text-xl font-bold text-white mt-0.5">{tier.label}</h4>
                      <p className="text-slate-300 text-sm mt-1 line-clamp-2">{tier.description}</p>
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && tier.detail && (
                  <div className="mt-3 ml-0 sm:ml-4 pl-0 sm:pl-6 border-l-2 border-slate-600 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {tier.detail.map((block, i) => (
                      <div key={i} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                        <h5 className="font-bold text-teal-300 text-sm uppercase tracking-wider mb-2">{block.title}</h5>
                        <ul className="space-y-1">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-teal-500 mt-1.5 shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend hint */}
      <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/30 text-center">
        <p className="text-slate-500 text-xs">Flow is top-down: Crown → Westminster → Devolved → Local</p>
      </div>
    </div>
  );
}
