import { Ward, Facility, TrafficSensor, AccidentHotspot, AQISensor, CitizenComplaint, EmergencyDispatch, AIPrediction, CityHealthScore } from '../types';

export const BENGALURU_WARDS: Ward[] = [
  {
    id: 'ward-1',
    name: 'Whitefield',
    number: 84,
    zone: 'Mahadevapura',
    lat: 12.9698,
    lng: 77.7499,
    population: 145000,
    areaKm2: 18.2,
    aqi: 142,
    trafficIndex: 82,
    waterSupplyStatus: 'Deficit',
    powerSupplyStatus: 'Stable',
    activeComplaints: 38,
    healthScore: 71,
    bounds: [
      [12.9820, 77.7350],
      [12.9850, 77.7650],
      [12.9550, 77.7700],
      [12.9500, 77.7400]
    ]
  },
  {
    id: 'ward-2',
    name: 'Indiranagar',
    number: 80,
    zone: 'East',
    lat: 12.9784,
    lng: 77.6408,
    population: 98000,
    areaKm2: 7.4,
    aqi: 92,
    trafficIndex: 68,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 14,
    healthScore: 86,
    bounds: [
      [12.9880, 77.6320],
      [12.9890, 77.6520],
      [12.9680, 77.6530],
      [12.9670, 77.6310]
    ]
  },
  {
    id: 'ward-3',
    name: 'Koramangala',
    number: 151,
    zone: 'South',
    lat: 12.9352,
    lng: 77.6245,
    population: 112000,
    areaKm2: 9.1,
    aqi: 118,
    trafficIndex: 76,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 21,
    healthScore: 81,
    bounds: [
      [12.9480, 77.6120],
      [12.9490, 77.6380],
      [12.9220, 77.6390],
      [12.9210, 77.6110]
    ]
  },
  {
    id: 'ward-4',
    name: 'HSR Layout',
    number: 174,
    zone: 'Bommanahalli',
    lat: 12.9121,
    lng: 77.6446,
    population: 128000,
    areaKm2: 12.5,
    aqi: 105,
    trafficIndex: 72,
    waterSupplyStatus: 'Deficit',
    powerSupplyStatus: 'Stable',
    activeComplaints: 19,
    healthScore: 78,
    bounds: [
      [12.9220, 77.6320],
      [12.9240, 77.6580],
      [12.9000, 77.6600],
      [12.8980, 77.6310]
    ]
  },
  {
    id: 'ward-5',
    name: 'MG Road & CBD',
    number: 111,
    zone: 'Central',
    lat: 12.9756,
    lng: 77.6066,
    population: 76000,
    areaKm2: 5.8,
    aqi: 135,
    trafficIndex: 88,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 12,
    healthScore: 83,
    bounds: [
      [12.9850, 77.5980],
      [12.9860, 77.6180],
      [12.9650, 77.6190],
      [12.9640, 77.5970]
    ]
  },
  {
    id: 'ward-6',
    name: 'Electronic City',
    number: 192,
    zone: 'Anekal',
    lat: 12.8452,
    lng: 77.6602,
    population: 160000,
    areaKm2: 22.4,
    aqi: 110,
    trafficIndex: 65,
    waterSupplyStatus: 'Critical',
    powerSupplyStatus: 'Stable',
    activeComplaints: 31,
    healthScore: 74,
    bounds: [
      [12.8600, 77.6450],
      [12.8620, 77.6750],
      [12.8300, 77.6780],
      [12.8280, 77.6420]
    ]
  },
  {
    id: 'ward-7',
    name: 'Hebbal & ORR',
    number: 21,
    zone: 'Yelahanka Zone',
    lat: 13.0358,
    lng: 77.5970,
    population: 118000,
    areaKm2: 11.2,
    aqi: 158,
    trafficIndex: 91,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Partial Outage',
    activeComplaints: 28,
    healthScore: 69,
    bounds: [
      [13.0480, 77.5850],
      [13.0500, 77.6100],
      [13.0220, 77.6120],
      [13.0200, 77.5840]
    ]
  },
  {
    id: 'ward-8',
    name: 'Yelahanka',
    number: 4,
    zone: 'North',
    lat: 13.1007,
    lng: 77.5963,
    population: 105000,
    areaKm2: 16.8,
    aqi: 68,
    trafficIndex: 42,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 9,
    healthScore: 91,
    bounds: [
      [13.1150, 77.5800],
      [13.1180, 77.6150],
      [13.0850, 77.6180],
      [13.0820, 77.5780]
    ]
  },
  {
    id: 'ward-9',
    name: 'Silk Board Junction',
    number: 172,
    zone: 'South East',
    lat: 12.9172,
    lng: 77.6228,
    population: 89000,
    areaKm2: 6.2,
    aqi: 175,
    trafficIndex: 96,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 45,
    healthScore: 62,
    bounds: [
      [12.9280, 77.6120],
      [12.9290, 77.6320],
      [12.9060, 77.6340],
      [12.9050, 77.6110]
    ]
  },
  {
    id: 'ward-10',
    name: 'Jayanagar',
    number: 153,
    zone: 'South',
    lat: 12.9299,
    lng: 77.5826,
    population: 130000,
    areaKm2: 10.1,
    aqi: 78,
    trafficIndex: 51,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 11,
    healthScore: 89,
    bounds: [
      [12.9420, 77.5720],
      [12.9430, 77.5940],
      [12.9170, 77.5950],
      [12.9160, 77.5710]
    ]
  },
  {
    id: 'ward-11',
    name: 'Rajajinagar',
    number: 108,
    zone: 'West',
    lat: 12.9982,
    lng: 77.5530,
    population: 122000,
    areaKm2: 8.9,
    aqi: 98,
    trafficIndex: 62,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 16,
    healthScore: 84,
    bounds: [
      [13.0100, 77.5420],
      [13.0120, 77.5640],
      [12.9860, 77.5650],
      [12.9840, 77.5410]
    ]
  },
  {
    id: 'ward-12',
    name: 'Bellandur',
    number: 150,
    zone: 'Mahadevapura',
    lat: 12.9304,
    lng: 77.6784,
    population: 155000,
    areaKm2: 19.5,
    aqi: 162,
    trafficIndex: 89,
    waterSupplyStatus: 'Critical',
    powerSupplyStatus: 'Stable',
    activeComplaints: 52,
    healthScore: 65,
    bounds: [
      [12.9450, 77.6620],
      [12.9480, 77.6950],
      [12.9150, 77.6980],
      [12.9120, 77.6600]
    ]
  },
  {
    id: 'ward-13',
    name: 'Malleshwaram',
    number: 65,
    zone: 'West',
    lat: 13.0031,
    lng: 77.5643,
    population: 115000,
    areaKm2: 7.2,
    aqi: 82,
    trafficIndex: 58,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 12,
    healthScore: 88,
    bounds: [
      [13.0150, 77.5550],
      [13.0160, 77.5750],
      [12.9920, 77.5760],
      [12.9910, 77.5540]
    ]
  },
  {
    id: 'ward-14',
    name: 'Rajarajeshwari Nagar',
    number: 160,
    zone: 'RR Nagar',
    lat: 12.9255,
    lng: 77.5160,
    population: 138000,
    areaKm2: 15.4,
    aqi: 95,
    trafficIndex: 64,
    waterSupplyStatus: 'Deficit',
    powerSupplyStatus: 'Stable',
    activeComplaints: 24,
    healthScore: 82,
    bounds: [
      [12.9400, 77.5020],
      [12.9420, 77.5300],
      [12.9100, 77.5320],
      [12.9080, 77.5000]
    ]
  },
  {
    id: 'ward-15',
    name: 'Dasarahalli',
    number: 15,
    zone: 'Dasarahalli',
    lat: 13.0418,
    lng: 77.5126,
    population: 142000,
    areaKm2: 14.1,
    aqi: 148,
    trafficIndex: 78,
    waterSupplyStatus: 'Critical',
    powerSupplyStatus: 'Partial Outage',
    activeComplaints: 36,
    healthScore: 70,
    bounds: [
      [13.0550, 77.5000],
      [13.0580, 77.5250],
      [13.0280, 77.5280],
      [13.0250, 77.4980]
    ]
  },
  {
    id: 'ward-16',
    name: 'BTM Layout',
    number: 176,
    zone: 'South',
    lat: 12.9166,
    lng: 77.6101,
    population: 126000,
    areaKm2: 8.4,
    aqi: 125,
    trafficIndex: 84,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 29,
    healthScore: 76,
    bounds: [
      [12.9280, 77.6000],
      [12.9300, 77.6220],
      [12.9050, 77.6240],
      [12.9030, 77.5980]
    ]
  },
  {
    id: 'ward-17',
    name: 'Banashankari',
    number: 180,
    zone: 'South',
    lat: 12.9250,
    lng: 77.5468,
    population: 148000,
    areaKm2: 13.8,
    aqi: 88,
    trafficIndex: 61,
    waterSupplyStatus: 'Optimal',
    powerSupplyStatus: 'Stable',
    activeComplaints: 18,
    healthScore: 85,
    bounds: [
      [12.9380, 77.5350],
      [12.9400, 77.5600],
      [12.9120, 77.5620],
      [12.9100, 77.5330]
    ]
  },
  {
    id: 'ward-18',
    name: 'Marathahalli',
    number: 85,
    zone: 'Mahadevapura',
    lat: 12.9569,
    lng: 77.7011,
    population: 152000,
    areaKm2: 11.6,
    aqi: 152,
    trafficIndex: 93,
    waterSupplyStatus: 'Deficit',
    powerSupplyStatus: 'Stable',
    activeComplaints: 41,
    healthScore: 68,
    bounds: [
      [12.9700, 77.6880],
      [12.9720, 77.7150],
      [12.9440, 77.7180],
      [12.9420, 77.6860]
    ]
  }
];

