import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Sliders, 
  BarChart3, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  Download, 
  Lightbulb,
  Building2,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ComposedChart 
} from 'recharts';

// Hourly Load Trend Data (24-Hour Curve)
const HOURLY_LOAD_DATA = [
  { hour: '00:00', load: 2400, capacity: 4500 },
  { hour: '03:00', load: 2100, capacity: 4500 },
  { hour: '06:00', load: 2600, capacity: 4500 },
  { hour: '09:00', load: 3400, capacity: 4500 },
  { hour: '12:00', load: 3750, capacity: 4500 },
  { hour: '15:00', load: 3820, capacity: 4500 },
  { hour: '18:00', load: 3650, capacity: 4500 },
  { hour: '21:00', load: 3100, capacity: 4500 },
];

// Daily Power Consumption Trend Data (GWh)
const DAILY_CONSUMPTION_DATA = [
  { day: 'Mon', consumption: 78.4, renewable: 9.2 },
  { day: 'Tue', consumption: 81.2, renewable: 9.8 },
  { day: 'Wed', consumption: 79.5, renewable: 10.1 },
  { day: 'Thu', consumption: 82.6, renewable: 10.4 },
  { day: 'Fri', consumption: 84.1, renewable: 10.8 },
  { day: 'Sat', consumption: 72.3, renewable: 11.2 },
  { day: 'Sun', consumption: 68.0, renewable: 11.5 },
];

// Ward Power Comparison Data
const WARD_POWER_DATA = [
  { ward: 'Whitefield', loadMW: 340, capacityMW: 400, loadFactor: 85 },
  { ward: 'Peenya Ind.', loadMW: 410, capacityMW: 500, loadFactor: 82 },
  { ward: 'Hebbal', loadMW: 280, capacityMW: 350, loadFactor: 80 },
  { ward: 'Koramangala', loadMW: 290, capacityMW: 360, loadFactor: 80 },
  { ward: 'Electronic City', loadMW: 380, capacityMW: 460, loadFactor: 82 },
  { ward: 'Yelahanka', loadMW: 210, capacityMW: 300, loadFactor: 70 },
  { ward: 'Jayanagar', loadMW: 195, capacityMW: 280, loadFactor: 69 },
];

// Peak Load Forecast Data (Next 7 Days)
const PEAK_LOAD_FORECAST_DATA = [
  { day: 'Day 1', actual: 3820, forecast: null },
  { day: 'Day 2', actual: 3850, forecast: null },
  { day: 'Day 3', actual: 3880, forecast: null },
  { day: 'Day 4', actual: 3910, forecast: 3910 },
  { day: 'Day 5 (FC)', actual: null, forecast: 3980 },
  { day: 'Day 6 (FC)', actual: null, forecast: 4050 },
  { day: 'Day 7 (FC)', actual: null, forecast: 4100 },
];

// Renewable Contribution Generation Curve Data (Solar + Wind)
const RENEWABLE_GENERATION_DATA = [
  { time: '06:00', solar: 40, wind: 80, total: 120 },
  { time: '09:00', solar: 180, wind: 70, total: 250 },
  { time: '12:00', solar: 320, wind: 100, total: 420 },
  { time: '15:00', solar: 280, wind: 110, total: 390 },
  { time: '18:00', solar: 90, wind: 130, total: 220 },
  { time: '21:00', solar: 0, wind: 140, total: 140 },
];

