import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Hospital, 
  Shield, 
  Bus, 
  Train, 
  Building2, 
  Trees, 
  Clock, 
  X, 
  FileText,
  Flame,
  LayoutDashboard,
  BarChart3,
  Map as MapIcon,
  Car,
  Wind,
  Droplets,
  Zap,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Server,
  UserCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ward, Facility, SearchResultItem } from '../types';
import { CityApi } from '../services/api';

interface IntelligentSearchProps {
  wards: Ward[];
  facilities?: Facility[];
  onSelectResult: (result: SearchResultItem) => void;
  onNavigateModule?: (moduleId: string) => void;
  placeholder?: string;
  className?: string;
}

const SYSTEM_MODULES: SearchResultItem[] = [
  { id: 'page-executive', entityId: 'executive', title: 'Executive Command Dashboard', subtitle: 'City Health & High-Level KPIs', category: 'Page', route: '/executive', wardName: 'executive' },
  { id: 'page-analytics', entityId: 'analytics', title: 'Analytics Center', subtitle: 'BI Benchmarking & Multi-Domain Metrics', category: 'Page', route: '/analytics', wardName: 'analytics' },
  { id: 'page-digital-twin', entityId: 'digital-twin', title: 'Digital Twin GIS Map', subtitle: '3D Spatial Layer & Live Sensors', category: 'Page', route: '/digital-twin', wardName: 'digital-twin' },
  { id: 'page-ward-analytics', entityId: 'ward-analytics', title: 'Ward Intelligence', subtitle: 'BBMP Single Ward In-Depth Analytics', category: 'Page', route: '/ward/Indiranagar', wardName: 'Indiranagar' },
  { id: 'page-ward-comparison', entityId: 'ward-comparison', title: 'Ward Comparison Center', subtitle: 'Side-by-side Ward BI Benchmarking', category: 'Page', route: '/ward-comparison', wardName: 'ward-comparison' },
  { id: 'page-traffic', entityId: 'traffic', title: 'Traffic Intelligence', subtitle: 'Gridlock Analysis & Signal Control', category: 'Page', route: '/traffic', wardName: 'traffic' },
  { id: 'page-environment', entityId: 'environment', title: 'Air Quality & Weather', subtitle: 'AQI Sensors & PM2.5 Telemetry', category: 'Page', route: '/environment', wardName: 'environment' },
  { id: 'page-water', entityId: 'water', title: 'Water Department', subtitle: 'BWSSB Cauvery Reservoirs & Deficits', category: 'Page', route: '/water', wardName: 'water' },
  { id: 'page-electricity', entityId: 'electricity', title: 'Electricity Grid', subtitle: 'BESCOM 220kV Master Distribution', category: 'Page', route: '/electricity', wardName: 'electricity' },
  { id: 'page-accidents', entityId: 'accidents', title: 'Accident Intelligence', subtitle: 'Traffic Hotspots & Blackspots', category: 'Page', route: '/accidents', wardName: 'accidents' },
  { id: 'page-complaints', entityId: 'complaints', title: 'Citizen Complaints', subtitle: 'BBMP Potholes & Public Grievances', category: 'Page', route: '/complaints', wardName: 'complaints' },
  { id: 'page-reports', entityId: 'reports', title: 'Reports & Analytics', subtitle: 'Government PDF Export & Audits', category: 'Page', route: '/reports', wardName: 'reports' },
  { id: 'page-smartcity-ai', entityId: 'smartcity-ai', title: 'SmartCity AI Assistant', subtitle: 'Conversational Data Science Engine', category: 'Page', route: '/smartcity-ai', wardName: 'smartcity-ai' },
  { id: 'page-admin', entityId: 'admin', title: 'Admin & System Control', subtitle: 'Role Management & PostGIS Telemetry', category: 'Page', route: '/admin', wardName: 'admin' },
];

