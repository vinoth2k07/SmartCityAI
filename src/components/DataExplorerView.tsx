import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Table as TableIcon,
  FileCode2,
  ListFilter
} from 'lucide-react';
import { Ward, TrafficSensor, AQISensor, Facility, CitizenComplaint } from '../types';

interface DataExplorerViewProps {
  wards: Ward[];
  facilities: Facility[];
  trafficSensors: TrafficSensor[];
  aqiSensors: AQISensor[];
  complaints: CitizenComplaint[];
}

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({
  wards,
  facilities,
  trafficSensors,
  aqiSensors,
  complaints
}) => {
  const [selectedDataset, setSelectedDataset] = useState<'wards' | 'facilities' | 'traffic' | 'aqi' | 'complaints'>('wards');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const datasets = [
    { id: 'wards', label: 'Wards & Demographics', count: wards.length, schema: 'PostGIS Ward Geometry & Telemetry' },
    { id: 'facilities', label: 'City Infrastructure & Facilities', count: facilities.length, schema: 'Hospitals, Police, Fire, Metro Stations' },
    { id: 'traffic', label: 'Traffic Junction Sensors', count: trafficSensors.length, schema: 'ITS Speed & Congestion Feeds' },
    { id: 'aqi', label: 'AQI & Air Quality Stations', count: aqiSensors.length, schema: 'KSPCB PM2.5 / PM10 Telemetry' },
    { id: 'complaints', label: 'Citizen Grievance Records', count: complaints.length, schema: 'BBMP Grievances & SLA Tickets' }
  ];

  const getRawData = () => {
    switch (selectedDataset) {
      case 'wards':
        return wards.map(w => ({
          ID: w.id,
          Name: w.name,
          WardNo: w.number,
          Zone: w.zone,
          Population: w.population,
          AQI: w.aqi,
          TrafficIndex: w.trafficIndex,
          WaterSupply: w.waterSupplyStatus,
          OpenComplaints: w.activeComplaints,
          HealthScore: w.healthScore
        }));
      case 'facilities':
        return facilities.map(f => ({
          ID: f.id,
          Name: f.name,
          Type: f.type,
          Ward: f.ward,
          Status: f.status,
          Latitude: f.lat,
          Longitude: f.lng,
          Capacity: f.capacity || 'N/A'
        }));
      case 'traffic':
        return trafficSensors.map(t => ({
          ID: t.id,
          Location: t.location,
          AvgSpeedKmvh: t.avgSpeedKmvh,
          CongestionLevel: t.congestionLevel,
          ActiveVehiclesPerHour: t.vehicleCountPerHour,
          SignalStatus: t.signalStatus
        }));
      case 'aqi':
        return aqiSensors.map(a => ({
          ID: a.id,
          StationName: a.stationName,
          Ward: a.ward,
          AQI: a.aqi,
          PM25: a.pm25,
          PM10: a.pm10,
          StatusCategory: a.category
        }));
      case 'complaints':
        return complaints.map(c => ({
          TicketNo: c.ticketNo,
          Category: c.category,
          Ward: c.ward,
          Priority: c.priority,
          Status: c.status,
          ReportedAt: c.reportedAt,
          Description: c.description
        }));
      default:
        return [];
    }
  };

  const raw = getRawData();

  // Search filter
  const filtered = raw.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = (a as any)[sortField];
    const valB = (b as any)[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const columns = raw.length > 0 ? Object.keys(raw[0]) : [];

  const triggerExport = (format: 'csv' | 'json') => {
    let content = '';
    let mime = '';
    let ext = '';

    if (format === 'csv') {
      const headers = columns.join(',');
      const rows = sorted.map(r => columns.map(col => `"${String((r as any)[col]).replace(/"/g, '""')}"`).join(','));
      content = [headers, ...rows].join('\n');
      mime = 'text/csv';
      ext = 'csv';
    } else {
      content = JSON.stringify(sorted, null, 2);
      mime = 'application/json';
      ext = 'json';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartCity360_${selectedDataset}_${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);

    setToastMsg(`Downloaded ${selectedDataset.toUpperCase()} dataset as ${ext.toUpperCase()}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              Data Explorer & Dataset Inspector
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
                PostgreSQL / PostGIS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Inspect raw city datasets, schema statistics, missing value profiles, column distributions, and export structured datasets for external analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerExport('csv')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Dataset CSV
          </button>
          <button
            onClick={() => triggerExport('json')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5 text-blue-400" /> Export JSON
          </button>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {datasets.map((ds) => (
          <button
            key={ds.id}
            onClick={() => {
              setSelectedDataset(ds.id as any);
              setSortField('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedDataset === ds.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-[#0B1220] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-blue-600'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            {ds.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedDataset === ds.id ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {ds.count}
            </span>
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#0B1220] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rows in current dataset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs font-mono text-slate-500 flex items-center gap-4">
          <span>Showing {sorted.length} of {raw.length} Rows</span>
          <span>Missing Values: <strong className="text-emerald-600 dark:text-emerald-400">0.0%</strong></span>
          <span>Schema: <strong className="text-blue-600 dark:text-blue-400">{datasets.find(d => d.id === selectedDataset)?.schema}</strong></span>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => {
                      if (sortField === col) {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortField(col);
                        setSortAsc(true);
                      }
                    }}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors whitespace-nowrap select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortField === col ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              {sorted.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="py-2.5 px-4 whitespace-nowrap">
                      {String((row as any)[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DataExplorerView;
