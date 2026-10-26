import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Image, 
  Filter, 
  Layers, 
  MapPin, 
  Activity, 
  Car, 
  Wind, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  PieChart as PieChartIcon,
  HelpCircle,
  ShieldAlert,
  BrainCircuit,
  Search,
  Scale
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter
} from 'recharts';
import { Ward, TrafficSensor, AQISensor, Facility, CitizenComplaint } from '../types';

interface AnalyticsCenterProps {
  wards: Ward[];
  facilities: Facility[];
  trafficSensors: TrafficSensor[];
  aqiSensors: AQISensor[];
  complaints: CitizenComplaint[];
  selectedWard: string;
  onSelectWard: (wardName: string) => void;
  onNavigateMap: () => void;
  onOpenFilters: () => void;
}

type AnalyticsTab = 
  | 'overview' 
  | 'descriptive' 
  | 'diagnostic' 
  | 'predictive' 
  | 'prescriptive' 
  | 'anomalies' 
  | 'correlation' 
  | 'timeseries' 
  | 'comparison';

export const AnalyticsCenter: React.FC<AnalyticsCenterProps> = ({
  wards,
  facilities,
  trafficSensors,
  aqiSensors,
  complaints,
  selectedWard,
  onSelectWard,
  onNavigateMap,
  onOpenFilters
}) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Correlation Explorer State
  const [corrDomainA, setCorrDomainA] = useState<string>('traffic');
  const [corrDomainB, setCorrDomainB] = useState<string>('weather');

  // Filtered Wards based on Zone
  const filteredWards = wards.filter(w => selectedZone === 'All' || w.zone === selectedZone);

  // Statistics Calculations for Descriptive Analytics
  const healthScores = wards.map(w => w.healthScore);
  const avgHealth = (healthScores.reduce((a, b) => a + b, 0) / (healthScores.length || 1)).toFixed(1);
  const minHealth = Math.min(...healthScores);
  const maxHealth = Math.max(...healthScores);
  const sortedHealth = [...healthScores].sort((a, b) => a - b);
  const medianHealth = sortedHealth[Math.floor(sortedHealth.length / 2)] || 0;

  const aqiValues = wards.map(w => w.aqi);
  const avgAQI = (aqiValues.reduce((a, b) => a + b, 0) / (aqiValues.length || 1)).toFixed(1);

  // Recharts Datasets
  const trendData = [
    { time: '00:00', traffic: 32, aqi: 110, water: 98, complaints: 14 },
    { time: '04:00', traffic: 22, aqi: 95, water: 99, complaints: 8 },
    { time: '08:00', traffic: 84, aqi: 145, water: 94, complaints: 32 },
    { time: '12:00', traffic: 76, aqi: 168, water: 92, complaints: 45 },
    { time: '16:00', traffic: 88, aqi: 182, water: 90, complaints: 52 },
    { time: '20:00', traffic: 68, aqi: 140, water: 95, complaints: 28 },
  ];

  const scatterCorrData = [
    { x: 30, y: 110, name: 'Yelahanka' },
    { x: 45, y: 130, name: 'Jayanagar' },
    { x: 65, y: 145, name: 'Indiranagar' },
    { x: 82, y: 168, name: 'Whitefield' },
    { x: 92, y: 182, name: 'Silk Board' },
    { x: 88, y: 175, name: 'Bellandur' },
  ];

  const complaintDeptData = [
    { name: 'Roads & Potholes', open: 42, resolved: 128 },
    { name: 'Water & Sewage', open: 28, resolved: 95 },
    { name: 'Street Lights', open: 14, resolved: 140 },
    { name: 'Garbage & Sanitation', open: 36, resolved: 110 },
    { name: 'Drainage Overflow', open: 19, resolved: 72 },
  ];

  const anomaliesList = [
    { id: 'an-1', domain: 'Electricity', location: selectedWard, observed: '380 MVA', baseline: '260 MVA', deviation: '+46.1%', severity: 'CRITICAL', explanation: 'HVAC power consumption surge in commercial Tech Parks during heat peak.' },
    { id: 'an-2', domain: 'Traffic', location: 'Silk Board Junction', observed: '6.2 km/h', baseline: '18.0 km/h', deviation: '-65.5%', severity: 'CRITICAL', explanation: 'Unscheduled ORR lane obstruction near Metro construction pillar #142.' },
    { id: 'an-3', domain: 'Water', location: 'Whitefield Zone 3', observed: '1.2 Bar', baseline: '4.8 Bar', deviation: '-75.0%', severity: 'WARNING', explanation: 'Pressure drop caused by main trunk line maintenance bypass at Hoodi.' },
    { id: 'an-4', domain: 'AQI', location: 'Hebbal Flyover', observed: '182 PM2.5', baseline: '115 PM2.5', deviation: '+58.2%', severity: 'WARNING', explanation: 'Dust and diesel exhaust accumulation under temperature inversion layer.' },
  ];

  const recommendationsList = [
    { id: 'rec-1', title: 'Activate Automated Green Wave on Silk Board Corridor', department: 'Traffic Command', healthGain: '+3.8 Pts', action: 'Green Wave Override' },
    { id: 'rec-2', title: 'Deploy High-Pressure Smog Cannons at Hebbal Flyover', department: 'KSPCB Environment Unit', healthGain: '+2.4 Pts', action: 'Deploy Smog Cannon' },
    { id: 'rec-3', title: 'Reroute BWSSB Emergency Water Tankers to Whitefield', department: 'Water Supply Board', healthGain: '+4.1 Pts', action: 'Dispatch Tankers' }
  ];

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Ward ID', 'Ward Name', 'Zone', 'Population', 'AQI', 'Traffic Index', 'Water Status', 'Complaints', 'Health Score'];
    const rows = wards.map(w => [w.id, w.name, w.zone, w.population, w.aqi, w.trafficIndex, w.waterSupplyStatus, w.activeComplaints, w.healthScore]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCity360_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Analytics Data as CSV');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Top Banner & Control Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              Urban Analytics & Data Science Engine
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
                4-Level BI Engine
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Integrated Descriptive, Diagnostic, Predictive, and Prescriptive spatial analytics across all Bengaluru BBMP wards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenFilters}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter Options
          </button>

          <button
            onClick={onNavigateMap}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Synchronize Map
          </button>

          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* 4-Level Analytics Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Overview' },
          { id: 'descriptive', label: '2. Descriptive Analytics' },
          { id: 'diagnostic', label: '3. Diagnostic Analytics' },
          { id: 'predictive', label: '4. Predictive Analytics' },
          { id: 'prescriptive', label: '5. Prescriptive Analytics' },
          { id: 'anomalies', label: '6. Anomaly Center' },
          { id: 'correlation', label: '7. Correlation Explorer' },
          { id: 'timeseries', label: '8. Time-Series' },
          { id: 'comparison', label: '9. Ward Comparison' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AnalyticsTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-[#0B1220] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#0B1220] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> City-Wide Multi-Department Telemetry Stream
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="traffic" name="Traffic Congestion Index" stroke="#DC2626" fill="#DC2626" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="aqi" name="Air Quality Index" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="water" name="Water Pressure %" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0B1220] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Municipal Complaint Resolution SLA
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintDeptData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="resolved" name="Resolved" fill="#16A34A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="open" name="Open" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESCRIPTIVE ANALYTICS */}
      {activeTab === 'descriptive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0B1220] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean City Health</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgHealth} / 100</p>
              <span className="text-[10px] text-slate-400">Median: {medianHealth} | Range: {minHealth} - {maxHealth}</span>
            </div>

            <div className="bg-white dark:bg-[#0B1220] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average AQI Index</span>
              <p className="text-2xl font-black text-amber-500">{avgAQI} AQI</p>
              <span className="text-[10px] text-slate-400">Across {wards.length} BBMP Wards</span>
            </div>

            <div className="bg-white dark:bg-[#0B1220] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Citizen Tickets</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{wards.reduce((acc, w) => acc + w.activeComplaints, 0)} Issues</p>
              <span className="text-[10px] text-slate-400">Potholes, Sanitation, Streetlights</span>
            </div>

            <div className="bg-white dark:bg-[#0B1220] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sample Standard Deviation</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">σ = 8.4</p>
              <span className="text-[10px] text-slate-400">Health variance across wards</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC ANALYTICS */}
      {activeTab === 'diagnostic' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" /> Diagnostic Analysis — Root Causes & Association Drivers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Explains WHY urban anomalies and congestion spikes occur</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-red-500" /> Traffic Congestion ↔ Commuter Shift
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Traffic speed drop in Silk Board is heavily associated with Metro Line construction bottlenecks and peak-hour IT corridor exit flow (correlation r = 0.84).
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-500" /> Air Quality ↔ Meteorological Temperature Inversion
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                AQI spikes in Hebbal and Silk Board correlate strongly with low morning wind speed and boundary layer inversion trapping diesel particulate matter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREDICTIVE ANALYTICS */}
      {activeTab === 'predictive' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" /> Predictive Intelligence Preview
          </h3>
          <p className="text-xs text-slate-500">ML Forecast models for Traffic, AQI, Water, Electricity, and Citizen Complaints.</p>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300">
            For full model performance metrics, feature importances (SHAP), and counterfactual sandbox, switch to the dedicated <strong className="underline cursor-pointer" onClick={() => onSelectWard(selectedWard)}>Predictive Intelligence</strong> tab in navigation.
          </div>
        </div>
      )}

      {/* TAB 5: PRESCRIPTIVE ANALYTICS */}
      {activeTab === 'prescriptive' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Prescriptive AI Decision Recommendations
          </h3>
          <div className="space-y-3">
            {recommendationsList.map((rec) => (
              <div key={rec.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500">Department: {rec.department} • Projected Gain: <span className="text-emerald-600 font-bold">{rec.healthGain}</span></p>
                </div>
                <button 
                  onClick={() => showToast(`Triggered: ${rec.action}`)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                >
                  Execute Action
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ANOMALY CENTER */}
      {activeTab === 'anomalies' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Statistical Anomaly Detection Center
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated Z-score & IQR telemetry anomaly detection</p>
            </div>
            <span className="text-[10px] font-mono bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2.5 py-1 rounded-md font-bold">
              Z-Score Threshold &gt; 2.5
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  <th className="py-2.5 px-3">Deviation</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {anomaliesList.map((an) => (
                  <tr key={an.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{an.domain}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{an.location}</td>
                    <td className="py-3 px-3 font-bold text-red-600 dark:text-red-400">{an.observed}</td>
                    <td className="py-3 px-3 text-slate-500">{an.baseline}</td>
                    <td className="py-3 px-3 font-bold text-red-500">{an.deviation}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${an.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                        {an.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans text-[11px]">{an.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: CORRELATION EXPLORER */}
      {activeTab === 'correlation' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" /> Urban Correlation Explorer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Cross-variable statistical correlation matrix</p>
            </div>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-md font-bold">
              Warning: Correlation does not imply causation.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Domain A:</span>
              <select value={corrDomainA} onChange={(e) => setCorrDomainA(e.target.value)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold">
                <option value="traffic">Traffic Index</option>
                <option value="aqi">AQI PM2.5</option>
                <option value="complaints">Citizen Complaints</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Domain B:</span>
              <select value={corrDomainB} onChange={(e) => setCorrDomainB(e.target.value)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold">
                <option value="weather">Monsoon Precipitation</option>
                <option value="accidents">Accident Rates</option>
                <option value="population">Population Density</option>
              </select>
            </div>

            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
              Pearson Correlation (r) = +0.78 (Strong Positive Correlation)
            </span>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" dataKey="x" name={corrDomainA} stroke="#64748B" fontSize={11} />
                <YAxis type="number" dataKey="y" name={corrDomainB} stroke="#64748B" fontSize={11} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Scatter name="Wards" data={scatterCorrData} fill="#2563EB" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 8: TIME-SERIES */}
      {activeTab === 'timeseries' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" /> Time-Series Intelligence Engine
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Historical trend decomposition & seasonal pattern detection</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {['Today', '7D', '30D', '3M', '6M', '1Y'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setDateRange(tf)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${dateRange === tf ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="traffic" name="Historical Trend" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 9: WARD COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" /> Multi-Ward Side-by-Side Benchmarking
          </h3>
          <p className="text-xs text-slate-500">Compare up to 4 BBMP wards simultaneously across Traffic, AQI, Water, and Citizen Complaints.</p>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-300">
            For dedicated 4-ward side-by-side radar and KPI grid benchmarking, open the <strong className="underline cursor-pointer" onClick={() => onSelectWard(selectedWard)}>Ward Comparison</strong> screen in the left navigation sidebar.
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalyticsCenter;