export const CITY_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Manipal Hospital (Old Airport Rd)',
    type: 'Hospital',
    lat: 12.9582,
    lng: 77.6482,
    ward: 'Indiranagar',
    status: 'Operational',
    capacity: '650 Beds | 42 ICU Available',
    contact: '+91 80 2502 4444'
  },
  {
    id: 'fac-2',
    name: 'Narayana Health City',
    type: 'Hospital',
    lat: 12.8122,
    lng: 77.6912,
    ward: 'Electronic City',
    status: 'Operational',
    capacity: '1000 Beds | 85 ICU Available',
    contact: '+91 80 7122 2222'
  },
  {
    id: 'fac-3',
    name: 'Aster CMI Hospital Hebbal',
    type: 'Hospital',
    lat: 13.0450,
    lng: 77.5920,
    ward: 'Hebbal & ORR',
    status: 'Busy',
    capacity: '500 Beds | 12 ICU Available',
    contact: '+91 80 4342 0100'
  },
  {
    id: 'fac-4',
    name: 'Victoria Hospital (KR Market)',
    type: 'Hospital',
    lat: 12.9630,
    lng: 77.5740,
    ward: 'Jayanagar',
    status: 'Emergency',
    capacity: '800 Beds | 5 ICU Available',
    contact: '+91 80 2670 1150'
  },
  {
    id: 'fac-5',
    name: 'BBMP Central Fire Command Station',
    type: 'Fire Station',
    lat: 12.9710,
    lng: 77.5960,
    ward: 'MG Road & CBD',
    status: 'Operational',
    capacity: '12 Water Tenders | 2 Snorkel Ladders',
    contact: '101 / +91 80 2297 1500'
  },
  {
    id: 'fac-6',
    name: 'Whitefield Fire Substation',
    type: 'Fire Station',
    lat: 12.9730,
    lng: 77.7420,
    ward: 'Whitefield',
    status: 'Operational',
    capacity: '4 Water Tenders',
    contact: '+91 80 2845 2200'
  },
  {
    id: 'fac-7',
    name: 'Koramangala Police Station',
    type: 'Police Station',
    lat: 12.9320,
    lng: 77.6210,
    ward: 'Koramangala',
    status: 'Operational',
    capacity: '18 Patrol Hoysala Vans',
    contact: '112 / +91 80 2294 3460'
  },
  {
    id: 'fac-8',
    name: 'Hebbal Traffic Police Station',
    type: 'Police Station',
    lat: 13.0380,
    lng: 77.5940,
    ward: 'Hebbal & ORR',
    status: 'Busy',
    capacity: '8 Interceptor Patrol Cars',
    contact: '+91 80 2294 3488'
  },
  {
    id: 'fac-9',
    name: 'Namma Metro Majestic Interchange',
    type: 'Metro Station',
    lat: 12.9780,
    lng: 77.5720,
    ward: 'Rajajinagar',
    status: 'Operational',
    capacity: 'Interchange Green & Purple Lines | 180k commuters/day',
    contact: '1800 425 12345'
  },
  {
    id: 'fac-10',
    name: 'Whitefield Metro Terminal (Kadugodi)',
    type: 'Metro Station',
    lat: 12.9880,
    lng: 77.7610,
    ward: 'Whitefield',
    status: 'Operational',
    capacity: 'Purple Line Terminal | 45k commuters/day',
    contact: '+91 80 2296 9000'
  },
  {
    id: 'fac-11',
    name: 'BWSSB TK Halli Cauvery Pumping Station',
    type: 'Water Reservoir',
    lat: 12.9100,
    lng: 77.5600,
    ward: 'Jayanagar',
    status: 'Operational',
    capacity: '1450 MLD Daily Treatment',
    contact: '+91 80 2223 8888'
  },
  {
    id: 'fac-12',
    name: 'BESCOM Hoodi 220kV Master Substation',
    type: 'Power Substation',
    lat: 12.9820,
    lng: 77.7120,
    ward: 'Whitefield',
    status: 'Operational',
    capacity: '400 MVA Substation Load',
    contact: '1912'
  },
  {
    id: 'fac-13',
    name: 'Vidhana Soudha & Secretariat',
    type: 'Government Building',
    lat: 12.9796,
    lng: 77.5907,
    ward: 'MG Road & CBD',
    status: 'Operational',
    capacity: 'State Legislature Command Center',
    contact: '+91 80 2225 3201'
  },
  {
    id: 'fac-14',
    name: 'BBMP Head Office (Corporation Circle)',
    type: 'Government Building',
    lat: 12.9675,
    lng: 77.5878,
    ward: 'MG Road & CBD',
    status: 'Operational',
    capacity: 'BBMP Civic Command Twin Hub',
    contact: '1533'
  },
  {
    id: 'fac-15',
    name: 'Cubbon Park Botanical Reserve',
    type: 'Park',
    lat: 12.9760,
    lng: 77.5930,
    ward: 'MG Road & CBD',
    status: 'Operational',
    capacity: '300 Acres Green Lung Space',
    contact: '+91 80 2286 4208'
  },
  {
    id: 'fac-16',
    name: 'Lalbagh Botanical Garden',
    type: 'Park',
    lat: 12.9507,
    lng: 77.5848,
    ward: 'Jayanagar',
    status: 'Operational',
    capacity: '240 Acres Heritage Garden & Lake',
    contact: '+91 80 2657 1921'
  },
  {
    id: 'fac-17',
    name: 'Indian Institute of Science (IISc Campus)',
    type: 'School',
    lat: 13.0182,
    lng: 77.5681,
    ward: 'Rajajinagar',
    status: 'Operational',
    capacity: '14,000 Students & Researchers',
    contact: '+91 80 2293 2004'
  },
  {
    id: 'fac-18',
    name: 'National Public School (Indiranagar)',
    type: 'School',
    lat: 12.9750,
    lng: 77.6430,
    ward: 'Indiranagar',
    status: 'Operational',
    capacity: '2,200 Students',
    contact: '+91 80 2528 0611'
  },
  {
    id: 'fac-19',
    name: 'Kempegowda Majestic Bus Terminal (BMTC/KSRTC)',
    type: 'Bus Terminal',
    lat: 12.9770,
    lng: 77.5710,
    ward: 'Rajajinagar',
    status: 'Busy',
    capacity: '4,500 Bus Trips / Day | 350k Passengers',
    contact: '080 2248 3777'
  },
  {
    id: 'fac-20',
    name: 'Agara Lake & Wetlands Reserve',
    type: 'Park',
    lat: 12.9210,
    lng: 77.6480,
    ward: 'HSR Layout',
    status: 'Operational',
    capacity: '98 Acres Lake Bio-Reserve',
    contact: '+91 80 2297 5000'
  }
];

