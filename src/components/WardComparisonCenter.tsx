import React, { useState, useMemo } from 'react';
import { 
  Building2, ArrowUpDown, Shield, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  Filter, Download, Sparkles, MapPin, Zap, Droplets, Car, Wind, Siren, FileText, 
  BarChart3, Award, Layers, Search, RefreshCw, X, ChevronRight, Eye, Info, Check, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, 
  AreaChart, Area, Cell, ScatterChart, Scatter
} from 'recharts';
import { Ward, Facility, TrafficSensor, AQISensor, CitizenComplaint, EmergencyDispatch } from '../types';
import { generateWardIntelligence } from '../data/wardAnalyticsGenerator';

interface WardComparisonCenterProps {
  selectedWardId?: string;
  wards: Ward[];
  facilities: Facility[];
  trafficSensors: TrafficSensor[];
  aqiSensors: AQISensor[];
  complaints: CitizenComplaint[];
  dispatches: EmergencyDispatch[];
  onSelectWard?: (wardName: string) => void;
  onNavigateMap?: () => void;
  onOpenFilters?: () => void;
}

const WARD_COLORS = [
  '#2563EB', // Blue
  '#16A34A', // Green
  '#F59E0B', // Amber
  '#9333EA', // Purple
  '#EC4899', // Pink
];

