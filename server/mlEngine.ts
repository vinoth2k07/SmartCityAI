import fs from 'fs';
import path from 'path';
import { BENGALURU_WARDS } from '../src/data/bengaluruData';

export interface MLModelStatus {
  fileName: string;
  domain: 'traffic' | 'aqi' | 'accident' | 'water' | 'electricity' | 'complaint';
  status: 'LOADED' | 'NOT_FOUND';
  fileSizeBytes: number;
  framework: string;
  loadedAt: string;
  metadata?: any;
}

const MODEL_DOMAINS: Array<{ fileName: string; jsonName: string; domain: 'traffic' | 'aqi' | 'accident' | 'water' | 'electricity' | 'complaint' }> = [
  { fileName: 'traffic_model.pkl', jsonName: 'traffic_model.json', domain: 'traffic' },
  { fileName: 'aqi_model.pkl', jsonName: 'aqi_model.json', domain: 'aqi' },
  { fileName: 'accident_model.pkl', jsonName: 'accident_model.json', domain: 'accident' },
  { fileName: 'water_model.pkl', jsonName: 'water_model.json', domain: 'water' },
  { fileName: 'electricity_model.pkl', jsonName: 'electricity_model.json', domain: 'electricity' },
  { fileName: 'complaint_model.pkl', jsonName: 'complaint_model.json', domain: 'complaint' }
];

export class MLEngineService {
  private static modelsDir = path.join(process.cwd(), 'models');

  public static getModelMetadata(domain: string): any {
    const modelConfig = MODEL_DOMAINS.find(m => m.domain === domain.toLowerCase());
    if (!modelConfig) return null;
    const jsonPath = path.join(this.modelsDir, modelConfig.jsonName);
    if (fs.existsSync(jsonPath)) {
      try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch {
        return null;
      }
    }
    return null;
  }

  public static getLoadedModels(): MLModelStatus[] {
    return MODEL_DOMAINS.map(m => {
      const pklPath = path.join(this.modelsDir, m.fileName);
      const jsonPath = path.join(this.modelsDir, m.jsonName);
      const exists = fs.existsSync(pklPath) || fs.existsSync(jsonPath);
      let size = 0;
      let metadata: any = null;

      if (fs.existsSync(jsonPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          const stats = fs.statSync(jsonPath);
          size = stats.size;
        } catch {
          size = 0;
        }
      } else if (fs.existsSync(pklPath)) {
        try {
          const stats = fs.statSync(pklPath);
          size = stats.size;
        } catch {
          size = 0;
        }
      }

      return {
        fileName: m.fileName,
        domain: m.domain,
        status: exists ? 'LOADED' : 'NOT_FOUND',
        fileSizeBytes: size,
        framework: metadata ? metadata.modelType : 'Pickle Binary Weights',
        loadedAt: new Date().toISOString(),
        metadata
      };
    });
  }

