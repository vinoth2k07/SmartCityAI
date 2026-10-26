/**
 * SmartCity360 - Type Definitions
 * Enterprise Digital Twin Analytics & Command Center for Bengaluru
 */

export type UserRole = 
  | 'Super Admin'
  | 'Traffic Department'
  | 'Environment Department'
  | 'Water Department'
  | 'Electricity Department'
  | 'Emergency Department'
  | 'Citizen';

export type DepartmentKey = 
  | 'traffic'
  | 'environment'
  | 'water'
  | 'electricity'
  | 'emergency'
  | 'transport'
  | 'infrastructure'
  | 'complaints';

export interface Ward {
  id: string;
  name: string;
  number: number;
  zone: string;
  lat: number;
  lng: number;
  population: number;
  areaKm2: number;
  aqi: number;
  trafficIndex: number; // 0-100 (100 = heavy congestion)
  waterSupplyStatus: 'Optimal' | 'Deficit' | 'Critical';
  powerSupplyStatus: 'Stable' | 'Partial Outage' | 'Grid Overload';
  activeComplaints: number;
  healthScore: number;
  bounds: [number, number][]; // Polygon lat/lngs
}

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Police Station' | 'Fire Station' | 'Metro Station' | 'Bus Terminal' | 'Water Reservoir' | 'Power Substation' | 'School' | 'Park' | 'Government Building';
  lat: number;
  lng: number;
  ward: string;
  status: 'Operational' | 'Busy' | 'Emergency' | 'Maintenance';
  capacity: string;
  contact: string;
}

export interface TrafficSensor {
  id: string;
  location: string;
  corridor: string;
  lat: number;
  lng: number;
  vehicleCountPerHour: number;
  avgSpeedKmvh: number;
  congestionLevel: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  signalStatus: 'Automated AI' | 'Manual Control' | 'Signal Failure' | 'AI Adaptive';
  lastUpdated: string;
}

export interface AccidentHotspot {
  id: string;
  junction: string;
  lat: number;
  lng: number;
  totalAccidents2026: number;
  fatalities: number;
  riskScore: 'Low' | 'Medium' | 'High' | 'Severe';
  primaryCause: string;
  recommendedMitigation: string;
}

export interface AQISensor {
  id: string;
  stationName: string;
  ward: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
}

export interface CitizenComplaint {
  id: string;
  ticketNo: string;
  category: 'Pothole' | 'Garbage Dump' | 'Water Leakage' | 'Power Outage' | 'Streetlight Off' | 'Drainage Block' | 'Encroachment';
  description: string;
  ward: string;
  lat: number;
  lng: number;
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  reportedBy: string;
  reportedAt: string;
  estimatedResolution: string;
  assignedDept: string;
}

export interface EmergencyDispatch {
  id: string;
  type: 'Medical Incident' | 'Fire Alert' | 'Traffic Collision' | 'Water Main Burst';
  location: string;
  lat: number;
  lng: number;
  reportedTime: string;
  assignedUnit: string;
  status: 'Dispatched' | 'En Route' | 'On Scene' | 'Resolved';
  etaMinutes: number;
}

export interface AIPrediction {
  metric: string;
  timeframe: string;
  currentValue: string | number;
  predictedValue: string | number;
  confidence: number; // percentage
  keyFactors: string[];
  recommendedAction: string;
  algorithmUsed: string;
}

export interface CityHealthScore {
  overallScore: number; // 0 - 100
  trafficSubscore: number;
  environmentSubscore: number;
  waterSubscore: number;
  powerSubscore: number;
  emergencyResponseSubscore: number;
  citizenSatisfactionSubscore: number;
  lastCalculated: string;
}

export interface MapLayerConfig {
  wardBoundaries: boolean;
  roads: boolean;
  traffic: boolean;
  accidents: boolean;
  aqi: boolean;
  weather: boolean;
  hospitals: boolean;
  police: boolean;
  fireStations: boolean;
  schools: boolean;
  parks: boolean;
  govBuildings: boolean;
  metro: boolean;
  busStops: boolean;
  electricity: boolean;
  water: boolean;
  complaints: boolean;
  heatmaps: boolean;
  bufferZone: boolean;
}

export interface ExplainabilityFeature {
  featureName: string;
  weight: number; // percentage or SHAP score
  value: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
}

export interface ExplainabilityCard {
  modelName: string;
  confidencePercent: number;
  timeHorizon: string;
  features: ExplainabilityFeature[];
  counterfactualText?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  department: string;
  expectedHealthGain: number; // e.g., +3.5 Health Points
  actionType: 'GREEN_WAVE' | 'SMOG_CANNON' | 'WATER_TANKER' | 'DISPATCH_PATROL';
  targetId?: string;
}

export interface LocationFilter {
  state: string;
  district: string;
  city: string;
  zone: string;
  wardId: string;
  road?: string;
  intersection?: string;
  sensorId?: string;
}

