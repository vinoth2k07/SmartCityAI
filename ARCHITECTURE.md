# SmartCity360 Enterprise Architecture Guide

## 1. System Architecture Overview

SmartCity360 follows a decoupled full-stack architecture built on Node.js/Express, React 18, PostgreSQL/PostGIS, and Google Gemini AI.

```
                    +-------------------------------------+
                    |   Browser Client (React 18 + Vite)  |
                    |  Leaflet GIS | TailWind | Web Speech |
                    +------------------+------------------+
                                       |
                         REST / SSE Stream (Port 3000)
                                       |
                    +------------------v------------------+
                    |    Node.js Express API Server       |
                    |  Security Middleware | Rate Limiter |
                    +--------+-------------------+--------+
                             |                   |
            +----------------v---+           +---v----------------+
            |  ML Pickle Engine  |           | PostgreSQL PostGIS |
            |  6 .pkl Weights    |           |  28 Schema Tables  |
            +--------------------+           +--------------------+
```

## 2. Spatial & Database Layer

- **PostgreSQL 16 + PostGIS 3.4**: Stores geometry data for Bengaluru's 12 major administrative wards (Central Silk Board, Koramangala, Indiranagar, Whitefield, Hebbal, Electronic City, Jayanagar, Marathahalli, Bellandur, Malleshwaram, Peenya, Yelahanka).
- **PostGIS Spatial Queries**: Used for calculating nearest hospital corridors (`ST_Distance`), buffer zones for flood impacts (`ST_Buffer`), and incident density clustering.

## 3. Machine Learning Inferencing Pipeline

The `MLEngineService` in `/server/mlEngine.ts` loads trained model weights for 6 critical urban domains:
1. `traffic_model.pkl` - XGBoost Regressor predicting congestion indices and queue lengths.
2. `aqi_model.pkl` - XGBoost Dispersion Model calculating PM2.5 & PM10 concentrations.
3. `accident_model.pkl` - RandomForest Classifier evaluating junction fatality risk.
4. `water_model.pkl` - MLP Pressure Net monitoring BWSSB pipeline pressure.
5. `electricity_model.pkl` - LightGBM Forecaster projecting BESCOM transformer load.
6. `complaint_model.pkl` - CatBoost Regressor estimating citizen grievance SLA resolution time.

## 4. Security & Compliance

- **Role-Based Access Control (RBAC)**: Fine-grained user personas (`SUPER_ADMIN`, `TRAFFIC_OFFICER`, `ENVIRONMENT_OFFICER`, `EMERGENCY_RESPONDER`, `CITIZEN`).
- **Audit Logging**: Every administrative green-wave trigger, ambulance corridor override, and tanker dispatch is recorded in `db.auditLogs`.
- **Prometheus Telemetry**: Native `/metrics` endpoint exposing Node.js memory heap usage, system CPU time, request counts, and loaded model counts.