export const TRAFFIC_SENSORS: TrafficSensor[] = [
  {
    id: 'ts-1',
    location: 'Central Silk Board Flyover Junction',
    corridor: 'Hosur Road - Outer Ring Road',
    lat: 12.9172,
    lng: 77.6228,
    vehicleCountPerHour: 14200,
    avgSpeedKmvh: 8.5,
    congestionLevel: 'Gridlock',
    signalStatus: 'Automated AI',
    lastUpdated: '1 min ago'
  },
  {
    id: 'ts-2',
    location: 'Marathahalli Innovative Multiplex Junction',
    corridor: 'Outer Ring Road (ORR Tech Belt)',
    lat: 12.9520,
    lng: 77.6980,
    vehicleCountPerHour: 12800,
    avgSpeedKmvh: 11.2,
    congestionLevel: 'Heavy',
    signalStatus: 'Automated AI',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'ts-3',
    location: 'Hebbal Flyover Airport Loop',
    corridor: 'Bellary Road Expressway',
    lat: 13.0358,
    lng: 77.5970,
    vehicleCountPerHour: 15100,
    avgSpeedKmvh: 14.0,
    congestionLevel: 'Heavy',
    signalStatus: 'Automated AI',
    lastUpdated: '1 min ago'
  },
  {
    id: 'ts-4',
    location: 'Trinity Circle Metro Station Signal',
    corridor: 'MG Road - Indiranagar Corridor',
    lat: 12.9720,
    lng: 77.6180,
    vehicleCountPerHour: 8900,
    avgSpeedKmvh: 22.4,
    congestionLevel: 'Moderate',
    signalStatus: 'Automated AI',
    lastUpdated: 'Just now'
  },
  {
    id: 'ts-5',
    location: 'Ecospace Bellandur Gate',
    corridor: 'Outer Ring Road',
    lat: 12.9280,
    lng: 77.6820,
    vehicleCountPerHour: 13900,
    avgSpeedKmvh: 9.8,
    congestionLevel: 'Gridlock',
    signalStatus: 'Manual Control',
    lastUpdated: '3 mins ago'
  },
  {
    id: 'ts-6',
    location: 'Electronic City Toll Plaza Elevated Highway',
    corridor: 'Hosur National Highway 44',
    lat: 12.8520,
    lng: 77.6580,
    vehicleCountPerHour: 7600,
    avgSpeedKmvh: 42.0,
    congestionLevel: 'Low',
    signalStatus: 'Automated AI',
    lastUpdated: 'Just now'
  }
];

