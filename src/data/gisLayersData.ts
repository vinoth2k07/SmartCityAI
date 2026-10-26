// GIS Spatial Layers Data for Digital Twin (Metro, Roads, Electricity, Water Grid, Weather)

export interface GISLineString {
  id: string;
  name: string;
  category: 'metro' | 'road' | 'electricity' | 'water';
  color: string;
  weight: number;
  dashArray?: string;
  coordinates: [number, number][]; // [lat, lng] array
  details: string;
}

export interface GISWeatherZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  tempC: number;
  rainfallMm: number;
  humidityPct: number;
  windSpeedKmh: number;
  condition: 'Moderate Rain' | 'Overcast' | 'Heavy Thunderstorm' | 'Clear Sky';
}

// 1. Namma Metro Purple & Green Lines Track Polylines
export const METRO_NETWORK_LINES: GISLineString[] = [
  {
    id: 'metro-purple',
    name: 'Namma Metro Purple Line (Whitefield - Kengeri Corridor)',
    category: 'metro',
    color: '#8B5CF6', // Purple
    weight: 4,
    coordinates: [
      [12.9880, 77.7610], // Whitefield
      [12.9850, 77.7400], // Hope Farm
      [12.9820, 77.7120], // Hoodi
      [12.9800, 77.6800], // KR Puram
      [12.9780, 77.6410], // Indiranagar
      [12.9756, 77.6066], // MG Road
      [12.9780, 77.5720], // Majestic Interchange
      [12.9600, 77.5300], // Vijayanagar
      [12.9100, 77.4800]  // Kengeri
    ],
    details: 'Capacity: 450,000 daily commuters | 37 Active Trains'
  },
  {
    id: 'metro-green',
    name: 'Namma Metro Green Line (Nagasandra - Silk Institute Corridor)',
    category: 'metro',
    color: '#10B981', // Green
    weight: 4,
    coordinates: [
      [13.0450, 77.5200], // Nagasandra
      [12.9982, 77.5530], // Rajajinagar
      [12.9780, 77.5720], // Majestic Interchange
      [12.9630, 77.5740], // KR Market / Victoria
      [12.9299, 77.5826], // Jayanagar
      [12.8900, 77.5700]  // Silk Institute
    ],
    details: 'Capacity: 380,000 daily commuters | 29 Active Trains'
  }
];

// 2. Bengaluru Major Road Network LineStrings
export const ROAD_NETWORK_LINES: GISLineString[] = [
  {
    id: 'road-orr',
    name: 'Outer Ring Road Tech Belt (Silk Board - Hebbal Expressway)',
    category: 'road',
    color: '#3B82F6',
    weight: 5,
    coordinates: [
      [12.9172, 77.6228], // Silk Board
      [12.9280, 77.6820], // Bellandur Ecospace
      [12.9520, 77.6980], // Marathahalli
      [12.9800, 77.6800], // KR Puram
      [13.0220, 77.6300], // Banaswadi
      [13.0358, 77.5970]  // Hebbal Flyover
    ],
    details: 'Length: 32 km | 6-lane IT Corridor | Daily Traffic Volume: 280k Vehicles'
  },
  {
    id: 'road-hosur',
    name: 'Hosur National Highway Elevated Expressway (NH 44)',
    category: 'road',
    color: '#2563EB',
    weight: 4,
    coordinates: [
      [12.9352, 77.6245], // Koramangala
      [12.9172, 77.6228], // Silk Board Junction
      [12.8900, 77.6350], // Bommanahalli
      [12.8520, 77.6580], // Electronic City Elevated Toll
      [12.8300, 77.6780]  // E-City Phase 2
    ],
    details: 'Elevated Expressway | Toll Toll Gate Monitoring Active'
  },
  {
    id: 'road-bellary',
    name: 'Bellary Road Kempegowda Airport Expressway',
    category: 'road',
    color: '#0284C7',
    weight: 5,
    coordinates: [
      [12.9796, 77.5907], // Vidhana Soudha
      [13.0358, 77.5970], // Hebbal Flyover
      [13.1007, 77.5963], // Yelahanka
      [13.1980, 77.6500]  // Devanahalli / KIA Airport
    ],
    details: 'Airport High-Speed Corridor | 120 km/h Design Speed'
  }
];

// 3. Electricity High-Voltage Grid Lines (220kV)
export const POWER_GRID_LINES: GISLineString[] = [
  {
    id: 'grid-line-1',
    name: 'BESCOM 220kV Master Power Grid (Hoodi - Silk Board)',
    category: 'electricity',
    color: '#F59E0B',
    weight: 3,
    dashArray: '8, 8',
    coordinates: [
      [12.9820, 77.7120], // Hoodi Substation
      [12.9520, 77.6980], // Marathahalli
      [12.9280, 77.6820], // Bellandur
      [12.9172, 77.6228]  // Silk Board
    ],
    details: 'HV Transmission 220kV | Load: 84% Stable'
  },
  {
    id: 'grid-line-2',
    name: 'BESCOM West Grid (Peenya - Rajajinagar - Jayanagar)',
    category: 'electricity',
    color: '#D97706',
    weight: 3,
    dashArray: '8, 8',
    coordinates: [
      [13.0300, 77.5200], // Peenya Industrial
      [12.9982, 77.5530], // Rajajinagar
      [12.9630, 77.5740], // City Center
      [12.9299, 77.5826]  // Jayanagar
    ],
    details: 'HV Transmission 220kV | Load: 68% Normal'
  }
];

// 4. BWSSB Cauvery Water Pumping Trunk Mains
export const WATER_PIPELINE_LINES: GISLineString[] = [
  {
    id: 'water-main-1',
    name: 'BWSSB Cauvery Stage V Trunk Pipeline (TK Halli - High Grounds Reservoir)',
    category: 'water',
    color: '#06B6D4',
    weight: 4,
    dashArray: '5, 5',
    coordinates: [
      [12.9100, 77.5600], // TK Halli Treatment
      [12.9299, 77.5826], // Jayanagar Reservoir
      [12.9675, 77.5878], // High Grounds Reservoir
      [12.9820, 77.7120]  // Whitefield Pipeline Extension
    ],
    details: 'Discharge Rate: 1,450 MLD | Pressure: 6.2 Bar'
  }
];

// 5. Live Weather & Radar Polygons
export const WEATHER_ZONES: GISWeatherZone[] = [
  {
    id: 'wx-1',
    name: 'Mahadevapura Monsoon Cell',
    lat: 12.9600,
    lng: 77.7200,
    radiusMeters: 4500,
    tempC: 22.4,
    rainfallMm: 42.5,
    humidityPct: 88,
    windSpeedKmh: 28.5,
    condition: 'Heavy Thunderstorm'
  },
  {
    id: 'wx-2',
    name: 'Yelahanka North Air Mass',
    lat: 13.0800,
    lng: 77.5900,
    radiusMeters: 5500,
    tempC: 26.1,
    rainfallMm: 0.0,
    humidityPct: 62,
    windSpeedKmh: 12.0,
    condition: 'Clear Sky'
  },
  {
    id: 'wx-3',
    name: 'South Bengaluru Light Drizzle Zone',
    lat: 12.9200,
    lng: 77.6100,
    radiusMeters: 3800,
    tempC: 24.0,
    rainfallMm: 8.2,
    humidityPct: 76,
    windSpeedKmh: 16.4,
    condition: 'Moderate Rain'
  }
];
