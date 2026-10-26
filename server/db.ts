// Production-ready database seed & state manager for SmartCity360 (Bengaluru Command Twin)
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
} from '../src/data/bengaluruData';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  token?: string;
  createdAt: string;
}

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  department: string;
}

export interface DbAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  targetModule: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
}

class CityDatabase {
  public wards = [...BENGALURU_WARDS];
  public facilities = [...CITY_FACILITIES];
  public trafficSensors = [...TRAFFIC_SENSORS];
  public accidentHotspots = [...ACCIDENT_HOTSPOTS];
  public aqiSensors = [...AQI_SENSORS];
  public complaints = [...CITIZEN_COMPLAINTS];
  public emergencyDispatches = [...EMERGENCY_DISPATCHES];
  public aiPredictions = [...AI_PREDICTIONS];
  public healthScore = { ...CITY_HEALTH_SCORE };

  public users: DbUser[] = [
    { id: 'usr-1', name: 'Tushar Giri', email: 'commissioner@bbmp.gov.in', role: 'Super Admin', department: 'Executive Command Center', createdAt: new Date().toISOString() },
    { id: 'usr-2', name: 'IPS M.A. Saleem', email: 'btp.chief@ksp.gov.in', role: 'Traffic Department', department: 'Bengaluru Traffic Police', createdAt: new Date().toISOString() },
    { id: 'usr-3', name: 'Dr. V. Ravichandar', email: 'environment@kpcb.gov.in', role: 'Environment Department', department: 'Karnataka Pollution Control Board', createdAt: new Date().toISOString() },
    { id: 'usr-4', name: 'Eng. Ramesh N.', email: 'chief@bwssb.gov.in', role: 'Water Department', department: 'BWSSB Cauvery Grid', createdAt: new Date().toISOString() },
    { id: 'usr-5', name: 'Eng. Sharath Kumar', email: 'ops@bescom.co.in', role: 'Electricity Department', department: 'BESCOM Power Distribution', createdAt: new Date().toISOString() },
    { id: 'usr-6', name: 'Dr. Priya Sharma', email: 'dispatch@112karnataka.gov.in', role: 'Emergency Department', department: '112 Emergency Dispatch', createdAt: new Date().toISOString() }
  ];

  public notifications: DbNotification[] = [
    {
      id: 'notif-1',
      title: 'Silk Board Flash Flood Alert',
      message: 'Underpass water logging detected at Silk Board Junction. Emergency pumping units dispatched.',
      type: 'critical',
      timestamp: new Date().toISOString(),
      read: false,
      department: 'Traffic & Emergency'
    },
    {
      id: 'notif-[#notif-2]',
      title: 'AQI Spike - Hebbal Station',
      message: 'AQI crossed 160 threshold in Hebbal. Automated anti-smog cannon deployment recommended.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
      department: 'Environment'
    },
    {
      id: 'notif-3',
      title: 'Substation Load Normalization',
      message: 'Whitefield 220kV grid load rebalanced automatically via smart transformer switching.',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      department: 'Electricity'
    }
  ];

  public auditLogs: DbAuditLog[] = [
    { id: 'log-101', timestamp: new Date().toISOString(), user: 'Tushar Giri', role: 'Super Admin', action: 'OVERRIDE_SIGNAL_GREEN_WAVE', targetModule: 'Traffic Command', status: 'SUCCESS', ipAddress: '10.240.0.12' },
    { id: 'log-102', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'IPS M.A. Saleem', role: 'Traffic Department', action: 'DISPATCH_AMBULANCE_CORRIDOR', targetModule: 'Emergency Response', status: 'SUCCESS', ipAddress: '10.240.1.45' },
    { id: 'log-103', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Eng. Ramesh N.', role: 'Water Department', action: 'TRIGGER_TANKER_DISPATCH', targetModule: 'Water Grid', status: 'SUCCESS', ipAddress: '10.240.2.88' }
  ];

  public reports = [
    { id: 'rep-1', title: 'Monthly Bengaluru Traffic Congestion & Bottleneck Analysis', date: 'July 2026', format: 'PDF', size: '4.2 MB', category: 'Traffic' },
    { id: 'rep-2', title: 'Quarterly Air Quality & Particulate Matter Emission Audit', date: 'Q2 2026', format: 'PDF', size: '8.1 MB', category: 'Environment' },
    { id: 'rep-3', title: 'Cauvery Water Distribution & Deficit Prediction Report', date: 'June 2026', format: 'XLSX', size: '2.5 MB', category: 'Water' },
    { id: 'rep-4', title: 'BBMP Citizen Complaint SLA Resolution Performance Scorecard', date: 'July 2026', format: 'PDF', size: '3.8 MB', category: 'Governance' }
  ];
}

export const db = new CityDatabase();