const COMPLAINTS_PRESET: SearchResultItem[] = [
  { id: 'c-101', entityId: 'c-101', title: 'Complaint #COMP-2024-101: Deep Pothole', subtitle: 'Silk Board Junction • Status: Open • Priority: Critical', category: 'Complaint', route: '/complaint/c-101', wardName: 'Silk Board Junction' },
  { id: 'c-102', entityId: 'c-102', title: 'Complaint #COMP-2024-102: Water Leakage', subtitle: 'Whitefield Main Road • Status: In Progress • Priority: High', category: 'Complaint', route: '/complaint/c-102', wardName: 'Whitefield' },
  { id: 'c-103', entityId: 'c-103', title: 'Complaint #COMP-2024-103: Streetlight Outage', subtitle: 'Indiranagar 100ft Road • Status: Resolved', category: 'Complaint', route: '/complaint/c-103', wardName: 'Indiranagar' },
  { id: 'c-104', entityId: 'c-104', title: 'Complaint #COMP-2024-104: Garbage Overflow', subtitle: 'Koramangala 5th Block • Status: Pending', category: 'Complaint', route: '/complaint/c-104', wardName: 'Koramangala' },
  { id: 'c-105', entityId: 'c-105', title: 'Complaint #COMP-2024-105: Sewage Overflow', subtitle: 'Bellandur Lake Boundary • Status: Escalated', category: 'Complaint', route: '/complaint/c-105', wardName: 'Bellandur' },
];

const REPORTS_PRESET: SearchResultItem[] = [
  { id: 'rep-1', entityId: 'rep-1', title: 'Report #REP-2024-Q3: BBMP Infrastructure & Road Quality Audit', subtitle: 'Pothole & Asphalt Degradation Analysis', category: 'Report', route: '/report/rep-1', wardName: 'reports' },
  { id: 'rep-2', entityId: 'rep-2', title: 'Report #REP-2024-AQI: Air Pollution & Smog Mitigation Plan', subtitle: 'Hebbal & ORR PM2.5 Interventions', category: 'Report', route: '/report/rep-2', wardName: 'reports' },
  { id: 'rep-3', entityId: 'rep-3', title: 'Report #REP-2024-TRF: Silk Board Traffic Green Wave Impact', subtitle: 'XGBoost Signal Optimization Metrics', category: 'Report', route: '/report/rep-3', wardName: 'reports' },
  { id: 'rep-4', entityId: 'rep-4', title: 'Report #REP-2024-WTR: BWSSB Cauvery Stage V Allocation', subtitle: 'Water Reservoir Supply & Pressure Deficit Audit', category: 'Report', route: '/report/rep-4', wardName: 'reports' },
];

