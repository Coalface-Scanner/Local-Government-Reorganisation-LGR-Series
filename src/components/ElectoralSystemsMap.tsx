import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Minus, CheckCircle2, XCircle, AlertTriangle, 
  Info, Move, Trophy, PieChart, GitMerge, Lightbulb, 
  Scale, Users, Vote, Globe, ChevronRight 
} from 'lucide-react';

// --- Data Structure ---
const mapData = {
  id: 'root',
  label: 'Democratic Election Systems',
  type: 'root',
  children: [
    {
      id: 'winner-takes-all',
      label: 'Winner Takes All',
      subLabel: 'Majoritarian Systems',
      type: 'category',
      color: 'blue',
      icon: 'trophy',
      children: [
        {
          id: 'fptp',
          label: 'First Past the Post',
          type: 'system',
          children: [
            { id: 'fptp-1', label: 'Simple majority wins seat', type: 'info' },
            { id: 'fptp-2', label: 'UK, USA, Canada, India', type: 'usage' },
            { id: 'fptp-3', label: 'Clear winners, stable gov', type: 'pro' },
            { id: 'fptp-4', label: 'Wasted votes, unrepresentative', type: 'con' }
          ]
        },
        {
          id: 'two-round',
          label: 'Two-Round System',
          type: 'system',
          children: [
            { id: 'tr-1', label: 'Runoff if no 50% majority', type: 'info' },
            { id: 'tr-2', label: 'France (Presidential)', type: 'usage' },
            { id: 'tr-3', label: 'Majority support guaranteed', type: 'pro' },
            { id: 'tr-4', label: 'Expensive & time-consuming', type: 'con' }
          ]
        }
      ]
    },
    {
      id: 'proportional',
      label: 'Proportional',
      subLabel: 'Representation Focus',
      type: 'category',
      color: 'purple',
      icon: 'pie',
      children: [
        {
          id: 'party-list',
          label: 'Party List PR',
          type: 'system',
          children: [
            { id: 'pl-1', label: 'Votes for parties, not people', type: 'info' },
            { id: 'pl-2', label: 'Spain, Netherlands, Israel', type: 'usage' },
            { id: 'pl-3', label: 'Highly fair & inclusive', type: 'pro' },
            { id: 'pl-4', label: 'Loss of local representation', type: 'con' }
          ]
        },
        {
          id: 'mmp',
          label: 'Mixed Member (MMP)',
          type: 'system',
          children: [
            { id: 'mmp-1', label: '2 Votes: Local + Party', type: 'info' },
            { id: 'mmp-2', label: 'Germany, New Zealand', type: 'usage' },
            { id: 'mmp-3', label: 'Local link + fair results', type: 'pro' },
            { id: 'mmp-4', label: 'Complex, 2 types of MPs', type: 'con' }
          ]
        }
      ]
    },
    {
      id: 'ranked',
      label: 'Ranked Choice',
      subLabel: 'Preferential Systems',
      type: 'category',
      color: 'green',
      icon: 'list',
      children: [
        {
          id: 'rcv',
          label: 'Instant Runoff (RCV)',
          type: 'system',
          children: [
            { id: 'rcv-1', label: 'Eliminate lowest & transfer', type: 'info' },
            { id: 'rcv-2', label: 'Australia, Maine, Alaska', type: 'usage' },
            { id: 'rcv-3', label: "No 'spoiler effect'", type: 'pro' },
            { id: 'rcv-4', label: 'Slower, complex counting', type: 'con' }
          ]
        },
        {
          id: 'stv',
          label: 'Single Transferable (STV)',
          type: 'system',
          children: [
            { id: 'stv-1', label: 'Multi-member + quotas', type: 'info' },
            { id: 'stv-2', label: 'Ireland, Malta', type: 'usage' },
            { id: 'stv-3', label: 'High choice, Gold Standard', type: 'pro' },
            { id: 'stv-4', label: 'Very complex math', type: 'con' }
          ]
        }
      ]
    },
    {
      id: 'theoretical',
      label: 'Theoretical',
      subLabel: 'Academic Methods',
      type: 'category',
      color: 'orange',
      icon: 'bulb',
      children: [
        {
          id: 'borda',
          label: 'Borda Count',
          type: 'system',
          children: [
            { id: 'bc-1', label: 'Points assigned to ranks', type: 'info' },
            { id: 'bc-2', label: 'Sports MVPs, Eurovision', type: 'usage' },
            { id: 'bc-3', label: 'Vulnerable to tactical voting', type: 'issue' }
          ]
        },
        {
          id: 'condorcet',
          label: 'Condorcet Method',
          type: 'system',
          children: [
            { id: 'cm-1', label: 'Head-to-head battles', type: 'info' },
            { id: 'cm-2', label: 'Potential for circular ties', type: 'issue' }
          ]
        }
      ]
    }
  ]
};

