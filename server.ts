import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { db } from "./server/db";
import { MLEngineService } from "./server/mlEngine";
import { CITY_AI_AGENTS, CITY_RAG_KNOWLEDGE_BASE, processAgentTask } from "./server/aiAgents";

import { generateReportFile } from "./server/exportService";

dotenv.config();

const PORT = 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health Check
  app.get(["/api/health", "/api/v1/health"], (req, res) => {
    res.json({ 
      status: "ok", 
      app: "SmartCity360", 
      city: "Bengaluru", 
      version: "v4.2.1-stable",
      timestamp: new Date().toISOString() 
    });
  });

  // Auth Endpoints
  app.post(["/api/auth/login", "/api/v1/auth/login"], (req, res) => {
    const { email, password, role } = req.body;
    const user = db.users.find(u => u.email === email || u.role === role) || db.users[0];
    const token = `jwt_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log audit event
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user.name,
      role: user.role,
      action: 'USER_LOGIN_SUCCESS',
      targetModule: 'Auth System',
      status: 'SUCCESS',
      ipAddress: req.ip || '10.240.0.1'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role || user.role,
        department: user.department
      }
    });
  });

  app.get(["/api/auth/me", "/api/v1/auth/me"], (req, res) => {
    res.json({ user: db.users[0] });
  });

  // City Overview
  app.get(["/api/city/overview", "/api/v1/city/overview"], (req, res) => {
    res.json({
      healthScore: db.healthScore,
      summary: "Bengaluru Smart City Operations running at 84/100 Health Index across 12 primary wards. Automated signal green wave active on Outer Ring Road corridor."
    });
  });

  // Wards
  app.get(["/api/wards", "/api/v1/wards"], (req, res) => {
    res.json(db.wards);
  });

  app.get(["/api/wards/:id", "/api/v1/wards/:id"], (req, res) => {
    const ward = db.wards.find(w => w.id === req.params.id || w.name.toLowerCase() === req.params.id.toLowerCase());
    if (!ward) return res.status(404).json({ error: 'Ward not found' });
    res.json(ward);
  });

  // Facilities / GIS Layers
  app.get(["/api/facilities", "/api/v1/facilities"], (req, res) => {
    res.json(db.facilities);
  });

  app.get(["/api/gis/layers", "/api/v1/gis/layers"], (req, res) => {
    res.json({
      wards: db.wards,
      facilities: db.facilities,
      trafficSensors: db.trafficSensors,
      accidentHotspots: db.accidentHotspots,
      aqiSensors: db.aqiSensors,
      complaints: db.complaints
    });
  });

  // Traffic
  app.get(["/api/traffic", "/api/v1/traffic"], (req, res) => {
    res.json(db.trafficSensors);
  });

  app.post(["/api/traffic/override-signal", "/api/v1/traffic/override-signal"], (req, res) => {
    const { sensorId, greenWaveDuration } = req.body;
    const sensor = db.trafficSensors.find(s => s.id === sensorId);
    if (sensor) {
      sensor.signalStatus = 'Manual Control';
      sensor.congestionLevel = 'Low';
    }

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Traffic Police Lead',
      role: 'Traffic Department',
      action: 'TRIGGER_GREEN_WAVE',
      targetModule: `Traffic Corridor ${sensorId}`,
      status: 'SUCCESS',
      ipAddress: req.ip || '10.240.1.15'
    });

    res.json({ success: true, message: `Green wave override active for ${greenWaveDuration || 15} minutes.`, sensor });
  });

  // Accidents
  app.get(["/api/accidents", "/api/v1/accidents"], (req, res) => {
    res.json(db.accidentHotspots);
  });

  // Environment & AQI
  app.get(["/api/environment/aqi", "/api/v1/environment/aqi"], (req, res) => {
    res.json(db.aqiSensors);
  });

  app.post(["/api/environment/deploy-smog-cannon", "/api/v1/environment/deploy-smog-cannon"], (req, res) => {
    const { sensorId } = req.body;
    const sensor = db.aqiSensors.find(s => s.id === sensorId);
    if (sensor) {
      sensor.pm25 = Math.max(25, sensor.pm25 - 20);
      sensor.aqi = Math.max(50, sensor.aqi - 30);
    }
    res.json({ success: true, message: 'Anti-smog mist cannon deployed. Particulate reduction in progress.', sensor });
  });

  // Citizen Complaints
  app.get(["/api/complaints", "/api/v1/complaints"], (req, res) => {
    res.json(db.complaints);
  });

  app.post(["/api/complaints", "/api/v1/complaints"], (req, res) => {
    const { category, description, ward, priority, reportedBy } = req.body;
    const newComplaint = {
      id: `cmp-${Date.now()}`,
      ticketNo: `BBMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category || 'Pothole',
      description: description || 'Issue reported via Citizen Portal',
      ward: ward || 'Indiranagar',
      lat: 12.9784 + (Math.random() - 0.5) * 0.04,
      lng: 77.6408 + (Math.random() - 0.5) * 0.04,
      status: 'Pending' as const,
      priority: (priority || 'Medium') as 'Low' | 'Medium' | 'High' | 'Emergency',
      reportedBy: reportedBy || 'Verified Citizen',
      reportedAt: new Date().toISOString(),
      estimatedResolution: priority === 'Emergency' ? '6 Hours' : '24 Hours',
      assignedDept: 'BBMP Field Division'
    };
    db.complaints.unshift(newComplaint);
    res.status(201).json(newComplaint);
  });

  // Emergency Services
  app.get(["/api/emergency/dispatches", "/api/v1/emergency/dispatches"], (req, res) => {
    res.json(db.emergencyDispatches);
  });

  app.get(["/api/emergency/hospitals", "/api/v1/emergency/hospitals"], (req, res) => {
    const hospitals = db.facilities.filter(f => f.type === 'Hospital');
    res.json(hospitals);
  });

  // AI Predictions
  app.get(["/api/ai/predictions", "/api/v1/predictions"], (req, res) => {
    res.json(db.aiPredictions);
  });

  // Global Search Endpoint
  app.get(["/api/search", "/api/v1/search"], (req, res) => {
    const q = (req.query.q as string || '').trim().toLowerCase();
    if (!q) return res.json([]);

    const results: any[] = [];

    // Module Pages
    const pages = [
      { id: 'page-executive', title: 'Executive Command Dashboard', subtitle: 'City Health & High-Level KPIs', category: 'Page', wardName: 'executive' },
      { id: 'page-analytics', title: 'Analytics Center', subtitle: 'BI Benchmarking & Multi-Domain Metrics', category: 'Page', wardName: 'analytics' },
      { id: 'page-digital-twin', title: 'Digital Twin GIS Map', subtitle: '3D Spatial Layer & Live Sensors', category: 'Page', wardName: 'digital-twin' },
      { id: 'page-ward-analytics', title: 'Ward Intelligence', subtitle: 'BBMP Single Ward In-Depth Analytics', category: 'Page', wardName: 'ward-analytics' },
      { id: 'page-ward-comparison', title: 'Ward Comparison Center', subtitle: 'Side-by-side Ward BI Benchmarking', category: 'Page', wardName: 'ward-comparison' },
      { id: 'page-traffic', title: 'Traffic Intelligence', subtitle: 'Gridlock Analysis & Signal Control', category: 'Page', wardName: 'traffic' },
      { id: 'page-environment', title: 'Air Quality & Weather', subtitle: 'AQI Sensors & PM2.5 Telemetry', category: 'Page', wardName: 'environment' },
      { id: 'page-water', title: 'Water Department', subtitle: 'BWSSB Cauvery Reservoirs & Deficits', category: 'Page', wardName: 'water' },
      { id: 'page-electricity', title: 'Electricity Grid', subtitle: 'BESCOM 220kV Master Distribution', category: 'Page', wardName: 'electricity' },
      { id: 'page-accidents', title: 'Accident Intelligence', subtitle: 'Traffic Hotspots & Blackspots', category: 'Page', wardName: 'accidents' },
      { id: 'page-complaints', title: 'Citizen Complaints', subtitle: 'BBMP Potholes & Public Grievances', category: 'Page', wardName: 'complaints' },
      { id: 'page-reports', title: 'Reports & Analytics', subtitle: 'Government PDF Export & Audits', category: 'Page', wardName: 'reports' },
      { id: 'page-smartcity-ai', title: 'SmartCity AI Assistant', subtitle: 'Conversational Data Science Engine', category: 'Page', wardName: 'smartcity-ai' },
      { id: 'page-admin', title: 'Admin & System Control', subtitle: 'Role Management & PostGIS Telemetry', category: 'Page', wardName: 'admin' },
    ];

    pages.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        let route = '/executive';
        if (p.id === 'page-analytics') route = '/analytics';
        else if (p.id === 'page-digital-twin') route = '/digital-twin';
        else if (p.id === 'page-ward-analytics') route = '/ward-analytics';
        else if (p.id === 'page-ward-comparison') route = '/ward-comparison';
        else if (p.id === 'page-traffic') route = '/traffic';
        else if (p.id === 'page-environment') route = '/environment';
        else if (p.id === 'page-water') route = '/water';
        else if (p.id === 'page-electricity') route = '/electricity';
        else if (p.id === 'page-accidents') route = '/accidents';
        else if (p.id === 'page-complaints') route = '/complaints';
        else if (p.id === 'page-reports') route = '/reports';
        else if (p.id === 'page-smartcity-ai') route = '/smartcity-ai';
        else if (p.id === 'page-admin') route = '/admin';

        results.push({
          ...p,
          route
        });
      }
    });

    // Search Wards
    db.wards.forEach(w => {
      if (
        w.name.toLowerCase().includes(q) || 
        `ward ${w.number}`.includes(q) || 
        w.zone.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q)
      ) {
        results.push({
          id: `w-${w.id}`,
          entityId: w.id,
          wardId: w.id,
          wardName: w.name,
          title: `${w.name} (Ward ${w.number})`,
          subtitle: `BBMP Zone: ${w.zone} • Pop: ${(w.population / 1000).toFixed(0)}k • AQI: ${w.aqi}`,
          category: 'Ward',
          route: `/ward/${encodeURIComponent(w.name)}`,
          zone: w.zone,
          lat: w.lat,
          lng: w.lng,
          details: `Ward ${w.number} | ${w.aqi} AQI | Health: ${w.healthScore}/100`,
          metadata: { ...w }
        });
      }
    });

    // Search Facilities
    db.facilities.forEach(f => {
      if (f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || (f.ward && f.ward.toLowerCase().includes(q))) {
        let route = `/facility/${f.id}`;
        if (f.type === 'Hospital') route = `/hospital/${f.id}`;
        else if (f.type === 'Police Station') route = `/police-station/${f.id}`;
        else if (f.type === 'Metro Station') route = `/metro/${f.id}`;
        else if (f.type === 'Fire Station') route = `/fire-station/${f.id}`;

        results.push({
          id: `f-${f.id}`,
          entityId: f.id,
          wardName: f.ward || 'Indiranagar',
          title: f.name,
          subtitle: `${f.type} • Ward: ${f.ward}`,
          category: f.type,
          route,
          lat: f.lat,
          lng: f.lng,
          details: f.status,
          metadata: { ...f }
        });
      }
    });

    // Search Complaints
    db.complaints.forEach(c => {
      if (c.ticketNo.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.ward.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        results.push({
          id: `c-${c.id}`,
          entityId: c.id,
          title: `Complaint #${c.ticketNo}: ${c.category}`,
          subtitle: `${c.ward} • Status: ${c.status} • Priority: ${c.priority}`,
          category: 'Complaint',
          route: `/complaint/${c.id}`,
          wardName: c.ward,
          lat: c.lat,
          lng: c.lng,
          details: c.description,
          metadata: { ...c }
        });
      }
    });

    // Search Reports
    db.reports.forEach(r => {
      if (r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)) {
        results.push({
          id: `rep-${r.id}`,
          entityId: r.id,
          title: r.title,
          subtitle: `${r.category} • Format: ${r.format} • Size: ${r.size}`,
          category: 'Report',
          route: `/report/${r.id}`,
          wardName: 'Citywide',
          metadata: { ...r }
        });
      }
    });

    res.json(results.slice(0, 15));
  });

  // Single Ward Endpoint
  app.get(["/api/wards/:idOrName", "/api/v1/wards/:idOrName"], (req, res) => {
    const param = decodeURIComponent(req.params.idOrName).toLowerCase();
    const ward = db.wards.find(w => 
      w.id.toLowerCase() === param || 
      w.name.toLowerCase() === param || 
      `ward-${w.number}`.toLowerCase() === param ||
      `ward ${w.number}`.toLowerCase() === param ||
      w.name.toLowerCase().includes(param) ||
      param.includes(w.name.toLowerCase())
    );
    if (!ward) return res.status(404).json({ error: "Ward not found" });

    // Include related facilities & sensors for this ward
    const wardFacilities = db.facilities.filter(f => f.ward.toLowerCase() === ward.name.toLowerCase());
    const wardComplaints = db.complaints.filter(c => c.ward.toLowerCase() === ward.name.toLowerCase());
    const wardSensors = db.trafficSensors.filter(s => s.location.toLowerCase().includes(ward.name.toLowerCase()));
    const wardAqi = db.aqiSensors.find(a => a.ward.toLowerCase() === ward.name.toLowerCase());

    res.json({
      ward,
      facilities: wardFacilities,
      complaints: wardComplaints,
      trafficSensors: wardSensors,
      aqiSensor: wardAqi
    });
  });

  // Single Facility Endpoint
  app.get(["/api/facilities/:id", "/api/v1/facilities/:id"], (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace(/^f-/, '');
    const facility = db.facilities.find(f => f.id === cleanId || f.id === id || f.name.toLowerCase() === decodeURIComponent(id).toLowerCase());
    if (!facility) return res.status(404).json({ error: "Facility not found" });

    const relatedDispatches = db.emergencyDispatches.filter(d => d.location.toLowerCase().includes(facility.ward.toLowerCase()) || d.assignedUnit.toLowerCase().includes(facility.name.toLowerCase()));
    res.json({ facility, relatedDispatches });
  });

  // Single Complaint Endpoint
  app.get(["/api/complaints/:id", "/api/v1/complaints/:id"], (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace(/^c-/, '');
    const complaint = db.complaints.find(c => c.id === cleanId || c.id === id || c.ticketNo.toLowerCase() === id.toLowerCase());
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  });

  // Single Report Endpoint
  app.get(["/api/reports/:id", "/api/v1/reports/:id"], (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace(/^rep-/, '');
    const report = db.reports.find(r => r.id === cleanId || r.id === id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  });

  // Reports Listing
  app.get(["/api/reports", "/api/v1/reports"], (req, res) => {
    res.json(db.reports);
  });

  // Dynamic Reports Download & Export Engine (PDF, Excel, CSV, PNG Chart)
  app.get(["/api/reports/download", "/api/v1/reports/download", "/api/export", "/api/v1/export"], (req, res) => {
    const reportType = (req.query.type as any) || (req.query.reportType as any) || 'executive';
    const format = (req.query.format as any) || 'pdf';
    const ward = (req.query.ward as string) || 'All Wards';
    const title = (req.query.title as string) || undefined;

    const file = generateReportFile({ reportType, format, ward, title });

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.content);
  });

  app.post(["/api/reports/download", "/api/v1/reports/download", "/api/export", "/api/v1/export"], (req, res) => {
    const { reportType = 'executive', format = 'pdf', ward = 'All Wards', title } = req.body || {};
    const file = generateReportFile({ reportType, format, ward, title });

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.content);
  });

  // Notifications Management Endpoints
  app.get(["/api/notifications", "/api/v1/notifications"], (req, res) => {
    res.json(db.notifications);
  });

  app.post(["/api/notifications/mark-read", "/api/v1/notifications/mark-read"], (req, res) => {
    const { id } = req.body || {};
    if (id) {
      const notif = db.notifications.find(n => n.id === id);
      if (notif) notif.read = true;
    } else {
      db.notifications.forEach(n => n.read = true);
    }
    res.json({ success: true, notifications: db.notifications });
  });

  app.delete(["/api/notifications/:id", "/api/v1/notifications/:id"], (req, res) => {
    const { id } = req.params;
    db.notifications = db.notifications.filter(n => n.id !== id);
    res.json({ success: true, message: `Notification ${id} dismissed`, notifications: db.notifications });
  });

  app.delete(["/api/notifications", "/api/v1/notifications"], (req, res) => {
    db.notifications = [];
    res.json({ success: true, message: 'All notifications cleared', notifications: [] });
  });

  app.post(["/api/notifications", "/api/v1/notifications"], (req, res) => {
    const { title, message, type = 'info', department = 'General' } = req.body || {};
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: title || 'System Notice',
      message: message || 'Event triggered',
      type: type as 'critical' | 'warning' | 'info',
      timestamp: new Date().toISOString(),
      read: false,
      department
    };
    db.notifications.unshift(newNotif);
    res.status(201).json(newNotif);
  });

  // Water Department Emergency Tanker Action
  app.post(["/api/water/deploy-tankers", "/api/v1/water/deploy-tankers"], (req, res) => {
    const { ward = 'Whitefield', count = 5 } = req.body || {};
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'BWSSB Hydro Chief',
      role: 'Water Department',
      action: 'DEPLOY_EMERGENCY_TANKERS',
      targetModule: `Water Grid (${ward})`,
      status: 'SUCCESS',
      ipAddress: req.ip || '10.240.2.11'
    });
    res.json({ success: true, message: `Successfully dispatched ${count} BWSSB emergency tankers to ${ward}.` });
  });

  // System & Audit Logs
  app.get(["/api/audit-logs", "/api/v1/audit-logs"], (req, res) => {
    res.json(db.auditLogs);
  });

  // Chat History Store
  const chatHistoryStore: Array<{ id: string; sender: 'user' | 'bot'; text: string; timestamp: string; domain?: string; dataCard?: any; explainabilityCard?: any; recommendations?: any }> = [];

  app.get(["/api/ai/history", "/api/v1/ai/history"], (req, res) => {
    res.json(chatHistoryStore);
  });

  app.delete(["/api/ai/history", "/api/v1/ai/history"], (req, res) => {
    chatHistoryStore.length = 0;
    res.json({ success: true, message: 'Chat history cleared' });
  });

  // Multi-Agent System Endpoints
  app.get(["/api/ai/agents", "/api/v1/ai/agents"], (req, res) => {
    res.json(Object.values(CITY_AI_AGENTS));
  });

  app.post(["/api/ai/agents/task", "/api/v1/ai/agents/task"], async (req, res) => {
    const { agentId = 'mayor_agent', query, wardContext } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    const result = await processAgentTask(agentId, query, wardContext);
    res.json(result);
  });

  // RAG Knowledge Index Endpoint
  app.get(["/api/ai/rag/knowledge", "/api/v1/ai/rag/knowledge"], (req, res) => {
    res.json(CITY_RAG_KNOWLEDGE_BASE);
  });

  // Real-Time Event SSE Stream Endpoint
  app.get(["/api/events/stream", "/api/v1/events/stream"], (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = () => {
      const liveTick = {
        timestamp: new Date().toISOString(),
        trafficSpeedAvg: +(8 + Math.random() * 4).toFixed(1),
        aqiCentralSilkBoard: Math.floor(165 + Math.random() * 20),
        bescomPowerLoadMW: Math.floor(3800 + Math.random() * 150),
        bwssbWaterFlowMLD: Math.floor(1420 + Math.random() * 40),
        activeEmergencyIncidents: Math.floor(12 + Math.random() * 5),
        openCitizenComplaints: Math.floor(138 + Math.random() * 10),
        cityHealthScore: +(83.5 + Math.random() * 1.5).toFixed(1)
      };
      res.write(`data: ${JSON.stringify(liveTick)}\n\n`);
    };

    sendEvent();
    const interval = setInterval(sendEvent, 4000);

    req.on('close', () => {
      clearInterval(interval);
    });
  });

  // Scenario Digital Twin Simulator API
  app.post(["/api/simulation/run", "/api/v1/simulation/run"], (req, res) => {
    const { scenarioType, severity = 'HIGH', targetWards = ['Silk Board', 'Indiranagar', 'Whitefield'] } = req.body || {};

    let scenarioTitle = 'Heavy Monsoon Rainfall & Flash Flooding';
    let impactMetrics = {
      trafficSpeedDropPct: -48,
      aqiChangePct: -18,
      powerDeficitMW: -120,
      waterDisruptionMLD: -85,
      complaintSurgePct: +145,
      emergencySLADelayMins: +14.2,
      projectedHealthScore: 68.5
    };
    let aiMitigations = [
      'Activate automated green wave override on NH44 Silk Board exit corridor.',
      'Deploy 4 emergency BWSSB water de-clogging pumps to Bellandur underpass.',
      'Reroute BMTC bus routes 500D via Marathahalli Outer Ring Road bypass.'
    ];

    if (scenarioType === 'ROAD_CLOSURE' || scenarioType === 'TRAFFIC_GRIDLOCK') {
      scenarioTitle = 'Outer Ring Road Major Flyover Closure';
      impactMetrics = {
        trafficSpeedDropPct: -65,
        aqiChangePct: +24,
        powerDeficitMW: 0,
        waterDisruptionMLD: 0,
        complaintSurgePct: +88,
        emergencySLADelayMins: +18.5,
        projectedHealthScore: 71.0
      };
      aiMitigations = [
        'Trigger Signal Green Wave on Koramangala 100ft Road alternative arterial.',
        'Issue emergency mobile broadcast alert to commuters bound for ITPL.',
        'Deploy 12 additional traffic police constables to Silk Board junction.'
      ];
    } else if (scenarioType === 'POWER_FAILURE' || scenarioType === 'GRID_BLACKOUT') {
      scenarioTitle = 'Hoodi 220kV Transformer Substation Trip';
      impactMetrics = {
        trafficSpeedDropPct: -15,
        aqiChangePct: 0,
        powerDeficitMW: -340,
        waterDisruptionMLD: -110,
        complaintSurgePct: +210,
        emergencySLADelayMins: +6.0,
        projectedHealthScore: 64.2
      };
      aiMitigations = [
        'Reroute 110kV grid supply from Peenya backup substation.',
        'Engage auxiliary diesel generators at Manipal & Columbia Asia hospitals.',
        'Prioritize BWSSB Pumping Station 3 grid re-connection.'
      ];
    } else if (scenarioType === 'VIP_MOVEMENT' || scenarioType === 'CRICKET_MATCH') {
      scenarioTitle = 'Chinnaswamy Stadium IPL Match Traffic Surge';
      impactMetrics = {
        trafficSpeedDropPct: -42,
        aqiChangePct: +12,
        powerDeficitMW: +25,
        waterDisruptionMLD: 0,
        complaintSurgePct: +35,
        emergencySLADelayMins: +8.0,
        projectedHealthScore: 78.4
      };
      aiMitigations = [
        'Increase Namma Metro Purple & Green line train frequency to 3 mins.',
        'Convert Cubbon Park road to one-way ingress flow.',
        'Open BMTC special feeder shuttle fleet from MG Road metro station.'
      ];
    }

    res.json({
      scenarioType,
      scenarioTitle,
      severity,
      targetWards,
      timestamp: new Date().toISOString(),
      baselineHealthScore: 84.0,
      impactMetrics,
      affectedFacilitiesCount: 18,
      estimatedRecoveryTimeHours: 3.5,
      aiMitigations
    });
  });

  // System & API Infrastructure Health Endpoint
  app.get(["/api/system/health", "/api/v1/system/health"], (req, res) => {
    const memoryUsage = process.memoryUsage();
    const loadedModels = MLEngineService.getLoadedModels();

    res.json({
      status: 'HEALTHY',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      serverMetrics: {
        memoryHeapUsedMB: +(memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        memoryHeapTotalMB: +(memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        memoryRssMB: +(memoryUsage.rss / 1024 / 1024).toFixed(2),
        cpuLoadPct: +(2.5 + Math.random() * 3).toFixed(1),
        avgResponseTimeMs: +(12 + Math.random() * 5).toFixed(1)
      },
      databaseStatus: {
        engine: 'PostgreSQL / PostGIS',
        connectionPool: 'Active (12 / 20 Connections)',
        tablesSynced: 28,
        totalWards: db.wards.length,
        totalComplaints: db.complaints.length,
        auditLogsCount: db.auditLogs.length
      },
      webSocketStatus: {
        channel: 'Real-Time Event Stream / SSE',
        status: 'CONNECTED',
        activeClients: 14
      },
      mlPickleModels: {
        totalModels: loadedModels.length,
        loadedCount: loadedModels.filter(m => m.status === 'LOADED').length,
        models: loadedModels
      }
    });
  });

  // Prometheus Metrics Scraping Endpoint
  app.get("/metrics", (req, res) => {
    const memory = process.memoryUsage();
    const metrics = [
      '# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.',
      '# TYPE process_cpu_seconds_total counter',
      `process_cpu_seconds_total ${(process.uptime() * 0.05).toFixed(3)}`,
      '# HELP process_resident_memory_bytes Resident memory size in bytes.',
      '# TYPE process_resident_memory_bytes gauge',
      `process_resident_memory_bytes ${memory.rss}`,
      '# HELP nodejs_heap_size_total_bytes Process heap size from Node.js in bytes.',
      '# TYPE nodejs_heap_size_total_bytes gauge',
      `nodejs_heap_size_total_bytes ${memory.heapTotal}`,
      '# HELP nodejs_heap_size_used_bytes Process heap size used from Node.js in bytes.',
      '# TYPE nodejs_heap_size_used_bytes gauge',
      `nodejs_heap_size_used_bytes ${memory.heapUsed}`,
      '# HELP smartcity_http_requests_total Total HTTP requests received.',
      '# TYPE smartcity_http_requests_total counter',
      'smartcity_http_requests_total 14820',
      '# HELP smartcity_ml_models_loaded Total ML Pickle models loaded in memory.',
      '# TYPE smartcity_ml_models_loaded gauge',
      'smartcity_ml_models_loaded 6'
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(metrics);
  });

  // ML Model Management & Pickle Loader Endpoints
  app.get(["/api/ml/models", "/api/v1/ml/models"], (req, res) => {
    const models = MLEngineService.getLoadedModels();
    res.json({
      status: 'OPERATIONAL',
      totalModels: models.length,
      loadedCount: models.filter(m => m.status === 'LOADED').length,
      models
    });
  });

  // Individual Pickled Model Prediction Endpoints
  app.post(["/api/ml/predict/traffic", "/api/v1/ml/predict/traffic"], (req, res) => {
    res.json(MLEngineService.infer('traffic', req.body));
  });

  app.post(["/api/ml/predict/aqi", "/api/v1/ml/predict/aqi"], (req, res) => {
    res.json(MLEngineService.infer('aqi', req.body));
  });

  app.post(["/api/ml/predict/accident", "/api/v1/ml/predict/accident"], (req, res) => {
    res.json(MLEngineService.infer('accident', req.body));
  });

  app.post(["/api/ml/predict/water", "/api/v1/ml/predict/water"], (req, res) => {
    res.json(MLEngineService.infer('water', req.body));
  });

  app.post(["/api/ml/predict/electricity", "/api/v1/ml/predict/electricity"], (req, res) => {
    res.json(MLEngineService.infer('electricity', req.body));
  });

  app.post(["/api/ml/predict/complaint", "/api/v1/ml/predict/complaint"], (req, res) => {
    res.json(MLEngineService.infer('complaint', req.body));
  });

  // Unified Dedicated ML Model Prediction Endpoint (Supports modelName or domain)
  app.post(["/api/ai/predict", "/api/v1/ai/predict", "/api/ml/predict", "/api/v1/ml/predict"], (req, res) => {
    const { domain, modelName, targetLocation, ward, timeHorizonHours } = req.body;
    let targetDomain = domain || 'traffic';
    if (modelName) {
      if (modelName.includes('aqi')) targetDomain = 'aqi';
      else if (modelName.includes('accident')) targetDomain = 'accident';
      else if (modelName.includes('water')) targetDomain = 'water';
      else if (modelName.includes('electricity')) targetDomain = 'electricity';
      else if (modelName.includes('complaint')) targetDomain = 'complaint';
      else targetDomain = 'traffic';
    }

    const inferenceResult = MLEngineService.infer(targetDomain, { location: targetLocation || ward, timeHorizonHours });
    res.json(inferenceResult);
  });

  // Dedicated ML Model Explainability Endpoint
  app.post(["/api/ai/explain", "/api/v1/ai/explain"], (req, res) => {
    const { predictionId, featureSet } = req.body;
    res.json({
      modelName: 'XGBoost-SHAP-Spatial-Regressor-v3',
      confidencePercent: 93.8,
      timeHorizon: 'Next 1 Hour',
      features: [
        { featureName: 'Vehicle Throughput Density', weight: 44, value: '2,850/hr', impact: 'Negative' },
        { featureName: 'Ambient Humidity & Fog', weight: 22, value: '84%', impact: 'Negative' },
        { featureName: 'Industrial Stack Emissions', weight: 20, value: '142 PM2.5', impact: 'Negative' },
        { featureName: 'Urban Canopy Dispersion', weight: 14, value: 'Medium', impact: 'Positive' }
      ],
      counterfactualText: 'If vehicle volume is diverted by 15% via ORR Bypass, the local congestion index drops from 88 to 54 within 20 minutes.'
    });
  });

  // AI Decision Recommendations Endpoint
  app.post(["/api/ai/recommendations", "/api/v1/ai/recommendations"], (req, res) => {
    const { ward } = req.body;
    res.json({
      ward: ward || 'Indiranagar',
      recommendations: [
        {
          id: 'rec-1',
          title: 'Activate Automated Green Wave on Silk Board - Koramangala Line',
          department: 'Traffic Police Command',
          expectedHealthGain: 3.8,
          actionType: 'GREEN_WAVE'
        },
        {
          id: 'rec-[#2]',
          title: 'Deploy High-Pressure Smog Cannons at Silk Board Flyover',
          department: 'Environment & KSPCB',
          expectedHealthGain: 2.4,
          actionType: 'SMOG_CANNON'
        },
        {
          id: 'rec-[#3]',
          title: 'Dispatch Emergency BWSSB Tankers to Whitefield Zone 3',
          department: 'Water Supply Board',
          expectedHealthGain: 4.1,
          actionType: 'WATER_TANKER'
        }
      ]
    });
  });

  // AI Chatbot Engine with Gemini + Multi-domain City Data Knowledge
  app.post(["/api/ai/chat", "/api/v1/ai/chat"], async (req, res) => {
    const { message, wardContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message prompt required" });
    }

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatHistoryStore.push(userMsg);

    const msgLower = message.toLowerCase();
    let domain: 'traffic' | 'weather' | 'aqi' | 'electricity' | 'water' | 'complaints' | 'hospitals' | 'emergency' | 'predictions' = 'traffic';

    let dataCard: any;
    let explainabilityCard: any;
    let recommendations: any[];

    if (msgLower.includes('weather') || msgLower.includes('rain') || msgLower.includes('temp')) {
      domain = 'weather';
      dataCard = {
        title: 'Bengaluru Radar Weather Telemetry',
        metrics: [
          { label: 'Mahadevapura Monsoon Cell', value: '42.5 mm/h Rain', badge: 'Thunderstorm' },
          { label: 'South Bengaluru Light Drizzle', value: '8.2 mm/h Rain', badge: 'Drizzle' },
          { label: 'Yelahanka North', value: '26.1 °C', badge: 'Clear Sky' }
        ]
      };
    } else if (msgLower.includes('aqi') || msgLower.includes('air') || msgLower.includes('smog') || msgLower.includes('pollution')) {
      domain = 'aqi';
      dataCard = {
        title: 'Air Quality Monitoring Stations',
        metrics: [
          { label: 'Central Silk Board', value: '175 AQI', badge: 'Poor' },
          { label: 'Hebbal Flyover', value: '158 AQI', badge: 'Poor' },
          { label: 'Whitefield', value: '142 AQI', badge: 'Moderate' },
          { label: 'Yelahanka GKVK', value: '58 AQI', badge: 'Good' }
        ]
      };
      explainabilityCard = {
        modelName: 'XGBoost AQI Dispersion Model v2',
        confidencePercent: 92.4,
        timeHorizon: 'Next 3 Hours',
        features: [
          { featureName: 'Diesel Exhaust Density', weight: 48, value: 'High', impact: 'Negative' },
          { featureName: 'Boundary Layer Height', weight: 28, value: 'Low', impact: 'Negative' },
          { featureName: 'Wind Velocity (SW)', weight: 24, value: '14 km/h', impact: 'Positive' }
        ],
        counterfactualText: 'Deploying anti-smog mist cannon lowers PM2.5 by up to 28% within a 500m radius.'
      };
      recommendations = [
        {
          id: 'rec-smog',
          title: 'Deploy High-Pressure Anti-Smog Cannon at Silk Board',
          department: 'KSPCB Environment Unit',
          expectedHealthGain: 2.8,
          actionType: 'SMOG_CANNON'
        }
      ];
    } else if (msgLower.includes('power') || msgLower.includes('electricity') || msgLower.includes('grid') || msgLower.includes('substation')) {
      domain = 'electricity';
      dataCard = {
        title: 'BESCOM 220kV Master Grid Load',
        metrics: [
          { label: 'Hoodi - Silk Board Line', value: '84% Load', badge: 'Stable' },
          { label: 'Peenya Industrial Grid', value: '68% Load', badge: 'Normal' },
          { label: 'Whitefield Substation', value: '380 MVA', badge: 'Operational' }
        ]
      };
    } else if (msgLower.includes('water') || msgLower.includes('cauvery') || msgLower.includes('leak') || msgLower.includes('tanker')) {
      domain = 'water';
      dataCard = {
        title: 'BWSSB Cauvery Stage V Trunk Line',
        metrics: [
          { label: 'Pumping Rate', value: '1,450 MLD', badge: 'Normal' },
          { label: 'High Grounds Pressure', value: '6.2 Bar', badge: 'Optimal' },
          { label: 'Whitefield Deficit Zone', value: '-120 MLD', badge: 'Deficit' }
        ]
      };
      recommendations = [
        {
          id: 'rec-water',
          title: 'Dispatch Emergency BWSSB Water Tankers to Whitefield',
          department: 'BWSSB Command',
          expectedHealthGain: 4.2,
          actionType: 'WATER_TANKER'
        }
      ];
    } else if (msgLower.includes('complaint') || msgLower.includes('pothole') || msgLower.includes('garbage') || msgLower.includes('ticket')) {
      domain = 'complaints';
      dataCard = {
        title: 'BBMP Citizen Grievance Statistics',
        metrics: [
          { label: 'Active Open Tickets', value: '142 Issues', badge: 'In Progress' },
          { label: 'Avg Resolution Time', value: '18.4 Hours', badge: 'Met SLA' },
          { label: 'Pothole Repair Rate', value: '88.5%', badge: 'Optimal' }
        ]
      };
    } else if (msgLower.includes('hospital') || msgLower.includes('police') || msgLower.includes('fire') || msgLower.includes('bed') || msgLower.includes('emergency')) {
      domain = 'hospitals';
      dataCard = {
        title: 'Trauma Care & Emergency Preparedness',
        metrics: [
          { label: 'Manipal Hosp Old Airport', value: '42 ICU Beds', badge: 'Operational' },
          { label: 'Narayana Health City', value: '85 ICU Beds', badge: 'Operational' },
          { label: 'Silk Board Police Stn', value: '12 Patrols Active', badge: 'On Duty' },
          { label: 'High Grounds Fire Stn', value: '6 Tenders Ready', badge: 'Standby' }
        ]
      };
    } else if (msgLower.includes('predict') || msgLower.includes('model') || msgLower.includes('forecast') || msgLower.includes('explain')) {
      domain = 'predictions';
      dataCard = {
        title: 'ML Predictive Model Forecasts',
        metrics: [
          { label: 'Silk Board Peak Congestion', value: 'Peak at 18:45', badge: 'High Risk' },
          { label: 'Expected Speed Drop', value: '6.2 km/h', badge: 'Gridlock' },
          { label: 'Model Accuracy', value: '94.2%', badge: 'XGBoost' }
        ]
      };
      explainabilityCard = {
        modelName: 'XGBoost Spatio-Temporal Regressor',
        confidencePercent: 94.2,
        timeHorizon: '1 Hour Ahead',
        features: [
          { featureName: 'IT Park Shift-End Exit Flow', weight: 42, value: '+3,400 Vehicles', impact: 'Negative' },
          { featureName: 'Signal Green Split Allocation', weight: 28, value: '45 Seconds', impact: 'Negative' },
          { featureName: 'Rain Surface Slickness', weight: 18, value: 'High', impact: 'Negative' },
          { featureName: 'Namma Metro Transit Share', weight: 12, value: '450k commuters', impact: 'Positive' }
        ],
        counterfactualText: 'Enabling automated green wave signal extensions reduces queue buildup by 32% during rush hours.'
      };
      recommendations = [
        {
          id: 'rec-greenwave',
          title: 'Activate Automated Green Corridor Override on Silk Board NH44',
          department: 'Traffic Command',
          expectedHealthGain: 3.5,
          actionType: 'GREEN_WAVE'
        }
      ];
    } else {
      domain = 'traffic';
      dataCard = {
        title: 'Traffic Congestion Corridor Analysis',
        metrics: [
          { label: 'Silk Board Junction', value: '8.5 km/h', badge: 'Gridlock' },
          { label: 'Outer Ring Road', value: '9.8 km/h', badge: 'Gridlock' },
          { label: 'E-City Expressway', value: '42.0 km/h', badge: 'Fluid' }
        ]
      };
    }

    let textResponse = "";

    try {
      const ai = getGeminiClient();
      if (ai) {
        const promptText = `
You are SmartCity AI, the AI Command Assistant for SmartCity360 (Bengaluru Digital Twin Analytics Platform).
Current City Data Context:
- Overall City Health Index: 84/100
- Active Ward Context: ${wardContext || 'Entire Bengaluru'}
- High Traffic Zones: Silk Board Junction (Gridlock, 8.5 km/h avg), ORR Bellandur (Gridlock, 9.8 km/h)
- AQI: Central Silk Board (175 - Poor), Hebbal (158 - Poor), Whitefield (142 - Moderate), Yelahanka (58 - Good)
- Electricity: Hoodi - Silk Board 220kV Grid Load at 84% Stable.
- Water: BWSSB Cauvery Stage V pumping at 1,450 MLD. Local deficit in Whitefield.
- Emergency Facilities: Manipal Hospital (42 ICU beds free), Narayana Health City (85 ICU beds free).

User Question: "${message}"

Instructions:
Provide a concise, authoritative, senior-engineering level answer incorporating real Bengaluru data. Keep response under 120 words.
        `;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            temperature: 0.2,
          }
        });

        textResponse = aiResponse.text || "SmartCity AI processed query successfully.";
      }
    } catch (err) {
      console.warn("Gemini server-side call error, using deterministic fallback:", err);
    }

    if (!textResponse) {
      if (domain === 'weather') {
        textResponse = `Radar weather telemetry indicates a heavy monsoon cell over Mahadevapura (42.5 mm/h rain). Yelahanka is clear at 26.1°C with 62% humidity.`;
      } else if (domain === 'aqi') {
        textResponse = `Central Silk Board station registers 175 AQI (Poor) due to heavy vehicular emissions. Whitefield reports 142 AQI (Moderate). Yelahanka has cleanest air at 58 AQI.`;
      } else if (domain === 'electricity') {
        textResponse = `BESCOM 220kV master grid load is stable at 84% capacity on the Hoodi-Silk Board transmission line. Peenya industrial grid is running smoothly at 68% load.`;
      } else if (domain === 'water') {
        textResponse = `BWSSB Cauvery Stage V pipeline is discharging 1,450 MLD with High Grounds reservoir pressure at 6.2 Bar. Whitefield Zone 3 currently reports a -120 MLD deficit.`;
      } else if (domain === 'complaints') {
        textResponse = `BBMP grievance cell has 142 active pending tickets across 12 wards with average resolution time of 18.4 hours, meeting the 24-hour SLA.`;
      } else if (domain === 'hospitals') {
        textResponse = `Manipal Hospital Old Airport Rd has 42 ICU beds available; Narayana Health City has 85 beds open. Emergency dispatch response time is currently under 6 minutes.`;
      } else if (domain === 'predictions') {
        textResponse = `SmartCity XGBoost Spatio-Temporal Regressor (94.2% accuracy) forecasts peak gridlock at Silk Board at 18:45 IST with average speeds dropping to 6.2 km/h.`;
      } else {
        textResponse = `Central Silk Board Junction and Bellandur Outer Ring Road are in Gridlock with average speeds under 10 km/h. Signal green wave override has been recommended.`;
      }
    }

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot' as const,
      text: textResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      domain,
      dataCard,
      explainabilityCard,
      recommendations
    };

    chatHistoryStore.push(botMsg);

    return res.json(botMsg);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SmartCity360] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
