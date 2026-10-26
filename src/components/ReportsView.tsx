import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  FileSpreadsheet, 
  Sparkles, 
  Building2, 
  Car, 
  Wind, 
  Droplets, 
  Zap, 
  MessageSquare, 
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { CityApi } from '../services/api';

interface ReportsViewProps {
  selectedReportId?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ selectedReportId }) => {
  const [selectedType, setSelectedType] = useState<string>('executive');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  React.useEffect(() => {
    if (selectedReportId) {
      const clean = selectedReportId.replace(/^rep-/, '').toLowerCase();
      if (clean.includes('aqi') || clean.includes('air') || clean === '2') setSelectedType('aqi');
      else if (clean.includes('trf') || clean.includes('traffic') || clean === '3') setSelectedType('traffic');
      else if (clean.includes('wtr') || clean.includes('water') || clean === '4') setSelectedType('water');
      else if (clean.includes('infra') || clean === '1') setSelectedType('ward');
      else setSelectedType('executive');
    }
  }, [selectedReportId]);
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportTypes = [
    { id: 'executive', name: 'Executive City Health Report', icon: Building2, dept: 'BBMP Executive Command' },
    { id: 'ward', name: 'Ward Single & Multi-Ward Audit', icon: Building2, dept: 'BBMP Revenue & GIS Division' },
    { id: 'traffic', name: 'Traffic Corridor & Signal Report', icon: Car, dept: 'Bengaluru Traffic Police' },
    { id: 'aqi', name: 'Air Quality & Microclimate Audit', icon: Wind, dept: 'Karnataka Pollution Control Board' },
    { id: 'water', name: 'Water Reservoir & Deficit Report', icon: Droplets, dept: 'BWSSB Cauvery Operations' },
    { id: 'electricity', name: 'Power Grid & Substation Telemetry', icon: Zap, dept: 'BESCOM Power Distribution' },
    { id: 'complaint', name: 'Citizen Complaint & SLA Scorecard', icon: MessageSquare, dept: 'BBMP Grievance Redressal Cell' }
  ];

  const formats = [
    { id: 'pdf', name: 'PDF Document', ext: '.pdf', desc: 'Official Stamp & Header' },
    { id: 'excel', name: 'Excel Sheet', ext: '.xls', desc: 'Formatted Spreadsheet' },
    { id: 'csv', name: 'CSV Dataset', ext: '.csv', desc: 'Raw Structured Data' },
    { id: 'png', name: 'PNG Chart', ext: '.svg', desc: 'Visual KPI Dashboard' }
  ];

  const wardsList = [
    'All Wards',
    'Indiranagar',
    'Whitefield',
    'Silk Board Junction',
    'Koramangala',
    'Bellandur',
    'Yelahanka',
    'Hebbal & ORR',
    'Marathahalli',
    'HSR Layout',
    'MG Road & CBD',
    'Malleshwaram',
    'Peenya Industrial'
  ];

  const handleGenerateReport = (typeVal?: string, formatVal?: string, wardVal?: string) => {
    const t = typeVal || selectedType;
    const f = formatVal || selectedFormat;
    const w = wardVal || selectedWard;

    const label = `${t.toUpperCase()} (${f.toUpperCase()})`;
    setDownloading(label);

    setTimeout(() => {
      CityApi.downloadReport(t, f, w);
      setDownloading(null);
      setDownloadSuccess(`Official ${t.toUpperCase()} report (${f.toUpperCase()}) generated and downloaded.`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 600);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bengaluru Municipal Report & Dossier Generation Center</h2>
            <p className="text-xs text-slate-500">Official Government PDF, Excel, CSV, and PNG Chart Export Service</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>PostGIS Real-Time DB Connected</span>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Report Generator Form */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Dynamic Custom Report Builder
            </h3>
            <p className="text-xs text-slate-500">Configure parameters to generate dynamic official municipal reports in real-time</p>
          </div>
        </div>

        {/* 1. Report Type Selection */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
            1. Select Report Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {reportTypes.map((rt) => {
              const Icon = rt.icon;
              const isSelected = selectedType === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => setSelectedType(rt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="font-bold text-xs leading-snug">{rt.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">{rt.dept}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Format & Ward Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Format Selection */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              2. Choose Output Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {formats.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{fmt.name} <span className="font-mono text-[10px] opacity-80">({fmt.ext})</span></p>
                      <p className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{fmt.desc}</p>
                    </div>
                    {fmt.id === 'pdf' ? <FileText className="w-4 h-4 shrink-0" /> :
                     fmt.id === 'excel' ? <FileSpreadsheet className="w-4 h-4 shrink-0" /> :
                     fmt.id === 'png' ? <ImageIcon className="w-4 h-4 shrink-0" /> :
                     <Download className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Ward Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              3. Filter Location Scope
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {wardsList.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>

            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-600 dark:text-blue-400 block">Report Parameters:</span>
                <span>Type: <b>{selectedType.toUpperCase()}</b> | Format: <b>{selectedFormat.toUpperCase()}</b> | Ward: <b>{selectedWard}</b></span>
              </div>
            </div>
          </div>

        </div>

        {/* Generate Action Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => handleGenerateReport()}
            disabled={!!downloading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2.5 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? `Generating ${downloading}...` : 'Generate & Download Official Report'}</span>
          </button>
        </div>

      </div>

      {/* Pre-Packaged Official Government Dossiers List */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pre-Compiled Executive Audits & Government Reports</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'rep-1', title: 'Monthly Bengaluru Traffic Congestion & Bottleneck Analysis', category: 'traffic', format: 'pdf', desc: 'BBMP & BTP joint corridor speed analysis across Silk Board & ORR.', date: 'July 2026', size: '4.2 MB' },
            { id: 'rep-2', title: 'Quarterly Air Quality & Particulate Matter Emission Audit', category: 'aqi', format: 'pdf', desc: 'CPCB 24-hour PM2.5 / PM10 readings and smog mitigation index.', date: 'Q2 2026', size: '8.1 MB' },
            { id: 'rep-3', title: 'Cauvery Water Distribution & Pressure Deficit Audit', category: 'water', format: 'excel', desc: 'BWSSB reservoir levels, pump telemetry, and ward allocation.', date: 'June 2026', size: '2.5 MB' },
            { id: 'rep-4', title: 'BBMP Citizen Complaint SLA Resolution Scorecard', category: 'complaint', format: 'csv', desc: 'Potholes, streetlights, and sanitation ticket resolution stats.', date: 'July 2026', size: '3.8 MB' }
          ].map((rep) => (
            <div key={rep.id} className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {rep.category.toUpperCase()} • {rep.format.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{rep.size}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{rep.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Published: {rep.date}</span>
                <button
                  onClick={() => handleGenerateReport(rep.category, rep.format, 'All Wards')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export File
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
