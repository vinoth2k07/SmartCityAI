import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Siren, ArrowUpRight } from 'lucide-react';
import { AccidentHotspot } from '../types';

interface AccidentDashboardProps {
  hotspots: AccidentHotspot[];
  onNavigateEmergency?: () => void;
}

export const AccidentDashboard: React.FC<AccidentDashboardProps> = ({ hotspots, onNavigateEmergency }) => {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bengaluru Road Safety & Accident Intelligence</h2>
            <p className="text-xs text-slate-500">Blackspot Identification, Collision Risk Scoring & Engineering Interventions</p>
          </div>
        </div>

        <button
          onClick={onNavigateEmergency}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
        >
          <Siren className="w-4 h-4 animate-bounce" /> 112 Emergency Dispatch Link
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Identified Blackspots</span>
          <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">18</p>
          <span className="text-[11px] text-red-600 dark:text-red-400 font-bold">4 High Priority Junctions</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Collisions 2026 YTD</span>
          <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">170</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">-14% vs 2025 (Speed Cameras Active)</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Fatalities Recorded</span>
          <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">15</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">Mainly Night Highway Entries</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Emergency SLA Response</span>
          <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 my-1">5.4 Mins</p>
          <span className="text-[11px] text-slate-500">Ambulance Arrival Time</span>
        </div>
      </div>

      {/* Identified Hotspots List */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Critical Accident Hotspots & Civil Safety Mitigation Plans</h3>

        <div className="space-y-4">
          {hotspots.map((hs) => (
            <div key={hs.id} className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-red-600 text-white rounded-md">
                    {hs.riskScore} RISK
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{hs.junction}</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Primary Risk Factor: <b>{hs.primaryCause}</b>
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg mt-1">
                  Mitigation Action: {hs.recommendedMitigation}
                </p>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block">COLLISIONS</span>
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{hs.totalAccidents2026}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block">FATALITIES</span>
                  <span className="text-lg font-bold font-mono text-red-600 dark:text-red-400">{hs.fatalities}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-LEVEL DOMAIN INTELLIGENCE FRAMEWORK FOR ACCIDENTS */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" /> 4-Level Road Safety & Crash Intelligence Framework
          </h3>
          <span className="text-[10px] font-mono bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded font-bold">
            Random Forest Crash Risk Classifier
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">1. What Happened?</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Descriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">18 Blackspots Identified</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              170 recorded collisions YTD across Hosur Road Flyover, Hebbal Flyover & Outer Ring Road. 15 fatalities recorded.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">2. Why Did It Happen?</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-1.5 py-0.5 rounded font-bold">Diagnostic</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">High Speed & Blind Spot Geometry</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Nighttime speed variations, poorly illuminated pedestrian crossings, and rapid lane compression at flyover ramps.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">3. What Is Likely Next?</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Predictive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">High Collision Probability (22:00-02:00)</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Model flags 74% elevated crash risk on Silk Board elevated highway during weekend late-night freight transport hours.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">4. What Should Be Considered?</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Prescriptive</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">High-Intensity Lighting & speed Humps</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consider installing high-lumen solar LED studs, rumble strips, and deploying BTP radar speed enforcement units.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
