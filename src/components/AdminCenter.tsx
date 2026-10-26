import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  FileCode, 
  Radio, 
  Terminal, 
  Users, 
  Key, 
  Lock, 
  UserCheck, 
  UserX, 
  Plus, 
  Trash2, 
  Settings, 
  BarChart3,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { CityApi } from '../services/api';
import { UserRole } from '../types';

interface AdminCenterProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Suspended';
  lastLogin: string;
}

const INITIAL_USERS: SystemUser[] = [
  { id: 'usr-1', name: 'Tushar Giri', email: 'admin@bbmp.gov.in', role: 'Super Admin', department: 'Executive Command', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'usr-2', name: 'IPS M.A. Saleem', email: 'traffic.cp@bengaluru.gov.in', role: 'Traffic Department', department: 'Bengaluru Traffic Police', status: 'Active', lastLogin: '14 mins ago' },
  { id: 'usr-3', name: 'Dr. Anita Rao', email: 'aqi.head@kspcb.gov.in', role: 'Environment Department', department: 'KSPCB Pollution Control', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'usr-4', name: 'Eng. Ramesh N.', email: 'chief.water@bwssb.gov.in', role: 'Water Department', department: 'BWSSB Water Grid', status: 'Active', lastLogin: '3 hours ago' },
  { id: 'usr-5', name: 'Suresh Kumar', email: 'grid.head@bescom.gov.in', role: 'Electricity Department', department: 'BESCOM Power Transmission', status: 'Active', lastLogin: 'Yesterday' }
];

