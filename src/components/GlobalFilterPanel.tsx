import React from 'react';
import { 
  Filter, 
  X, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  Car, 
  Wind, 
  AlertTriangle, 
  Sliders, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { GlobalFilterState, Ward, DepartmentKey } from '../types';

interface GlobalFilterPanelProps {
  filters: GlobalFilterState;
  onChangeFilters: (filters: GlobalFilterState) => void;
  wards: Ward[];
  isOpen: boolean;
  onClose: () => void;
}

const KARNATAKA_DISTRICTS = ['Bengaluru Urban', 'Bengaluru Rural', 'Ramanagara', 'Chikkaballapura', 'Kolar'];
const BENGALURU_CITIES = ['Bengaluru', 'Electronic City IT Zone', 'Yelahanka Satellite Town'];

export const DEFAULT_GLOBAL_FILTERS: GlobalFilterState = {
  location: {
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    zone: 'All',
    wardId: 'all',
    road: 'All',
    sensorId: 'All'
  },
  dateRange: 'Today',
  timeOfDay: 'Real-Time',
  department: 'All',
  vehicleType: 'All',
  complaintCategory: 'All',
  weather: 'All',
  aqiLevel: 'All',
  emergencyType: 'All'
};

export const GlobalFilterPanel: React.FC<GlobalFilterPanelProps> = ({
  filters,
  onChangeFilters,
  wards,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Extract unique zones dynamically from loaded database wards
  const zones = Array.from(new Set(wards.map(w => w.zone).filter(Boolean)));

  // Wards filtered by chosen zone
  const availableWards = filters.location.zone === 'All'
    ? wards
    : wards.filter(w => w.zone === filters.location.zone);

  // Roads for selected ward
  const selectedWardObj = wards.find(w => w.id === filters.location.wardId);
  const availableRoads = selectedWardObj
    ? [
        'All',
        `${selectedWardObj.name} Main Outer Arterial`,
        `${selectedWardObj.name} 100 Feet Road Corridor`,
        `${selectedWardObj.name} Junction 4`,
        `${selectedWardObj.name} Commercial Avenue`
      ]
    : ['All'];

  const handleLocationChange = (field: string, value: string) => {
    const updatedLoc = { ...filters.location, [field]: value };
    
    // Reset child hierarchy if parent changes
    if (field === 'zone') {
      updatedLoc.wardId = 'all';
      updatedLoc.road = 'All';
    } else if (field === 'wardId') {
      updatedLoc.road = 'All';
    }

    onChangeFilters({
      ...filters,
      location: updatedLoc
    });
  };

  const handleReset = () => {
    onChangeFilters(DEFAULT_GLOBAL_FILTERS);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0F172A] border-l border-[#1E293B] text-slate-100 h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0B1220]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Enterprise Filter Panel</h2>
              <p className="text-[11px] text-slate-400">Cascading Location & Multi-Domain Control</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SECTION 1: CASCADING LOCATION HIERARCHY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-400 tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location Hierarchy</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* State */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State</label>
                <select 
                  value={filters.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">District</label>
                <select 
                  value={filters.location.district}
                  onChange={(e) => handleLocationChange('district', e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {KARNATAKA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City</label>
                <select 
                  value={filters.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {BENGALURU_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* BBMP Zone */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">BBMP Zone</label>
                <select 
                  value={filters.location.zone}
                  onChange={(e) => handleLocationChange('zone', e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All BBMP Zones</option>
                  {zones.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ward Selector */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">BBMP Ward (From PostGIS DB)</label>
              <select 
                value={filters.location.wardId}
                onChange={(e) => handleLocationChange('wardId', e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Wards ({wards.length} Loaded)</option>
                {availableWards.map(w => (
                  <option key={w.id} value={w.id}>
                    Ward {w.number}: {w.name} ({w.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Road Selector */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Corridor / Road</label>
              <select 
                value={filters.location.road || 'All'}
                onChange={(e) => handleLocationChange('road', e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {availableRoads.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* SECTION 2: TEMPORAL FILTERS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400 tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Time Horizon & Window</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Date Range</label>
                <select 
                  value={filters.dateRange}
                  onChange={(e) => onChangeFilters({ ...filters, dateRange: e.target.value as any })}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Today">Today (Live Stream)</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Q3 2026">Q3 2026 Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Time Profile</label>
                <select 
                  value={filters.timeOfDay}
                  onChange={(e) => onChangeFilters({ ...filters, timeOfDay: e.target.value as any })}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Real-Time">Real-Time Live</option>
                  <option value="Morning Peak">Morning Peak (08:00-11:00)</option>
                  <option value="Afternoon">Afternoon (11:00-16:00)</option>
                  <option value="Evening Peak">Evening Peak (17:00-21:00)</option>
                  <option value="Night">Night (21:00-06:00)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* SECTION 3: DOMAIN & VEHICLE FILTERS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400 tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <span>Domain & Classification</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Department</label>
                <select 
                  value={filters.department}
                  onChange={(e) => onChangeFilters({ ...filters, department: e.target.value as any })}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Departments</option>
                  <option value="traffic">Traffic & Signals</option>
                  <option value="environment">Environment & Air Quality</option>
                  <option value="water">BWSSB Water Grid</option>
                  <option value="electricity">BESCOM Electricity Grid</option>
                  <option value="emergency">112 Emergency Dispatch</option>
                  <option value="infrastructure">Civil Infrastructure</option>
                  <option value="complaints">BBMP Citizen Complaints</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Vehicle Type</label>
                  <select 
                    value={filters.vehicleType}
                    onChange={(e) => onChangeFilters({ ...filters, vehicleType: e.target.value })}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Vehicles</option>
                    <option value="Two Wheelers">Two Wheelers</option>
                    <option value="Cars & SUVs">Cars & SUVs</option>
                    <option value="BMTC Buses">BMTC Buses</option>
                    <option value="Auto Rickshaws">Auto Rickshaws</option>
                    <option value="Freight Trucks">Freight Trucks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Weather Context</label>
                  <select 
                    value={filters.weather}
                    onChange={(e) => onChangeFilters({ ...filters, weather: e.target.value })}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Weather</option>
                    <option value="Clear">Clear / Dry</option>
                    <option value="Monsoon Rain">Monsoon Rain</option>
                    <option value="Overcast">Overcast</option>
                    <option value="Smog">Smog / Mist</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* SECTION 4: THRESHOLDS & EMERGENCY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-purple-400 tracking-wider">
              <Wind className="w-3.5 h-3.5" />
              <span>AQI & Emergency Severity</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">AQI Filter</label>
                <select 
                  value={filters.aqiLevel}
                  onChange={(e) => onChangeFilters({ ...filters, aqiLevel: e.target.value })}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="All">All AQI Levels</option>
                  <option value="Good">Good (0 - 50)</option>
                  <option value="Satisfactory">Satisfactory (51 - 100)</option>
                  <option value="Moderate">Moderate (101 - 200)</option>
                  <option value="Poor">Poor (201 - 300)</option>
                  <option value="Very Poor">Very Poor (&gt;300)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Emergency Category</label>
                <select 
                  value={filters.emergencyType}
                  onChange={(e) => onChangeFilters({ ...filters, emergencyType: e.target.value })}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="All">All Incidents</option>
                  <option value="Medical Incident">Medical Emergency</option>
                  <option value="Fire Alert">Fire Alert</option>
                  <option value="Traffic Collision">Traffic Crash</option>
                  <option value="Water Main Burst">Pipe Main Burst</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0B1220] flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Filters ({availableWards.length} Wards Active)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
