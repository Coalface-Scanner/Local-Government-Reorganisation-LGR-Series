import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { X, Sparkles, CheckCircle2, BarChart3, Zap, BookOpen, MapPin, Share2, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import FAQSection from '../components/FAQSection';
import './SurreyElectionSimulator.css';

interface SurreyElectionSimulatorProps {
  onNavigate?: (page: string, data?: unknown) => void;
}

interface District {
  name: string;
  group: 'West' | 'East';
  composition: Record<string, number>;
}

const PARTIES = ['Con', 'LD', 'Res', 'Lab', 'Green', 'Reform', 'Ind', 'Other'] as const;

const PARTY_COLORS: Record<string, string> = {
  'Con': '#0087DC', 'LD': '#FAA61A', 'Res': '#6B7280',
  'Lab': '#E4003B', 'Green': '#02A95B', 'Reform': '#6B238E', 'Ind': '#9CA3AF', 'Other': '#CBD5E1',
  'Empty': '#F1F5F9'
};

const PARTY_NAMES: Record<string, string> = {
  'Con': 'Conservative', 'LD': 'Lib Dem', 'Res': 'Residents',
  'Lab': 'Labour', 'Green': 'Green', 'Reform': 'Reform UK', 'Ind': 'Independent', 'Other': 'Other'
};

const districts: District[] = [
  // ELMBRIDGE: LD: 20, Res: 14 (12+2), Con: 10, Ind: 1, Other: 3 (Elmbridge Independents)
  { name: "Elmbridge", group: "East", composition: { Lab: 0, Con: 10, LD: 20, Green: 0, Ind: 1, Res: 14, Other: 3 } },
  // EPSOM AND EWELL: Res: 25, LD: 3, Lab: 3, Con: 2, Ind: 2
  { name: "Epsom & Ewell", group: "East", composition: { Lab: 3, Con: 2, LD: 3, Green: 0, Ind: 2, Res: 25, Other: 0 } },
  // GUILDFORD: LD: 25, Con: 10, Res: 7, Other: 3 (Guildford Greenbelt Group), Lab: 3
  { name: "Guildford", group: "West", composition: { Lab: 3, Con: 10, LD: 25, Green: 0, Ind: 0, Res: 7, Other: 3 } },
  // MOLE VALLEY: LD: 31, Other: 6 (Informal Independent), Con: 2
  { name: "Mole Valley", group: "East", composition: { Lab: 0, Con: 2, LD: 31, Green: 0, Ind: 0, Res: 0, Other: 6 } },
  // REIGATE & BANSTEAD: Con: 18, Green: 13, Res: 6, LD: 4, Ind: 2, Lab: 2
  { name: "Reigate & Banstead", group: "East", composition: { Lab: 2, Con: 18, LD: 4, Green: 13, Ind: 2, Res: 6, Other: 0 } },
  // RUNNYMEDE: Con: 13, Green: 3, Ind: 5, Lab: 8, LD: 6, Res: 6 (Runnymede Independent Residents' Group)
  { name: "Runnymede", group: "West", composition: { Lab: 8, Con: 13, LD: 6, Green: 3, Ind: 5, Res: 6, Other: 0 } },
  // SPELTHORNE: Con: 16, LD: 11, Other: 6 (Independent Spelthorne incl. 1 Green), Lab: 6
  { name: "Spelthorne", group: "West", composition: { Lab: 6, Con: 16, LD: 11, Green: 0, Ind: 0, Res: 0, Other: 6 } },
  // SURREY HEATH: LD: 24, Con: 6, Ind: 3 (The Community Group), Lab: 2
  { name: "Surrey Heath", group: "West", composition: { Lab: 2, Con: 6, LD: 24, Green: 0, Ind: 3, Res: 0, Other: 0 } },
  // TANDRIDGE: Res: 20 (Residents' Alliance), LD: 11, Con: 7, Other: 5 (Independent Group)
  { name: "Tandridge", group: "East", composition: { Lab: 0, Con: 7, LD: 11, Green: 0, Ind: 0, Res: 20, Other: 5 } },
  // WAVERLEY: LD: 22, Res: 13 (Farnham Residents), Con: 11, Ind: 2, Lab: 1, Green: 1
  { name: "Waverley", group: "West", composition: { Lab: 1, Con: 11, LD: 22, Green: 1, Ind: 2, Res: 13, Other: 0 } },
  // WOKING: LD: 24, Ind: 5, Lab: 1
  { name: "Woking", group: "West", composition: { Lab: 1, Con: 0, LD: 24, Green: 0, Ind: 5, Res: 0, Other: 0 } }
];

// SURREY COUNTY COUNCIL: Con: 38, LD: 19, Res: 16 (Residents' Association/Independent), Lab: 2, Green: 2, Reform: 2 (Reform UK), Ind: 1, Other: 0, 1 vacancy
const countyCouncil = { composition: { Con: 38, LD: 19, Res: 16, Lab: 2, Green: 2, Reform: 2, Ind: 1, Other: 0 } };

export default function SurreyElectionSimulator(_props: SurreyElectionSimulatorProps) {
  // Props are intentionally unused - component doesn't use onNavigate prop
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current hash from URL (e.g., #aggregate, #simulator, #existing)
  const currentHash = location.hash.replace('#', '') || null;
  
  const [simulation, setSimulation] = useState({
    West: { target: 90, composition: { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 } },
    East: { target: 76, composition: { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 } }
  });
  
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percentageMode, setPercentageMode] = useState(false);
  const [percentages, setPercentages] = useState<Record<string, number>>({
    Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0
  });
  const [showShareWest, setShowShareWest] = useState(false);
  const [showShareEast, setShowShareEast] = useState(false);
  const chartsRef = useRef<Record<string, Chart>>({});
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Serialize simulation state to URL parameters
  const serializeStateToUrl = useCallback((sim: typeof simulation): string => {
    const params = new URLSearchParams();
    
    // Add West Surrey composition
    Object.entries(sim.West.composition).forEach(([party, count]) => {
      if (count > 0) {
        params.append('west_' + party, count.toString());
      }
    });
    
    // Add East Surrey composition
    Object.entries(sim.East.composition).forEach(([party, count]) => {
      if (count > 0) {
        params.append('east_' + party, count.toString());
      }
    });
    
    return params.toString();
  }, []);

  // Deserialize URL parameters to simulation state
  const deserializeStateFromUrl = (search: string): typeof simulation | null => {
    const params = new URLSearchParams(search);
    const westComposition: { Con: number; LD: number; Res: number; Lab: number; Green: number; Reform: number; Ind: number; Other: number } = { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 };
    const eastComposition: { Con: number; LD: number; Res: number; Lab: number; Green: number; Reform: number; Ind: number; Other: number } = { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 };
    
    let hasData = false;
    
    params.forEach((value, key) => {
      if (key.startsWith('west_')) {
        const party = key.replace('west_', '') as keyof typeof westComposition;
        if (PARTIES.includes(party as typeof PARTIES[number])) {
          const count = parseInt(value, 10);
          if (!isNaN(count) && count >= 0) {
            westComposition[party] = count;
            hasData = true;
          }
        }
      } else if (key.startsWith('east_')) {
        const party = key.replace('east_', '') as keyof typeof eastComposition;
        if (PARTIES.includes(party as typeof PARTIES[number])) {
          const count = parseInt(value, 10);
          if (!isNaN(count) && count >= 0) {
            eastComposition[party] = count;
            hasData = true;
          }
        }
      }
    });
    
    if (!hasData) return null;
    
    return {
      West: { target: 90, composition: westComposition },
      East: { target: 76, composition: eastComposition }
    };
  };

  // Parse URL on mount to restore state
  useEffect(() => {
    const restoredState = deserializeStateFromUrl(location.search);
    if (restoredState) {
      setSimulation(restoredState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update URL when simulation changes (debounced)
  useEffect(() => {
    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }
    
    urlUpdateTimeoutRef.current = setTimeout(() => {
      const params = serializeStateToUrl(simulation);
      const newUrl = params 
        ? `${location.pathname}?${params}`
        : location.pathname;
      
      window.history.replaceState({}, '', newUrl);
    }, 500); // Debounce 500ms
    
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [simulation, location.pathname, serializeStateToUrl]);

  // 2024 General Election vote shares
  const GE2024_SHARES: Record<string, number> = {
    Lab: 33.7,
    Con: 23.7,
    Reform: 14.3, // Reform UK
    LD: 12.2,
    Green: 6.7,
    Res: 0,
    Ind: 0,
    Other: 0
  };

  const initCharts = useCallback(() => {
    // Destroy existing charts
    Object.values(chartsRef.current).forEach((chart) => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    chartsRef.current = {};

    // Render aggregates
    const aggregates = calculateAggregates();
    renderAggregateChart('aggWestChart', aggregates.West);
    renderAggregateChart('aggEastChart', aggregates.East);

    // Render simulator charts
    renderSimChart('simWestChart', 'West');
    renderSimChart('simEastChart', 'East');

    // Render reference charts
    renderReferenceChart('countyChart', countyCouncil.composition);

    // Render modal chart if open
    if (isModalOpen && selectedDistrict) {
      renderReferenceChart('modalChart', selectedDistrict.composition);
    }
    // Note: renderSimChart, renderAggregateChart, renderReferenceChart, and calculateAggregates
    // are stable function declarations that don't change between renders, so they don't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulation, isModalOpen, selectedDistrict]);

  // Initialize charts when component mounts and when data changes
  useEffect(() => {
    initCharts();

    // Cleanup on unmount
    return () => {
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, [initCharts]);

  const calculateAggregates = () => {
    const west = { total: 0, composition: {} as Record<string, number> };
    const east = { total: 0, composition: {} as Record<string, number> };

    PARTIES.forEach(p => {
      west.composition[p] = 0;
      east.composition[p] = 0;
    });

    districts.forEach(d => {
      const target = d.group === 'West' ? west : east;
      Object.entries(d.composition).forEach(([p, count]) => {
        target.composition[p] = (target.composition[p] || 0) + count;
        target.total += count;
      });
    });

    return { West: west, East: east };
  };

  const renderAggregateChart = (canvasId: string, data: { total: number; composition: Record<string, number> }) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(data.composition).filter(k => data.composition[k] > 0);
    const values = labels.map(l => data.composition[l]);
    const colors = labels.map(l => PARTY_COLORS[l] || '#CBD5E1');

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        animation: { duration: 400 }
      }
    });
  };

  const renderSimChart = (canvasId: string, side: 'West' | 'East') => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simData = simulation[side];
    const filled = Object.values(simData.composition).reduce((a, b) => a + b, 0);
    const remaining = simData.target - filled;

    const chartData: Record<string, number> = { ...simData.composition };
    if (remaining > 0) chartData['Empty'] = remaining;

    const labels = Object.keys(chartData).filter(k => chartData[k] > 0);
    const values = labels.map(l => chartData[l]);
    const colors = labels.map(l => PARTY_COLORS[l] || '#CBD5E1');

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        animation: { duration: 400 }
      }
    });
  };

  const renderReferenceChart = (canvasId: string, composition: Record<string, number>) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sorted = Object.entries(composition).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(x => PARTY_NAMES[x[0]]);
    const values = sorted.map(x => x[1]);
    const colors = sorted.map(x => PARTY_COLORS[x[0]] || '#CBD5E1');

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        animation: { duration: 400 }
      }
    });
  };

  const updateSim = (side: 'West' | 'East', party: string, change: number) => {
    setSimulation(prev => {
      const simData = prev[side];
      const currentVal = simData.composition[party as keyof typeof simData.composition];
      const totalFilled = Object.values(simData.composition).reduce((a, b) => a + b, 0);

      if (change > 0 && totalFilled >= simData.target) return prev;
      if (change < 0 && currentVal <= 0) return prev;

      return {
        ...prev,
        [side]: {
          ...simData,
          composition: {
            ...simData.composition,
            [party]: currentVal + change
          }
        }
      };
    });
  };

  const openDistrictModal = (name: string) => {
    const district = districts.find(d => d.name === name);
    if (district) {
      setSelectedDistrict(district);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
  };

  const aggregates = calculateAggregates();

  const getSimRemaining = (side: 'West' | 'East') => {
    const simData = simulation[side];
    const filled = Object.values(simData.composition).reduce((a, b) => a + b, 0);
    return simData.target - filled;
  };

  const getMajorityRequired = (side: 'West' | 'East') => {
    const simData = simulation[side];
    return Math.floor(simData.target / 2) + 1;
  };

  const getBiggestParty = (side: 'West' | 'East') => {
    const simData = simulation[side];
    const sorted = Object.entries(simData.composition)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0] : null;
  };

  const getMajorityStatus = (side: 'West' | 'East') => {
    const majority = getMajorityRequired(side);
    const biggest = getBiggestParty(side);
    if (!biggest) return { text: 'No seats', value: 0 };
    
    const [party, seats] = biggest;
    const difference = seats - majority;
    
    if (difference >= 0) {
      return { text: `Majority +${difference}`, value: difference, party: PARTY_NAMES[party] };
    } else {
      return { text: `Short By ${Math.abs(difference)}`, value: difference, party: PARTY_NAMES[party] };
    }
  };

  const generateShareSummary = (short: boolean = false): string => {
    const westTotal = getTotalAssigned('West');
    const eastTotal = getTotalAssigned('East');
    const westStatus = getMajorityStatus('West');
    const eastStatus = getMajorityStatus('East');
    
    if (short) {
      // Short version for Twitter (under 280 chars)
      const westBiggest = getBiggestParty('West');
      const eastBiggest = getBiggestParty('East');
      let shortSummary = 'Surrey Election Simulator Results:\n';
      
      if (westBiggest) {
        shortSummary += `West: ${westStatus.party} ${westStatus.text}\n`;
      }
      if (eastBiggest) {
        shortSummary += `East: ${eastStatus.party} ${eastStatus.text}`;
      }
      
      return shortSummary.length > 240 ? shortSummary.substring(0, 237) + '...' : shortSummary;
    }
    
    // Full summary for email and other platforms
    let summary = 'Surrey Election Simulator Results:\n\n';
    
    // West Surrey
    summary += `West Surrey (${simulation.West.target} seats):\n`;
    if (westTotal === 0) {
      summary += '- No seats assigned\n';
    } else {
      const westEntries = Object.entries(simulation.West.composition)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);
      
      westEntries.forEach(([party, count]) => {
        summary += `- ${PARTY_NAMES[party]}: ${count} seats\n`;
      });
    }
    summary += `Total Assigned: ${westTotal}/${simulation.West.target}\n`;
    summary += `Status: ${westStatus.text} (${westStatus.party || 'No majority'})\n`;
    summary += `Seats Required for Majority: ${getMajorityRequired('West')}\n\n`;
    
    // East Surrey
    summary += `East Surrey (${simulation.East.target} seats):\n`;
    if (eastTotal === 0) {
      summary += '- No seats assigned\n';
    } else {
      const eastEntries = Object.entries(simulation.East.composition)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);
      
      eastEntries.forEach(([party, count]) => {
        summary += `- ${PARTY_NAMES[party]}: ${count} seats\n`;
      });
    }
    summary += `Total Assigned: ${eastTotal}/${simulation.East.target}\n`;
    summary += `Status: ${eastStatus.text} (${eastStatus.party || 'No majority'})\n`;
    summary += `Seats Required for Majority: ${getMajorityRequired('East')}\n\n`;
    
    summary += 'Try the Surrey Election Simulator: ' + window.location.origin + location.pathname;
    
    return summary;
  };

  const getShareableUrl = (): string => {
    const params = serializeStateToUrl(simulation);
    return params 
      ? `${window.location.origin}${location.pathname}?${params}`
      : `${window.location.origin}${location.pathname}`;
  };

  const applyPreset = (preset: 'clear' | 'aggregate' | 'ge2024', side: 'West' | 'East') => {
    const target = simulation[side].target;
    const newComposition: Record<string, number> = { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 };

    if (preset === 'clear') {
      // No seats assigned - already initialized
    } else if (preset === 'aggregate') {
      // Use aggregate totals as percentages - recalculate to ensure fresh data
      const currentAggregates = calculateAggregates();
      const agg = side === 'West' ? currentAggregates.West : currentAggregates.East;
      const total = agg.total || 1; // Avoid division by zero
      Object.keys(newComposition).forEach(party => {
        const count = agg.composition[party] || 0;
        const percentage = (count / total) * 100;
        newComposition[party] = Math.round((percentage / 100) * target);
      });
    } else if (preset === 'ge2024') {
      // Use 2024 General Election percentages
      Object.keys(newComposition).forEach(party => {
        const share = GE2024_SHARES[party] || 0;
        newComposition[party] = Math.round((share / 100) * target);
      });
    }

    // Ensure total doesn't exceed target
    let total = Object.values(newComposition).reduce((a, b) => a + b, 0);
    if (total > target) {
      const ratio = target / total;
      Object.keys(newComposition).forEach(party => {
        newComposition[party] = Math.round(newComposition[party] * ratio);
      });
      // Recalculate after adjustment
      total = Object.values(newComposition).reduce((a, b) => a + b, 0);
    }

    // If under target, distribute remainder to largest party
    if (total < target) {
      const remainder = target - total;
      const sorted = Object.entries(newComposition).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        newComposition[sorted[0][0]] = (newComposition[sorted[0][0]] || 0) + remainder;
      }
    }

    setSimulation(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        composition: newComposition
      }
    }));
  };

  const applyPercentages = (side: 'West' | 'East') => {
    const target = simulation[side].target;
    const totalPercentage = Object.values(percentages).reduce((a, b) => a + b, 0);
    
    if (totalPercentage === 0) return; // No percentages entered

    const newComposition: Record<string, number> = {};
    
    // Normalize percentages if they don't add up to 100%
    const normalize = totalPercentage !== 100;
    const normalizedPercentages = normalize 
      ? Object.fromEntries(Object.entries(percentages).map(([k, v]) => [k, (v / totalPercentage) * 100]))
      : percentages;

    // First pass: assign seats based on percentages
    let assignedTotal = 0;
    Object.keys(normalizedPercentages).forEach(party => {
      const pct = normalizedPercentages[party] || 0;
      newComposition[party] = Math.round((pct / 100) * target);
      assignedTotal += newComposition[party];
    });

    // Adjust if rounding caused overflow/underflow
    if (assignedTotal !== target) {
      const diff = target - assignedTotal;
      // Find the party with the largest remainder and adjust
      const adjustments = Object.keys(normalizedPercentages)
        .map(party => ({
          party,
          remainder: ((normalizedPercentages[party] / 100) * target) % 1,
          current: newComposition[party] || 0
        }))
        .filter(a => a.current > 0 || diff > 0); // Only consider parties that have seats or if we're adding
      
      adjustments.sort((a, b) => {
        if (diff > 0) return b.remainder - a.remainder;
        return a.remainder - b.remainder;
      });
      
      for (let i = 0; i < Math.abs(diff); i++) {
        if (adjustments.length === 0) break;
        const party = adjustments[i % adjustments.length].party;
        if (diff > 0) {
          newComposition[party] = (newComposition[party] || 0) + 1;
        } else {
          newComposition[party] = Math.max(0, (newComposition[party] || 0) - 1);
        }
      }
    }

    setSimulation(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        composition: newComposition
      }
    }));
  };

  const getProgressPercentage = (side: 'West' | 'East') => {
    const simData = simulation[side];
    const filled = Object.values(simData.composition).reduce((a, b) => a + b, 0);
    return (filled / simData.target) * 100;
  };

  const getTotalAssigned = (side: 'West' | 'East') => {
    const simData = simulation[side];
    return Object.values(simData.composition).reduce((a, b) => a + b, 0);
  };

  const heroTitle = currentHash === 'aggregate' ? 'Current Aggregate Totals' : currentHash === 'existing' ? 'Existing Councils' : 'Election Simulator';
  const heroSubtitle = currentHash === 'aggregate'
    ? 'Mathematically combined district councillor totals showing the current composition from existing districts.'
    : currentHash === 'existing'
      ? 'Reference data for Surrey County Council and all district councils showing current compositions and party control.'
      : 'Interactive seat planner for Surrey\'s local government reorganisation. Model election outcomes for East and West Surrey unitary authorities.';

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Surrey Election Simulator - LGR Modeller"
        description="Interactive seat planner for Surrey's local government reorganisation. Model election outcomes for East and West Surrey unitary authorities."
        keywords="Surrey election simulator, Surrey LGR modeller, election planning, Surrey reorganisation"
      />
      <PageBanner
        heroLabel="FOCUS: SURREY"
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/surrey/election-tracker')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Election Tracker
        </button>
      </div>
      <main className="layout-container layout-content-sub">
        <div className="space-y-10">
        {/* SECTION 1: AGGREGATE */}
        {(!currentHash || currentHash === 'aggregate') && (
        <section id="aggregate" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* West Agg */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-slate-900">West Surrey (Current)</h3>
                <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 px-3 py-1.5 rounded-full text-blue-700 font-medium shadow-sm">From 6 Districts</span>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
                    <span className="block text-3xl font-black text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{aggregates.West.total}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mt-1">Total Cllrs</span>
                  </div>
                </div>
                <div className="w-2/3 relative chart-container-200">
                  <canvas id="aggWestChart"></canvas>
                </div>
              </div>
            </div>

            {/* East Agg */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-slate-900">East Surrey (Current)</h3>
                <span className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 px-3 py-1.5 rounded-full text-green-700 font-medium shadow-sm">From 5 Districts</span>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100/50">
                    <span className="block text-3xl font-black text-slate-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{aggregates.East.total}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mt-1">Total Cllrs</span>
                  </div>
                </div>
                <div className="w-2/3 relative chart-container-200">
                  <canvas id="aggEastChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* DIVIDER - Only show if multiple sections visible */}
        {(!currentHash || (currentHash !== 'aggregate' && currentHash !== 'simulator' && currentHash !== 'existing')) && (
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-full text-slate-600 text-sm font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Election Simulator (Adjustable)
            </span>
          </div>
        </div>
        )}

        {/* SECTION 2: SIMULATOR */}
        {(!currentHash || currentHash === 'simulator') && (
        <section id="simulator" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Preset Options */}
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-xl shadow-slate-900/5">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Quick Presets (Apply to Both Councils)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => {
                  applyPreset('clear', 'West');
                  applyPreset('clear', 'East');
                }}
                className="group px-5 py-3 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  1. No Seats Assigned
                </span>
              </button>
              <button
                onClick={() => {
                  applyPreset('aggregate', 'West');
                  applyPreset('aggregate', 'East');
                }}
                className="group px-5 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl text-sm font-semibold transition-all duration-200 border border-blue-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  2. By Aggregate % (Current Seats)
                </span>
              </button>
              <button
                onClick={() => {
                  applyPreset('ge2024', 'West');
                  applyPreset('ge2024', 'East');
                }}
                className="group px-5 py-3 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 rounded-xl text-sm font-semibold transition-all duration-200 border border-green-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  3. By GE 2024 %
                </span>
              </button>
            </div>

            {/* Percentage Allocation Mode */}
            <div className="border-t border-slate-200/50 pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  Allocate by Percentage
                </h3>
                <button
                  onClick={() => setPercentageMode(!percentageMode)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-md shadow-teal-500/30 hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-0.5 active:scale-95"
                >
                  {percentageMode ? 'Hide' : 'Show'} Percentages
                </button>
              </div>
              
              {percentageMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PARTIES.map(party => (
                    <div key={party} className="flex items-center gap-2">
                      <label className="text-xs text-slate-600 w-12">{PARTY_NAMES[party]}:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={percentages[party] || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setPercentages(prev => ({ ...prev, [party]: value }));
                        }}
                        className="w-16 px-2.5 py-1.5 text-sm border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  ))}
                  <div className="col-span-full flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        applyPercentages('West');
                        applyPercentages('East');
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 active:scale-95"
                    >
                      Apply to Both
                    </button>
                    <button
                      onClick={() => setPercentages({ Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Reform: 0, Ind: 0, Other: 0 })}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    >
                      Clear
                    </button>
                    <div className="flex-1 text-right flex items-center justify-end gap-2">
                      <span className="text-xs font-semibold text-slate-600">Total:</span>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                        Math.abs(Object.values(percentages).reduce((a, b) => a + b, 0) - 100) < 0.1
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {Object.values(percentages).reduce((a, b) => a + b, 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SIMULATOR: WEST SURREY */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-xl shadow-slate-900/10 border-t-4 border-yellow-400 border border-slate-200/50 hover:shadow-2xl hover:shadow-slate-900/15 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">West Surrey</h3>
                    {getTotalAssigned('West') === simulation.West.target && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Target: <span className="font-bold text-slate-900 text-base">90 Seats</span>
                  </p>
                  <div className="space-y-2">
                    <span className="inline-block text-xs bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 px-3 py-1.5 rounded-full text-blue-700 font-medium shadow-sm">From 6 Districts</span>
                    <div className="inline-block ml-2 text-xs bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 px-3 py-1.5 rounded-full text-purple-700 font-medium shadow-sm">
                      Majority Control: <span className="font-bold">{getMajorityRequired('West')}</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-600">Progress</span>
                      <span className="text-xs font-bold text-slate-900">{getTotalAssigned('West')} / {simulation.West.target}</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 ease-out shadow-sm progress-bar-container"
                        style={{ '--progress-width': `${getProgressPercentage('West')}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200/50 shadow-lg">
                    <span className="block text-4xl font-black text-yellow-600">{getSimRemaining('West')}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unassigned</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200/50 shadow-inner chart-container-250">
                  <canvas id="simWestChart"></canvas>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{getMajorityStatus('West').party || 'Biggest Party'}</span>
                      <span className={`block text-base font-black ${
                        getMajorityStatus('West').value >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMajorityStatus('West').text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2.5">
                  {PARTIES.map(party => (
                    <div
                      key={party}
                      className="group flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span
                            className="w-4 h-4 rounded-full shadow-sm border-2 border-white party-color-indicator"
                            style={{ '--party-color': PARTY_COLORS[party] } as React.CSSProperties}
                          ></span>
                          {simulation.West.composition[party] > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm animate-pulse"></span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{PARTY_NAMES[party]}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer bg-gradient-to-br from-red-50 to-red-100 text-red-700 hover:from-red-500 hover:to-red-600 hover:text-white border border-red-200/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateSim('West', party, -1)}
                          disabled={simulation.West.composition[party] <= 0}
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-black text-slate-900 text-base bg-slate-50 rounded-lg py-1 border border-slate-200/50">
                          {simulation.West.composition[party]}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer bg-gradient-to-br from-green-50 to-green-100 text-green-700 hover:from-green-500 hover:to-green-600 hover:text-white border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateSim('West', party, 1)}
                          disabled={getSimRemaining('West') <= 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Section for West Surrey */}
              <div className="mt-6 pt-6 border-t border-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600" />
                    Share Results
                  </h4>
                  <button
                    onClick={() => setShowShareWest(!showShareWest)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition-all duration-200 border border-teal-200/50 shadow-sm hover:shadow-md"
                  >
                    {showShareWest ? 'Hide' : 'Show'} Share Options
                  </button>
                </div>
                {showShareWest && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                    <ShareButtons
                      title="West Surrey Election Simulator Results"
                      description={generateShareSummary(false)}
                      url={getShareableUrl()}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SIMULATOR: EAST SURREY */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-xl shadow-slate-900/10 border-t-4 border-yellow-400 border border-slate-200/50 hover:shadow-2xl hover:shadow-slate-900/15 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">East Surrey</h3>
                    {getTotalAssigned('East') === simulation.East.target && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Target: <span className="font-bold text-slate-900 text-base">76 Seats</span>
                  </p>
                  <div className="space-y-2">
                    <span className="inline-block text-xs bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 px-3 py-1.5 rounded-full text-green-700 font-medium shadow-sm">From 5 Districts</span>
                    <div className="inline-block ml-2 text-xs bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 px-3 py-1.5 rounded-full text-purple-700 font-medium shadow-sm">
                      Majority Control: <span className="font-bold">{getMajorityRequired('East')}</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-600">Progress</span>
                      <span className="text-xs font-bold text-slate-900">{getTotalAssigned('East')} / {simulation.East.target}</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 ease-out shadow-sm progress-bar-container"
                        style={{ '--progress-width': `${getProgressPercentage('East')}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200/50 shadow-lg">
                    <span className="block text-4xl font-black text-yellow-600">{getSimRemaining('East')}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unassigned</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200/50 shadow-inner chart-container-250">
                  <canvas id="simEastChart"></canvas>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{getMajorityStatus('East').party || 'Biggest Party'}</span>
                      <span className={`block text-base font-black ${
                        getMajorityStatus('East').value >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMajorityStatus('East').text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2.5">
                  {PARTIES.map(party => (
                    <div
                      key={party}
                      className="group flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span
                            className="w-4 h-4 rounded-full shadow-sm border-2 border-white party-color-indicator"
                            style={{ '--party-color': PARTY_COLORS[party] } as React.CSSProperties}
                          ></span>
                          {simulation.East.composition[party] > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm animate-pulse"></span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{PARTY_NAMES[party]}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer bg-gradient-to-br from-red-50 to-red-100 text-red-700 hover:from-red-500 hover:to-red-600 hover:text-white border border-red-200/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateSim('East', party, -1)}
                          disabled={simulation.East.composition[party] <= 0}
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-black text-slate-900 text-base bg-slate-50 rounded-lg py-1 border border-slate-200/50">
                          {simulation.East.composition[party]}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer bg-gradient-to-br from-green-50 to-green-100 text-green-700 hover:from-green-500 hover:to-green-600 hover:text-white border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateSim('East', party, 1)}
                          disabled={getSimRemaining('East') <= 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Section for East Surrey */}
              <div className="mt-6 pt-6 border-t border-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600" />
                    Share Results
                  </h4>
                  <button
                    onClick={() => setShowShareEast(!showShareEast)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition-all duration-200 border border-teal-200/50 shadow-sm hover:shadow-md"
                  >
                    {showShareEast ? 'Hide' : 'Show'} Share Options
                  </button>
                </div>
                {showShareEast && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                    <ShareButtons
                      title="East Surrey Election Simulator Results"
                      description={generateShareSummary(false)}
                      url={getShareableUrl()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* DIVIDER - Only show if multiple sections visible */}
        {(!currentHash || (currentHash !== 'aggregate' && currentHash !== 'simulator' && currentHash !== 'existing')) && (
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/50 rounded-full text-slate-600 text-sm font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              Reference Data (Read Only)
            </span>
          </div>
        </div>
        )}

        {/* SECTION 3: REFERENCE */}
        {(!currentHash || currentHash === 'existing') && (
        <section id="existing" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* County Council */}
            <div className="lg:col-span-1 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-slate-900/5 border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Surrey County Council</h4>
              </div>
              <div className="relative mb-3 bg-white/60 rounded-xl p-2 border border-slate-200/50 shadow-inner chart-container-128">
                <canvas id="countyChart"></canvas>
              </div>
              <div className="space-y-1.5 text-xs">
                {Object.entries(countyCouncil.composition)
                  .sort((a, b) => b[1] - a[1])
                  .filter(([, c]) => c > 0)
                  .map(([p, c]) => (
                    <div key={p} className="flex justify-between items-center p-2 bg-white/60 rounded-lg border border-slate-200/50">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm party-color-indicator-sm" style={{ '--party-color': PARTY_COLORS[p] } as React.CSSProperties}></span>
                        <span className="font-medium text-slate-700">{PARTY_NAMES[p]}</span>
                      </span>
                      <span className="font-black text-slate-900">{c}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Districts */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {districts.map(d => {
                const total = Object.values(d.composition).reduce((a, b) => a + b, 0);
                const lead = Object.entries(d.composition).sort((a, b) => b[1] - a[1])[0];
                const magic = Math.floor(total / 2) + 1;
                const control = lead[1] >= magic ? PARTY_NAMES[lead[0]] : "NOC";
                const color = lead[1] >= magic ? PARTY_COLORS[lead[0]] : "#94A3B8";

                return (
                  <div
                    key={d.name}
                    className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md shadow-slate-900/5 border border-slate-200/50 cursor-pointer hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300 hover:bg-white/90"
                    onClick={() => openDistrictModal(d.name)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">{d.group}</span>
                      <div className="relative">
                        <div className="h-3 w-3 rounded-full shadow-sm border-2 border-white party-color-indicator-xs" style={{ '--party-color': color } as React.CSSProperties}></div>
                        {lead[1] >= magic && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1.5">{d.name}</h4>
                    <p className="text-xs text-slate-600 mb-3 font-medium">{control}</p>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      {Object.entries(d.composition)
                        .sort((a, b) => b[1] - a[1])
                        .map(([p, c]) => {
                          const pct = (c / total) * 100;
                          return (
                            <div
                              key={p}
                              className="transition-all duration-300 group-hover:shadow-sm seat-bar-segment"
                              style={{ '--segment-width': `${pct}%`, '--party-color': PARTY_COLORS[p] } as React.CSSProperties}
                              title={`${PARTY_NAMES[p]}: ${c} seats`}
                            ></div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        )}

        {/* Related Resources - LGR Hub Link */}
        <div className="mt-12 p-8 bg-teal-50 rounded-lg border-l-4 border-teal-700">
          <div className="flex items-start gap-4">
            <LinkIcon className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Learn More About Local Government Reorganisation
              </h3>
              <p className="text-neutral-600 mb-4">
                Explore the <a href="/facts/what-is-lgr" className="text-teal-700 hover:text-teal-800 underline font-medium">LGRI hub</a> for comprehensive guides on Local Government Reorganisation, LGR governance, and the LGR timetable 2026.
              </p>
              <button
                onClick={() => navigate('/facts/what-is-lgr')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
              >
                <BookOpen size={18} />
                What is LGR?
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>

      <FAQSection page="surrey" />
      {/* DETAILS MODAL */}
      {isModalOpen && selectedDistrict && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-in fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300 border border-slate-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-200/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedDistrict.name}</h2>
                <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {selectedDistrict.group} Surrey • Current Composition
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="relative mb-6 bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200/50 shadow-inner chart-container-250">
                <canvas id="modalChart"></canvas>
              </div>

              <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 border-b border-slate-200 pb-2 tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Current Composition
              </h4>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
                {Object.entries(selectedDistrict.composition)
                  .sort((a, b) => b[1] - a[1])
                  .filter(([, count]) => count > 0)
                  .map(([p, count]) => {
                    const total = Object.values(selectedDistrict.composition).reduce((a, b) => a + b, 0);
                    const percentage = ((count / total) * 100).toFixed(1);
                    return (
                      <div
                        key={p}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-white to-slate-50/50 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-x-0.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span
                              className="w-4 h-4 rounded-full shadow-md border-2 border-white party-color-indicator"
                              style={{ '--party-color': PARTY_COLORS[p] } as React.CSSProperties}
                            ></span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 block">{PARTY_NAMES[p]}</span>
                            <span className="text-xs text-slate-500">{percentage}%</span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 text-lg">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