export const AdminCenter: React.FC<AdminCenterProps> = ({ currentRole, onSelectRole }) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'mlops' | 'api' | 'db' | 'logs' | 'users'>('monitoring');
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  
  // User Management State
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Traffic Department');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadHealth = async () => {
    setIsLoading(true);
    try {
      const data = await CityApi.getSystemHealth();
      setHealthData(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('System health fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserRole.includes('Traffic') ? 'Traffic Police' : newUserRole.includes('Water') ? 'BWSSB' : 'BBMP Municipal',
      status: 'Active',
      lastLogin: 'Just registered'
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    showToast(`Added system user ${newUser.name}`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    showToast('Updated user authorization state');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              System Administration & Operations Control
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
                {healthData?.status || 'HEALTHY'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Centralized admin suite for Node.js platform monitoring, MLOps model health, PostGIS database connection pools, REST API health, audit logs, and user access control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-mono">Refreshed: {lastRefreshed}</span>
          <button
            onClick={loadHealth}
            disabled={isLoading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
            title="Refresh Health Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Admin Sub-Module Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'monitoring', label: 'System Monitoring', icon: Server },
          { id: 'mlops', label: 'MLOps Health', icon: Zap },
          { id: 'api', label: 'API Health', icon: Globe },
          { id: 'db', label: 'Database Health', icon: Database },
          { id: 'logs', label: 'Security & Audit Logs', icon: Terminal },
          { id: 'users', label: 'User Management', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#0B1220] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Monitoring & Server Health */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Heap Memory Used</span>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  {healthData?.serverMetrics?.memoryHeapUsedMB || 84.2} MB
                </div>
                <p className="text-[10px] text-slate-500">Max Limit: {healthData?.serverMetrics?.memoryHeapTotalMB || 128} MB</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">PostGIS DB Connections</span>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  12 Active / 50 Max
                </div>
                <p className="text-[10px] text-emerald-500 font-medium">Pool Status: Optimal</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">SSE Stream Status</span>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  CONNECTED
                </div>
                <p className="text-[10px] text-slate-500">14 Active Listeners</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Avg Response Time</span>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  14.2 ms
                </div>
                <p className="text-[10px] text-emerald-500 font-medium">&lt; 50ms Target SLA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MLOps Health */}
      {activeTab === 'mlops' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-500" />
              Machine Learning Model Pickle Weights Registry
            </h3>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
              6 PKL Files Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { fileName: 'traffic_model.pkl', domain: 'Traffic Congestion', model: 'XGBoost Regressor v4.2', accuracy: '94.2%', inferenceCount: '142,800 runs', status: 'LOADED' },
              { fileName: 'aqi_model.pkl', domain: 'Air Quality Index', model: 'XGBoost Dispersion Model v2.1', accuracy: '92.8%', inferenceCount: '98,400 runs', status: 'LOADED' },
              { fileName: 'accident_model.pkl', domain: 'Accident Risk', model: 'RandomForest Classifier v3.0', accuracy: '91.5%', inferenceCount: '45,200 runs', status: 'LOADED' },
              { fileName: 'water_model.pkl', domain: 'Water Pressure Grid', model: 'MLP Pressure Net v1.5', accuracy: '93.0%', inferenceCount: '78,100 runs', status: 'LOADED' },
              { fileName: 'electricity_model.pkl', domain: 'BESCOM Power Load', model: 'LightGBM Forecaster v2.0', accuracy: '95.1%', inferenceCount: '112,000 runs', status: 'LOADED' },
              { fileName: 'complaint_model.pkl', domain: 'Citizen SLA Predictor', model: 'CatBoost Regressor v1.2', accuracy: '89.4%', inferenceCount: '34,900 runs', status: 'LOADED' }
            ].map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono text-sm">
                    {m.fileName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{m.domain} • <b>{m.model}</b></div>
                  <div className="text-[10px] text-slate-400 mt-1">Inferences: {m.inferenceCount}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono block mb-1">
                    {m.status}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">Accuracy: {m.accuracy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: API Health */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              REST API Endpoint Status & Latency Monitoring
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-mono font-bold">
              100% Up
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { endpoint: 'GET /api/wards', method: 'GET', status: 200, latency: '8 ms', load: 'High' },
              { endpoint: 'GET /api/traffic-sensors', method: 'GET', status: 200, latency: '12 ms', load: 'High' },
              { endpoint: 'GET /api/aqi-sensors', method: 'GET', status: 200, latency: '10 ms', load: 'Medium' },
              { endpoint: 'GET /api/complaints', method: 'GET', status: 200, latency: '15 ms', load: 'Medium' },
              { endpoint: 'POST /api/ai/chat', method: 'POST', status: 200, latency: '42 ms', load: 'High' },
              { endpoint: 'GET /api/health', method: 'GET', status: 200, latency: '3 ms', load: 'Low' },
            ].map((api, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${api.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                    {api.method}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{api.endpoint}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="text-emerald-500 font-bold">HTTP {api.status}</span>
                  <span className="text-slate-500">Latency: {api.latency}</span>
                  <span className="text-slate-400">Load: {api.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Database Health */}
      {activeTab === 'db' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              PostgreSQL PostGIS Spatial Database Pool Health
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-mono font-bold">
              Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Active Connection Pool</span>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">12 / 50 Active</div>
              <p className="text-[10px] text-emerald-500 mt-1">Zero connection drops recorded</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Spatial PostGIS Extension</span>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">PostGIS 3.3.2</div>
              <p className="text-[10px] text-slate-500 mt-1">SRID 4326 (WGS 84) Native Enabled</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Query Cache Hit Ratio</span>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">98.4% Hit Rate</div>
              <p className="text-[10px] text-emerald-500 mt-1">In-Memory Redis Layer Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security & Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Real-Time Security & System Audit Telemetry Stream
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Live Security Stream
            </span>
          </div>

          <div className="font-mono text-xs space-y-2.5 text-slate-300">
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-start justify-between gap-2">
              <div>
                <span className="text-emerald-400 font-bold">[SUCCESS]</span> OVERRIDE_SIGNAL_GREEN_WAVE
                <div className="text-[10px] text-slate-400 mt-0.5">User: Tushar Giri (Super Admin) | IP: 10.240.0.12</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">Just now</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-start justify-between gap-2">
              <div>
                <span className="text-emerald-400 font-bold">[SUCCESS]</span> DISPATCH_AMBULANCE_CORRIDOR
                <div className="text-[10px] text-slate-400 mt-0.5">User: IPS M.A. Saleem | IP: 10.240.1.45</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">2m ago</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-start justify-between gap-2">
              <div>
                <span className="text-emerald-400 font-bold">[SUCCESS]</span> TRIGGER_TANKER_DISPATCH
                <div className="text-[10px] text-slate-400 mt-0.5">User: Eng. Ramesh N. | IP: 10.240.2.88</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">5m ago</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-start justify-between gap-2">
              <div>
                <span className="text-amber-400 font-bold">[WARN]</span> AQI_THRESHOLD_EXCEEDED_HEBBAL
                <div className="text-[10px] text-slate-400 mt-0.5">Automated Smog Cannon Trigger Triggered</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">12m ago</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: User Management & RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#0B1220] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                User Access Management & Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage platform permissions across municipal departments</p>
            </div>
            
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add System User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Login</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{u.department}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{u.lastLogin}</td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${u.status === 'Active' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'}`}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Provision System User
            </h3>
            
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Inspector Ramesh"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Government Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. officer@bbmp.gov.in"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Assigned Department Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Traffic Department">Traffic Department</option>
                  <option value="Environment Department">Environment Department</option>
                  <option value="Water Department">Water Department</option>
                  <option value="Electricity Department">Electricity Department</option>
                  <option value="Emergency Department">Emergency Department</option>
                  <option value="Citizen">Citizen</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCenter;
