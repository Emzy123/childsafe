-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM for abuse types
CREATE TYPE abuse_type_enum AS ENUM ('physical', 'sexual', 'emotional', 'neglect', 'other');

-- ENUM for case status
CREATE TYPE case_status_enum AS ENUM ('reported', 'under_investigation', 'with_agency', 'closed');

-- ENUM for user roles
CREATE TYPE user_role_enum AS ENUM ('admin', 'social_worker', 'law_enforcement');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'social_worker',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Victims table
CREATE TABLE victims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    approximate_age INT,
    gender VARCHAR(10),
    address TEXT,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Perpetrators table
CREATE TABLE perpetrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    aliases TEXT,
    address TEXT,
    known_associations TEXT,
    modus_operandi TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table (core case table)
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_ref VARCHAR(20) UNIQUE NOT NULL,
    victim_id UUID REFERENCES victims(id) ON DELETE SET NULL,
    perpetrator_id UUID REFERENCES perpetrators(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    abuse_type abuse_type_enum NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    location TEXT NOT NULL,
    jurisdiction VARCHAR(100),
    status case_status_enum DEFAULT 'reported',
    is_anonymous BOOLEAN DEFAULT FALSE,
    reporter_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case updates table (history log)
CREATE TABLE case_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id),
    old_status case_status_enum,
    new_status case_status_enum,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_incidents_case_ref ON incidents(case_ref);
CREATE INDEX idx_incidents_victim_id ON incidents(victim_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_incident_date ON incidents(incident_date);
CREATE INDEX idx_users_email ON users(email);
