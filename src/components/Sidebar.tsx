import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Car, 
  AlertTriangle, 
  Wind, 
  Droplets, 
  Zap, 
  MessageSquare, 
  Siren, 
  Bus, 
  HardHat, 
  Award, 
  BrainCircuit, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Cpu,
  Server,
  Radio,
  Building2,
  Code2,
  BarChart3,
  Database
} from 'lucide-react';
import { UserRole } from '../types';

export interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  category?: 'core' | 'analytics' | 'utilities';
}

interface SidebarProps {
  activeModule?: string;
  activeTab?: string;
  onSelectModule?: (moduleId: string) => void;
  onTabChange?: (tabId: string) => void;
  userRole?: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAIChat?: () => void;
}

export const NAV_ITEMS: NavItem[] = [
  // Primary Analytics & Decision Twin
  { id: 'executive', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'ward-analytics', label: 'Ward Intelligence', icon: Building2, badge: 'BBMP', badgeColor: 'bg-emerald-600 text-white', category: 'core' },
  { id: 'digital-twin', label: 'Digital Twin Map', icon: Map, badge: '3D GIS', badgeColor: 'bg-indigo-600 text-white', category: 'core' },

  // Domain Analytics (4-Level Framework)
  { id: 'traffic', label: 'Traffic Analytics', icon: Car, badge: 'Live', badgeColor: 'bg-red-600 text-white', category: 'analytics' },
  { id: 'environment', label: 'Environment Analytics', icon: Wind, badge: 'AQI', badgeColor: 'bg-amber-500 text-white', category: 'analytics' },
  { id: 'utilities', label: 'Utilities Analytics', icon: Zap, badge: 'Water & Power', badgeColor: 'bg-blue-600 text-white', category: 'analytics' },
  { id: 'citizen-services', label: 'Citizen Services', icon: MessageSquare, badge: 'Grievances', badgeColor: 'bg-purple-600 text-white', category: 'analytics' },

  // Advanced Intelligence & Exports
  { id: 'reports', label: 'Reports', icon: FileText, category: 'utilities' },
  { id: 'smartcity-ai', label: 'AI Assistant', icon: Sparkles, badge: 'SmartCity360', badgeColor: 'bg-[#2563EB] text-white', category: 'utilities' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  activeTab,
  onSelectModule,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onOpenAIChat
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getModuleRoute = (id: string) => {
    switch (id) {
      case 'executive': return '/executive';
      case 'digital-twin': return '/digital-twin';
      case 'ward-analytics': return '/ward-analytics';
      case 'traffic': return '/traffic';
      case 'environment': return '/environment';
      case 'utilities': return '/utilities';
      case 'citizen-services': return '/citizen-services';
      case 'reports': return '/reports';
      case 'smartcity-ai': return '/smartcity-ai';
      default: return `/${id}`;
    }
  };

  const isItemActive = (item: NavItem) => {
    const itemRoute = getModuleRoute(item.id);
    if (location.pathname === itemRoute) return true;
    if (item.id === 'ward-analytics' && (location.pathname.startsWith('/ward/') || location.pathname === '/ward-comparison')) return true;
    if (item.id === 'traffic' && location.pathname.startsWith('/road/')) return true;
    if (item.id === 'utilities' && (location.pathname === '/water' || location.pathname === '/electricity')) return true;
    if (item.id === 'citizen-services' && (location.pathname.startsWith('/complaint/') || location.pathname === '/accidents' || location.pathname === '/complaints')) return true;
    if (item.id === 'reports' && location.pathname.startsWith('/report/')) return true;
    if (item.id === 'executive' && (location.pathname === '/' || location.pathname === '/executive' || location.pathname === '/analytics')) return true;
    return activeModule === item.id;
  };

  const handleSelect = (id: string) => {
    if (onSelectModule) onSelectModule(id);
    if (onTabChange) onTabChange(id);
    navigate(getModuleRoute(id));
  };

  const coreItems = NAV_ITEMS.filter(item => item.category === 'core');
  const analyticsItems = NAV_ITEMS.filter(item => item.category === 'analytics');
  const utilityItems = NAV_ITEMS.filter(item => item.category === 'utilities');

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      {!isCollapsed && (
        <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest px-3 mb-2">
          {title}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item);

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#1E293B] text-white shadow-sm font-semibold border-l-2 border-[#2563EB]'
                  : 'text-gray-400 dark:text-gray-400 hover:bg-[#1E293B] hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-gray-400 group-hover:text-white'}`} />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${item.badgeColor || 'bg-slate-800 text-gray-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`relative bg-[#111827] text-white border-r border-[#1E293B] transition-all duration-300 flex flex-col z-30 select-none shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Collapse Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md hover:bg-[#1D4ED8] transition-colors z-40"
        title={isCollapsed ? "Expand Navigation" : "Collapse Navigation"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-800">
        {renderNavGroup('Core Intelligence', coreItems)}
        {renderNavGroup('Domain Operations', analyticsItems)}
        {renderNavGroup('Command & Admin', utilityItems)}
      </div>

      {/* AI Assistant Widget at Sidebar Bottom */}
      {!isCollapsed && (
        <div className="p-3 mt-auto border-t border-[#1E293B]">
          <div className="bg-[#0F172A] rounded-xl p-3.5 border border-[#1E293B]">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Assistant
              </p>
              <span className="text-[9px] bg-[#1E293B] px-1.5 py-0.5 rounded text-gray-300 font-semibold">Online</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed italic">
              "Traffic flow in Silk Board is 14% higher than model projections..."
            </p>
            {onOpenAIChat && (
              <button 
                onClick={onOpenAIChat}
                className="mt-3 w-full py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                Open Chat
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[10px] font-bold text-gray-400">Grid SLA</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#16A34A]">99.8%</span>
          </div>
        </div>
      )}
    </aside>
  );
};
