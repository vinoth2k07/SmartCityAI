import React, { useState } from 'react';
import { 
  Droplets, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Sliders, 
  BarChart3, 
  Layers, 
  ArrowUpRight, 
  Info, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  Lightbulb,
  Building2
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

// Historical Supply vs Consumption Trend Data
const SUPPLY_VS_CONSUMPTION_DATA = [
  { day: 'Mon', supply: 1450, consumption: 1190, target: 1200 },
  { day: 'Tue', supply: 1450, consumption: 1210, target: 1200 },
  { day: 'Wed', supply: 1450, consumption: 1180, target: 1200 },
  { day: 'Thu', supply: 1450, consumption: 1230, target: 1200 },
  { day: 'Fri', supply: 1450, consumption: 1250, target: 1200 },
  { day: 'Sat', supply: 1420, consumption: 1140, target: 1200 },
  { day: 'Sun', supply: 1400, consumption: 1120, target: 1200 },
];

// Historical Monthly Usage Data
const MONTHLY_USAGE_DATA = [
  { month: 'Oct', usage: 34.2, supply: 42.0 },
  { month: 'Nov', usage: 35.8, supply: 43.5 },
  { month: 'Dec', usage: 36.5, supply: 43.0 },
  { month: 'Jan', usage: 37.1, supply: 44.2 },
  { month: 'Feb', usage: 38.0, supply: 44.5 },
  { month: 'Mar', usage: 39.4, supply: 45.0 },
];

// Leakage Rate Historical Trend Data (% NRW)
const LEAKAGE_TREND_DATA = [
  { month: 'Oct', actual: 34.5, target: 20.0 },
  { month: 'Nov', actual: 32.8, target: 20.0 },
  { month: 'Dec', actual: 31.0, target: 20.0 },
  { month: 'Jan', actual: 29.8, target: 20.0 },
  { month: 'Feb', actual: 29.1, target: 20.0 },
  { month: 'Mar', actual: 28.2, target: 20.0 },
  { month: 'Apr (FC)', forecast: 24.5, target: 20.0 },
  { month: 'May (FC)', forecast: 19.8, target: 20.0 },
];

// Ward Comparison Data
const WARD_WATER_DATA = [
  { ward: 'Whitefield', supply: 120, demand: 155, deficit: 35 },
  { ward: 'Bellandur', supply: 110, demand: 142, deficit: 32 },
  { ward: 'Koramangala', supply: 135, demand: 130, deficit: 0 },
  { ward: 'Indiranagar', supply: 125, demand: 118, deficit: 0 },
  { ward: 'Hebbal', supply: 140, demand: 135, deficit: 0 },
  { ward: 'Yelahanka', supply: 105, demand: 98, deficit: 0 },
  { ward: 'Jayanagar', supply: 130, demand: 122, deficit: 0 },
];

// Water Demand Forecast Data
const DEMAND_FORECAST_DATA = [
  { day: 'Day 1', historical: 1180, forecast: null },
  { day: 'Day 2', historical: 1200, forecast: null },
  { day: 'Day 3', historical: 1210, forecast: null },
  { day: 'Day 4', historical: 1195, forecast: null },
  { day: 'Day 5', historical: 1225, forecast: 1225 },
  { day: 'Day 6 (F)', historical: null, forecast: 1245 },
  { day: 'Day 7 (F)', historical: null, forecast: 1270 },
  { day: 'Day 8 (F)', historical: null, forecast: 1290 },
  { day: 'Day 9 (F)', historical: null, forecast: 1280 },
  { day: 'Day 10 (F)', historical: null, forecast: 1260 },
  { day: 'Day 11 (F)', historical: null, forecast: 1250 },
  { day: 'Day 12 (F)', historical: null, forecast: 1235 },
];

export const WaterDashboard: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'7d' | '30d' | '1y'>('7d');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState<boolean>(false);

  const handleWaterAction = (actionName: string, message: string) => {
    setIsGeneratingRecommendation(true);
    setTimeout(() => {
      setIsGeneratingRecommendation(false);
      setActionFeedback(`[AI Decision Support]: ${message}`);
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
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Water Analytics</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                Live Data Integration
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supply-demand balances, consumption trends, leakage detection & predictive water forecasting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => handleWaterAction('Suggested Water Distribution', 'Suggested Water Distribution model updated for Whitefield & Bellandur deficit zones.')}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Water Distribution</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
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
        
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Water Supply</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">1,450 MLD</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Stage I to IV Full Capacity
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Water Consumption</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">1,180 MLD</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Average Urban Usage (81.3% of Supply)
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Water Availability</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 my-1">82.4 TMC</p>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-bold">
            66% Live Storage Level
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Leakage Rate</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-amber-500 my-1">28.2%</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            Non-Revenue Water (Target &lt; 20%)
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Affected Wards</span>
            <Building2 className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold font-mono text-red-500 my-1">2 Wards</p>
          <p className="text-[11px] text-red-600 dark:text-red-400 font-bold">
            Whitefield & Bellandur
          </p>
        </div>

      </div>

      {/* 2. SECTION: INTERACTIVE CHARTS & HISTORICAL TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Supply vs Consumption Trend Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Supply & Consumption Trend</h2>
              <p className="text-xs text-slate-500">24-Hour water production vs actual citywide consumption (MLD)</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
              <button 
                onClick={() => setActiveTimeframe('7d')} 
                className={`px-2 py-1 rounded-lg transition-all ${activeTimeframe === '7d' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setActiveTimeframe('30d')} 
                className={`px-2 py-1 rounded-lg transition-all ${activeTimeframe === '30d' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SUPPLY_VS_CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="consumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1000, 1600]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="supply" name="Daily Water Supply (MLD)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#supplyGrad)" />
                <Area type="monotone" dataKey="consumption" name="Water Consumption (MLD)" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#consumeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leakage Trend Chart (% Non-Revenue Water) */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leakage Trend & Non-Revenue Water (NRW)</h2>
              <p className="text-xs text-slate-500">Acoustic sensor telemetry & distribution loss trajectory (%)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              Target: &lt;20%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LEAKAGE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[15, 40]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Leakage (%)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="Forecasted Leakage (%)" stroke="#10B981" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" name="Policy Target (%)" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. SECTION: WARD COMPARISON & WATER DEMAND FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ward Comparison Bar Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ward Comparison (Supply vs Demand)</h2>
              <p className="text-xs text-slate-500">MLD allocation by key urban zones highlighting localized deficits</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_WATER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="ward" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="supply" name="Supply (MLD)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" name="Demand (MLD)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Demand Forecast Chart */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Water Demand Forecast</h2>
              <p className="text-xs text-slate-500">14-Day AI Predictive model based on population & weather variables</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              AI Forecast Active
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEMAND_FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1100, 1350]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="historical" name="Historical Demand (MLD)" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="Predicted Demand (MLD)" stroke="#8B5CF6" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. SECTION: WATER DISTRIBUTION STATUS */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" /> Water Distribution Status
          </h2>
          <span className="text-xs text-slate-500 font-medium">Real-Time Distribution & Pressure Analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">TK Halli Distribution Zone</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Optimal</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">4.8 Bar Pressure</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Flow Rate: 550 MLD (100% Target)</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Koramangala Distribution Zone</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">Moderate</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">3.1 Bar Pressure</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Flow Rate: 420 MLD (Minor Friction Loss)</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Hoodi-Whitefield Zone</span>
              <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold px-1.5 py-0.5 rounded">Low Pressure</span>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">1.9 Bar Pressure</p>
            <p className="text-xs text-red-500 font-medium mt-1">Flow Rate: 310 MLD (Deficit Zone Alert)</p>
          </div>
        </div>
      </div>

      {/* 5. SECTION: AI INSIGHTS & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">AI Water Analytics Insights</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Localized Deficit Analysis: Whitefield & Bellandur</span>
                <span className="text-[10px] text-red-500 font-bold">High Priority</span>
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Rapid commercial construction and tech park expansion in Mahadevapura zone have created a 35 MLD water supply gap. Acoustic telemetry identifies main trunk friction resistance between Koramangala and Hoodi.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Non-Revenue Water (NRW) Reduction Strategy</span>
                <span className="text-[10px] text-amber-500 font-bold">Medium Priority</span>
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Leakage rate has decreased from 34.5% to 28.2% over 6 months due to smart metering deployment. Additional pressure management in high-head elevation zones can reduce NRW to &lt;20% target by Q3.
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
                <span>Adjust booster flow allocation to Whitefield feeder during peak evening draw hours (17:00–20:00).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Encourage rainwater harvesting incentives in eastern zone tech parks to offset 15 MLD commercial demand.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Optimize pressure release valves at Koramangala reservoir to prevent micro-leaks in aging feeder lines.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleWaterAction('Suggested Flow Optimization', 'Suggested Flow Optimization strategy generated for Koramangala-Whitefield corridor.')}
              disabled={isGeneratingRecommendation}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Suggested Flow Optimization</span>
            </button>

            <button
              onClick={() => handleWaterAction('Generate Water Recommendation', 'AI Water Recommendation report compiled for municipal planning committee.')}
              disabled={isGeneratingRecommendation}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Generate Water Recommendation</span>
            </button>
          </div>
        </div>

      </div>

      {/* 6. SECTION: 4-LEVEL DOMAIN INTELLIGENCE FRAMEWORK FOR WATER */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" /> 4-Level Water Analytics Intelligence Framework
          </h2>
          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
            Urban Decision Support Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">1. What Happened?</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Descriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Supply: 1,450 MLD</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pressure index at Hoodi booster station registered <strong>1.9 Bar</strong>. Non-revenue water leakage is at 28.2%.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">2. Why Did It Happen?</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-1.5 py-0.5 rounded font-bold">Diagnostic</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Trunk Pressure Loss & Draw Spikes</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Main trunk resistance at Hoodi junction coupled with evening commercial draw spikes in Mahadevapura tech corridors.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">3. What Is Likely Next?</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Predictive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">14-Day Demand Projection</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Demand forecasted to reach <strong>1,290 MLD</strong> during upcoming summer dry spell. Supply deficits risks in 2 eastern wards.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">4. What Should Be Considered?</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Prescriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Flow Optimization Recommendation</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consider implementing flow balancing from Koramangala reservoir and encouraging greywater recycling in commercial tech hubs.
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
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Water Analytics Executive Report</h3>
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
                <p className="font-bold text-slate-900 dark:text-white">Report Title: Urban Water Analytics & Supply Balance</p>
                <p>Date Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>Status: Verified by AI Digital Twin Engine</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">Key Executive Metrics Included:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Daily Water Supply: 1,450 MLD</li>
                  <li>City Water Consumption: 1,180 MLD</li>
                  <li>Reservoir Availability: 82.4 TMC (66% Storage)</li>
                  <li>Non-Revenue Water Leakage: 28.2%</li>
                  <li>Ward Deficit Analysis & 14-Day Demand Forecast</li>
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
                  setActionFeedback('Water Analytics Report exported to PDF format.');
                  setTimeout(() => setActionFeedback(null), 4000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
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

export default WaterDashboard;