export interface GlobalFilterState {
  location: LocationFilter;
  dateRange: 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Q3 2026' | 'Custom';
  timeOfDay: 'Real-Time' | 'Morning Peak' | 'Afternoon' | 'Evening Peak' | 'Night';
  department: DepartmentKey | 'All';
  vehicleType: string;
  complaintCategory: string;
  weather: string;
  aqiLevel: string;
  emergencyType: string;
}

export interface SearchResultItem {
  id: string;
  entityId?: string;
  wardId?: string;
  route?: string;
  title: string;
  subtitle: string;
  category: 
    | 'Ward' 
    | 'Road' 
    | 'Metro Station' 
    | 'Hospital' 
    | 'Police Station' 
    | 'Fire Station' 
    | 'Bus Terminal' 
    | 'Water Reservoir' 
    | 'Power Substation' 
    | 'School' 
    | 'Park' 
    | 'Government Building' 
    | 'Lake' 
    | 'Bus Stop' 
    | 'Government Office' 
    | 'Landmark' 
    | 'Page' 
    | 'Complaint' 
    | 'Report' 
    | 'Department' 
    | 'Dashboard' 
    | 'Analytics';
  wardName: string;
  zone?: string;
  lat?: number;
  lng?: number;
  details?: string;
  metadata?: any;
}

export interface WardIntelligenceProfile {
  ward: Ward;
  scores: {
    healthScore: number;
    infrastructureScore: number;
    trafficScore: number;
    aqiScore: number;
    waterScore: number;
    electricityScore: number;
    safetyScore: number;
    complaintScore: number;
    aiRiskScore: number;
  };
  traffic: {
    volumeVehPerHour: number;
    avgSpeedKmvh: number;
    congestionIndexPct: number;
    peakHour: string;
    roadRankings: { roadName: string; congestionPct: number; avgSpeed: number }[];
    signalPerformance: { automatedPct: number; manualPct: number; failurePct: number };
    vehicleClassification: { category: string; count: number; percentage: number }[];
    trafficPrediction: { time: string; predictedSpeed: number; predictedVolume: number }[];
  };
  accidents: {
    count2026: number;
    fatalities: number;
    severityBreakdown: { category: string; count: number }[];
    monthlyTrend: { month: string; accidents: number; fatalities: number }[];
    blackspots: { location: string; severity: string; primaryCause: string; riskScore: number }[];
    weatherCorrelation: { weather: string; accidentRatePct: number }[];
  };
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    category: string;
    trend24h: { time: string; aqi: number; pm25: number; pm10: number }[];
    sources: { source: string; percentage: number }[];
    forecast7d: { day: string; predictedAqi: number; riskLevel: string }[];
  };
  water: {
    dailyConsumptionMLD: number;
    deficitPct: number;
    leakageRatePct: number;
    pressurePSI: number;
    reservoirSupplyPct: number;
    prediction: { month: string; demandMLD: number; supplyMLD: number }[];
  };
  electricity: {
    demandMW: number;
    peakLoadMW: number;
    substationLoadPct: number;
    transformerStatus: { normal: number; warning: number; overload: number };
    outageRiskPrediction: { zone: string; riskPct: number; estimatedImpactMinutes: number }[];
  };
  complaints: {
    openCases: number;
    closedCases: number;
    avgResolutionTimeHours: number;
    deptComparison: { department: string; open: number; resolved: number; avgHours: number }[];
    monthlyTrend: { month: string; received: number; resolved: number }[];
    sentiment: { positivePct: number; neutralPct: number; negativePct: number; escalatedPct: number };
  };
  emergency: {
    fireStations: number;
    hospitals: number;
    ambulances: number;
    policeStations: number;
    avgResponseTimeMins: number;
    emergencyCallsCount: number;
    nearestResources: Facility[];
  };
  infrastructure: {
    roadConditionIndex: number; // 0-100
    bridgeHealthPct: number;
    streetlightActivePct: number;
    waterPipeAgeYears: number;
    drainageCapacityPct: number;
    transformerLoadPct: number;
    maintenanceHistory: { asset: string; date: string; type: string; status: string }[];
    failurePredictions: { asset: string; type: string; failureProbabilityPct: number; timeHorizon: string }[];
  };
  mlExplainability: {
    modelName: string;
    accuracyPct: number;
    precisionPct: number;
    recallPct: number;
    f1ScorePct: number;
    confidencePct: number;
    shapFeatures: { featureName: string; shapValue: number; impact: 'Positive' | 'Negative' | 'Neutral'; actualValue: string }[];
    explainabilitySummary: string;
  };
  aiInsights: {
    topRisks: string[];
    keyTrends: string[];
    forecastSummary: string;
    anomalies: string[];
    recommendedActions: { title: string; dept: string; impact: string; priority: 'Critical' | 'High' | 'Medium' }[];
    priorityScore: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  domain?: 'traffic' | 'weather' | 'aqi' | 'electricity' | 'water' | 'complaints' | 'hospitals' | 'emergency' | 'predictions';
  dataCard?: {
    title: string;
    metrics: { label: string; value: string | number; badge?: string }[];
    actionText?: string;
  };
  explainabilityCard?: ExplainabilityCard;
  recommendations?: AIRecommendation[];
}

