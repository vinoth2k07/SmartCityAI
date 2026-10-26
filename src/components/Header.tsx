import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  UserCheck, 
  ChevronDown
} from 'lucide-react';
import { UserRole, SearchResultItem, Ward, Facility } from '../types';
import { IntelligentSearch } from './IntelligentSearch';
import { CityApi } from '../services/api';

interface HeaderProps {
  activeModule?: string;
  onSelectModule?: (module: string) => void;
  userRole?: UserRole;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenAIChat?: () => void;
  onToggleAIChat?: () => void;
  selectedWard?: string;
  onSelectWard?: (ward: string) => void;
  wards?: Ward[];
  facilities?: Facility[];
  activeModuleTitle?: string;
  onOpenAuthModal?: () => void;
  onOpenFilters?: () => void;
  onSearchResultSelect?: (result: SearchResultItem) => void;
}

const ROLES: UserRole[] = [
  'Super Admin',
  'Traffic Department',
  'Environment Department',
  'Water Department',
  'Electricity Department',
  'Emergency Department',
  'Citizen'
];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Critical' | 'Warning' | 'Info' | 'AI Recommendation';
  targetModule: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Silk Board Gridlock Alert',
    message: 'Average vehicle speed dropped to 8.5 km/h. Signal Green Wave proposed.',
    time: '2m ago',
    category: 'Critical',
    targetModule: 'traffic',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'AQI Spike at Hebbal',
    message: 'PM2.5 exceeded 175 µg/m³. Anti-smog mist cannons recommended.',
    time: '12m ago',
    category: 'Warning',
    targetModule: 'environment',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'BWSSB Cauvery Stage V Deficit',
    message: 'Whitefield Sector 4 reports 18% pressure drop. Emergency tanker ready.',
    time: '45m ago',
    category: 'Warning',
    targetModule: 'water',
    isRead: false
  },
  {
    id: 'notif-4',
    title: 'AI Signal Optimization Ready',
    message: 'XGBoost Traffic Model suggests resetting green timing on Indiranagar 100ft Rd.',
    time: '1h ago',
    category: 'AI Recommendation',
    targetModule: 'smartcity-ai',
    isRead: true
  },
  {
    id: 'notif-5',
    title: 'Scheduled System Maintenance',
    message: 'PostGIS GIS database index re-indexing completed successfully.',
    time: '3h ago',
    category: 'Info',
    targetModule: 'admin',
    isRead: true
  }
];