interface TreeNodeData {
  id: string;
  label: string;
  subLabel?: string;
  type: 'root' | 'category' | 'system' | 'info' | 'usage' | 'pro' | 'con' | 'issue';
  color?: 'blue' | 'purple' | 'green' | 'orange';
  icon?: 'trophy' | 'pie' | 'list' | 'bulb';
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
  level?: number;
  onExpand: (id: string) => void;
  expandedNodes: Record<string, boolean>;
}

// --- Helper Components ---

const CategoryIcon = ({ icon, color }: { icon: string; color?: string }) => {
  const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    trophy: Trophy,
    pie: PieChart,
    list: Scale,
    bulb: Lightbulb
  };
  const Icon = icons[icon] || GitMerge;
  
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-200 bg-blue-500',
    purple: 'text-purple-200 bg-purple-500',
    green: 'text-emerald-200 bg-emerald-500',
    orange: 'text-orange-200 bg-orange-500'
  };
  
  const colorClass = color ? colorClasses[color] || 'text-slate-200 bg-slate-500' : 'text-slate-200 bg-slate-500';
  
  return (
    <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20 backdrop-blur-sm mr-3`}>
      <Icon size={20} className="stroke-current" />
    </div>
  );
};

const TreeNode = ({ node, level = 0, onExpand, expandedNodes }: TreeNodeProps) => {
  const isExpanded = expandedNodes[node.id];
  const hasChildren = node.children && node.children.length > 0;
  
  // Dynamic Styles
  const getCardStyles = (type: string, color?: string) => {
    const base = "relative z-10 flex items-center p-4 rounded-xl transition-all duration-300 backdrop-blur-md border";
    
    switch(type) {
      case 'root': 
        return `${base} bg-slate-900/90 border-slate-700 text-white shadow-2xl min-w-[280px]`;
      case 'category': 
        const colors: Record<string, string> = {
          blue: 'bg-blue-900/80 border-blue-500/30 text-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
          purple: 'bg-purple-900/80 border-purple-500/30 text-purple-50 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
          green: 'bg-emerald-900/80 border-emerald-500/30 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
          orange: 'bg-orange-900/80 border-orange-500/30 text-orange-50 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        };
        return `${base} ${colors[color || ''] || 'bg-slate-800 border-slate-600'} min-w-[260px]`;
      case 'system': 
        return `${base} bg-white/95 border-slate-200 text-slate-800 shadow-lg hover:shadow-xl hover:scale-[1.02] min-w-[240px]`;
      case 'pro': 
        return `${base} bg-green-50/90 border-green-200 text-green-900 py-2 px-3 text-sm min-w-[200px] hover:bg-green-100`;
      case 'con': 
        return `${base} bg-red-50/90 border-red-200 text-red-900 py-2 px-3 text-sm min-w-[200px] hover:bg-red-100`;
      case 'issue': 
        return `${base} bg-amber-50/90 border-amber-200 text-amber-900 py-2 px-3 text-sm min-w-[200px] hover:bg-amber-100`;
      case 'usage': 
        return `${base} bg-blue-50/90 border-blue-200 text-blue-900 py-2 px-3 text-sm font-medium min-w-[200px]`;
      default: 
        return `${base} bg-slate-50/90 border-slate-200 text-slate-600 py-2 px-3 text-sm min-w-[200px]`;
    }
  };

  const getStatusIcon = (type: string) => {
    switch(type) {
      case 'pro': return <CheckCircle2 size={16} className="text-emerald-500 mr-2 shrink-0" />;
      case 'con': return <XCircle size={16} className="text-rose-500 mr-2 shrink-0" />;
      case 'issue': return <AlertTriangle size={16} className="text-amber-500 mr-2 shrink-0" />;
      case 'usage': return <Globe size={16} className="text-blue-500 mr-2 shrink-0" />;
      case 'info': return <Info size={16} className="text-slate-400 mr-2 shrink-0" />;
      default: return null;
    }
  };

  const isLeaf = !hasChildren;

  return (
    <div className="flex flex-row items-center animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center">
        {/* Node Card */}
        <div 
          onClick={() => hasChildren && onExpand(node.id)}
          className={`
            ${getCardStyles(node.type, node.color)}
            ${hasChildren ? 'cursor-pointer group' : ''}
          `}
        >
          {/* Specific Logic for Root/Category Header rendering */}
          {node.type === 'root' ? (
             <div className="flex items-center w-full">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-lg mr-3 shadow-inner">
                 <Vote size={24} className="text-white" />
               </div>
               <div>
                 <div className="font-bold text-lg leading-tight">Electoral Systems</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Interactive Map</div>
               </div>
               <div className="ml-auto pl-4">
                  {isExpanded ? <Minus size={18} className="text-slate-400" /> : <Plus size={18} className="text-slate-400" />}
               </div>
             </div>
          ) : node.type === 'category' ? (
            <div className="flex items-center w-full">
              <CategoryIcon icon={node.icon || 'trophy'} color={node.color} />
              <div className="flex-1">
                <div className="font-bold text-base">{node.label}</div>
                <div className={`text-xs opacity-70`}>{node.subLabel}</div>
              </div>
              <div className="ml-3 transition-transform duration-300">
                 {isExpanded ? <Minus size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>
          ) : (
            // System and Leaf Nodes
            <div className="flex items-center w-full">
               {getStatusIcon(node.type)}
               <span className={`flex-1 ${node.type === 'system' ? 'font-semibold text-base' : ''}`}>
                 {node.label}
               </span>
               {hasChildren && (
                 <div className={`ml-2 p-1 rounded-full transition-colors ${isExpanded ? 'bg-slate-100 text-slate-600' : 'text-slate-400'}`}>
                   {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Children Tree Logic */}
      {hasChildren && isExpanded && (
        <div className="flex flex-row">
           {/* Connector Elbow */}
           <div className="w-12 h-auto flex flex-col relative">
              {/* Top half of the connector */}
              <div className="h-[50%] w-full border-b-2 border-slate-300/40 rounded-bl-3xl absolute top-0 left-0 translate-y-[1px]"></div>
           </div>
           
           {/* Children Stack */}
           <div className="flex flex-col justify-center relative py-2">
             {/* The long vertical line connecting siblings */}
             {node.children && node.children.length > 1 && (
                <div className="absolute left-0 top-6 bottom-6 w-px bg-slate-300/40 -translate-x-px"></div>
             )}

             {node.children?.map((child, index) => {
               const isFirst = index === 0;
               const isLast = index === (node.children?.length || 0) - 1;
               
               return (
                <div key={child.id} className="flex flex-row items-center py-3 pl-8 relative group/branch">
                   {/* Horizontal connector to child */}
                   <div className={`absolute left-0 top-1/2 w-8 h-[2px] bg-slate-300/40 -translate-y-1/2 transition-all duration-300 ${!isLast ? 'group-hover/branch:bg-indigo-400/50' : ''}`}></div>
                   
                   {/* Corner adjustments for top/bottom nodes to connect to the main vertical line cleanly */}
                   {node.children && node.children.length > 1 && (
                     <>
                       {/* If first child, hide line going up */}
                       {isFirst && <div className="absolute left-0 top-0 h-1/2 w-px bg-slate-50 z-0"></div>} 
                       {/* If last child, hide line going down */}
                       {isLast && <div className="absolute left-0 bottom-0 h-1/2 w-px bg-slate-50 z-0"></div>}
                       
                       {/* Add a curved corner for the connection point to vertical line */}
                       <div className="absolute left-0 top-1/2 w-4 h-full border-l-2 border-slate-300/40 -translate-x-[2px] -translate-y-1/2 pointer-events-none"></div>
                     </>
                   )}

                   <TreeNode 
                     node={child} 
                     level={level + 1} 
                     onExpand={onExpand} 
                     expandedNodes={expandedNodes} 
                   />
                </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
};

export default function ElectoralSystemsMap() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 
    'root': true,
    'winner-takes-all': true,
    'proportional': false,
    'ranked': false,
    'theoretical': false,
    'fptp': false,
    'two-round': false,
    'party-list': false,
    'mmp': false,
    'rcv': false,
    'stv': false,
    'borda': false,
    'condorcet': false
  });
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.001;
      setScale(prev => Math.min(Math.max(0.4, prev + delta), 2.5));
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.canvas-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && (e.target === containerRef.current || (e.target as HTMLElement).closest('.canvas-bg'))) {
      const touch = e.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastTouchRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
  };

  return (
    <div className="relative h-[600px] w-full flex flex-col bg-slate-950 overflow-hidden font-sans text-slate-200 rounded-xl border border-slate-800">
      {/* Floating Legend/Help */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
         <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
            <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Legend</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-300">
               <div className="flex items-center"><CheckCircle2 size={12} className="text-emerald-500 mr-2"/> Pros</div>
               <div className="flex items-center"><XCircle size={12} className="text-rose-500 mr-2"/> Cons</div>
               <div className="flex items-center"><Globe size={12} className="text-blue-500 mr-2"/> Usage</div>
               <div className="flex items-center"><AlertTriangle size={12} className="text-amber-500 mr-2"/> Issues</div>
               <div className="flex items-center col-span-2 mt-2 pt-2 border-t border-slate-800 text-slate-500">
                  <Move size={12} className="mr-2"/> Drag or Scroll to Pan
               </div>
            </div>
         </div>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden relative canvas-bg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
            backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            touchAction: 'none'
        }}
      >
        <div 
          className="absolute top-0 left-0 transition-transform duration-100 ease-out origin-top-left p-24"
          style={{
            transform: `translate(${position.x + 50}px, ${position.y + 50}px) scale(${scale})`
          }}
        >
          <TreeNode 
            node={mapData} 
            onExpand={toggleNode} 
            expandedNodes={expandedNodes} 
          />
        </div>
      </div>
    </div>
  );
}
