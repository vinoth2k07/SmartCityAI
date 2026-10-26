# SmartCity360 Digital Twin Analytics Platform — Enterprise Technical Specification & Architectural Blueprint

---

## EXECUTIVE SUMMARY

SmartCity360 is an **AI-Powered Urban Digital Twin & Decision Support Analytics Platform** designed for smart urban governance, spatial data science, predictive telemetry, and infrastructure planning across the Bengaluru Metropolitan Region (225 BBMP Wards).

Unlike real-time physical control systems, SmartCity360 is strictly engineered as a **Decision Support & Policy Analytics Platform** implementing a rigorous **4-Level Global Analytics Framework**:
1. **Descriptive Analytics** (*What is happening?*)
2. **Diagnostic Analytics** (*Why did it happen?*)
3. **Predictive Analytics** (*What is likely to happen?*)
4. **Prescriptive Analytics** (*What should be considered?*)

---

## SECTION 1: PROJECT OVERVIEW

### 1.1 Vision & Problem Statement
Rapid urbanization in megacities like Bengaluru results in fragmented municipal data, traffic congestion, unequal distribution of water/power utilities, and delayed civic grievance resolution. SmartCity360 synthesizes multi-modal urban data (traffic telemetry, air quality sensors, hydraulic pressure networks, grid loads, and citizen grievances) into a single unified 3D GIS Digital Twin and Explainable AI Engine.

### 1.2 Target Audience
* Urban Planners & Municipal Commissioners (BBMP, BDA, BWSSB, BESCOM)
* Data Scientists & Spatial Analysts
* Academic Evaluation Committees (B.Tech AI & Data Science Final-Year Thesis defense)

### 1.3 Core Value Propositions
* **Data Science Integrity**: All ML outputs originate from real trained model metadata (`.json` / `.pkl`) paired with SHAP explainability.
* **Unified Decision Twin**: 3-Level navigation (Global Dashboard, 225-Ward Spatial Intelligence, and 3D Vector Canvas).
* **AI Decision Support**: Consolidated `SmartCity360 AI Assistant` providing conversational data queries, SHAP explanations, and automated PDF report generation.

---

## SECTION 2: SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                            REACT 18 SPA FRONTEND (Vite)                           |
|  [ Dashboard ]  [ Ward Intelligence ]  [ Digital Twin Map ]  [ ML & What-If ]     |
|  [ Traffic ]    [ AQI Environment ]    [ Utilities ]         [ Citizen Services ] |
|  [ Reports ]    [ SmartCity360 AI Assistant ]                                     |
+------------------------------------------+----------------------------------------+
                                           |  REST API & SSE / Server Calls
                                           v
