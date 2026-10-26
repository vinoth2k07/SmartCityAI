# SmartCity360 - AI Powered Digital Twin Analytics Platform

**SmartCity360** is an enterprise-grade Smart City Command Center and Digital Twin Platform tailored for **Bengaluru Metropolitan Area**. The platform unifies real-time IoT feeds, geospatial GIS layers, machine learning predictive models, emergency dispatch systems, and conversational AI into a unified government control wall.

---

## Key Capabilities

- **Executive Command Center Wall**: Real-time city health score (84.0/100), active crisis tracking, ward stress level monitoring, and automated incident response feeds.
- **Digital Twin 3D GIS Map**: High-performance Leaflet geospatial canvas rendered with 12 Ward boundaries, live traffic congestion corridors, air quality heatmaps, emergency facilities, water pipelines, and electrical transformers.
- **Machine Learning Inference Engine (Pickle Support)**: Pre-loaded trained model weights for 6 domains (`traffic_model.pkl`, `aqi_model.pkl`, `accident_model.pkl`, `water_model.pkl`, `electricity_model.pkl`, `complaint_model.pkl`) returning confidence scores and feature importance.
- **Digital Twin Scenario & Crisis Simulator**: Monte Carlo crisis simulation for heavy monsoon flash floods, flyover structural repair closures, transformer substation outages, and stadium event crowds.
- **Real-Time Event Streaming**: Server-Sent Events (SSE) telemetry pipeline pushing live sensor ticks directly to frontend dashboards without page reload.
- **Conversational AI & Voice Assistant**: Powered by Google Gemini 2.5/3.0 with speech synthesis and voice input for querying city ward metrics, initiating emergency actions, and generating PDF reports.
- **Role-Based Access Control (RBAC)**: Secure multi-persona portal supporting Super Admin, Traffic Officer, Environment Officer, Emergency Responder, and Citizen profiles.
- **System & MLOps Infrastructure Health**: Live monitoring of Node.js heap memory, PostgreSQL connection pool metrics, WebSocket listener counts, and system security audit logs.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React State & Context API
- **Maps**: Leaflet + React Leaflet + GeoJSON
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend & Storage
- **Server**: Express.js / Node.js 20 ESM Server with custom bundler
- **Database**: PostgreSQL 16 + PostGIS Spatial Engine
- **In-Memory Cache**: Redis
- **Observability**: Prometheus (`/metrics`) + Grafana Telemetry
- **Machine Learning**: Native `.pkl` XGBoost / LightGBM / CatBoost model weight inferencing engine

---

## Quick Start (Local Development)

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start development server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Docker Deployment

```bash
# Launch entire SmartCity360 stack (App, PostGIS, Redis, Prometheus, Grafana)
docker-compose up -d --build
```

- **SmartCity360 App**: `http://localhost:3000`
- **Prometheus Metrics**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3001`
- **PostgreSQL / PostGIS**: `localhost:5432`

---

## Production Build

```bash
# Compile Vite frontend and bundle server.ts with esbuild
npm run build

# Start production server
npm run start
```
