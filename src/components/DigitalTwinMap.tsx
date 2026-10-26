import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Car, 
  AlertTriangle, 
  Wind, 
  Hospital, 
  Siren, 
  Flame, 
  Bus, 
  Zap, 
  Droplets, 
  MessageSquare, 
  Play, 
  Pause, 
  RotateCcw,
  Navigation,
  Check,
  School,
  Trees,
  Landmark,
  Maximize2,
  Minimize2,
  Radio,
  Search,
  Compass,
  Crosshair,
  Filter,
  Clock,
  Target,
  Activity,
  X
} from 'lucide-react';

import { Ward, Facility, TrafficSensor, AccidentHotspot, AQISensor, CitizenComplaint, MapLayerConfig } from '../types';
import { 
  METRO_NETWORK_LINES, 
  ROAD_NETWORK_LINES, 
  POWER_GRID_LINES, 
  WATER_PIPELINE_LINES, 
  WEATHER_ZONES 
} from '../data/gisLayersData';

interface DigitalTwinMapProps {
  wards: Ward[];
  facilities: Facility[];
  trafficSensors: TrafficSensor[];
  accidentHotspots: AccidentHotspot[];
  aqiSensors: AQISensor[];
  complaints: CitizenComplaint[];
  selectedWard: string;
  onSelectWard: (ward: string) => void;
  isDarkMode: boolean;
}

const DEFAULT_LAYERS: MapLayerConfig = {
  wardBoundaries: true,
  roads: true,
  traffic: true,
  accidents: true,
  aqi: true,
  weather: false,
  hospitals: true,
  police: true,
  fireStations: true,
  schools: false,
  parks: true,
  govBuildings: true,
  metro: true,
  busStops: false,
  electricity: false,
  water: false,
  complaints: true,
  heatmaps: true,
  bufferZone: false
};

