import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Car, 
  Wind, 
  Droplets, 
  Zap, 
  MessageSquare, 
  Siren, 
  HardHat, 
  BrainCircuit, 
  Download, 
  Sliders, 
  Map as MapIcon, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  BarChart3,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  X,
  HelpCircle
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

import { Ward, Facility, TrafficSensor, AQISensor, CitizenComplaint, EmergencyDispatch, WardIntelligenceProfile } from '../types';
import { generateWardIntelligence } from '../data/wardAnalyticsGenerator';

interface WardIntelligenceDashboardProps {
  selectedWardId: string;
  wards: Ward[];
  facilities?: Facility[];
  trafficSensors?: TrafficSensor[];
  aqiSensors?: AQISensor[];
  complaints?: CitizenComplaint[];
  dispatches?: EmergencyDispatch[];
  onSelectWard: (wardId: string) => void;
  onNavigateMap: () => void;
  onOpenFilters: () => void;
}

type TabType = 
  | 'overview' 
  | 'traffic' 
  | 'accidents' 
  | 'aqi' 
  | 'water' 
  | 'electricity' 
  | 'complaints' 
  | 'emergency' 
  | 'infrastructure' 
  | 'ml';

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6', '#06B6D4', '#EC4899'];

export const WardIntelligenceDashboard: React.FC<WardIntelligenceDashboardProps> = ({
  selectedWardId,
  wards,
  facilities = [],
  trafficSensors = [],
  aqiSensors = [],
  complaints = [],
  dispatches = [],
  onSelectWard,
  onNavigateMap,
  onOpenFilters
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedRoad, setSelectedRoad] = useState<string>('All');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Find target ward or default to first
  const currentWard = wards.find(w => w.id === selectedWardId || w.name.toLowerCase() === selectedWardId.toLowerCase()) || wards[0];

  if (!currentWard) {
    return (
      <div className="p-12 text-center text-slate-400">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-white">No Data Available</h3>
        <p className="text-sm">The requested ward record could not be loaded from PostgreSQL database.</p>
      </div>
    );
  }

  // Generate complete Intelligence Profile for this ward
  const profile: WardIntelligenceProfile = generateWardIntelligence(
    currentWard,
    facilities,
    trafficSensors,
    aqiSensors,
    complaints
  );

  // Radar Chart Data for Ward Comparison
  const radarData = [
    { metric: 'Traffic Fluidity', wardVal: profile.scores.trafficScore, cityAvg: 68 },
    { metric: 'Air Quality', wardVal: profile.scores.aqiScore, cityAvg: 70 },
    { metric: 'Water Security', wardVal: profile.scores.waterScore, cityAvg: 72 },
    { metric: 'Power Grid', wardVal: profile.scores.electricityScore, cityAvg: 80 },
    { metric: 'Safety Index', wardVal: profile.scores.safetyScore, cityAvg: 78 },
    { metric: 'Governance SLA', wardVal: profile.scores.complaintScore, cityAvg: 74 },
    { metric: 'Civil Infra', wardVal: profile.scores.infrastructureScore, cityAvg: 76 }
  ];

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV' | 'PNG') => {
    setExportNotice(`Exporting Ward ${currentWard.number} (${currentWard.name}) Analytics as ${format}...`);
    setTimeout(() => {
      setExportNotice(null);
      setShowExportModal(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 p-4 lg:p-6 space-y-6">
      
      {/* 1. TOP CASCADING LOCATION BREADCRUMB & HEADER */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
        
        {/* Breadcrumb Path */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-300 font-semibold">Karnataka</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300 font-semibold">Bengaluru Urban</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300 font-semibold">Bengaluru</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
            {currentWard.zone} Zone
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-bold bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
            Ward {currentWard.number}: {currentWard.name}
          </span>
          {selectedRoad !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {selectedRoad}
              </span>
            </>
          )}
        </div>

        {/* Header Main Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          
          {/* Left Ward Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg border border-blue-400/30 shrink-0">
              #{currentWard.number}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white">{currentWard.name} Ward Profile</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live PostGIS Sync
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                <span><strong>Population:</strong> {currentWard.population.toLocaleString('en-IN')} citizens</span>
                <span>•</span>
                <span><strong>Area:</strong> {currentWard.areaKm2} km²</span>
                <span>•</span>
                <span><strong>Density:</strong> {Math.round(currentWard.population / currentWard.areaKm2).toLocaleString('en-IN')} pop/km²</span>
                <span>•</span>
                <span><strong>Coords:</strong> {currentWard.lat.toFixed(4)}°N, {currentWard.lng.toFixed(4)}°E</span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Ward Quick Dropdown */}
            <select
              value={currentWard.id}
              onChange={(e) => onSelectWard(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              {wards.map(w => (
                <option key={w.id} value={w.id}>
                  Ward {w.number}: {w.name} ({w.zone})
                </option>
              ))}
            </select>

            <button
              onClick={onOpenFilters}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Filters</span>
            </button>

            <button
              onClick={onNavigateMap}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>View Map Twin</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export BI Report</span>
            </button>
          </div>

        </div>

      </div>

      {/* 2. EXECUTIVE SCORECARDS (9 WARD INDEX BADGES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        
        {/* Health Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Index</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-emerald-400">{profile.scores.healthScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profile.scores.healthScore}%` }} />
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Infra Score</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-blue-400">{profile.scores.infrastructureScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${profile.scores.infrastructureScore}%` }} />
          </div>
        </div>

        {/* Traffic Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traffic Speed</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-amber-400">{profile.scores.trafficScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${profile.scores.trafficScore}%` }} />
          </div>
        </div>

        {/* AQI Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Air Quality</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-purple-400">{currentWard.aqi}</span>
            <span className="text-[10px] text-slate-400">AQI</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, currentWard.aqi / 3)}%` }} />
          </div>
        </div>

        {/* Water Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Water Grid</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-cyan-400">{profile.scores.waterScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${profile.scores.waterScore}%` }} />
          </div>
        </div>

        {/* Electricity */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Power Grid</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-yellow-400">{profile.scores.electricityScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${profile.scores.electricityScore}%` }} />
          </div>
        </div>

        {/* Safety Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety Index</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-sky-400">{profile.scores.safetyScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${profile.scores.safetyScore}%` }} />
          </div>
        </div>

        {/* Complaint Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BBMP SLA</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-indigo-400">{profile.scores.complaintScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${profile.scores.complaintScore}%` }} />
          </div>
        </div>

        {/* AI Risk Score */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex flex-col justify-between border-rose-500/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">AI Risk Index</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-rose-400">{profile.scores.aiRiskScore}</span>
            <span className="text-[10px] text-slate-400">High</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${profile.scores.aiRiskScore}%` }} />
          </div>
        </div>

      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1E293B] scrollbar-none">
        {[
          { id: 'overview', label: 'Ward Overview & Risk', icon: Activity },
          { id: 'traffic', label: 'Traffic & Mobility', icon: Car },
          { id: 'accidents', label: 'Accident Intelligence', icon: AlertTriangle },
          { id: 'aqi', label: 'Air Quality (AQI)', icon: Wind },
          { id: 'water', label: 'Water Grid (BWSSB)', icon: Droplets },
          { id: 'electricity', label: 'Power Grid (BESCOM)', icon: Zap },
          { id: 'complaints', label: 'Citizen Complaints', icon: MessageSquare },
          { id: 'emergency', label: '112 Emergency', icon: Siren },
          { id: 'infrastructure', label: 'Civil Infrastructure', icon: HardHat },
          { id: 'ml', label: 'ML SHAP & Explainability', icon: BrainCircuit }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-[#0F172A] text-slate-400 hover:text-white hover:bg-[#1E293B] border border-[#1E293B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: WARD OVERVIEW & AI RISK PROFILE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Radar Chart: Ward vs City Benchmark */}
          <div className="lg:col-span-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Ward Performance vs City Benchmark</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Normalized 0 - 100</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name={currentWard.name} dataKey="wardVal" stroke="#2563EB" fill="#2563EB" fillOpacity={0.4} />
                  <Radar name="City Average" dataKey="cityAvg" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Risk Profile & Recommended Actions */}
          <div className="lg:col-span-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Risk Assessment & Mitigations</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Priority Risk {profile.aiInsights.priorityScore}/100
              </span>
            </div>

            {/* Top Risks */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Ward Vulnerabilities</h4>
              <div className="space-y-1.5">
                {profile.aiInsights.topRisks.map((risk, idx) => (
                  <div key={idx} className="p-2.5 bg-[#1E293B]/70 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Recommended Priority Interventions</h4>
              <div className="space-y-2">
                {profile.aiInsights.recommendedActions.map((act, idx) => (
                  <div key={idx} className="p-3 bg-[#1E293B] rounded-xl border border-blue-500/30 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-white">{act.title}</h5>
                      <p className="text-[11px] text-slate-400">Dept: {act.dept} • Expected Impact: {act.impact}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow shrink-0">
                      Execute
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: TRAFFIC & MOBILITY */}
      {activeTab === 'traffic' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traffic Volume & Speed Forecast */}
            <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" />
                    <span>Traffic Volume vs Predicted Vehicle Speed</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Peak Hours: {profile.traffic.peakHour}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400">{profile.traffic.congestionIndexPct}%</span>
                  <p className="text-[10px] text-slate-400">Congestion Index</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profile.traffic.trafficPrediction}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="time" stroke="#64748B" />
                    <YAxis yAxisId="left" stroke="#3B82F6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                    <Area yAxisId="left" type="monotone" dataKey="predictedVolume" name="Vehicles/hr" stroke="#2563EB" fillOpacity={1} fill="url(#volGrad)" />
                    <Line yAxisId="right" type="monotone" dataKey="predictedSpeed" name="Speed (km/h)" stroke="#F59E0B" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vehicle Classification Breakdown */}
            <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">Vehicle Modal Split</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profile.traffic.vehicleClassification}
                      dataKey="percentage"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {profile.traffic.vehicleClassification.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Road Ranking Table */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Major Corridors & Bottleneck Rankings in Ward</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-[#1E293B] text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Corridor / Road Name</th>
                    <th className="p-3">Congestion Level</th>
                    <th className="p-3">Average Speed</th>
                    <th className="p-3">Action Drill-down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {profile.traffic.roadRankings.map((r, idx) => (
                    <tr key={idx} className="hover:bg-[#1E293B]/50 transition-colors">
                      <td className="p-3 font-semibold text-white">{r.roadName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${r.congestionPct > 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {r.congestionPct}% Congested
                        </span>
                      </td>
                      <td className="p-3 font-mono">{r.avgSpeed} km/h</td>
                      <td className="p-3">
                        <button 
                          onClick={() => setSelectedRoad(r.roadName)}
                          className="text-blue-400 hover:underline font-bold"
                        >
                          Select Road Analytics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ACCIDENTS */}
      {activeTab === 'accidents' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">2026 Monthly Road Accidents & Fatalities</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.accidents.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                    <Bar dataKey="accidents" name="Total Accidents" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white">Identified Blackspot Hotspots</h3>
              <div className="space-y-2">
                {profile.accidents.blackspots.map((b, idx) => (
                  <div key={idx} className="p-3 bg-[#1E293B] rounded-xl border border-rose-500/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-rose-400">{b.location}</h4>
                      <span className="text-[10px] font-mono font-bold text-slate-300">Risk Score: {b.riskScore}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">Cause: {b.primaryCause}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: AQI */}
      {activeTab === 'aqi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">24-Hour Particulate Matter Trend (PM2.5 / PM10)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profile.airQuality.trend24h}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="aqi" name="AQI Index" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                  <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#EC4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="pm10" name="PM10 (µg/m³)" stroke="#06B6D4" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WATER */}
      {activeTab === 'water' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white">BWSSB Cauvery Water Demand vs Supply Prediction (MLD)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profile.water.prediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                <Bar dataKey="demandMLD" name="Demand (MLD)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supplyMLD" name="Supply (MLD)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 6: ELECTRICITY */}
      {activeTab === 'electricity' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white">BESCOM Substation Load & Outage Risk</h3>
          <p className="text-xs text-slate-300">Total Ward Demand: {profile.electricity.demandMW} MW • Peak Load: {profile.electricity.peakLoadMW} MW</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#1E293B] rounded-xl text-center">
              <span className="text-xs text-slate-400">Normal Transformers</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{profile.electricity.transformerStatus.normal}</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl text-center">
              <span className="text-xs text-slate-400">Warning Transformers</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{profile.electricity.transformerStatus.warning}</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl text-center">
              <span className="text-xs text-slate-400">Overload Transformers</span>
              <p className="text-2xl font-black text-rose-400 mt-1">{profile.electricity.transformerStatus.overload}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white">BBMP Citizen Grievances by Department</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profile.complaints.deptComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="department" stroke="#64748B" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                <Bar dataKey="open" name="Open Cases" fill="#EF4444" />
                <Bar dataKey="resolved" name="Resolved Cases" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 8: EMERGENCY */}
      {activeTab === 'emergency' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white">112 Emergency Assets & SLA Response Times</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-[#1E293B] rounded-xl">
              <span className="text-xs text-slate-400">Avg Response Time</span>
              <p className="text-2xl font-black text-blue-400 mt-1">{profile.emergency.avgResponseTimeMins} Mins</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl">
              <span className="text-xs text-slate-400">Hospitals</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{profile.emergency.hospitals}</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl">
              <span className="text-xs text-slate-400">Ambulances</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{profile.emergency.ambulances}</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl">
              <span className="text-xs text-slate-400">Fire Stations</span>
              <p className="text-2xl font-black text-rose-400 mt-1">{profile.emergency.fireStations}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CIVIL INFRASTRUCTURE */}
      {activeTab === 'infrastructure' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white">Civil Asset Health Index & Predictive Maintenance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1E293B] rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Road Quality Index</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{profile.infrastructure.roadConditionIndex}/100</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Bridge Structural Health</span>
              <p className="text-2xl font-black text-blue-400 mt-1">{profile.infrastructure.bridgeHealthPct}%</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Active Streetlights</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{profile.infrastructure.streetlightActivePct}%</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: ML SHAP EXPLAINABILITY */}
      {activeTab === 'ml' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>XGBoost SHAP Feature Importance & Model Performance</span>
              </h3>
              <p className="text-[11px] text-slate-400">Model: {profile.mlExplainability.modelName}</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                Confidence: {profile.mlExplainability.confidencePct}%
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#1E293B] rounded-xl text-xs text-slate-200 border border-slate-700 leading-relaxed">
            {profile.mlExplainability.explainabilitySummary}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#1E293B] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{profile.mlExplainability.accuracyPct}%</p>
            </div>
            <div className="p-3 bg-[#1E293B] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Precision</span>
              <p className="text-lg font-black text-blue-400 mt-0.5">{profile.mlExplainability.precisionPct}%</p>
            </div>
            <div className="p-3 bg-[#1E293B] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Recall</span>
              <p className="text-lg font-black text-amber-400 mt-0.5">{profile.mlExplainability.recallPct}%</p>
            </div>
            <div className="p-3 bg-[#1E293B] rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">F1 Score</span>
              <p className="text-lg font-black text-purple-400 mt-0.5">{profile.mlExplainability.f1ScorePct}%</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">SHAP Feature Drivers</h4>
            <div className="space-y-2">
              {profile.mlExplainability.shapFeatures.map((feat, idx) => (
                <div key={idx} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white">{feat.featureName}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({feat.actualValue})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${feat.impact === 'Negative' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    SHAP Impact: {feat.shapValue > 0 ? `+${feat.shapValue}` : feat.shapValue}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* REPORT EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Ward {currentWard.number} Analytics</span>
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {exportNotice ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-semibold text-emerald-400">{exportNotice}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Select export format to generate executive report for <strong>{currentWard.name} Ward ({currentWard.zone} Zone)</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleExport('PDF')}
                    className="p-3 bg-[#1E293B] hover:bg-slate-700 rounded-xl border border-slate-700 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-rose-400" />
                    <span className="font-bold text-xs text-white">Executive PDF</span>
                    <span className="text-[10px] text-slate-400">Charts & AI Risk</span>
                  </button>

                  <button
                    onClick={() => handleExport('Excel')}
                    className="p-3 bg-[#1E293B] hover:bg-slate-700 rounded-xl border border-slate-700 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xs text-white">Excel Sheet</span>
                    <span className="text-[10px] text-slate-400">Raw Sensor Rows</span>
                  </button>

                  <button
                    onClick={() => handleExport('CSV')}
                    className="p-3 bg-[#1E293B] hover:bg-slate-700 rounded-xl border border-slate-700 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-xs text-white">CSV Data</span>
                    <span className="text-[10px] text-slate-400">PostGIS Standard</span>
                  </button>

                  <button
                    onClick={() => handleExport('PNG')}
                    className="p-3 bg-[#1E293B] hover:bg-slate-700 rounded-xl border border-slate-700 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-xs text-white">PNG Visual</span>
                    <span className="text-[10px] text-slate-400">High Res Snapshot</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