export const Header: React.FC<HeaderProps> = ({
  userRole,
  currentRole,
  onRoleChange,
  isDarkMode = true,
  onToggleDarkMode,
  onOpenAIChat,
  onToggleAIChat,
  selectedWard = 'Indiranagar',
  onSelectWard,
  wards = [],
  facilities = [],
  activeModuleTitle = 'Executive Command',
  onOpenAuthModal,
  onOpenFilters,
  onSearchResultSelect,
  activeModule,
  onSelectModule
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info' | 'AI Recommendation'>('All');

  // Load backend notifications on mount
  useEffect(() => {
    async function loadNotifs() {
      try {
        const backendNotifs = await CityApi.getNotifications();
        if (backendNotifs && backendNotifs.length > 0) {
          const mapped: NotificationItem[] = backendNotifs.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: 'Just now',
            category: n.type === 'critical' ? 'Critical' : n.type === 'warning' ? 'Warning' : 'Info',
            targetModule: 'executive',
            isRead: n.read
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.warn('Could not load backend notifications:', err);
      }
    }
    loadNotifs();
  }, []);

  const role = userRole || currentRole || 'Super Admin';

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifFilter === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === notifFilter);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await CityApi.markNotificationsRead(id);
  };

  const handleDismiss = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    await CityApi.dismissNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await CityApi.markNotificationsRead();
  };

  const handleClearAll = async () => {
    setNotifications([]);
    await CityApi.clearNotifications();
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    if (onSelectModule) {
      onSelectModule(notif.targetModule);
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0B1220] text-white flex items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-[#1E293B] shrink-0 select-none gap-2 sm:gap-4">
      
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => onSelectModule && onSelectModule('executive')}
          title="Go to Executive Dashboard"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center font-bold text-sm tracking-tight text-white shadow-md group-hover:scale-105 transition-transform">
            360
          </div>
          <div className="hidden min-[420px]:block">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white">
              SmartCity360
            </h1>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5 whitespace-nowrap">Enterprise Command</p>
          </div>
        </div>
      </div>

      {/* Center: Large Enterprise Search Bar */}
      <div className="flex-1 max-w-[680px] mx-1 sm:mx-2 md:mx-4">
        <IntelligentSearch
          wards={wards as any || []}
          facilities={facilities}
          placeholder="Search Ward, Road, Hospital, Complaint ID, Department, Report..."
          onNavigateModule={(modId) => {
            if (onSelectModule) onSelectModule(modId);
          }}
          onSelectResult={(item) => {
            if (onSearchResultSelect) onSearchResultSelect(item);
            if (onSelectWard && item.wardName) {
              onSelectWard(item.wardName);
            }
          }}
          className="w-full"
        />
      </div>

      {/* Right Controls: Theme Toggle, Notification Icon, User Profile */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        
        {/* Theme Toggle */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors focus:outline-none"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        )}

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors relative focus:outline-none"
            title="System Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] font-bold rounded-full bg-red-600 text-white min-w-[16px] text-center leading-tight shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F172A] rounded-xl shadow-2xl border border-[#1E293B] p-3 z-50 animate-in fade-in zoom-in-95">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-xs text-white">System Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-600/30 text-red-400 px-1.5 py-0.2 rounded font-mono font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} className="text-blue-400 hover:underline">Mark all read</button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={handleClearAll} className="text-slate-400 hover:text-red-400 transition-colors">Clear all</button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 my-2 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                {(['All', 'Critical', 'Warning', 'Info', 'AI Recommendation'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNotifFilter(cat)}
                    className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                      notifFilter === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                        n.category === 'Critical' ? 'bg-red-950/30 border-red-900/50 hover:border-red-500' :
                        n.category === 'Warning' ? 'bg-amber-950/30 border-amber-900/50 hover:border-amber-500' :
                        n.category === 'AI Recommendation' ? 'bg-purple-950/30 border-purple-900/50 hover:border-purple-500' :
                        'bg-slate-900 border-slate-800 hover:border-blue-500'
                      } ${!n.isRead ? 'ring-1 ring-blue-500/30' : 'opacity-80'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            <p className={`text-xs font-bold ${
                              n.category === 'Critical' ? 'text-red-400' :
                              n.category === 'Warning' ? 'text-amber-400' :
                              n.category === 'AI Recommendation' ? 'text-purple-400' :
                              'text-blue-400'
                            }`}>
                              {n.title}
                            </p>
                          </div>
                          <p className="text-[11px] text-gray-300 mt-1 leading-snug">{n.message}</p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
                            <span>{n.time}</span>
                            <span className="text-blue-400 group-hover:underline">Click to View →</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(n.id, e)}
                              className="text-[10px] text-slate-400 hover:text-white px-1"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDismiss(n.id, e)}
                            className="text-[10px] text-slate-400 hover:text-red-400 px-1"
                            title="Dismiss"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No notifications in this category.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative flex items-center border-l border-[#1E293B] pl-2 sm:pl-3">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 text-left focus:outline-none p-1 rounded-lg hover:bg-[#1E293B] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
              {role.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-right hidden xl:block">
              <p className="text-[11px] font-semibold text-white leading-tight">{role}</p>
              <p className="text-[9px] text-slate-400">Enterprise Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-11 w-60 bg-[#0F172A] rounded-xl shadow-2xl border border-[#1E293B] py-2 z-50">
              <div className="px-3 py-2 border-b border-[#1E293B] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {role.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{role}</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@smartcity360.gov.in</p>
                </div>
              </div>

              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Department Role
              </div>

              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (onRoleChange) onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                    role === r
                      ? 'bg-[#1E293B] text-blue-400 font-bold'
                      : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <UserCheck className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              ))}

              {onOpenAuthModal && (
                <div className="pt-2 mt-1 border-t border-[#1E293B] px-2">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-center py-1.5 bg-[#1E293B] hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Manage SSO & Security
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
