import React, { useState } from 'react';
import { Search, MapPin, LayoutDashboard, AlertCircle, ArrowLeft, Building2, Car, Wind, Droplets, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundViewProps {
  onSearchAgain?: (query: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onSearchAgain }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const popularDestinations = [
    { title: 'Executive Command', route: '/executive', icon: LayoutDashboard, category: 'Page' },
    { title: 'Ward Intelligence', route: '/ward/Indiranagar', icon: MapPin, category: 'Ward' },
    { title: 'Traffic Intelligence', route: '/traffic', icon: Car, category: 'Traffic' },
    { title: 'Air Quality & Weather', route: '/environment', icon: Wind, category: 'Environment' },
    { title: 'Water Department', route: '/water', icon: Droplets, category: 'Water' },
    { title: 'Citizen Complaints', route: '/complaints', icon: MessageSquare, category: 'Complaint' },
    { title: 'Reports & Audits', route: '/reports', icon: FileText, category: 'Report' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.trim().toLowerCase();
    
    if (q.includes('traffic') || q.includes('road')) navigate('/traffic');
    else if (q.includes('aqi') || q.includes('weather') || q.includes('smog')) navigate('/environment');
    else if (q.includes('water') || q.includes('cauvery')) navigate('/water');
    else if (q.includes('complaint') || q.includes('pothole')) navigate('/complaints');
    else if (q.includes('report') || q.includes('pdf')) navigate('/reports');
    else navigate(`/ward/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto my-8 space-y-6 text-center animate-in fade-in duration-200">
      
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl w-fit mx-auto">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page or Entity Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The requested route, ward name, or facility ID could not be matched. Try searching again using the global search box below.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Ward (e.g. Koramangala), Hospital, Traffic, Complaint..."
          className="w-full bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
        >
          Search
        </button>
      </form>

      {/* Popular Shortcuts */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Popular System Pages & Dashboards</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {popularDestinations.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.route}
                onClick={() => navigate(dest.route)}
                className="p-3 bg-white dark:bg-[#111827] hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-xl transition-all text-left flex items-center gap-3 group"
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white rounded-lg transition-colors text-slate-600 dark:text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dest.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{dest.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Executive Dashboard</span>
        </button>
      </div>

    </div>
  );
};
