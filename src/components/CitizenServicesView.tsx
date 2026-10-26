import React, { useState } from 'react';
import { CitizenComplaintsDashboard } from './CitizenComplaintsDashboard';
import { AccidentDashboard } from './AccidentDashboard';
import { CitizenComplaint, EmergencyDispatch } from '../types';
import { ACCIDENT_HOTSPOTS } from '../data/bengaluruData';
import { MessageSquare, Siren } from 'lucide-react';

interface CitizenServicesViewProps {
  complaints: CitizenComplaint[];
  onSubmitNewComplaint: (complaint: Partial<CitizenComplaint>) => void;
  wards: { id: string; name: string }[];
  highlightTicket?: string;
  onNavigateEmergency?: () => void;
  initialTab?: 'complaints' | 'emergency';
}

export const CitizenServicesView: React.FC<CitizenServicesViewProps> = ({
  complaints,
  onSubmitNewComplaint,
  wards,
  highlightTicket,
  onNavigateEmergency,
  initialTab = 'complaints'
}) => {
  const [activeTab, setActiveTab] = useState<'complaints' | 'emergency'>(initialTab);

  return (
    <div className="space-y-4">
      {/* Citizen Services Header Tab Switcher */}
      <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 sticky top-14 z-20 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white hidden sm:block">
              Citizen Services & Emergency Telemetry
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'complaints'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>BBMP Civic Complaints</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-mono">
                  {complaints.length} Tickets
                </span>
              </button>

              <button
                onClick={() => setActiveTab('emergency')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'emergency'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Siren className="w-4 h-4 text-rose-500" />
                <span>Accident & Emergency Analytics</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 font-mono">
                  108 Fleet Live
                </span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden md:block">
            SLA SLA Tracking & Dispatch Command
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        {activeTab === 'complaints' ? (
          <CitizenComplaintsDashboard
            complaints={complaints}
            onSubmitNewComplaint={onSubmitNewComplaint}
            wards={wards}
            highlightTicket={highlightTicket}
          />
        ) : (
          <AccidentDashboard
            hotspots={ACCIDENT_HOTSPOTS}
            onNavigateEmergency={onNavigateEmergency}
          />
        )}
      </div>
    </div>
  );
};

export default CitizenServicesView;