export const ACCIDENT_HOTSPOTS: AccidentHotspot[] = [
  {
    id: 'acc-1',
    junction: 'Silk Board Junction Underpass Ramp',
    lat: 12.9172,
    lng: 77.6228,
    totalAccidents2026: 48,
    fatalities: 4,
    riskScore: 'Severe',
    primaryCause: 'Abrupt lane merge & illegal pedestrian crossing near bus stop',
    recommendedMitigation: 'Install automated pedestrian skywalk with guard rails + high-vis LED rumble strips'
  },
  {
    id: 'acc-2',
    junction: 'Hebbal Flyover Airport Ramp Loop B',
    lat: 13.0358,
    lng: 77.5970,
    totalAccidents2026: 39,
    fatalities: 3,
    riskScore: 'Severe',
    primaryCause: 'High speed curve entry by heavy freight vehicles during off-peak hours',
    recommendedMitigation: 'Deploy radar speed enforcement cameras + solar crash barriers'
  },
  {
    id: 'acc-3',
    junction: 'Tin Factory / KR Puram Railway Bridge Curve',
    lat: 12.9920,
    lng: 77.6710,
    totalAccidents2026: 52,
    fatalities: 6,
    riskScore: 'Severe',
    primaryCause: 'Narrow bottleneck merging 6 lanes into 2 under rail bridge',
    recommendedMitigation: 'Underpass widening project & dedicated BMTC bus bay enforcement'
  },
  {
    id: 'acc-4',
    junction: 'Goraguntepalya Junction Ring Road',
    lat: 13.0280,
    lng: 77.5410,
    totalAccidents2026: 31,
    fatalities: 2,
    riskScore: 'High',
    primaryCause: 'Intercity night bus turning movements without signal clearance',
    recommendedMitigation: 'Implement dedicated bus turning signal phase'
  }
];