export const ElectricityDashboard: React.FC = () => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePowerAction = (actionName: string, message: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActionFeedback(`[AI Power Decision Support]: ${message}`);
      setTimeout(() => setActionFeedback(null), 5000);
    }, 600);
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Power Analytics</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                Live Data Integration
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Grid load trends, peak demand forecasting, renewable generation & distribution efficiency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => handlePowerAction('Suggested Power Distribution', 'Suggested Power Distribution model calculated for Hoodi and Peenya distribution nodes.')}
            className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Power Distribution</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-between gap-2 text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
        </div>
      )}

      {/* 1. SECTION: TOP KPI OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Current Power Usage</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">3,820 MW</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            Peak Demand Margin (+450 MW Reserve)
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Peak Load</span>
            <TrendingUp className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-red-500 my-1">4,100 MW</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Forecasted Max Peak Load
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Renewable Energy</span>
            <Sun className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 my-1">420 MW</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Solar & Wind (11% City Power)
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Power Availability</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 my-1">99.4%</p>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-bold">
            Grid Reliability SLA Target
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Affected Wards</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">1 Ward</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            Whitefield Phase 2 Maintenance
          </p>
        </div>

      </div>

      {/* 2. SECTION: INTERACTIVE CHARTS & HISTORICAL TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Load Trend Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hourly Load Trend (24-Hour Profile)</h2>
              <p className="text-xs text-slate-500">Real-time electricity load vs available grid capacity (MW)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              Peak: 15:00 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_LOAD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1500, 5000]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="load" name="Power Load (MW)" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#loadGrad)" />
                <Line type="monotone" dataKey="capacity" name="Grid Capacity (MW)" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Consumption Trend Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Power Consumption</h2>
              <p className="text-xs text-slate-500">Weekly energy consumption breakdown (GWh) & renewable contribution</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="consumption" name="Grid Consumption (GWh)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="renewable" name="Renewable Offset (GWh)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. SECTION: WARD COMPARISON, PEAK LOAD FORECAST & RENEWABLE CONTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ward Comparison Bar Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ward Power Comparison</h2>
              <p className="text-xs text-slate-500">Current load (MW) across major wards</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_POWER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="ward" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="loadMW" name="Load (MW)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Load Forecast Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Peak Load Forecast</h2>
              <p className="text-xs text-slate-500">7-Day AI load prediction (MW)</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={PEAK_LOAD_FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[3500, 4300]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Line type="monotone" dataKey="actual" name="Actual Peak (MW)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="Predicted Peak (MW)" stroke="#EF4444" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Renewable Contribution Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Renewable Contribution</h2>
              <p className="text-xs text-slate-500">Solar rooftop & wind profile (MW)</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RENEWABLE_GENERATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="solar" name="Solar Generation (MW)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" />
                <Line type="monotone" dataKey="wind" name="Wind Offset (MW)" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. SECTION: POWER DISTRIBUTION STATUS */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Power Distribution Status
          </h2>
          <span className="text-xs text-slate-500 font-medium">Distribution Node Capacities & Load Indices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Hoodi Distribution Node</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">High Load</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">340 MW / 400 MW</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">85% Load Factor (Tech Park Peak Draw)</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Hebbal Distribution Node</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Optimal</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">280 MW / 350 MW</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">80% Load Factor (Balanced Operational Margin)</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Peenya Industrial Node</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Optimal</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">410 MW / 500 MW</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">82% Load Factor (Industrial Shift Consumption)</p>
          </div>
        </div>
      </div>

      {/* 5. SECTION: AI INSIGHTS & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Grid Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">AI Grid Analytics Insights</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Peak Load Drivers & HVAC Demand</span>
                <span className="text-[10px] text-amber-500 font-bold">Moderate Risk</span>
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                High afternoon temperatures (26.4 °C) coincide with commercial building cooling demand and EV rapid charging depot draws in tech parks, pushing Hoodi node load factor to 85%.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Solar Rooftop Integration Cushion</span>
                <span className="text-[10px] text-emerald-500 font-bold">Positive Growth</span>
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Rooftop solar installations generated 420 MW during peak daylight hours (11:00–14:00), successfully offsetting 11% of total citywide peak power demand.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Recommendations & Quick Actions */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">AI Policy Recommendations</h2>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suggest feeder load shifting from Hoodi node to Hebbal node during 14:00–16:00 peak hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Incentivize commercial EV fleet charging during off-peak hours (22:00–06:00).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Expand rooftop solar net-metering incentives for commercial tech park roofs.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handlePowerAction('Suggested Power Distribution', 'Suggested Power Distribution optimization computed for Hoodi-Hebbal load transfer.')}
              disabled={isProcessing}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Suggested Power Distribution</span>
            </button>

            <button
              onClick={() => handlePowerAction('AI Power Recommendation', 'AI Power Recommendation brief compiled for urban energy planning.')}
              disabled={isProcessing}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Power Recommendation</span>
            </button>
          </div>
        </div>

      </div>

      {/* 6. SECTION: 4-LEVEL DOMAIN INTELLIGENCE FRAMEWORK FOR ELECTRICITY */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" /> 4-Level Power Analytics Intelligence Framework
          </h2>
          <span className="text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
            Urban Decision Support Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">1. What Happened?</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Descriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Peak Power Usage: 3,820 MW</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hoodi distribution node touched <strong>85% capacity</strong>. Solar rooftop contribution reached 420 MW midday.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">2. Why Did It Happen?</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-1.5 py-0.5 rounded font-bold">Diagnostic</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">HVAC Cooling & Rapid EV Charging</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              High ambient temperature (26.4 °C) drove simultaneous commercial HVAC cooling load and EV fleet rapid charging.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">3. What Is Likely Next?</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Predictive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Evening Load Forecast</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Forecasted peak load reaching <strong>4,100 MW</strong> over next 7 days during summer temperature surge.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">4. What Should Be Considered?</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Prescriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Load Distribution Strategy</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consider suggested load distribution from Hoodi to Hebbal node and off-peak EV charging incentives.
            </p>
          </div>

        </div>
      </div>

      {/* REPORT GENERATION MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Power Analytics Executive Report</h3>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1 font-mono">
                <p className="font-bold text-slate-900 dark:text-white">Report Title: Urban Power Analytics & Grid Stability</p>
                <p>Date Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>Status: Verified by AI Digital Twin Engine</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">Key Executive Metrics Included:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Current Peak Power Usage: 3,820 MW</li>
                  <li>Forecasted Peak Load: 4,100 MW</li>
                  <li>Renewable Energy Generation: 420 MW (11% City Power)</li>
                  <li>Power Grid Availability: 99.4% SLA</li>
                  <li>Ward Power Consumption & 7-Day Peak Load Forecast</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setActionFeedback('Power Analytics Report exported to PDF format.');
                  setTimeout(() => setActionFeedback(null), 4000);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Report PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ElectricityDashboard;
