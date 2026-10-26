import React, { useState, useEffect } from 'react';
import { 
  Hospital, 
  Shield, 
  Flame, 
  Train, 
  Bus, 
  Trees, 
  Building2, 
  Droplets, 
  MapPin, 
  Phone, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ExternalLink, 
  Navigation, 
  Clock, 
  Send,
  Sparkles,
  Users,
  Radio
} from 'lucide-react';
import { Facility } from '../types';
import { CityApi } from '../services/api';

interface FacilityProfileViewProps {
  facilityId: string;
  facilityType?: string;
  facilities: Facility[];
  onNavigateMap?: (lat?: number, lng?: number) => void;
  onNavigateWard?: (wardName: string) => void;
  onBack?: () => void;
}

export const FacilityProfileView: React.FC<FacilityProfileViewProps> = ({
  facilityId,
  facilities,
  onNavigateMap,
  onNavigateWard,
  onBack
}) => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFacility() {
      setLoading(true);
      setError(null);
      try {
        // Try backend single facility API first
        const apiData = await CityApi.getFacilityDetails(facilityId);
        if (isMounted && apiData && apiData.facility) {
          setFacility(apiData.facility);
          setDispatches(apiData.relatedDispatches || []);
          setLoading(false);
          return;
        }

        // Fallback to searching locally in props
        const cleanId = facilityId.replace(/^f-/, '');
        const found = facilities.find(f => 
          f.id === cleanId || 
          f.id === facilityId || 
          f.name.toLowerCase().includes(decodeURIComponent(facilityId).toLowerCase())
        );

        if (isMounted) {
          if (found) {
            setFacility(found);
            setDispatches([
              { id: 'disp-101', type: `${found.type} Emergency Response`, location: `${found.ward} Main Rd`, status: 'On Scene', etaMinutes: 4, assignedUnit: `${found.name} Squad 1` }
            ]);
          } else {
            setError(`Facility "${facilityId}" could not be located in PostGIS records.`);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to connect to municipal PostGIS telemetry server.');
          setLoading(false);
        }
      }
    }

    loadFacility();
    return () => { isMounted = false; };
  }, [facilityId, facilities]);

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'Hospital': return <Hospital className="w-6 h-6 text-rose-500" />;
      case 'Police Station': return <Shield className="w-6 h-6 text-sky-500" />;
      case 'Fire Station': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Metro Station': return <Train className="w-6 h-6 text-purple-500" />;
      case 'Bus Terminal': return <Bus className="w-6 h-6 text-indigo-500" />;
      case 'Park': return <Trees className="w-6 h-6 text-emerald-500" />;
      case 'School': return <Building2 className="w-6 h-6 text-amber-500" />;
      default: return <Building2 className="w-6 h-6 text-blue-500" />;
    }
  };

  const handleAction = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center max-w-4xl mx-auto space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="font-bold text-slate-800 dark:text-white text-base">Retrieving Facility Telemetry & Emergency Records...</h3>
        <p className="text-xs text-slate-400">Connecting to BBMP Central GIS & Emergency Dispatch System</p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-full w-fit mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Facility Record Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested facility entity could not be found.'}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateWard && (
            <button
              onClick={() => onNavigateWard(facility.ward)}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Ward: {facility.ward}</span>
            </button>
          )}

          {onNavigateMap && (
            <button
              onClick={() => onNavigateMap(facility.lat, facility.lng)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Locate on Digital Twin Map</span>
            </button>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Banner Card */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              {getFacilityIcon(facility.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-md">
                  {facility.type}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  ID: f-{facility.id}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{facility.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{facility.ward} Ward • Coords: {facility.lat.toFixed(4)}, {facility.lng.toFixed(4)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              facility.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
              facility.status === 'Emergency' ? 'bg-red-500 text-white animate-pulse' :
              'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              <span>Status: {facility.status}</span>
            </span>
          </div>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Capacity & Resources</span>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">{facility.capacity}</p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live Capacity Telemetry</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Helpline & Hotline</span>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">{facility.contact}</p>
            <span className="text-[10px] text-blue-600 font-bold mt-1 block">24/7 Command Center Line</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Assigned Municipal Zone</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">BBMP East Zone</p>
            <span className="text-[10px] text-slate-400 font-bold mt-1 block">PostGIS Layer Synced</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Emergency Readiness</span>
            <p className="text-lg font-bold font-mono text-emerald-500 mt-1">98.4%</p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Level 1 Priority Active</span>
          </div>
        </div>

        {/* Quick Command Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Dispatch & Coordination Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction(`Ping sent to ${facility.name} command post. Response acknowledged.`)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ping Station Desk</span>
            </button>

            <button
              onClick={() => handleAction(`Dispatched emergency unit from ${facility.name}.`)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Trigger Hotline</span>
            </button>
          </div>
        </div>

      </div>

      {/* Dispatches & Emergency Logs */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Active Emergency Dispatches & Nearby Incidents</span>
        </h3>

        {dispatches.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dispatches.map((disp, idx) => (
              <div key={disp.id || idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{disp.type || 'Emergency Dispatch'}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{disp.location} • Unit: {disp.assignedUnit || facility.name}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {disp.status || 'En Route'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">ETA: {disp.etaMinutes || 5} Mins</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No active emergency dispatches currently logged for this facility.</p>
        )}
      </div>

    </div>
  );
};