export const AQI_SENSORS: AQISensor[] = [
  {
    id: 'aqi-1',
    stationName: 'Central Silk Board CPCB',
    ward: 'Silk Board Junction',
    lat: 12.9172,
    lng: 77.6228,
    aqi: 175,
    pm25: 88,
    pm10: 164,
    no2: 52,
    co: 2.1,
    category: 'Poor'
  },
  {
    id: 'aqi-2',
    stationName: 'Hebbal Flyover Air Quality Station',
    ward: 'Hebbal & ORR',
    lat: 13.0358,
    lng: 77.5970,
    aqi: 158,
    pm25: 79,
    pm10: 148,
    no2: 48,
    co: 1.8,
    category: 'Poor'
  },
  {
    id: 'aqi-3',
    stationName: 'Whitefield ITPL Eco Station',
    ward: 'Whitefield',
    lat: 12.9850,
    lng: 77.7350,
    aqi: 142,
    pm25: 68,
    pm10: 128,
    no2: 39,
    co: 1.4,
    category: 'Moderate'
  },
  {
    id: 'aqi-4',
    stationName: 'Indiranagar 100ft Road Station',
    ward: 'Indiranagar',
    lat: 12.9784,
    lng: 77.6408,
    aqi: 92,
    pm25: 38,
    pm10: 74,
    no2: 24,
    co: 0.9,
    category: 'Satisfactory'
  },
  {
    id: 'aqi-5',
    stationName: 'GKVK Yelahanka Green Campus',
    ward: 'Yelahanka',
    lat: 13.0850,
    lng: 77.5850,
    aqi: 58,
    pm25: 21,
    pm10: 45,
    no2: 14,
    co: 0.5,
    category: 'Good'
  }
];

