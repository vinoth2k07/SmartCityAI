import React, { useState } from 'react';
import { WaterDashboard } from './WaterDashboard';
import { ElectricityDashboard } from './ElectricityDashboard';
import { Droplets, Zap, Activity } from 'lucide-react';

interface UtilitiesViewProps {
  initialTab?: 'water' | 'electricity';
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({ initialTab = 'water' }) => {
  const [activeTab, setActiveTab] = useState<'water' | 'electricity'>(initialTab);

  return (
    <div className="space-y-4">
      {/* Utilities Header Tab Switcher */}
      <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 sticky top-14 z-20 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white hidden sm:block">
              Utilities Analytics
            </h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('water')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'water'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Water Analytics</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">1,450 MLD</span>
              </button>

              <button
                onClick={() => setActiveTab('electricity')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'electricity'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Power Analytics</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">3,820 MW</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Live Data Integration & AI Forecasting</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        {activeTab === 'water' ? <WaterDashboard /> : <ElectricityDashboard />}
      </div>
    </div>
  );
};

export default UtilitiesView;

