# SmartCity360 REST API Reference (/api/v1/)

## Authentication & Authorization

### `POST /api/v1/auth/login`
Authenticates a user and returns a JWT token with role claims.

**Request Body:**
```json
{
  "email": "admin@smartcity360.gov.in",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_01",
    "name": "Tushar Giri",
    "role": "SUPER_ADMIN",
    "department": "Smart City Command Center"
  }
}
```

---

## Real-Time & Streaming

### `GET /api/v1/events/stream`
Server-Sent Events (SSE) endpoint emitting live city telemetry ticks every 4 seconds.

---

## Machine Learning & Predictions

### `GET /api/v1/ml/models`
Returns the operational status of all 6 loaded pickle models.

### `POST /api/v1/ml/predict/:domain`
Executes ML inference for domain (`traffic`, `aqi`, `accident`, `water`, `electricity`, `complaint`).

---

## Simulation & Digital Twin

### `POST /api/v1/simulation/run`
Executes Monte Carlo physics simulation for a urban crisis scenario.

---

## System Telemetry

### `GET /api/v1/system/health`
Returns system memory, PostgreSQL PostGIS pool, WebSocket status, and loaded ML models.

### `GET /metrics`
Prometheus metrics format endpoint.