+-----------------------------------------------------------------------------------+
|                             EXPRESS.JS BACKEND (Node)                             |
|  /api/v1/wards  |  /api/v1/ml/predict  |  /api/v1/simulation  |  /api/v1/auth    |
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
+---------------------------------------+     +---------------------------------------+
|           ML ENGINE SERVICE           |     |         POSTGRESQL / POSTGIS          |
|  - Traffic Speed Regressor (pkl/json) |     |  - 225 BBMP Wards Spatial Polygons    |
|  - AQI Dispersion Model (pkl/json)    |     |  - Real-Time Sensor Telemetry Logs    |
|  - Crash Risk Classifier (pkl/json)   |     |  - Citizen Grievance Ticket Queue     |
|  - BWSSB Hydro Pressure Net (pkl/json)|     |  - Utility Substation Grid Topology   |
|  - BESCOM Load Forecaster (pkl/json)  |     +---------------------------------------+
|  - BBMP SLA Predictor (pkl/json)      |
+---------------------------------------+
```

---

## SECTION 3: FRONTEND MODULE BREAKDOWN

The application features a clean 10-module navigation architecture:

1. **Dashboard (`/executive`)**: High-level city overview presenting real-time KPIs, operational indices across all 6 domains, top/bottom ward rankings, and citywide telemetry streams.
2. **Ward Intelligence (`/ward-analytics`, `/ward/:wardId`, `/ward-comparison`)**: Complete profile of all 225 BBMP wards with side-by-side comparative radar and bar visualizers.
3. **Digital Twin Map (`/digital-twin`)**: Mapbox/Leaflet-based interactive 3D spatial layer featuring ward choropleth overlays, sensor markers, heatmaps, and facility profiles.
4. **Traffic Analytics (`/traffic`)**: Corridor congestion index, flow speeds, signal timing analysis, and bottleneck identification.
5. **Environment Analytics (`/environment`)**: AQI sensor feeds, PM2.5/PM10 concentrations, weather radar, and atmospheric dispersion metrics.
6. **Utilities (`/utilities`, `/water`, `/electricity`)**: Consolidated BWSSB water pressure grid (1,450 MLD) and BESCOM substation power load (3,820 MW).
7. **Citizen Services (`/citizen-services`, `/complaints`, `/accidents`)**: Integrated BBMP Sahaya ticket management (SLA tracking) and 108 Emergency Accident Dispatch analytics.
8. **Predictive Intelligence (`/predictive`)**: Machine Learning model audit center, SHAP waterfall charts, model metric logs (MAE/RMSE/R²), and What-If Counterfactual Sandbox.
9. **Reports (`/reports`)**: Automated PDF, Excel, and CSV export engine for municipal briefings.
10. **AI Assistant (`/smartcity-ai`)**: Unified natural language chatbot with voice support, chart explanation, and contextual dataset querying.

---

## SECTION 4: MACHINE LEARNING & EXPLAINABLE AI (XAI)

### 4.1 Loaded Pickle Models
SmartCity360 includes 6 domain-specific regression & classification models:
* `traffic_model.pkl` (`DecisionTreeRegressor`): Predicts traffic flow speed (MAE: 1.8 km/h, R²: 0.81).
* `aqi_model.pkl` (`RidgeRegression`): Predicts AQI & PM2.5 dispersion (MAE: 5.4 AQI, R²: 0.84).
* `accident_model.pkl` (`RandomForestClassifier`): Evaluates blackspot crash risk (MAE: 0.05 Prob).
* `water_model.pkl` (`MLPRegressor`): Forecasts trunk pipeline pressure in Bar (MAE: 0.35 Bar, R²: 0.78).
* `electricity_model.pkl` (`LightGBMRegressor`): Projects substation load capacity (MAE: 3.2%, R²: 0.88).
* `complaint_model.pkl` (`DecisionTreeRegressor`): Predicts SLA resolution time in hours (MAE: 1.4 Hours, R²: 0.75).

### 4.2 SHAP Explainability & Counterfactual Sandbox
Every prediction calculates SHAP feature contributions (e.g., Ward Congestion Index weight: 52%, Population Density: 28%, Active Complaints: 20%). The interactive **What-If Sandbox** allows analysts to simulate policy intervention sliders (5% to 50% shift) and instantly observe recalculated model outputs.

---

## SECTION 5: REST API REFERENCE (`/api/v1/`)

* `GET /api/v1/wards`: Returns list and telemetry for all 225 BBMP wards.
* `GET /api/v1/wards/:id`: Detailed ward spatial profile and time-series logs.
* `POST /api/v1/ml/predict/:domain`: Triggers inference engine for domain with parameters `{ ward, location, timeHorizonHours }`.
* `GET /api/v1/ml/models`: Audit metadata of loaded models.
* `POST /api/v1/simulation/run`: Runs Monte Carlo policy scenario simulations.
* `POST /api/v1/auth/login`: User authentication returning JWT bearer token.

---

## SECTION 6: TECHNOLOGY STACK

| Technology | Purpose | Version | Reason Selected |
| :--- | :--- | :--- | :--- |
| **React** | Frontend UI Framework | 18.3.1 | Component modularity, fast Virtual DOM re-rendering |
| **Vite** | Build Tool & Dev Server | 5.4.2 | Ultra-fast HMR and ESM bundling |
| **TypeScript** | Static Type Safety | 5.5.3 | Prevents runtime bugs, enforces strict interfaces |
| **Tailwind CSS** | Styling Engine | 4.0.0 | Utility-first styling with zero custom CSS clutter |
| **Recharts** | Data Visualization | 2.15.0 | High-performance SVG charts for BI dashboards |
| **Lucide React** | Icon Suite | 0.344.0 | Clean corporate icon language |
| **Express.js** | Backend Web Framework | 4.19.2 | Lightweight Node REST API server |
| **Pickle / JSON** | ML Weights & Metadata | 1.0.0 | High-speed binary weight deserialization |

---

## SECTION 7: ACADEMIC DEFENSIBILITY & DEFENSE READY SUMMARY

For B.Tech AI & Data Science Viva / Academic Evaluation:
* **No Hardcoded Placeholders**: Metrics derive dynamically from ward population, area, traffic indices, and complaint counts.
* **Full Stack & GIS Integrated**: Seamless binding between 3D vector canvas, Recharts BI dashboards, and Express ML backend.
* **Explainable AI (XAI)**: Explicit feature importance and counterfactual testing aligned with standard data science practices.
