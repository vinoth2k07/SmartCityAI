import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, X } from 'lucide-react';

interface AuthModalProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentRole, onSelectRole, onClose }) => {
  const ROLES: { id: UserRole; name: string; dept: string; access: string }[] = [
    { id: 'Super Admin', name: 'Chief Commissioner / Mayor', dept: 'BBMP Executive Command', access: 'Full Command Rights & Override' },
    { id: 'Traffic Department', name: 'Traffic Police Commissioner', dept: 'Bengaluru Traffic Police (BTP)', access: 'Signal Green Wave & Corridor Dispatch' },
    { id: 'Environment Department', name: 'CPCB Environmental Officer', dept: 'Karnataka Pollution Control', access: 'AQI Sensors & Anti-Smog Cannon Control' },
    { id: 'Water Department', name: 'BWSSB Chief Engineer', dept: 'Cauvery Water Grid', access: 'Pumping Telemetry & Tanker Dispatch' },
    { id: 'Electricity Department', name: 'BESCOM Operations Lead', dept: 'Power Grid Distribution', access: 'Substation Load Control & Outages' },
    { id: 'Emergency Department', name: '112 Chief Dispatcher', dept: 'Emergency Response Center', access: 'Ambulance, Fire & Police Routing' },
    { id: 'Citizen', name: 'Bengaluru Resident Citizen', dept: 'BBMP Sahaaya Public Portal', access: 'Report Issues & View Public Map' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">SmartCity360 Role-Based Access Control (RBAC)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">Switch government department role to test RBAC command controls & authorization levels.</p>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {ROLES.map((r) => {
            const isSelected = currentRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{r.name}</span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {r.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.dept} | Access: <b>{r.access}</b></p>
                </div>

                {isSelected && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
