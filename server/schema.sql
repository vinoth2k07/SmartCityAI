-- ==============================================================================
-- SmartCity360: Enterprise Digital Twin Analytics Platform (Bengaluru Command)
-- Database Migration Script & Normalized PostgreSQL + PostGIS Schema
-- File: /server/schema.sql
-- ==============================================================================

-- Enable required PostGIS and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. CORE ORGANIZATIONAL & SECURITY DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    head_officer VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    budget_allocated DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_mfa_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. GIS & SPATIAL BOUNDARIES DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_no INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    population INT DEFAULT 0,
    area_sq_km DECIMAL(8,2) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    centroid GEOMETRY(Point, 4326),
    health_score DECIMAL(5,2) DEFAULT 80.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS road_network (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_name VARCHAR(150) NOT NULL,
    road_class VARCHAR(50) NOT NULL, -- Arterial, Sub-arterial, Expressway
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    length_km DECIMAL(8,2),
    speed_limit_kmh INT DEFAULT 50,
    path GEOMETRY(LineString, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS government_buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    building_type VARCHAR(100) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. TRAFFIC, TRANSPORTATION & ROADS DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS traffic_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    junction_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    is_adaptive BOOLEAN DEFAULT TRUE,
    current_status VARCHAR(50) DEFAULT 'Automated AI', -- Automated AI, Manual Control, Green Wave Active
    cycle_time_seconds INT DEFAULT 120,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traffic_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    signal_id UUID REFERENCES traffic_signals(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    avg_speed_kmh DECIMAL(5,2) DEFAULT 25.00,
    vehicle_count_per_min INT DEFAULT 45,
    congestion_level VARCHAR(20) DEFAULT 'Moderate', -- Low, Moderate, Heavy, Gridlock
    last_ping_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_no VARCHAR(50) UNIQUE NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    road_id UUID REFERENCES road_network(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- Low, High, Critical
    fatality_count INT DEFAULT 0,
    injury_count INT DEFAULT 0,
    cause VARCHAR(100),
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS metro_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(100) NOT NULL,
    line_color VARCHAR(30) NOT NULL, -- Purple Line, Green Line, Yellow Line
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    daily_footfall INT DEFAULT 0,
    is_operational BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bus_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_name VARCHAR(100) NOT NULL,
    bmtc_stop_id VARCHAR(50) UNIQUE NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    shelter_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bus_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_no VARCHAR(30) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    total_stops INT DEFAULT 15,
    frequency_mins INT DEFAULT 10
);

-- ------------------------------------------------------------------------------
-- 4. EMERGENCY SERVICES & CRITICAL INFRASTRUCTURE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    total_beds INT DEFAULT 100,
    icu_beds_available INT DEFAULT 10,
    trauma_center_level INT DEFAULT 1,
    contact_phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS police_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    jurisdiction_area VARCHAR(100),
    patrol_vehicles INT DEFAULT 5,
    contact_phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS fire_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    fire_tenders_available INT DEFAULT 3,
    contact_phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_no VARCHAR(30) UNIQUE NOT NULL,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    driver_name VARCHAR(100),
    contact_phone VARCHAR(20),
    current_location GEOMETRY(Point, 4326),
    status VARCHAR(30) DEFAULT 'Available' -- Available, Dispatched, Maintenance
);

CREATE TABLE IF NOT EXISTS emergency_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispatch_code VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(50) NOT NULL, -- Medical, Fire, Crime, Traffic Crash
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    priority VARCHAR(20) NOT NULL, -- Medium, High, Critical
    status VARCHAR(30) DEFAULT 'Active', -- Dispatched, En Route, On Scene, Resolved
    assigned_ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
    assigned_police_id UUID REFERENCES police_stations(id) ON DELETE SET NULL,
    assigned_fire_id UUID REFERENCES fire_stations(id) ON DELETE SET NULL,
    dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 5. ENVIRONMENT & UTILITIES DOMAIN (AQI, WATER, ELECTRICITY)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS aqi_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_code VARCHAR(50) UNIQUE NOT NULL,
    station_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    aqi_index INT NOT NULL,
    pm25 DECIMAL(6,2) NOT NULL,
    pm10 DECIMAL(6,2) NOT NULL,
    no2 DECIMAL(6,2) DEFAULT 0.0,
    so2 DECIMAL(6,2) DEFAULT 0.0,
    co DECIMAL(6,2) DEFAULT 0.0,
    category VARCHAR(30) DEFAULT 'Moderate',
    last_ping_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weather_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    temperature_c DECIMAL(4,1) NOT NULL,
    humidity_pct INT NOT NULL,
    rainfall_mm DECIMAL(6,2) DEFAULT 0.0,
    wind_speed_kmh DECIMAL(5,2) DEFAULT 10.0,
    last_ping_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservoirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    capacity_million_liters DECIMAL(10,2) NOT NULL,
    current_level_pct DECIMAL(5,2) NOT NULL,
    inflow_rate_lps DECIMAL(8,2) DEFAULT 0.0,
    outflow_rate_lps DECIMAL(8,2) DEFAULT 0.0,
    location GEOMETRY(Point, 4326)
);

CREATE TABLE IF NOT EXISTS water_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    reservoir_id UUID REFERENCES reservoirs(id) ON DELETE SET NULL,
    daily_demand_mld DECIMAL(8,2) NOT NULL,
    daily_supply_mld DECIMAL(8,2) NOT NULL,
    deficit_pct DECIMAL(5,2) DEFAULT 0.0,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS transformers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transformer_code VARCHAR(50) UNIQUE NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    capacity_kva INT NOT NULL,
    current_load_pct DECIMAL(5,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Normal', -- Normal, Warning, Overloaded
    location GEOMETRY(Point, 4326)
);

CREATE TABLE IF NOT EXISTS electricity_grid (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    substation_name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    total_capacity_mw DECIMAL(8,2) NOT NULL,
    current_demand_mw DECIMAL(8,2) NOT NULL,
    peak_load_pct DECIMAL(5,2) NOT NULL,
    outage_count INT DEFAULT 0,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ------------------------------------------------------------------------------
-- 6. CITIZEN GOVERNANCE & COMPLAINTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS complaint_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    sla_hours INT DEFAULT 24
);

CREATE TABLE IF NOT EXISTS citizen_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_no VARCHAR(50) UNIQUE NOT NULL,
    category_id UUID REFERENCES complaint_categories(id) ON DELETE RESTRICT,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Emergency
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, Assigned, In Progress, Resolved, Rejected
    location GEOMETRY(Point, 4326),
    reported_by VARCHAR(150) DEFAULT 'Anonymous Resident',
    assigned_dept_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES citizen_complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    remarks TEXT,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. AI MODELS, PREDICTIONS & CHAT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_key VARCHAR(50) UNIQUE NOT NULL, -- traffic_model, aqi_model, accident_model
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    accuracy_score DECIMAL(5,2) DEFAULT 92.50,
    last_trained_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS prediction_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES ai_models(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    metric_type VARCHAR(50) NOT NULL,
    predicted_value DECIMAL(10,2) NOT NULL,
    actual_value DECIMAL(10,2),
    confidence_score DECIMAL(5,2) DEFAULT 0.90,
    horizon_hours INT DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant
    message TEXT NOT NULL,
    context_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. SYSTEM MONITORING, REPORTS & AUDIT LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info', -- info, warning, critical
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_format VARCHAR(20) DEFAULT 'PDF',
    file_size_bytes BIGINT DEFAULT 0,
    download_url TEXT,
    generated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(150),
    role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target_module VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    ip_address INET,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) DEFAULT 'INFO', -- DEBUG, INFO, WARN, ERROR, FATAL
    service_name VARCHAR(100) DEFAULT 'api_server',
    message TEXT NOT NULL,
    stack_trace TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES & SPATIAL OPTIMIZATION
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_wards_boundary ON wards USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_road_network_path ON road_network USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_traffic_sensors_location ON traffic_sensors USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_accidents_location ON accidents USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_aqi_sensors_location ON aqi_sensors USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON citizen_complaints USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_ticket_no ON citizen_complaints(ticket_no);
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON chat_history(session_id);

-- End of Schema Definition