export const CITIZEN_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'cmp-101',
    ticketNo: 'BBMP-2026-8819',
    category: 'Pothole',
    description: 'Deep crater on Outer Ring Road near Bellandur EcoWorld Gate 3 causing two-wheeler skidding',
    ward: 'Bellandur',
    lat: 12.9290,
    lng: 77.6810,
    status: 'In Progress',
    priority: 'High',
    reportedBy: 'Rahul V.',
    reportedAt: '2026-07-23T14:30:00Z',
    estimatedResolution: '24 Hours',
    assignedDept: 'BBMP Major Roads Division'
  },
  {
    id: 'cmp-102',
    ticketNo: 'BWSSB-2026-4412',
    category: 'Water Leakage',
    description: 'Main Cauvery supply line 600mm pipe burst spraying water on 80ft Road Koramangala 4th Block',
    ward: 'Koramangala',
    lat: 12.9340,
    lng: 77.6280,
    status: 'Pending',
    priority: 'Emergency',
    reportedBy: 'Sunita M.',
    reportedAt: '2026-07-23T18:15:00Z',
    estimatedResolution: '6 Hours',
    assignedDept: 'BWSSB Water Supply Division'
  },
  {
    id: 'cmp-103',
    ticketNo: 'BESCOM-2026-9021',
    category: 'Power Outage',
    description: 'Transformer spark and power disruption affecting 300 residential homes in Whitefield Phase 2',
    ward: 'Whitefield',
    lat: 12.9650,
    lng: 77.7420,
    status: 'In Progress',
    priority: 'High',
    reportedBy: 'Karthik S.',
    reportedAt: '2026-07-23T19:40:00Z',
    estimatedResolution: '2 Hours',
    assignedDept: 'BESCOM Hoodi Subdivision'
  },
  {
    id: 'cmp-104',
    ticketNo: 'BBMP-2026-1104',
    category: 'Garbage Dump',
    description: 'Uncollected plastic dump near Indiranagar Metro Station Pillar 84 obstructing footpath',
    ward: 'Indiranagar',
    lat: 12.9790,
    lng: 77.6390,
    status: 'Resolved',
    priority: 'Medium',
    reportedBy: 'Priya K.',
    reportedAt: '2026-07-22T09:00:00Z',
    estimatedResolution: 'Completed',
    assignedDept: 'BBMP Solid Waste Management'
  }
];

