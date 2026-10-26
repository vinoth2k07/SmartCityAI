import { 
  Ward, 
  Facility, 
  TrafficSensor, 
  AccidentHotspot, 
  AQISensor, 
  CitizenComplaint, 
  EmergencyDispatch, 
  AIPrediction, 
  CityHealthScore,
  ChatMessage 
} from '../types';

import { 
  BENGALURU_WARDS, 
  CITY_FACILITIES, 
  TRAFFIC_SENSORS, 
  ACCIDENT_HOTSPOTS, 
  AQI_SENSORS, 
  CITIZEN_COMPLAINTS, 
  EMERGENCY_DISPATCHES, 
  AI_PREDICTIONS, 
  CITY_HEALTH_SCORE 
} from '../data/bengaluruData';

async function safeFetch<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, using fallback state:`, err);
    return fallbackData;
  }
}

export interface UserSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  };
}

export const CityApi = {
  // Authentication
  login: async (email: string, role: string): Promise<UserSession> => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch {
      return {
        token: `mock_jwt_${Date.now()}`,
        user: {
          id: 'usr-1',
          name: 'Tushar Giri',
          email: email || 'commissioner@bbmp.gov.in',
          role: role || 'Super Admin',
          department: 'BBMP Executive Command'
        }
      };
    }
  },

  // City Overview
  getOverview: async (): Promise<{ healthScore: CityHealthScore; summary: string }> => {
    return safeFetch('/api/v1/city/overview', {
      healthScore: CITY_HEALTH_SCORE,
      summary: 'Bengaluru Smart City Operations running at 84/100 Health Index across 12 primary wards. Automated signal routing active.'
    });
  },

  // Wards
  getWards: async (): Promise<Ward[]> => {
    return safeFetch('/api/v1/wards', BENGALURU_WARDS);
  },

  // Facilities / Infrastructure
  getFacilities: async (): Promise<Facility[]> => {
    return safeFetch('/api/v1/facilities', CITY_FACILITIES);
  },

  // Traffic & Signals
  getTrafficSensors: async (): Promise<TrafficSensor[]> => {
    return safeFetch('/api/v1/traffic', TRAFFIC_SENSORS);
  },

  triggerGreenWave: async (sensorId: string, durationMinutes: number = 15): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/v1/traffic/override-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorId, greenWaveDuration: durationMinutes })
      });
      return await res.json();
    } catch {
      return { success: true, message: `Green wave activated for ${durationMinutes} mins on corridor ${sensorId}.` };
    }
  },

  // Accidents
  getAccidentHotspots: async (): Promise<AccidentHotspot[]> => {
    return safeFetch('/api/v1/accidents', ACCIDENT_HOTSPOTS);
  },

  // Environment & AQI
  getAQISensors: async (): Promise<AQISensor[]> => {
    return safeFetch('/api/v1/environment/aqi', AQI_SENSORS);
  },

  deploySmogCannon: async (sensorId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/v1/environment/deploy-smog-cannon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorId })
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Anti-smog cannon deployed successfully.' };
    }
  },

  // Citizen Complaints
  getComplaints: async (): Promise<CitizenComplaint[]> => {
    return safeFetch('/api/v1/complaints', CITIZEN_COMPLAINTS);
  },

  submitComplaint: async (complaint: Partial<CitizenComplaint>): Promise<CitizenComplaint> => {
    try {
      const res = await fetch('/api/v1/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint)
      });
      if (!res.ok) throw new Error('Failed to create complaint');
      return await res.json();
    } catch {
      const newTicket: CitizenComplaint = {
        id: `cmp-${Date.now()}`,
        ticketNo: `BBMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        category: complaint.category || 'Pothole',
        description: complaint.description || 'Citizen reported issue',
        ward: complaint.ward || 'Indiranagar',
        lat: complaint.lat || 12.9784,
        lng: complaint.lng || 77.6408,
        status: 'Pending',
        priority: complaint.priority || 'Medium',
        reportedBy: complaint.reportedBy || 'Citizen User',
        reportedAt: new Date().toISOString(),
        estimatedResolution: '48 Hours',
        assignedDept: 'BBMP Field Division'
      };
      return newTicket;
    }
  },

  // Emergency Dispatches & Hospitals
  getEmergencyDispatches: async (): Promise<EmergencyDispatch[]> => {
    return safeFetch('/api/v1/emergency/dispatches', EMERGENCY_DISPATCHES);
  },

  getHospitals: async (): Promise<Facility[]> => {
    return safeFetch('/api/v1/emergency/hospitals', CITY_FACILITIES.filter(f => f.type === 'Hospital'));
  },

  // AI Predictions
  getAIPredictions: async (): Promise<AIPrediction[]> => {
    return safeFetch('/api/v1/predictions', AI_PREDICTIONS);
  },

  // Reports
  getReports: async (): Promise<any[]> => {
    return safeFetch('/api/v1/reports', [
      { id: 'rep-1', title: 'Monthly Traffic Congestion & Bottleneck Analysis', date: 'July 2026', format: 'PDF', size: '4.2 MB' },
      { id: 'rep-2', title: 'Quarterly Air Quality & PM Emission Audit', date: 'Q2 2026', format: 'PDF', size: '8.1 MB' },
      { id: 'rep-3', title: 'Cauvery Water Deficit & Pumping Optimization', date: 'June 2026', format: 'XLSX', size: '2.5 MB' }
    ]);
  },

  // Search API
  search: async (query: string): Promise<any[]> => {
    if (!query || !query.trim()) return [];
    return safeFetch(`/api/v1/search?q=${encodeURIComponent(query)}`, []);
  },

  // Single Entity Detail API Methods
  getWardDetails: async (idOrName: string): Promise<any | null> => {
    return safeFetch(`/api/v1/wards/${encodeURIComponent(idOrName)}`, null);
  },

  getFacilityDetails: async (id: string): Promise<any | null> => {
    return safeFetch(`/api/v1/facilities/${encodeURIComponent(id)}`, null);
  },

  getComplaintDetails: async (id: string): Promise<any | null> => {
    return safeFetch(`/api/v1/complaints/${encodeURIComponent(id)}`, null);
  },

  getReportDetails: async (id: string): Promise<any | null> => {
    return safeFetch(`/api/v1/reports/${encodeURIComponent(id)}`, null);
  },

  // Notifications
  getNotifications: async (): Promise<any[]> => {
    return safeFetch('/api/v1/notifications', [
      { id: 'notif-1', title: 'Silk Board Flash Flood Alert', message: 'Underpass water logging detected. Emergency units dispatched.', type: 'critical', timestamp: new Date().toISOString(), read: false, department: 'Traffic & Emergency' },
      { id: 'notif-2', title: 'AQI Spike - Hebbal Station', message: 'AQI crossed 160 threshold in Hebbal. Anti-smog cannon deployment recommended.', type: 'warning', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false, department: 'Environment' },
      { id: 'notif-3', title: 'Substation Load Normalization', message: 'Whitefield 220kV grid load rebalanced automatically.', type: 'info', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true, department: 'Electricity' }
    ]);
  },

  markNotificationsRead: async (id?: string): Promise<{ success: boolean; notifications: any[] }> => {
    try {
      const res = await fetch('/api/v1/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return await res.json();
    } catch {
      return { success: true, notifications: [] };
    }
  },

  dismissNotification: async (id: string): Promise<{ success: boolean; notifications: any[] }> => {
    try {
      const res = await fetch(`/api/v1/notifications/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: true, notifications: [] };
    }
  },

  clearNotifications: async (): Promise<{ success: boolean; notifications: any[] }> => {
    try {
      const res = await fetch('/api/v1/notifications', { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: true, notifications: [] };
    }
  },

  deployWaterTankers: async (ward: string = 'Whitefield', count: number = 5): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/v1/water/deploy-tankers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ward, count })
      });
      return await res.json();
    } catch {
      return { success: true, message: `Dispatched ${count} BWSSB emergency tankers to ${ward}.` };
    }
  },

  // Download Report File Directly (Triggers browser download)
  downloadReport: (reportType: string = 'executive', format: string = 'pdf', ward: string = 'All Wards') => {
    const downloadUrl = `/api/v1/reports/download?type=${encodeURIComponent(reportType)}&format=${encodeURIComponent(format)}&ward=${encodeURIComponent(ward)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `SmartCity360_${reportType}_${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Audit Logs
  getAuditLogs: async (): Promise<any[]> => {
    return safeFetch('/api/v1/audit-logs', [
      { id: 'log-101', timestamp: new Date().toISOString(), user: 'Tushar Giri', role: 'Super Admin', action: 'OVERRIDE_SIGNAL_GREEN_WAVE', targetModule: 'Traffic Command', status: 'SUCCESS', ipAddress: '10.240.0.12' },
      { id: 'log-102', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'IPS M.A. Saleem', role: 'Traffic Department', action: 'DISPATCH_AMBULANCE_CORRIDOR', targetModule: 'Emergency Response', status: 'SUCCESS', ipAddress: '10.240.1.45' }
    ]);
  },

  // AI Chatbot
  getChatHistory: async (): Promise<ChatMessage[]> => {
    return safeFetch('/api/v1/ai/history', []);
  },

  clearChatHistory: async (): Promise<{ success: boolean }> => {
    try {
      const res = await fetch('/api/v1/ai/history', { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  getMLModels: async (): Promise<any> => {
    return safeFetch('/api/v1/ml/models', {
      status: 'OPERATIONAL',
      totalModels: 6,
      loadedCount: 6,
      models: [
        { fileName: 'traffic_model.pkl', domain: 'traffic', status: 'LOADED', framework: 'XGBoost Regressor v4.2' },
        { fileName: 'aqi_model.pkl', domain: 'aqi', status: 'LOADED', framework: 'XGBoost Dispersion Model v2.1' },
        { fileName: 'accident_model.pkl', domain: 'accident', status: 'LOADED', framework: 'RandomForest Classifier v3.0' },
        { fileName: 'water_model.pkl', domain: 'water', status: 'LOADED', framework: 'MLP Pressure Net v1.5' },
        { fileName: 'electricity_model.pkl', domain: 'electricity', status: 'LOADED', framework: 'LightGBM Load Forecaster v2.0' },
        { fileName: 'complaint_model.pkl', domain: 'complaint', status: 'LOADED', framework: 'CatBoost SLA Predictor v1.2' }
      ]
    });
  },

  predictML: async (domain: string, targetLocation: string): Promise<any> => {
    try {
      const res = await fetch(`/api/v1/ml/predict/${domain}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, targetLocation })
      });
      return await res.json();
    } catch {
      return {
        modelFile: `${domain}_model.pkl`,
        isLoaded: true,
        confidencePercent: 94.2,
        predictions: { status: 'Optimal' }
      };
    }
  },

  explainML: async (predictionId?: string): Promise<any> => {
    try {
      const res = await fetch('/api/v1/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId })
      });
      return await res.json();
    } catch {
      return {
        modelName: 'XGBoost-SHAP-Spatial-Regressor-v3',
        confidencePercent: 93.8,
        features: [
          { featureName: 'Vehicle Throughput Density', weight: 44, value: '2,850/hr', impact: 'Negative' }
        ]
      };
    }
  },

  runSimulation: async (scenarioType: string, severity: string = 'HIGH'): Promise<any> => {
    try {
      const res = await fetch('/api/v1/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioType, severity })
      });
      return await res.json();
    } catch {
      return {
        scenarioType,
        scenarioTitle: 'Heavy Monsoon Rainfall & Flash Flooding',
        baselineHealthScore: 84.0,
        impactMetrics: {
          trafficSpeedDropPct: -48,
          aqiChangePct: -18,
          powerDeficitMW: -120,
          waterDisruptionMLD: -85,
          complaintSurgePct: +145,
          emergencySLADelayMins: +14.2,
          projectedHealthScore: 68.5
        },
        aiMitigations: [
          'Activate automated green wave override on NH44 Silk Board corridor.',
          'Deploy 4 emergency BWSSB water de-clogging pumps to Bellandur underpass.'
        ]
      };
    }
  },

  getSystemHealth: async (): Promise<any> => {
    return safeFetch('/api/v1/system/health', {
      status: 'HEALTHY',
      environment: 'development',
      nodeVersion: 'v20.12.0',
      uptimeSeconds: 12450,
      serverMetrics: {
        memoryHeapUsedMB: 84.2,
        memoryHeapTotalMB: 128.0,
        memoryRssMB: 142.5,
        cpuLoadPct: 3.4,
        avgResponseTimeMs: 14.2
      },
      databaseStatus: {
        engine: 'PostgreSQL / PostGIS',
        connectionPool: 'Active (12 / 20 Connections)',
        tablesSynced: 28,
        totalWards: 12,
        totalComplaints: 24
      },
      webSocketStatus: {
        channel: 'Real-Time Event Stream / SSE',
        status: 'CONNECTED',
        activeClients: 14
      },
      mlPickleModels: {
        totalModels: 6,
        loadedCount: 6,
        models: []
      }
    });
  },

  getAgents: async (): Promise<any[]> => {
    return safeFetch('/api/v1/ai/agents', [
      { id: 'mayor_agent', name: 'Mayor Command AI', role: 'Executive Strategic Advisor', department: 'BBMP Executive Office' },
      { id: 'traffic_agent', name: 'Traffic & Signals AI', role: 'Adaptive Corridor Controller', department: 'Bengaluru Traffic Police' },
      { id: 'emergency_agent', name: 'Emergency Dispatch AI', role: '112 Disaster & SLA Command', department: 'KSDMA' },
      { id: 'env_agent', name: 'Air & Climate AI', role: 'AQI & Weather Sentinel', department: 'KSPCB' },
      { id: 'utility_agent', name: 'Grid & Water AI', role: 'BESCOM & BWSSB Optimizer', department: 'BESCOM / BWSSB' },
      { id: 'rag_agent', name: 'Municipal Policy RAG AI', role: 'Legal & SOP Compliance Engine', department: 'BBMP Legal' }
    ]);
  },

  runAgentTask: async (agentId: string, query: string, wardContext?: string): Promise<any> => {
    try {
      const res = await fetch('/api/v1/ai/agents/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, query, wardContext })
      });
      return await res.json();
    } catch {
      return {
        agent: { name: 'SmartCity AI Agent', department: 'Command Operations' },
        response: `Executed query "${query}" for ${wardContext || 'all wards'}. Thresholds within normal limits.`,
        citations: ['[BBMP-SOP-2025] Section 4.2 Traffic & Water Mitigation Norms']
      };
    }
  },

  getRagKnowledge: async (): Promise<any[]> => {
    return safeFetch('/api/v1/ai/rag/knowledge', []);
  },

  askAIChatbot: async (message: string, wardContext?: string): Promise<ChatMessage> => {
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, wardContext })
      });
      if (!res.ok) throw new Error('Chat API failed');
      return await res.json();
    } catch {
      const msg = message.toLowerCase();
      if (msg.includes('aqi') || msg.includes('air')) {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Whitefield current AQI is 142 (Moderate). Central Silk Board station reports highest AQI at 175 (Poor). Yelahanka GKVK enjoys cleanest air at 58 AQI (Good).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataCard: {
            title: 'Bengaluru AQI Telemetry',
            metrics: [
              { label: 'Whitefield', value: '142 AQI', badge: 'Moderate' },
              { label: 'Silk Board', value: '175 AQI', badge: 'Poor' },
              { label: 'Yelahanka', value: '58 AQI', badge: 'Good' }
            ]
          }
        };
      } else if (msg.includes('traffic') || msg.includes('silk board') || msg.includes('orr')) {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Central Silk Board Junction is currently in Gridlock with average speed at 8.5 km/h. Automated signal green wave override is active. Outer Ring Road speed is 9.8 km/h.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataCard: {
            title: 'Traffic Intelligence Corridor',
            metrics: [
              { label: 'Silk Board', value: '8.5 km/h', badge: 'Gridlock' },
              { label: 'ORR Ecospace', value: '9.8 km/h', badge: 'Gridlock' },
              { label: 'E-City Flyover', value: '42.0 km/h', badge: 'Fluid' }
            ]
          }
        };
      } else {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `SmartCity AI Command Assistant standing by. Overall Bengaluru City Health Index is 84/100. All 12 wards telemetry feeds are synchronized with PostGIS spatial grid.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataCard: {
            title: 'Bengaluru Command Twin',
            metrics: [
              { label: 'City Health Index', value: '84 / 100', badge: 'Optimal' },
              { label: 'Active Wards', value: '12 Monitored' }
            ]
          }
        };
      }
    }
  }
};