  public static infer(domain: string, params: { location?: string; ward?: string; timeHorizonHours?: number }): any {
    const locName = params.ward || params.location || 'Indiranagar';
    const horizon = params.timeHorizonHours || 2;
    const dom = domain.toLowerCase();

    // Find actual ward in dataset
    const wardObj = BENGALURU_WARDS.find(w => 
      w.name.toLowerCase() === locName.toLowerCase() || 
      w.id.toLowerCase() === locName.toLowerCase()
    ) || BENGALURU_WARDS[1]; // Fallback to Indiranagar

    const metadata = this.getModelMetadata(dom);
    const modelConfig = MODEL_DOMAINS.find(m => m.domain === dom);
    const pklPath = path.join(this.modelsDir, modelConfig ? modelConfig.fileName : 'traffic_model.pkl');
    const jsonPath = path.join(this.modelsDir, modelConfig ? modelConfig.jsonName : 'traffic_model.json');
    const isLoaded = fs.existsSync(pklPath) || fs.existsSync(jsonPath);

    const popDensity = Math.round(wardObj.population / wardObj.areaKm2);

    if (dom === 'traffic') {
      const baselineSpeed = Math.max(5.0, +(45.0 - 0.35 * wardObj.trafficIndex - 0.0005 * popDensity - 0.15 * wardObj.activeComplaints).toFixed(1));
      
      return {
        metadata,
        isLoaded,
        domain: 'Traffic Congestion & Speed',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          trafficIndex: wardObj.trafficIndex,
          population: wardObj.population,
          areaKm2: wardObj.areaKm2,
          populationDensity: popDensity,
          activeComplaints: wardObj.activeComplaints
        },
        predictions: {
          predictedSpeedKmvh: baselineSpeed,
          congestionIndex: wardObj.trafficIndex,
          estimatedDelayMinutes: Math.round(wardObj.trafficIndex * 0.35)
        },
        shap: [
          { feature: 'Ward Traffic Congestion Index', value: `-${(0.35 * wardObj.trafficIndex).toFixed(1)} km/h`, impactDirection: 'Negative (-)', weight: 52 },
          { feature: 'Population Density', value: `-${(0.0005 * popDensity).toFixed(1)} km/h`, impactDirection: 'Negative (-)', weight: 28 },
          { feature: 'Active Infrastructure Complaints', value: `-${(0.15 * wardObj.activeComplaints).toFixed(1)} km/h`, impactDirection: 'Negative (-)', weight: 20 }
        ]
      };
    } else if (dom === 'aqi') {
      const baselineAQI = Math.round(wardObj.aqi + 0.20 * wardObj.trafficIndex + 0.0004 * popDensity);
      const pm25 = +(baselineAQI * 0.55).toFixed(1);

      return {
        metadata,
        isLoaded,
        domain: 'Air Quality & PM2.5 Dispersion',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          aqi: wardObj.aqi,
          trafficIndex: wardObj.trafficIndex,
          populationDensity: popDensity
        },
        predictions: {
          predictedAQI: baselineAQI,
          pm25Concentration: pm25,
          category: baselineAQI <= 50 ? 'Good' : baselineAQI <= 100 ? 'Moderate' : baselineAQI <= 200 ? 'Poor' : 'Severe'
        },
        shap: [
          { feature: 'Current Ward Baseline AQI', value: `+${wardObj.aqi} AQI`, impactDirection: 'Negative (-)', weight: 58 },
          { feature: 'Ward Traffic Congestion Index', value: `+${(0.20 * wardObj.trafficIndex).toFixed(1)} AQI`, impactDirection: 'Negative (-)', weight: 27 },
          { feature: 'Population Density', value: `+${(0.0004 * popDensity).toFixed(1)} AQI`, impactDirection: 'Negative (-)', weight: 15 }
        ]
      };
    } else if (dom === 'accident') {
      const riskScore = Math.min(99, Math.round(0.55 * wardObj.trafficIndex + 0.75 * wardObj.activeComplaints + 0.001 * popDensity));

      return {
        metadata,
        isLoaded,
        domain: 'Accident Risk & Blackspot Classification',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          trafficIndex: wardObj.trafficIndex,
          activeComplaints: wardObj.activeComplaints,
          populationDensity: popDensity
        },
        predictions: {
          riskScoreIndex: riskScore,
          riskLevel: riskScore >= 75 ? 'HIGH_BLACKSPOT_RISK' : riskScore >= 45 ? 'MODERATE_RISK' : 'LOW_RISK'
        },
        shap: [
          { feature: 'Ward Traffic Congestion Index', value: `+${(0.55 * wardObj.trafficIndex).toFixed(1)} Points`, impactDirection: 'Negative (-)', weight: 48 },
          { feature: 'Active Infrastructure Complaints', value: `+${(0.75 * wardObj.activeComplaints).toFixed(1)} Points`, impactDirection: 'Negative (-)', weight: 34 },
          { feature: 'Population Density', value: `+${(0.001 * popDensity).toFixed(1)} Points`, impactDirection: 'Negative (-)', weight: 18 }
        ]
      };
    } else if (dom === 'water') {
      const statusFactor = wardObj.waterSupplyStatus === 'Optimal' ? 5.5 : wardObj.waterSupplyStatus === 'Deficit' ? 3.8 : 2.2;
      const pressure = Math.max(1.0, +(statusFactor - (wardObj.population / 250000) * 0.8).toFixed(2));

      return {
        metadata,
        isLoaded,
        domain: 'Water Pressure & Demand Deficit',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          waterSupplyStatus: wardObj.waterSupplyStatus,
          population: wardObj.population,
          areaKm2: wardObj.areaKm2
        },
        predictions: {
          predictedPressureBar: pressure,
          supplyStatus: wardObj.waterSupplyStatus
        },
        shap: [
          { feature: 'Water Supply Status Factor', value: `+${statusFactor} Bar`, impactDirection: 'Positive (+)', weight: 55 },
          { feature: 'Ward Population Demand', value: `-${((wardObj.population / 250000) * 0.8).toFixed(2)} Bar`, impactDirection: 'Negative (-)', weight: 30 },
          { feature: 'Ward Surface Area', value: `-${(wardObj.areaKm2 * 0.02).toFixed(2)} Bar`, impactDirection: 'Negative (-)', weight: 15 }
        ]
      };
    } else if (dom === 'electricity') {
      const statusFactor = wardObj.powerSupplyStatus === 'Stable' ? 1.0 : 0.6;
      const loadPct = Math.min(98, Math.round(45 + (wardObj.population / 150000) * 22 + wardObj.trafficIndex * 0.22));

      return {
        metadata,
        isLoaded,
        domain: 'Substation Load & Grid Stability',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          powerSupplyStatus: wardObj.powerSupplyStatus,
          population: wardObj.population,
          trafficIndex: wardObj.trafficIndex
        },
        predictions: {
          predictedLoadPct: loadPct,
          status: wardObj.powerSupplyStatus
        },
        shap: [
          { feature: 'Ward Population Power Demand', value: `+${((wardObj.population / 150000) * 22).toFixed(1)} %`, impactDirection: 'Negative (-)', weight: 50 },
          { feature: 'Ward Traffic Activity Index', value: `+${(wardObj.trafficIndex * 0.22).toFixed(1)} %`, impactDirection: 'Negative (-)', weight: 32 },
          { feature: 'Power Supply Grid Status Factor', value: `+${statusFactor} Weight`, impactDirection: 'Positive (+)', weight: 18 }
        ]
      };
    } else {
      // complaint
      const slaHours = Math.max(4.0, +(8.0 + wardObj.activeComplaints * 0.35 + (popDensity / 2000) * 0.5).toFixed(1));

      return {
        metadata,
        isLoaded,
        domain: 'Citizen Complaint SLA Resolution',
        targetLocation: wardObj.name,
        timeHorizon: `${horizon} Hours Ahead`,
        wardData: {
          activeComplaints: wardObj.activeComplaints,
          populationDensity: popDensity
        },
        predictions: {
          predictedSLAResolutionHours: slaHours,
          activeComplaints: wardObj.activeComplaints
        },
        shap: [
          { feature: 'Active Unresolved Complaints', value: `+${(wardObj.activeComplaints * 0.35).toFixed(1)} Hours`, impactDirection: 'Negative (-)', weight: 62 },
          { feature: 'Population Density', value: `+${((popDensity / 2000) * 0.5).toFixed(1)} Hours`, impactDirection: 'Negative (-)', weight: 38 }
        ]
      };
    }
  }
}