export const EMERGENCY_DISPATCHES: EmergencyDispatch[] = [
  {
    id: 'disp-1',
    type: 'Traffic Collision',
    location: 'Silk Board Underpass Ramp Southbound',
    lat: 12.9172,
    lng: 77.6228,
    reportedTime: '12 mins ago',
    assignedUnit: '112 Hoysala Patrol - 14 & Ambulance BLS-09',
    status: 'En Route',
    etaMinutes: 3
  },
  {
    id: 'disp-2',
    type: 'Fire Alert',
    location: 'Hoodi Industrial Area Warehouse 4B',
    lat: 12.9810,
    lng: 77.7200,
    reportedTime: '25 mins ago',
    assignedUnit: 'Whitefield Fire Tender 1 & Tender 2',
    status: 'On Scene',
    etaMinutes: 0
  },
  {
    id: 'disp-3',
    type: 'Medical Incident',
    location: 'Hebbal Railway Bridge Platform 2',
    lat: 13.0360,
    lng: 77.5950,
    reportedTime: '5 mins ago',
    assignedUnit: 'Aster CMI Cardiac ALS Ambulance',
    status: 'Dispatched',
    etaMinutes: 5
  }
];

export const AI_PREDICTIONS: AIPrediction[] = [
  {
    metric: 'Outer Ring Road Peak Traffic Congestion Index',
    timeframe: 'Tomorrow 08:30 - 10:30 AM',
    currentValue: '78 / 100',
    predictedValue: '94 / 100 (Severe)',
    confidence: 93,
    keyFactors: ['Metro construction lane narrowing at Bellandur', 'Heavy rain forecast (18mm)', 'Friday tech park exit surge'],
    recommendedAction: 'Pre-deploy 12 traffic constables at Ecospace gate; signal timing automated wave extension (+35s green corridor)',
    algorithmUsed: 'XGBoost Spatio-Temporal Model v3.2'
  },
  {
    metric: 'Whitefield Ward AQI PM2.5 Surge',
    timeframe: 'Next 24 Hours',
    currentValue: '142 AQI',
    predictedValue: '185 AQI (Unhealthy)',
    confidence: 89,
    keyFactors: ['Thermal inversion at dusk', 'Construction dust off Hoodi road', 'Low wind speed (< 4 km/h)'],
    recommendedAction: 'Deploy BBMP anti-smog water cannons along ITPL Main Road from 06:00 AM to 10:00 AM',
    algorithmUsed: 'LightGBM Multi-Feature Climate Predictor'
  },
  {
    metric: 'Bellandur - Sarjapur Zone Water Deficit Risk',
    timeframe: 'Upcoming Weekend',
    currentValue: '12.4 MLD Deficit',
    predictedValue: '18.9 MLD Deficit',
    confidence: 91,
    keyFactors: ['Pumping station maintenance at TK Halli Stage IV', 'Groundwater table drop in borewell cluster 7'],
    recommendedAction: 'Re-route 6.5 MLD emergency Cauvery allocation from Central Supply & dispatch 40 BWSSB tanker trucks',
    algorithmUsed: 'CatBoost Hydro-Demand Forecasting Neural Net'
  },
  {
    metric: 'BESCOM Hoodi Grid Peak Load Overload',
    timeframe: 'Today 18:00 - 21:00 PM',
    currentValue: '340 MW',
    predictedValue: '392 MW (98% Transformer Cap)',
    confidence: 95,
    keyFactors: ['Commercial AC load spike', 'EV fast-charging station cluster active'],
    recommendedAction: 'Activate 35 MW battery energy storage (BESS) reserve and initiate industrial load shifting incentive',
    algorithmUsed: 'LSTM Short-Term Load Forecaster (PyTorch)'
  }
];

export const CITY_HEALTH_SCORE: CityHealthScore = {
  overallScore: 84,
  trafficSubscore: 72,
  environmentSubscore: 81,
  waterSubscore: 79,
  powerSubscore: 92,
  emergencyResponseSubscore: 88,
  citizenSatisfactionSubscore: 86,
  lastCalculated: '2026-07-23 21:35:00 IST'
};