const LANDMARKS_PRESET: SearchResultItem[] = [
  // Metro Stations
  { id: 'm-1', entityId: 'm-1', title: 'Indiranagar Metro Station', subtitle: 'Purple Line • Ward 80', category: 'Metro Station', route: '/metro/m-1', wardName: 'Indiranagar', lat: 12.9782, lng: 77.6388 },
  { id: 'm-2', entityId: 'm-2', title: 'Whitefield Kadugodi Metro', subtitle: 'Purple Line Extension • Ward 84', category: 'Metro Station', route: '/metro/m-2', wardName: 'Whitefield', lat: 12.9960, lng: 77.7610 },
  { id: 'm-3', entityId: 'm-3', title: 'Silk Board Interchange Metro', subtitle: 'Yellow & Blue Line Junction', category: 'Metro Station', route: '/metro/m-3', wardName: 'Silk Board Junction', lat: 12.9172, lng: 77.6228 },
  { id: 'm-4', entityId: 'm-4', title: 'Hebbal Elevated Metro Hub', subtitle: 'Blue Line Airport Express', category: 'Metro Station', route: '/metro/m-4', wardName: 'Hebbal & ORR', lat: 13.0360, lng: 77.5980 },

  // Roads
  { id: 'r-1', entityId: 'r-1', title: 'Outer Ring Road (ORR) Marathahalli Tech Corridor', subtitle: 'High Density IT Belt • Ward 85', category: 'Road', route: '/road/r-1', wardName: 'Marathahalli', lat: 12.9569, lng: 77.7011 },
  { id: 'r-2', entityId: 'r-2', title: 'Indiranagar 100 Feet Road', subtitle: 'Commercial High Street • Ward 80', category: 'Road', route: '/road/r-2', wardName: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
  { id: 'r-3', entityId: 'r-3', title: 'Hosur Road Silk Board Flyover', subtitle: 'National Highway 44 Expressway', category: 'Road', route: '/road/r-3', wardName: 'Silk Board Junction', lat: 12.9172, lng: 77.6228 },
  { id: 'r-4', entityId: 'r-4', title: 'Ballari Road Yelahanka Flyover', subtitle: 'Airport Highway Expressway', category: 'Road', route: '/road/r-4', wardName: 'Yelahanka', lat: 13.1007, lng: 77.5963 },

  // Fire Stations
  { id: 'fire-1', entityId: 'fire-1', title: 'High Grounds Fire Station Central', subtitle: 'Emergency Response Squad • CBD', category: 'Fire Station', route: '/fire-station/fire-1', wardName: 'MG Road & CBD', lat: 12.9850, lng: 77.5900 },
  { id: 'fire-2', entityId: 'fire-2', title: 'Whitefield Fire & Disaster Station', subtitle: 'Industrial Safety Division', category: 'Fire Station', route: '/fire-station/fire-2', wardName: 'Whitefield', lat: 12.9700, lng: 77.7500 },

  // Police Stations
  { id: 'p-1', entityId: 'p-1', title: 'Bengaluru Traffic Police Command (BTP)', subtitle: 'Infantry Road Head Office', category: 'Police Station', route: '/police-station/p-1', wardName: 'MG Road & CBD', lat: 12.9780, lng: 77.6010 },
  { id: 'p-2', entityId: 'p-2', title: 'Madiwala Traffic Police Station', subtitle: 'Silk Board Jurisdiction', category: 'Police Station', route: '/police-station/p-2', wardName: 'Silk Board Junction', lat: 12.9200, lng: 77.6200 },

  // Hospitals
  { id: 'hosp-1', entityId: 'hosp-1', title: 'Manipal Hospital Whitefield', subtitle: 'Super Specialty Care Center • Ward 84', category: 'Hospital', route: '/hospital/hosp-1', wardName: 'Whitefield', lat: 12.9800, lng: 77.7280 },
  { id: 'hosp-2', entityId: 'hosp-2', title: 'Victoria Hospital Central', subtitle: 'Government Multi-Specialty • Fort Area', category: 'Hospital', route: '/hospital/hosp-2', wardName: 'MG Road & CBD', lat: 12.9620, lng: 77.5750 },
  { id: 'hosp-3', entityId: 'hosp-3', title: 'Bowring & Lady Curzon Hospital', subtitle: 'Govt Medical College Hospital • CBD', category: 'Hospital', route: '/hospital/hosp-3', wardName: 'MG Road & CBD', lat: 12.9830, lng: 77.6030 },
  { id: 'hosp-4', entityId: 'hosp-4', title: 'Fortis Hospital Bannerghatta Road', subtitle: 'Cardiac & Emergency Specialty • Ward 174', category: 'Hospital', route: '/hospital/hosp-4', wardName: 'Silk Board Junction', lat: 12.8950, lng: 77.5980 }
];

export const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  wards,
  facilities = [],
  onSelectResult,
  onNavigateModule,
  placeholder = 'Search Ward (e.g. Koramangala), Hospital, Traffic, Complaint, Report...',
  className = ''
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<SearchResultItem[]>([]);
  const [backendResults, setBackendResults] = useState<SearchResultItem[]>([]);
  const [isSearchingBackend, setIsSearchingBackend] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartcity360_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Debounced Live Backend Search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setBackendResults([]);
      setIsSearchingBackend(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingBackend(true);
      try {
        const rawResults = await CityApi.search(query.trim());
        if (rawResults && Array.isArray(rawResults)) {
          const mappedBackendItems: SearchResultItem[] = rawResults.map(r => {
            let cat = r.category || 'Facility';
            let route = `/facility/${r.id}`;

            if (cat === 'Ward' || r.wardName && !r.category) {
              cat = 'Ward';
              route = `/ward/${encodeURIComponent(r.wardName || r.title.split(' ')[0])}`;
            } else if (cat === 'Page') {
              const moduleMap: Record<string, string> = {
                'Executive Command Dashboard': '/executive',
                'Analytics Center': '/analytics',
                'Digital Twin GIS Map': '/digital-twin',
                'Ward Intelligence': '/ward/Indiranagar',
                'Ward Comparison Center': '/ward-comparison',
                'Traffic Intelligence': '/traffic',
                'Air Quality & Weather': '/environment',
                'Water Department': '/water',
                'Electricity Grid': '/electricity',
                'Accident Intelligence': '/accidents',
                'Citizen Complaints': '/complaints',
                'Reports & Analytics': '/reports',
                'SmartCity AI Assistant': '/smartcity-ai',
                'Admin & System Control': '/admin'
              };
              route = moduleMap[r.title] || '/executive';
            } else if (cat === 'Hospital') {
              route = `/hospital/${r.id}`;
            } else if (cat === 'Police Station') {
              route = `/police-station/${r.id}`;
            } else if (cat === 'Metro Station') {
              route = `/metro/${r.id}`;
            } else if (cat === 'Fire Station') {
              route = `/fire-station/${r.id}`;
            } else if (cat === 'Complaint') {
              route = `/complaint/${r.id}`;
            } else if (cat === 'Report') {
              route = `/report/${r.id}`;
            } else if (cat === 'Road') {
              route = `/road/${r.id}`;
            }

            return {
              id: r.id,
              entityId: r.id,
              title: r.title,
              subtitle: r.subtitle,
              category: cat,
              route,
              wardName: r.wardName || 'Indiranagar',
              lat: r.lat,
              lng: r.lng,
              details: r.details,
              metadata: r
            };
          });
          setBackendResults(mappedBackendItems);
        }
      } catch (err) {
        console.warn('Backend search query warning:', err);
      } finally {
        setIsSearchingBackend(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compile local items
  const wardItems: SearchResultItem[] = wards.map(w => ({
    id: `w-${w.id}`,
    entityId: w.id,
    title: `${w.name} (Ward ${w.number})`,
    subtitle: `BBMP Zone: ${w.zone} • Pop: ${(w.population / 1000).toFixed(0)}k`,
    category: 'Ward',
    route: `/ward/${encodeURIComponent(w.name)}`,
    wardName: w.name,
    lat: w.lat,
    lng: w.lng,
    details: `${w.aqi} AQI | Health: ${w.healthScore}/100`,
    metadata: { ...w }
  }));

  const facilityItems: SearchResultItem[] = facilities.map(f => {
    let route = `/facility/f-${f.id}`;
    if (f.type === 'Hospital') route = `/hospital/f-${f.id}`;
    else if (f.type === 'Police Station') route = `/police-station/f-${f.id}`;
    else if (f.type === 'Metro Station') route = `/metro/f-${f.id}`;
    else if (f.type === 'Fire Station') route = `/fire-station/f-${f.id}`;

    return {
      id: `f-${f.id}`,
      entityId: `f-${f.id}`,
      title: f.name,
      subtitle: `${f.type} • Ward: ${f.ward}`,
      category: f.type,
      route,
      wardName: f.ward || 'Indiranagar',
      lat: f.lat,
      lng: f.lng,
      details: f.status,
      metadata: { ...f }
    };
  });

  const allSearchable = [
    ...SYSTEM_MODULES,
    ...COMPLAINTS_PRESET,
    ...REPORTS_PRESET,
    ...LANDMARKS_PRESET,
    ...wardItems,
    ...facilityItems
  ];

  // Filter local results
  const localFiltered = query.trim() === ''
    ? []
    : allSearchable.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.wardName.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      });

  // Combine backend and local results without duplicates
  const combinedMap = new Map<string, SearchResultItem>();
  [...backendResults, ...localFiltered].forEach(item => {
    if (!combinedMap.has(item.id)) {
      combinedMap.set(item.id, item);
    }
  });

  const filteredResults = Array.from(combinedMap.values()).slice(0, 12);

  const handleSelect = (item: SearchResultItem) => {
    // 1. Invoke props handler
    onSelectResult(item);
    setIsOpen(false);
    setQuery(item.title);

    // 2. Perform Router Navigation
    if (item.route) {
      navigate(item.route, { state: { item } });
    }

    // 3. Save to recent searches
    const updated = [item, ...recentSearches.filter(r => r.id !== item.id)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('smartcity360_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Page': return <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Complaint': return <MessageSquare className="w-3.5 h-3.5 text-amber-400" />;
      case 'Report': return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Ward': return <MapPin className="w-3.5 h-3.5 text-blue-400" />;
      case 'Road': return <Navigation className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Metro Station': return <Train className="w-3.5 h-3.5 text-purple-400" />;
      case 'Hospital': return <Hospital className="w-3.5 h-3.5 text-rose-400" />;
      case 'Police Station': return <Shield className="w-3.5 h-3.5 text-sky-400" />;
      case 'Fire Station': return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'Park': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'School': return <Building2 className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Lake': return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      case 'Bus Stop': return <Bus className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Building2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Input Box */}
      <div className="relative flex items-center">
        {isSearchingBackend ? (
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin absolute left-3 pointer-events-none" />
        ) : (
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#1E293B]/90 hover:bg-[#1E293B] focus:bg-[#0B1220] border border-[#334155] focus:border-blue-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 transition-all focus:outline-none shadow-sm"
        />

        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-2.5 p-0.5 text-slate-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0F172A] border border-[#334155] rounded-xl shadow-2xl z-50 overflow-hidden text-xs max-h-96 overflow-y-auto divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Query Results */}
          {query.trim() !== '' ? (
            filteredResults.length > 0 ? (
              <div className="p-1">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>Matched Search Results ({filteredResults.length})</span>
                  <span className="text-blue-400 font-mono">Real-Time Navigation</span>
                </div>
                {filteredResults.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${
                      selectedIndex === idx ? 'bg-blue-600/30 text-white border border-blue-500/50' : 'hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-slate-800 group-hover:bg-blue-600/20 rounded-md transition-colors shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
                          <span className="truncate">{item.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.details && (
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-white hidden sm:inline">
                          {item.details}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-600" />
                <p className="font-bold text-white text-sm">No results found for "{query}"</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try searching for <button onClick={() => { setQuery('Koramangala'); }} className="text-blue-400 underline">Koramangala</button>, <button onClick={() => { setQuery('Traffic'); }} className="text-blue-400 underline">Traffic</button>, <button onClick={() => { setQuery('Hospital'); }} className="text-blue-400 underline">Hospital</button>, or <button onClick={() => { setQuery('Report'); }} className="text-blue-400 underline">Report</button>
                </p>
              </div>
            )
          ) : (
            /* Empty Query: Show Recent Searches & System Modules */
            <div className="p-2 space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setRecentSearches([]); localStorage.removeItem('smartcity360_recent_searches'); }}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {recentSearches.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#1E293B] rounded-lg transition-colors flex items-center justify-between text-slate-300 hover:text-white group"
                      >
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <span className="font-medium text-xs">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-blue-400">{item.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Popular Core Modules</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {SYSTEM_MODULES.slice(0, 6).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className="text-left p-2 bg-[#1E293B]/60 hover:bg-[#1E293B] border border-slate-800 rounded-lg transition-all group"
                    >
                      <div className="font-medium text-white text-[11px] flex items-center justify-between">
                        <span className="group-hover:text-blue-400 transition-colors">{p.title}</span>
                        <LayoutDashboard className="w-3 h-3 text-indigo-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{p.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