// Haversine Distance Helper in Km
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  wards,
  facilities,
  trafficSensors,
  accidentHotspots,
  aqiSensors,
  complaints,
  selectedWard,
  onSelectWard,
  isDarkMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer State
  const [layers, setLayers] = useState<MapLayerConfig>(DEFAULT_LAYERS);
  const [activeTab, setActiveTab] = useState<'layers' | 'route' | 'buffer' | 'query'>('layers');
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  
  // Controls State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLivePolling, setIsLivePolling] = useState<boolean>(true);
  const [lastLivePing, setLastLivePing] = useState<string>('Just now');

  // Timeline State
  const [timeHour, setTimeHour] = useState<number>(18); // Default 18:00 Peak Hour
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Route Analysis State
  const [routeOrigin, setRouteOrigin] = useState<string>('Silk Board Junction');
  const [routeDestination, setRouteDestination] = useState<string>('Manipal Hospital (Old Airport Rd)');
  const [activeRoutePath, setActiveRoutePath] = useState<[number, number][] | null>(null);
  const [routeResult, setRouteResult] = useState<{ distanceKm: number; etaMins: number; status: string } | null>(null);

  // Buffer & Proximity Analysis State
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(3);
  const [nearestTargetType, setNearestTargetType] = useState<'Hospital' | 'Police Station' | 'Fire Station'>('Hospital');
  const [nearestResult, setNearestResult] = useState<{ facilityName: string; distanceKm: number; ward: string; phone: string } | null>(null);
  const [bufferStats, setBufferStats] = useState<{ facilitiesCount: number; complaintsCount: number; accidentsCount: number } | null>(null);

  // Spatial Query Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Live Polling Timer Simulation
  useEffect(() => {
    let interval: any;
    if (isLivePolling) {
      interval = setInterval(() => {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastLivePing(timeStr);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLivePolling]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapRef.current;
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      const tileUrl = isDarkMode
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
    }
  }, [isDarkMode]);

  // Center / Fly Map to Selected Ward when selectedWard changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const locState = (location as any)?.state;
    const targetWardName = locState?.wardName || selectedWard;
    if (targetWardName) {
      const wardObj = wards.find(w => 
        w.name.toLowerCase() === targetWardName.toLowerCase() ||
        w.id.toLowerCase() === targetWardName.toLowerCase() ||
        `ward-${w.number}`.toLowerCase() === targetWardName.toLowerCase() ||
        w.name.toLowerCase().includes(targetWardName.toLowerCase()) ||
        targetWardName.toLowerCase().includes(w.name.toLowerCase())
      );

      if (wardObj) {
        map.flyTo([wardObj.lat, wardObj.lng], 14, { duration: 1.2 });
      }
    }
  }, [selectedWard, location, wards]);

  // Main Map Render Effect (Wards, Layers, Route Lines, Buffer Circles)
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Temporal multiplier for Traffic & AQI based on selected timeline hour
    let trafficMultiplier = 1.0;
    if ((timeHour >= 8 && timeHour <= 10) || (timeHour >= 17 && timeHour <= 20)) {
      trafficMultiplier = 1.35; // Rush Hour
    } else if (timeHour >= 0 && timeHour <= 5) {
      trafficMultiplier = 0.45; // Off-Peak Night
    }

    const currentWardObj = wards.find(w => w.name === selectedWard) || wards[0];

    // 1. Ward Polygon Boundaries
    if (layers.wardBoundaries) {
      wards.forEach((ward) => {
        const isSelected = selectedWard === ward.name;
        const adjustedTraffic = Math.min(100, Math.round(ward.trafficIndex * trafficMultiplier));
        const color = adjustedTraffic > 85 ? '#DC2626' : adjustedTraffic > 70 ? '#F59E0B' : '#2563EB';

        const polygon = L.polygon(ward.bounds, {
          color: isSelected ? '#3B82F6' : color,
          weight: isSelected ? 3.5 : 1.5,
          fillColor: color,
          fillOpacity: isSelected ? 0.35 : 0.12
        });

        polygon.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #2563EB;">BBMP Ward ${ward.number}</div>
            <h4 style="margin: 2px 0 4px 0; font-weight: 700; color: #0F172A;">${ward.name} Ward</h4>
            <p style="margin: 0; font-size: 11px; color: #475569;">Zone: <b>${ward.zone}</b> | Pop: <b>${(ward.population / 1000).toFixed(0)}k</b></p>
            <hr style="margin: 6px 0; border: none; border-top: 1px solid #E2E8F0;" />
            <div style="font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div>AQI Level: <b style="color: ${ward.aqi > 150 ? '#DC2626' : '#F59E0B'}">${ward.aqi} AQI</b></div>
              <div>Traffic: <b style="color: ${adjustedTraffic > 80 ? '#DC2626' : '#16A34A'}">${adjustedTraffic}/100</b></div>
              <div>Water: <b>${ward.waterSupplyStatus}</b></div>
              <div>Health: <b style="color: #2563EB">${ward.healthScore}/100</b></div>
            </div>
          </div>
        `);

        polygon.on('click', () => {
          onSelectWard(ward.name);
        });

        layerGroup.addLayer(polygon);
      });
    }

    // 2. Spatial Buffer Radius Overlay
    if (layers.bufferZone && currentWardObj) {
      const bufferCircle = L.circle([currentWardObj.lat, currentWardObj.lng], {
        radius: bufferRadiusKm * 1000,
        color: '#8B5CF6',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#A78BFA',
        fillOpacity: 0.15
      });

      bufferCircle.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 2px 0; font-weight: 700; color: #6D28D9;">${bufferRadiusKm} km GIS Spatial Buffer</h4>
          <p style="margin: 0; font-size: 11px; color: #4C1D95;">Center: <b>${currentWardObj.name} Ward</b></p>
        </div>
      `);

      layerGroup.addLayer(bufferCircle);
    }

    // 3. Metro Line Tracks (GeoJSON Polylines)
    if (layers.metro) {
      METRO_NETWORK_LINES.forEach((line) => {
        const polyline = L.polyline(line.coordinates, {
          color: line.color,
          weight: line.weight,
          opacity: 0.9
        });
        polyline.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${line.color}; font-weight: 800;">NAMMA METRO TRACK</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${line.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #475569;">${line.details}</p>
          </div>
        `);
        layerGroup.addLayer(polyline);
      });
    }

    // 4. Road Network Major Corridors
    if (layers.roads) {
      ROAD_NETWORK_LINES.forEach((road) => {
        const polyline = L.polyline(road.coordinates, {
          color: road.color,
          weight: road.weight,
          opacity: 0.85
        });
        polyline.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #2563EB;">ARTERIAL ROAD CORRIDOR</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${road.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #475569;">${road.details}</p>
          </div>
        `);
        layerGroup.addLayer(polyline);
      });
    }

    // 5. Electricity High Voltage Grid Lines
    if (layers.electricity) {
      POWER_GRID_LINES.forEach((grid) => {
        const polyline = L.polyline(grid.coordinates, {
          color: grid.color,
          weight: grid.weight,
          dashArray: grid.dashArray,
          opacity: 0.9
        });
        polyline.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #D97706;">BESCOM POWER GRID</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${grid.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #475569;">${grid.details}</p>
          </div>
        `);
        layerGroup.addLayer(polyline);
      });
    }

    // 6. Water Supply Trunk Main Pipelines
    if (layers.water) {
      WATER_PIPELINE_LINES.forEach((pipe) => {
        const polyline = L.polyline(pipe.coordinates, {
          color: pipe.color,
          weight: pipe.weight,
          dashArray: pipe.dashArray,
          opacity: 0.9
        });
        polyline.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #0891B2;">BWSSB CAUVERY TRUNK MAIN</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${pipe.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #475569;">${pipe.details}</p>
          </div>
        `);
        layerGroup.addLayer(polyline);
      });
    }

    // 7. Weather Radar Circles
    if (layers.weather) {
      WEATHER_ZONES.forEach((wx) => {
        const circle = L.circle([wx.lat, wx.lng], {
          radius: wx.radiusMeters,
          color: '#38BDF8',
          weight: 1.5,
          fillColor: '#0284C7',
          fillOpacity: 0.25
        });

        circle.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #0284C7;">RADAR WEATHER TELEMETRY</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${wx.name}</h4>
            <div style="font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px;">
              <div>Condition: <b>${wx.condition}</b></div>
              <div>Temp: <b>${wx.tempC} °C</b></div>
              <div>Rainfall: <b>${wx.rainfallMm} mm/h</b></div>
              <div>Wind: <b>${wx.windSpeedKmh} km/h</b></div>
            </div>
          </div>
        `);
        layerGroup.addLayer(circle);
      });
    }

    // 8. Traffic Sensors & Congestion Circles
    if (layers.traffic) {
      trafficSensors.forEach((sensor) => {
        const simSpeed = Math.max(5, Math.round(sensor.avgSpeedKmvh / trafficMultiplier));
        const simCongestion = simSpeed < 10 ? 'Gridlock' : simSpeed < 20 ? 'Heavy' : 'Moderate';
        const color = simCongestion === 'Gridlock' ? '#DC2626' : simCongestion === 'Heavy' ? '#F59E0B' : '#16A34A';

        const circle = L.circleMarker([sensor.lat, sensor.lng], {
          radius: simCongestion === 'Gridlock' ? 12 : 8,
          color: '#ffffff',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.85
        });

        circle.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748B;">Traffic Telemetry</div>
            <h4 style="margin: 2px 0; font-weight: 700; color: #0F172A;">${sensor.location}</h4>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">${sensor.corridor}</p>
            <div style="font-size: 11px; background: #F8FAFC; padding: 6px; border-radius: 8px;">
              <div>Avg Speed: <b style="color: ${simSpeed < 12 ? '#DC2626' : '#16A34A'}">${simSpeed} km/h</b></div>
              <div>Flow Rate: <b>${Math.round(sensor.vehicleCountPerHour * trafficMultiplier)} vehicles/hr</b></div>
              <div>Congestion: <span style="font-weight: 700; color: ${color}">${simCongestion}</span></div>
            </div>
          </div>
        `);

        layerGroup.addLayer(circle);
      });
    }

    // 9. Accident Hotspots
    if (layers.accidents) {
      accidentHotspots.forEach((hotspot) => {
        const icon = L.divIcon({
          className: 'custom-accident-marker',
          html: `<div style="background-color: #DC2626; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; box-shadow: 0 0 8px rgba(220,38,38,0.8);">!</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        const marker = L.marker([hotspot.lat, hotspot.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px; max-width: 220px;">
            <span style="background: #FEE2E2; color: #991B1B; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px;">ACCIDENT BLACKSPOT</span>
            <h4 style="margin: 4px 0 2px 0; font-weight: 700;">${hotspot.junction}</h4>
            <p style="font-size: 11px; color: #475569; margin-bottom: 6px;">Total Collisions 2026: <b>${hotspot.totalAccidents2026}</b> | Fatalities: <b>${hotspot.fatalities}</b></p>
            <p style="font-size: 10px; color: #7F1D1D; background: #FFF1F1; padding: 4px; border-radius: 4px;">${hotspot.recommendedMitigation}</p>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 10. AQI Air Quality Sensors
    if (layers.aqi) {
      aqiSensors.forEach((sensor) => {
        const color = sensor.aqi > 150 ? '#DC2626' : sensor.aqi > 100 ? '#F59E0B' : '#16A34A';
        const icon = L.divIcon({
          className: 'custom-aqi-marker',
          html: `<div style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${sensor.aqi} AQI</div>`,
          iconSize: [50, 20]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <h4 style="margin: 0; font-weight: 700;">${sensor.stationName}</h4>
            <div style="font-size: 11px; margin-top: 4px;">
              <div>Category: <b style="color: ${color}">${sensor.category}</b></div>
              <div>PM2.5: <b>${sensor.pm25} µg/m³</b> | PM10: <b>${sensor.pm10} µg/m³</b></div>
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 11. Facilities (Hospitals, Police, Fire, Schools, Parks, Gov Buildings, Metro, Bus, Water, Power)
    facilities.forEach((fac) => {
      // Search filter if provided
      if (searchQuery && !fac.name.toLowerCase().includes(searchQuery.toLowerCase()) && !fac.ward.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      let shouldShow = false;
      let badgeBg = '#2563EB';
      let symbol = 'H';

      if (fac.type === 'Hospital' && layers.hospitals) {
        shouldShow = true; badgeBg = '#059669'; symbol = '+';
      } else if (fac.type === 'Police Station' && layers.police) {
        shouldShow = true; badgeBg = '#1E40AF'; symbol = 'P';
      } else if (fac.type === 'Fire Station' && layers.fireStations) {
        shouldShow = true; badgeBg = '#DC2626'; symbol = 'F';
      } else if (fac.type === 'Metro Station' && layers.metro) {
        shouldShow = true; badgeBg = '#7C3AED'; symbol = 'M';
      } else if (fac.type === 'School' && layers.schools) {
        shouldShow = true; badgeBg = '#2563EB'; symbol = 'S';
      } else if (fac.type === 'Park' && layers.parks) {
        shouldShow = true; badgeBg = '#16A34A'; symbol = 'T';
      } else if (fac.type === 'Government Building' && layers.govBuildings) {
        shouldShow = true; badgeBg = '#4F46E5'; symbol = 'G';
      } else if (fac.type === 'Bus Terminal' && layers.busStops) {
        shouldShow = true; badgeBg = '#0284C7'; symbol = 'B';
      } else if (fac.type === 'Water Reservoir' && layers.water) {
        shouldShow = true; badgeBg = '#06B6D4'; symbol = 'W';
      } else if (fac.type === 'Power Substation' && layers.electricity) {
        shouldShow = true; badgeBg = '#D97706'; symbol = 'E';
      }

      if (shouldShow) {
        const icon = L.divIcon({
          className: 'custom-facility-icon',
          html: `<div style="background-color: ${badgeBg}; color: white; width: 22px; height: 22px; border-radius: 6px; font-weight: 800; font-size: 11px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">${symbol}</div>`,
          iconSize: [22, 22]
        });

        const marker = L.marker([fac.lat, fac.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${badgeBg};">${fac.type.toUpperCase()}</span>
            <h4 style="margin: 2px 0; font-weight: 700; color: #0F172A;">${fac.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 11px; color: #475569;">${fac.capacity}</p>
            <p style="margin: 0; font-size: 10px; color: #64748B;">Ward: <b>${fac.ward}</b> | Contact: <b>${fac.contact}</b></p>
          </div>
        `);
        layerGroup.addLayer(marker);
      }
    });

    // 12. Citizen Complaints
    if (layers.complaints) {
      complaints.forEach((cmp) => {
        const icon = L.divIcon({
          className: 'custom-complaint-icon',
          html: `<div style="background-color: #EA580C; width: 14px; height: 14px; border-radius: 3px; border: 2px solid white; box-shadow: 0 0 6px rgba(234,88,12,0.8);"></div>`,
          iconSize: [14, 14]
        });

        const marker = L.marker([cmp.lat, cmp.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px; max-width: 200px;">
            <span style="font-size: 10px; font-weight: 700; color: #EA580C;">TICKET ${cmp.ticketNo}</span>
            <h4 style="margin: 2px 0; font-weight: 700;">${cmp.category}</h4>
            <p style="font-size: 11px; color: #475569; margin-bottom: 4px;">${cmp.description}</p>
            <span style="font-size: 10px; background: #FFEDD5; color: #C2410C; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Status: ${cmp.status}</span>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 13. Active Route Line Overlay
    if (activeRoutePath && activeRoutePath.length > 0) {
      const routePolyline = L.polyline(activeRoutePath, {
        color: '#2563EB',
        weight: 6,
        opacity: 0.95
      });

      // Start Waypoint
      const startMarker = L.circleMarker(activeRoutePath[0], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#16A34A',
        fillOpacity: 1
      });

      // End Waypoint
      const endMarker = L.circleMarker(activeRoutePath[activeRoutePath.length - 1], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#DC2626',
        fillOpacity: 1
      });

      layerGroup.addLayer(routePolyline);
      layerGroup.addLayer(startMarker);
      layerGroup.addLayer(endMarker);
    }

  }, [wards, facilities, trafficSensors, accidentHotspots, aqiSensors, complaints, layers, selectedWard, timeHour, bufferRadiusKm, activeRoutePath, searchQuery]);

  // Timeline Animation Simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimeHour((prev) => (prev >= 23 ? 0 : prev + 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Handle Route Calculation
  const handleCalculateRoute = () => {
    // Generate route coordinates from origin to destination
    const p1: [number, number] = [12.9172, 77.6228]; // Silk Board
    const p2: [number, number] = [12.9352, 77.6245]; // Koramangala
    const p3: [number, number] = [12.9582, 77.6482]; // Manipal Hosp

    setActiveRoutePath([p1, p2, p3]);

    // Zoom map to route bounds
    if (mapRef.current) {
      mapRef.current.fitBounds(L.latLngBounds([p1, p3]), { padding: [40, 40] });
    }

    setRouteResult({
      distanceKm: 14.2,
      etaMins: 24,
      status: 'Emergency Green Corridor Priority Wave Activated. All signals overridden.'
    });
  };

  // Handle Nearest Facility Calculation
  const handleFindNearest = () => {
    const currentWardObj = wards.find(w => w.name === selectedWard) || wards[0];
    const targetFacilities = facilities.filter(f => f.type === nearestTargetType);

    if (targetFacilities.length === 0) return;

    let closest: Facility | null = null;
    let minDistance = Infinity;

    targetFacilities.forEach(f => {
      const dist = getHaversineDistanceKm(currentWardObj.lat, currentWardObj.lng, f.lat, f.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = f;
      }
    });

    if (closest) {
      const target: Facility = closest;
      setNearestResult({
        facilityName: target.name,
        distanceKm: minDistance,
        ward: target.ward,
        phone: target.contact
      });

      // Plot line on map
      if (layerGroupRef.current) {
        const rayLine = L.polyline([
          [currentWardObj.lat, currentWardObj.lng],
          [target.lat, target.lng]
        ], {
          color: '#EC4899',
          weight: 3,
          dashArray: '5, 10'
        });
        layerGroupRef.current.addLayer(rayLine);
      }
    }
  };

  // Handle Spatial Buffer Analysis
  const handleRunBufferAnalysis = () => {
    const currentWardObj = wards.find(w => w.name === selectedWard) || wards[0];
    
    // Count objects within buffer radius
    let facCount = 0;
    facilities.forEach(f => {
      if (getHaversineDistanceKm(currentWardObj.lat, currentWardObj.lng, f.lat, f.lng) <= bufferRadiusKm) facCount++;
    });

    let cmpCount = 0;
    complaints.forEach(c => {
      if (getHaversineDistanceKm(currentWardObj.lat, currentWardObj.lng, c.lat, c.lng) <= bufferRadiusKm) cmpCount++;
    });

    let accCount = 0;
    accidentHotspots.forEach(a => {
      if (getHaversineDistanceKm(currentWardObj.lat, currentWardObj.lng, a.lat, a.lng) <= bufferRadiusKm) accCount++;
    });

    setLayers(prev => ({ ...prev, bufferZone: true }));
    setBufferStats({ facilitiesCount: facCount, complaintsCount: cmpCount, accidentsCount: accCount });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-900 overflow-hidden font-sans">
      
      {/* Main Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Floating Bar: Drawer Toggle & Mode Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>GIS Control Panel</span>
        </button>

        {/* Selected Ward Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Ward: <b className="text-blue-600 dark:text-blue-400">{selectedWard}</b></span>
        </div>

        {/* Live Polling Status Indicator */}
        <button
          onClick={() => setIsLivePolling(!isLivePolling)}
          className={`flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold ${isLivePolling ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
        >
          <Radio className={`w-3.5 h-3.5 ${isLivePolling ? 'animate-pulse text-emerald-500' : ''}`} />
          <span className="hidden sm:inline">{isLivePolling ? `LIVE (${lastLivePing})` : 'PAUSED'}</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Fullscreen Map"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Slide-out GIS Sidebar Control Drawer (Left Side) */}
      {showDrawer && (
        <div className="absolute top-16 left-4 z-20 w-80 sm:w-88 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 max-h-[calc(100vh-10rem)] overflow-y-auto animate-in fade-in slide-in-from-left-2">
          
          {/* Header & Tabs Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Digital Twin GIS Engine
            </span>
            <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-3 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('layers')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'layers' ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Layers
            </button>
            <button
              onClick={() => setActiveTab('route')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'route' ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Route
            </button>
            <button
              onClick={() => setActiveTab('buffer')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'buffer' ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Proximity
            </button>
          </div>

          {/* TAB 1: GIS LAYER VISIBILITY & SEARCH */}
          {activeTab === 'layers' && (
            <div className="space-y-3">
              {/* Search Spatial Filter Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter facilities, wards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Multi-category Layer Checkbox List */}
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {[
                  { key: 'wardBoundaries', label: 'Ward Boundaries', icon: MapPin, color: 'text-blue-500' },
                  { key: 'roads', label: 'Arterial Road Network', icon: Navigation, color: 'text-slate-500' },
                  { key: 'traffic', label: 'Traffic Speed & Flow', icon: Car, color: 'text-amber-500' },
                  { key: 'accidents', label: 'Accident Blackspots', icon: AlertTriangle, color: 'text-red-500' },
                  { key: 'aqi', label: 'Air Quality Stations', icon: Wind, color: 'text-emerald-500' },
                  { key: 'weather', label: 'Weather & Radar Cell', icon: Wind, color: 'text-sky-400' },
                  { key: 'hospitals', label: 'Hospitals & ICU Beds', icon: Hospital, color: 'text-emerald-600' },
                  { key: 'police', label: 'Police Stations', icon: Siren, color: 'text-blue-600' },
                  { key: 'fireStations', label: 'Fire Substations', icon: Flame, color: 'text-red-600' },
                  { key: 'schools', label: 'Educational Institutes', icon: School, color: 'text-indigo-500' },
                  { key: 'parks', label: 'Parks & Lake Reserves', icon: Trees, color: 'text-green-600' },
                  { key: 'govBuildings', label: 'Government Buildings', icon: Landmark, color: 'text-purple-600' },
                  { key: 'metro', label: 'Namma Metro Lines', icon: Bus, color: 'text-purple-500' },
                  { key: 'busStops', label: 'BMTC Bus Terminals', icon: Bus, color: 'text-cyan-600' },
                  { key: 'electricity', label: 'BESCOM Power Grid', icon: Zap, color: 'text-amber-400' },
                  { key: 'water', label: 'BWSSB Water Trunk', icon: Droplets, color: 'text-cyan-500' },
                  { key: 'complaints', label: 'Citizen Issues', icon: MessageSquare, color: 'text-orange-500' }
                ].map(({ key, label, icon: Icon, color }) => {
                  const isChecked = (layers as any)[key];
                  return (
                    <label
                      key={key}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                        <span>{label}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setLayers({ ...layers, [key]: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ROUTE ANALYSIS & GREEN CORRIDOR */}
          {activeTab === 'route' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Start Origin:</label>
                <input
                  type="text"
                  value={routeOrigin}
                  onChange={(e) => setRouteOrigin(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Destination Facility:</label>
                <input
                  type="text"
                  value={routeDestination}
                  onChange={(e) => setRouteDestination(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                />
              </div>

              <button
                onClick={handleCalculateRoute}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5" /> Calculate Priority Corridor
              </button>

              {routeResult && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl mt-2 animate-in fade-in space-y-1">
                  <div className="flex items-center justify-between text-blue-900 dark:text-blue-200 font-bold">
                    <span>ETA: {routeResult.etaMins} Mins</span>
                    <span>Distance: {routeResult.distanceKm} km</span>
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-snug">{routeResult.status}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BUFFER & PROXIMITY ANALYSIS */}
          {activeTab === 'buffer' && (
            <div className="space-y-3 text-xs">
              
              {/* Buffer Radius Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Spatial Buffer Radius:</label>
                  <span className="font-bold text-blue-600">{bufferRadiusKm} km</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 3, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setBufferRadiusKm(r)}
                      className={`py-1 rounded-lg border font-bold text-xs ${bufferRadiusKm === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRunBufferAnalysis}
                  className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" /> Draw Spatial Buffer
                </button>
              </div>

              {bufferStats && (
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-950 dark:text-purple-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-600">Buffer Summary ({selectedWard})</span>
                  <div className="grid grid-cols-3 gap-1 text-center font-bold text-xs pt-1">
                    <div className="bg-white/60 dark:bg-purple-900/40 p-1.5 rounded-lg">
                      <div className="text-purple-700 dark:text-purple-300">{bufferStats.facilitiesCount}</div>
                      <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Facilities</div>
                    </div>
                    <div className="bg-white/60 dark:bg-purple-900/40 p-1.5 rounded-lg">
                      <div className="text-orange-600 dark:text-orange-400">{bufferStats.complaintsCount}</div>
                      <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Issues</div>
                    </div>
                    <div className="bg-white/60 dark:bg-purple-900/40 p-1.5 rounded-lg">
                      <div className="text-red-600 dark:text-red-400">{bufferStats.accidentsCount}</div>
                      <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Blackspots</div>
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-slate-200 dark:border-slate-800 my-2" />

              {/* Nearest Facility Finder */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Find Nearest Emergency Unit:</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={nearestTargetType}
                    onChange={(e: any) => setNearestTargetType(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Hospital">Hospital / ICU</option>
                    <option value="Police Station">Police Station</option>
                    <option value="Fire Station">Fire Substation</option>
                  </select>
                  <button
                    onClick={handleFindNearest}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Find
                  </button>
                </div>

                {nearestResult && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl mt-2 text-emerald-950 dark:text-emerald-200">
                    <div className="text-[10px] uppercase font-bold text-emerald-600">Closest Facility Located</div>
                    <div className="font-bold text-xs mt-0.5">{nearestResult.facilityName}</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 flex justify-between">
                      <span>Proximity: <b>{nearestResult.distanceKm} km</b></span>
                      <span>Ward: <b>{nearestResult.ward}</b></span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Emergency Tel: <b>{nearestResult.phone}</b></div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Bottom Floating Temporal Timeline Slider */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-3xl bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors"
              title={isPlayingTimeline ? "Pause Simulation" : "Play Time Simulation"}
            >
              {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setTimeHour(18); setIsPlayingTimeline(false); }}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
              title="Reset Time"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white ml-2">
              Time Simulation: <span className="font-mono text-blue-600 dark:text-blue-400">{timeHour < 10 ? `0${timeHour}` : timeHour}:00 IST</span>
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {timeHour >= 8 && timeHour <= 10 ? 'Morning Peak Rush Hour' : timeHour >= 17 && timeHour <= 20 ? 'Evening Peak Rush Hour' : 'Off-Peak Fluid Traffic'}
          </span>
        </div>

        {/* Timeline Slider Range */}
        <input
          type="range"
          min="0"
          max="23"
          value={timeHour}
          onChange={(e) => setTimeHour(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

    </div>
  );
};

export default DigitalTwinMap;
