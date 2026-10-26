import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Car, 
  Wind, 
  Droplets, 
  Zap, 
  Siren, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Activity,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Ward, CityHealthScore } from '../types';

interface ExecutiveDashboardProps {
  healthScore: CityHealthScore;
  wards: Ward[];
  onSelectWard: (wardName: string) => void;
  onNavigateModule: (moduleId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  healthScore,
  wards,
  onSelectWard,
  onNavigateModule
}) => {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Banner: City Scorecard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Health Score Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-[#0F172A] text-white p-6 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Building2 className="w-48 h-48" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bengaluru Digital Twin Score</span>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> OPTIMAL SLA
              </span>
            </div>

            <div className="flex items-baseline gap-4 my-2">
              <span className="text-6xl font-extrabold font-mono tracking-tight text-white">{healthScore.overallScore}</span>
              <span className="text-xl font-medium text-slate-400">/ 100</span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4% vs Last Week
              </div>
            </div>
            <p className="text-xs text-slate-300 font-medium">Weighted index across 12 wards, 1,420 sensors, traffic corridors, and citizen feedback.</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Last Calculated: {healthScore.lastCalculated}</span>
            <button
              onClick={() => onNavigateModule('ai-insights')}
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
            >
              Formula & Weights <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Subscore Category Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          <div 
            onClick={() => onNavigateModule('traffic')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Traffic Index</span>
              <Car className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.trafficSubscore}</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">High Load</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${healthScore.trafficSubscore}%` }} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateModule('environment')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Air Quality</span>
              <Wind className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.environmentSubscore}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">Satisfactory</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthScore.environmentSubscore}%` }} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateModule('water')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Water Supply</span>
              <Droplets className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.waterSubscore}</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">Cauvery Grid</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${healthScore.waterSubscore}%` }} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateModule('electricity')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Power Grid</span>
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.powerSubscore}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">BESCOM 99%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${healthScore.powerSubscore}%` }} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateModule('emergency')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">112 SLA Target</span>
              <Siren className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.emergencyResponseSubscore}</span>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">&lt; 6 Mins</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${healthScore.emergencyResponseSubscore}%` }} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateModule('complaints')}
            className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Citizen Index</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{healthScore.citizenSatisfactionSubscore}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded">BBMP 86%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${healthScore.citizenSatisfactionSubscore}%` }} />
            </div>
          </div>

        </div>

      </div>

      {/* Middle Section: Active Anomaly Feeds & Priority Executive Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active City Anomaly Stream */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" /> Live City Anomaly Feed
            </span>
            <span className="text-xs font-mono text-slate-400">4 Active Incidents</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">TRAFFIC GRIDLOCK</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Central Silk Board Junction (Hosur Road)</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Average corridor speed dropped to 8.5 km/h. Signal green extension active.</p>
              </div>
              <button onClick={() => onNavigateModule('traffic')} className="text-xs text-blue-600 font-bold hover:underline shrink-0">View GIS</button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded">ENVIRONMENT ALARM</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Whitefield & Central Silk Board AQI Spikes</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">PM2.5 exceeded 175 µg/m³. Anti-smog water cannons recommended for ITPL Road.</p>
              </div>
              <button onClick={() => onNavigateModule('environment')} className="text-xs text-blue-600 font-bold hover:underline shrink-0">View AQI</button>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">WATER DEFICIT</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">BWSSB TK Halli Cauvery Supply Pipeline Pressure Drop</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Localized pressure reduction in Bellandur & Whitefield wards. 40 tankers queued.</p>
              </div>
              <button onClick={() => onNavigateModule('water')} className="text-xs text-blue-600 font-bold hover:underline shrink-0">View Water</button>
            </div>
          </div>
        </div>

        {/* Rapid Executive Actions Panel */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Rapid Inter-Departmental Actions
            </span>
            <span className="text-xs text-slate-400">Command Controls</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Trigger Signal Wave Corridor (ORR - Silk Board)</p>
                <p className="text-[11px] text-slate-500">Automate green signal extension (+35 seconds) to clear peak tech-park exodus.</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                Execute Wave
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dispatch BBMP Anti-Smog Water Sprinklers</p>
                <p className="text-[11px] text-slate-500">Send 4 water cannon trucks to Whitefield ITPL & Hebbal flyover loop.</p>
              </div>
              <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                Dispatch Units
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Re-route BWSSB Emergency Water Allocation</p>
                <p className="text-[11px] text-slate-500">Redirect 6.5 MLD treated Cauvery supply from Central Reservoir to Bellandur.</p>
              </div>
              <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                Re-route Grid
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Ward Telemetry Performance Grid */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Bengaluru Wards Telemetry Index (12 Primary Zones)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any ward to filter Digital Twin GIS map and inspect live sensor telemetry.</p>
          </div>
          <button
            onClick={() => onNavigateModule('digital-twin')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open Full Digital Twin Map <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Ward Name</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Population</th>
                <th className="py-2.5 px-3">AQI Index</th>
                <th className="py-2.5 px-3">Traffic Density</th>
                <th className="py-2.5 px-3">Water Supply</th>
                <th className="py-2.5 px-3">Power Status</th>
                <th className="py-2.5 px-3">Active Complaints</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {wards.map((ward) => (
                <tr key={ward.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{ward.name} <span className="text-[10px] font-normal text-slate-400">(#{ward.number})</span></td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{ward.zone}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{(ward.population / 1000).toFixed(0)}k</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${ward.aqi > 150 ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : ward.aqi > 100 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                      {ward.aqi} AQI
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${ward.trafficIndex > 80 ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                      {ward.trafficIndex}/100
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{ward.waterSupplyStatus}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{ward.powerSupplyStatus}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{ward.activeComplaints} issues</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{ward.healthScore}/100</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        onSelectWard(ward.name);
                        onNavigateModule('digital-twin');
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-[11px] transition-all"
                    >
                      Map View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