export const WardComparisonCenter: React.FC<WardComparisonCenterProps> = ({
  selectedWardId,
  wards = [],
  facilities = [],
  trafficSensors = [],
  aqiSensors = [],
  complaints = [],
  dispatches = [],
  onSelectWard,
  onNavigateMap,
  onOpenFilters,
}) => {
  // Pre-select initial wards
  const initialSelectedWardNames = useMemo(() => {
    const selected = selectedWardId || 'Indiranagar';
    const defaults = ['Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City Phase 1', 'Yelahanka'];
    const filtered = defaults.filter(w => wards.some(item => item.name === w));
    if (!filtered.includes(selected) && wards.some(w => w.name === selected)) {
      filtered.unshift(selected);
    }
    return filtered.slice(0, 5);
  }, [selectedWardId, wards]);

  const [compareWardNames, setCompareWardNames] = useState<string[]>(initialSelectedWardNames);
  const [activeTab, setActiveTab] = useState<'comparison' | 'rankings' | 'benchmarks' | 'ai-insights' | 'scorecard'>('comparison');
  const [timeRange, setTimeRange] = useState<'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Last 6 Months' | 'Last Year'>('Last 30 Days');
  const [rankingCategory, setRankingCategory] = useState<'smart' | 'traffic' | 'aqi' | 'water' | 'electricity' | 'safety' | 'complaints'>('smart');
  const [drillDownWard, setDrillDownWard] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [wardSearchQuery, setWardSearchQuery] = useState<string>('');
  const [showWardSelectorModal, setShowWardSelectorModal] = useState<boolean>(false);

  // Derive Ward Profiles for comparison set
  const comparisonProfiles = useMemo(() => {
    return compareWardNames.map(name => {
      const foundWard = wards.find(w => w.name.toLowerCase() === name.toLowerCase()) || wards[0];
      return {
        name: foundWard.name,
        profile: generateWardIntelligence(foundWard, facilities, trafficSensors, aqiSensors, complaints)
      };
    });
  }, [compareWardNames, wards, facilities, trafficSensors, aqiSensors, complaints]);

  // Compute City Averages
  const cityAverages = useMemo(() => {
    if (wards.length === 0) return null;
    const totalPop = wards.reduce((acc, w) => acc + w.population, 0);
    const avgHealth = Math.round(wards.reduce((acc, w) => acc + w.healthScore, 0) / wards.length);
    const avgTrafficIndex = Math.round(wards.reduce((acc, w) => acc + w.trafficIndex, 0) / wards.length);
    const avgAqi = Math.round(wards.reduce((acc, w) => acc + w.aqi, 0) / wards.length);
    const avgComplaints = Math.round(wards.reduce((acc, w) => acc + w.activeComplaints, 0) / wards.length);
    return {
      totalPop,
      avgHealth,
      avgTrafficIndex,
      avgAqi,
      avgComplaints,
      avgTrafficSpeed: Math.max(10, Math.round(48 - avgTrafficIndex * 0.38)),
      avgWaterScore: 72,
      avgElectricityScore: 84,
      avgSafetyScore: 78
    };
  }, [wards]);

  // Handle adding/removing wards
  const toggleWardSelection = (wardName: string) => {
    if (compareWardNames.includes(wardName)) {
      if (compareWardNames.length <= 1) return; // Keep at least 1
      setCompareWardNames(compareWardNames.filter(w => w !== wardName));
    } else {
      if (compareWardNames.length >= 5) return; // Max 5
      setCompareWardNames([...compareWardNames, wardName]);
    }
  };

  const applyPreset = (presetNames: string[]) => {
    const valid = presetNames.filter(p => wards.some(w => w.name === p));
    if (valid.length > 0) {
      setCompareWardNames(valid.slice(0, 5));
    }
  };

  // Data transforms for Recharts
  const trafficVolumeData = useMemo(() => {
    return comparisonProfiles.map(cp => ({
      wardName: cp.name,
      volume: cp.profile.traffic.volumeVehPerHour,
      congestion: cp.profile.traffic.congestionIndexPct,
      speed: cp.profile.traffic.avgSpeedKmvh
    }));
  }, [comparisonProfiles]);

  const aqiData = useMemo(() => {
    return comparisonProfiles.map(cp => ({
      wardName: cp.name,
      aqi: cp.profile.airQuality.aqi,
      pm25: cp.profile.airQuality.pm25,
      pm10: cp.profile.airQuality.pm10,
      no2: cp.profile.airQuality.no2
    }));
  }, [comparisonProfiles]);

  const utilitiesData = useMemo(() => {
    return comparisonProfiles.map(cp => ({
      wardName: cp.name,
      waterMLD: cp.profile.water.dailyConsumptionMLD,
      waterScore: cp.profile.scores.waterScore,
      electricityMW: cp.profile.electricity.demandMW,
      electricityScore: cp.profile.scores.electricityScore
    }));
  }, [comparisonProfiles]);

  const complaintsData = useMemo(() => {
    return comparisonProfiles.map(cp => ({
      wardName: cp.name,
      open: cp.profile.complaints.openCases,
      closed: cp.profile.complaints.closedCases,
      resolutionHours: cp.profile.complaints.avgResolutionTimeHours
    }));
  }, [comparisonProfiles]);

  const radarComparisonData = useMemo(() => {
    const categories = [
      { key: 'healthScore', label: 'Smart Index' },
      { key: 'trafficScore', label: 'Traffic Speed' },
      { key: 'aqiScore', label: 'Clean Air' },
      { key: 'waterScore', label: 'Water Security' },
      { key: 'electricityScore', label: 'Grid Power' },
      { key: 'safetyScore', label: 'Safety & Emergency' },
      { key: 'complaintScore', label: 'SLA Resolution' },
      { key: 'infrastructureScore', label: 'Infrastructure' }
    ];

    return categories.map(cat => {
      const item: any = { subject: cat.label };
      comparisonProfiles.forEach(cp => {
        item[cp.name] = (cp.profile.scores as any)[cat.key] || 50;
      });
      return item;
    });
  }, [comparisonProfiles]);

  // Ward Rankings Calculation (All Wards)
  const rankedWards = useMemo(() => {
    if (wards.length === 0) return { top10: [], bottom10: [], fullList: [] };

    const sorted = [...wards].map(w => {
      const prof = generateWardIntelligence(w, facilities, trafficSensors, aqiSensors, complaints);
      let metricValue = w.healthScore;
      let label = 'Smart City Index';

      if (rankingCategory === 'traffic') {
        metricValue = prof.scores.trafficScore;
        label = 'Traffic Fluidity Score';
      } else if (rankingCategory === 'aqi') {
        metricValue = prof.scores.aqiScore;
        label = 'Clean Air Score (100-AQI)';
      } else if (rankingCategory === 'water') {
        metricValue = prof.scores.waterScore;
        label = 'Water Security Score';
      } else if (rankingCategory === 'electricity') {
        metricValue = prof.scores.electricityScore;
        label = 'Electricity Reliability';
      } else if (rankingCategory === 'safety') {
        metricValue = prof.scores.safetyScore;
        label = 'Safety & Emergency Score';
      } else if (rankingCategory === 'complaints') {
        metricValue = prof.scores.complaintScore;
        label = 'Complaint Resolution SLA';
      }

      return {
        wardName: w.name,
        zone: w.zone,
        value: metricValue,
        label,
        population: w.population,
        trafficIndex: w.trafficIndex,
        aqi: w.aqi,
        healthScore: w.healthScore
      };
    }).sort((a, b) => b.value - a.value);

    return {
      top10: sorted.slice(0, 10),
      bottom10: sorted.slice(-10).reverse(),
      fullList: sorted
    };
  }, [wards, facilities, trafficSensors, aqiSensors, complaints, rankingCategory]);

  const handleExport = (format: 'pdf' | 'excel' | 'csv' | 'png') => {
    setExportNotice(`Exporting Ward Comparison Report in .${format.toUpperCase()} format...`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Header / Control Toolbar */}
      <div className="bg-gray-800/90 border border-gray-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded uppercase tracking-wider">
                Government Decision Support System
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live PostGIS Stream
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              BBMP Ward Intelligence & Benchmarking Center
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Multi-Ward Analytics, Cross-Domain Benchmarking, AI Forecasting, and Executive Decision Dashboards
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowWardSelectorModal(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              Select Wards ({compareWardNames.length}/5)
            </button>

            <button
              onClick={onOpenFilters}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition border border-gray-600"
            >
              <Filter className="w-4 h-4 text-emerald-400" />
              Cascading Filters
            </button>

            {onNavigateMap && (
              <button
                onClick={onNavigateMap}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition border border-gray-600"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                Digital Twin Map
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <div className="absolute right-0 mt-1 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 hidden group-hover:block z-50">
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700">Export PDF Report</button>
                <button onClick={() => handleExport('excel')} className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700">Export Excel Dataset</button>
                <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700">Export CSV Raw</button>
                <button onClick={() => handleExport('png')} className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700">Export High-Res PNG</button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Wards Chips Bar & Presets */}
        <div className="mt-4 pt-3 border-t border-gray-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Active Comparison:</span>
            {comparisonProfiles.map((cp, idx) => (
              <div 
                key={cp.name}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-900 border border-gray-700 shadow-inner"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WARD_COLORS[idx % WARD_COLORS.length] }}></span>
                <span className="text-white font-semibold">{cp.name}</span>
                <span className="text-[10px] text-gray-400">({cp.profile.ward.zone})</span>
                <button 
                  onClick={() => toggleWardSelection(cp.name)}
                  className="ml-1 text-gray-400 hover:text-red-400 transition"
                  title="Remove ward"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Quick Clusters:</span>
            <button 
              onClick={() => applyPreset(['Whitefield', 'Koramangala', 'Electronic City Phase 1', 'Indiranagar', 'HSR Layout'])}
              className="px-2 py-0.5 text-[11px] bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 transition"
            >
              Tech Corridors
            </button>
            <button 
              onClick={() => applyPreset(['Malleswaram', 'Basavanagudi', 'Jayanagar', 'Chickpet', 'Shivajinagar'])}
              className="px-2 py-0.5 text-[11px] bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 transition"
            >
              Heritage Central
            </button>
            <button 
              onClick={() => applyPreset(['Yelahanka', 'Hebbal', 'Thanisandra', 'Vidyaranyapura', 'Peenya'])}
              className="px-2 py-0.5 text-[11px] bg-gray-700 hover:bg-gray-600 text-gray-300 rounded border border-gray-600 transition"
            >
              North & West Industrial
            </button>
          </div>
        </div>
      </div>

      {/* Export Notification Toast */}
      {exportNotice && (
        <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Navigation View Tabs & Time Series Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-800/80 p-1.5 rounded-xl border border-gray-700">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Multi-Ward Comparison Charts
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'rankings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            <Award className="w-4 h-4" />
            Ward Rankings (Top 10 / Bottom 10)
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'benchmarks'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Benchmark Analytics
          </button>
          <button
            onClick={() => setActiveTab('ai-insights')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ai-insights'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Insights & Predictive
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scorecard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Executive Scorecard
          </button>
        </div>

        {/* Time Horizon Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/80 rounded-lg border border-gray-700">
          <span className="text-[11px] text-gray-400 font-semibold uppercase">Horizon:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="Today" className="bg-gray-800">Today</option>
            <option value="Yesterday" className="bg-gray-800">Yesterday</option>
            <option value="Last 7 Days" className="bg-gray-800">Last 7 Days</option>
            <option value="Last 30 Days" className="bg-gray-800">Last 30 Days</option>
            <option value="Last 6 Months" className="bg-gray-800">Last 6 Months</option>
            <option value="Last Year" className="bg-gray-800">Last Year</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: MULTI-WARD COMPARISON CHARTS */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Top Multi-Radar Chart Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Overall Smart City Index Comparison
                  </h3>
                  <span className="text-[10px] text-gray-400 bg-gray-700 px-2 py-0.5 rounded font-mono">
                    Radar Metrics
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Multi-axial overlay of Smart Index, Traffic, Air Quality, Water, Power, Safety, SLA Resolution, and Civil Infrastructure.
                </p>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarComparisonData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
                    {comparisonProfiles.map((cp, idx) => (
                      <Radar
                        key={cp.name}
                        name={cp.name}
                        dataKey={cp.name}
                        stroke={WARD_COLORS[idx % WARD_COLORS.length]}
                        fill={WARD_COLORS[idx % WARD_COLORS.length]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Horizontal Bar Chart: Overall Smart City Score */}
            <div className="lg:col-span-2 bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Overall Health & Smart City Score Comparison
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">Target: 85.0+</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  BBMP Smart City Health Score computed across 14 spatial variables.
                </p>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonProfiles.map(cp => ({ wardName: cp.name, score: cp.profile.scores.healthScore }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="wardName" type="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="score" name="Smart City Score" radius={[0, 6, 6, 0]}>
                      {comparisonProfiles.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={WARD_COLORS[idx % WARD_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Grid of Domain Specific Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Traffic Volume & Avg Speed */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-400" />
                  Traffic Volume (Veh/Hr) vs Avg Speed (km/h)
                </h4>
                <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-800/60 px-2 py-0.5 rounded font-mono">
                  Peak Window
                </span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="wardName" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="volume" name="Hourly Volume (Veh/Hr)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="speed" name="Avg Speed (km/h)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Air Quality (AQI) & PM2.5 */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-400" />
                  Air Quality Index (AQI) & PM2.5 Pollution
                </h4>
                <span className="text-[10px] bg-amber-950/60 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded font-mono">
                  CPCB Thresholds
                </span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aqiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="wardName" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="aqi" name="Overall AQI" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pm25" name="PM2.5 (µg/m³)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pm10" name="PM10 (µg/m³)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Utilities - Water & Electricity Consumption */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Water Consumption (MLD) & Power Demand (MW)
                </h4>
                <span className="text-[10px] bg-blue-950/60 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded font-mono">
                  BWSSB & BESCOM
                </span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilitiesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="wardName" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="waterMLD" name="Water Demand (MLD)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="electricityMW" name="Power Demand (MW)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Complaints Stacked Bar */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Citizen Complaints: Open vs Closed Cases
                </h4>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                  BBMP Sahaya 1912
                </span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="wardName" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="open" name="Open Complaints" stackId="a" fill="#EF4444" />
                    <Bar dataKey="closed" name="Resolved Complaints" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: WARD RANKINGS (TOP 10 & BOTTOM 10) */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          {/* Category Selector Buttons */}
          <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Rank By Domain:</span>
              <button
                onClick={() => setRankingCategory('smart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'smart' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Overall Smart Ward Score
              </button>
              <button
                onClick={() => setRankingCategory('traffic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'traffic' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Traffic Fluidity
              </button>
              <button
                onClick={() => setRankingCategory('aqi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'aqi' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Cleanest Air (AQI)
              </button>
              <button
                onClick={() => setRankingCategory('water')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'water' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Water Security
              </button>
              <button
                onClick={() => setRankingCategory('electricity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'electricity' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Electricity Reliability
              </button>
              <button
                onClick={() => setRankingCategory('safety')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'safety' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Safety & Emergency
              </button>
              <button
                onClick={() => setRankingCategory('complaints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  rankingCategory === 'complaints' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Complaint SLA
              </button>
            </div>

            <div className="text-xs text-gray-400 font-mono">
              Total Wards Ranked: <span className="text-white font-bold">{wards.length}</span>
            </div>
          </div>

          {/* Top 10 vs Bottom 10 Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 Wards Chart */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Top 10 Performers ({rankedWards.top10[0]?.label || 'Score'})
                </h3>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold uppercase">
                  Leaders
                </span>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankedWards.top10} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="wardName" type="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="value" name="Score" fill="#10B981" radius={[0, 6, 6, 0]}>
                      {rankedWards.top10.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : '#10B981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom 10 Wards Chart */}
            <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Bottom 10 Wards (Requires Priority Intervention)
                </h3>
                <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-400 border border-red-800 rounded font-bold uppercase">
                  Priority Action
                </span>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankedWards.bottom10} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="wardName" type="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="value" name="Score" fill="#EF4444" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: BENCHMARK ANALYTICS */}
      {activeTab === 'benchmarks' && cityAverages && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow">
              <p className="text-xs text-gray-400 font-semibold uppercase">BBMP Citywide Average Index</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{cityAverages.avgHealth} / 100</p>
              <p className="text-[11px] text-gray-400 mt-1">Across {wards.length} wards</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow">
              <p className="text-xs text-gray-400 font-semibold uppercase">Citywide Congestion Index</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{cityAverages.avgTrafficIndex}%</p>
              <p className="text-[11px] text-gray-400 mt-1">Avg Speed: {cityAverages.avgTrafficSpeed} km/h</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow">
              <p className="text-xs text-gray-400 font-semibold uppercase">Citywide AQI Average</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{cityAverages.avgAqi} AQI</p>
              <p className="text-[11px] text-gray-400 mt-1">Category: Moderate</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow">
              <p className="text-xs text-gray-400 font-semibold uppercase">Avg Open Complaints / Ward</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{cityAverages.avgComplaints}</p>
              <p className="text-[11px] text-gray-400 mt-1">Resolution SLA: ~22 Hrs</p>
            </div>
          </div>

          {/* Benchmark Table Comparison */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg overflow-x-auto">
            <h3 className="text-base font-bold text-white mb-3">Selected Wards vs City & Zone Benchmarks</h3>
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4">Ward Name</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Smart Score</th>
                  <th className="py-3 px-4">vs City Avg</th>
                  <th className="py-3 px-4">Traffic Index</th>
                  <th className="py-3 px-4">vs City Traffic</th>
                  <th className="py-3 px-4">AQI</th>
                  <th className="py-3 px-4">vs City AQI</th>
                  <th className="py-3 px-4">Variance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60 font-mono">
                {comparisonProfiles.map((cp) => {
                  const healthDiff = cp.profile.scores.healthScore - cityAverages.avgHealth;
                  const trafficDiff = cp.profile.traffic.congestionIndexPct - cityAverages.avgTrafficIndex;
                  const aqiDiff = cp.profile.airQuality.aqi - cityAverages.avgAqi;

                  return (
                    <tr key={cp.name} className="hover:bg-gray-700/40 transition">
                      <td className="py-3 px-4 font-bold text-white">{cp.name}</td>
                      <td className="py-3 px-4 text-gray-400">{cp.profile.ward.zone}</td>
                      <td className="py-3 px-4 font-bold text-blue-400">{cp.profile.scores.healthScore}</td>
                      <td className={`py-3 px-4 font-bold ${healthDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {healthDiff >= 0 ? `+${healthDiff}` : healthDiff} pts
                      </td>
                      <td className="py-3 px-4 text-red-400">{cp.profile.traffic.congestionIndexPct}%</td>
                      <td className={`py-3 px-4 ${trafficDiff <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trafficDiff <= 0 ? `${trafficDiff}%` : `+${trafficDiff}%`}
                      </td>
                      <td className="py-3 px-4 text-amber-400">{cp.profile.airQuality.aqi}</td>
                      <td className={`py-3 px-4 ${aqiDiff <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {aqiDiff <= 0 ? `${aqiDiff}` : `+${aqiDiff}`}
                      </td>
                      <td className="py-3 px-4">
                        {healthDiff >= 5 ? (
                          <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-sans font-bold">
                            Outperforming
                          </span>
                        ) : healthDiff >= -5 ? (
                          <span className="px-2 py-0.5 text-[10px] bg-blue-950 text-blue-400 border border-blue-800 rounded font-sans font-bold">
                            On Par
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-400 border border-red-800 rounded font-sans font-bold">
                            Underperforming
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: AI INSIGHTS & PREDICTIVE ANALYTICS */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-gray-800 border border-blue-500/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-bold text-white">AI Machine Learning Comparative Synthesis</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Synthesized by BBMP-XGBoost-Spatial-SHAP-v4.2 trained on 2.4M sensor events, traffic radar feeds, and municipal GIS logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonProfiles.map((cp, idx) => (
              <div key={cp.name} className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: WARD_COLORS[idx % WARD_COLORS.length] }}></span>
                    <h4 className="text-sm font-bold text-white">{cp.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400">Score: {cp.profile.scores.healthScore}</span>
                </div>

                {/* Top Risks */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Key Vulnerabilities
                  </p>
                  <ul className="text-xs text-gray-300 space-y-1 pl-3 list-disc">
                    {cp.profile.aiInsights.topRisks.map((risk, rIdx) => (
                      <li key={rIdx}>{risk}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendations */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> AI Budget & Capital Recommendations
                  </p>
                  <div className="space-y-2">
                    {cp.profile.aiInsights.recommendedActions.map((act, aIdx) => (
                      <div key={aIdx} className="bg-gray-900/80 p-2 rounded border border-gray-700 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white">{act.title}</p>
                          <span className="text-[10px] text-gray-400">Dept: {act.dept}</span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700">
                          {act.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: EXECUTIVE SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Executive Ward Comparative Scorecard</h3>
              <p className="text-xs text-gray-400">Master audit sheet comparing all municipal KPIs across selected wards.</p>
            </div>
            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> Download Scorecard
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-200">
              <thead className="bg-gray-900 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4">Ward Name</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Population</th>
                  <th className="py-3 px-4">Smart Index</th>
                  <th className="py-3 px-4">Traffic Score</th>
                  <th className="py-3 px-4">AQI Score</th>
                  <th className="py-3 px-4">Water Security</th>
                  <th className="py-3 px-4">Power Grid</th>
                  <th className="py-3 px-4">Safety Index</th>
                  <th className="py-3 px-4">Open Complaints</th>
                  <th className="py-3 px-4">AI Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 font-mono">
                {comparisonProfiles.map((cp) => (
                  <tr key={cp.name} className="hover:bg-gray-700/50 transition">
                    <td className="py-3 px-4 font-bold text-white">{cp.name}</td>
                    <td className="py-3 px-4 text-gray-400">{cp.profile.ward.zone}</td>
                    <td className="py-3 px-4 text-gray-300">{cp.profile.ward.population.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-blue-400">{cp.profile.scores.healthScore}/100</td>
                    <td className="py-3 px-4 text-red-400">{cp.profile.scores.trafficScore}</td>
                    <td className="py-3 px-4 text-amber-400">{cp.profile.scores.aqiScore}</td>
                    <td className="py-3 px-4 text-blue-300">{cp.profile.scores.waterScore}</td>
                    <td className="py-3 px-4 text-purple-300">{cp.profile.scores.electricityScore}</td>
                    <td className="py-3 px-4 text-emerald-400">{cp.profile.scores.safetyScore}</td>
                    <td className="py-3 px-4 text-gray-300">{cp.profile.complaints.openCases}</td>
                    <td className="py-3 px-4 font-bold text-red-400">{cp.profile.scores.aiRiskScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ward Selection Modal */}
      {showWardSelectorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Select Up to 5 BBMP Wards</h3>
                <p className="text-xs text-gray-400">Toggle wards to include in the comparative analytics suite.</p>
              </div>
              <button 
                onClick={() => setShowWardSelectorModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-gray-900 border-b border-gray-700 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search wards by name or zone..."
                value={wardSearchQuery}
                onChange={(e) => setWardSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
              />
            </div>

            {/* Ward List Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
              {wards
                .filter(w => w.name.toLowerCase().includes(wardSearchQuery.toLowerCase()) || w.zone.toLowerCase().includes(wardSearchQuery.toLowerCase()))
                .map((w) => {
                  const isSelected = compareWardNames.includes(w.name);
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleWardSelection(w.name)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-gray-700/60'
                      }`}
                    >
                      <div>
                        <p className="truncate font-semibold">{w.name}</p>
                        <p className="text-[10px] text-gray-400">{w.zone}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
            </div>

            <div className="p-3 border-t border-gray-700 bg-gray-900 flex justify-between items-center text-xs">
              <span className="text-gray-400">Selected: <strong className="text-white">{compareWardNames.length} / 5</strong></span>
              <button
                onClick={() => setShowWardSelectorModal(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
