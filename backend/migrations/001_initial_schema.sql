-- Area Councils
CREATE TABLE IF NOT EXISTS area_councils (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'FCT'
);

-- Wards
CREATE TABLE IF NOT EXISTS wards (
    id VARCHAR(50) PRIMARY KEY,
    area_council_id VARCHAR(50) REFERENCES area_councils(id),
    name VARCHAR(100) NOT NULL,
    total_polling_units INT DEFAULT 0,
    registered_voters INT DEFAULT 0
);

-- Ward Results (One-to-One with Wards for simplicity in this iteration)
CREATE TABLE IF NOT EXISTS ward_results (
    ward_id VARCHAR(50) PRIMARY KEY REFERENCES wards(id),
    
    -- Logistics
    arrival_time VARCHAR(50),
    collation_start_time VARCHAR(50),
    
    -- Staffing
    inec_staff INT DEFAULT 0,
    security_present BOOLEAN DEFAULT false,
    party_agents INT DEFAULT 0,
    
    -- Integrity Checks
    ec8b_submitted BOOLEAN DEFAULT false,
    ec8c_collated BOOLEAN DEFAULT false,
    csrvs_done BOOLEAN DEFAULT false,
    votes_announced BOOLEAN DEFAULT false,
    agents_countersigned BOOLEAN DEFAULT false,
    ec60e_displayed BOOLEAN DEFAULT false,
    
    -- Voting Stats
    accredited_voters INT DEFAULT 0,
    valid_votes INT DEFAULT 0,
    rejected_votes INT DEFAULT 0,
    votes_cast INT DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Party Results per Ward
CREATE TABLE IF NOT EXISTS party_results (
    id SERIAL PRIMARY KEY,
    ward_id VARCHAR(50) REFERENCES wards(id),
    party_name VARCHAR(20) NOT NULL,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ward_id, party_name)
);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    ward_id VARCHAR(50) REFERENCES wards(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- violence, fraud, etc.
    severity VARCHAR(20), -- low, medium, high
    status VARCHAR(20) DEFAULT 'reported', -- reported, resolved
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Area Councils (FCT)
INSERT INTO area_councils (id, name) VALUES
('abaji', 'Abaji'),
('bwari', 'Bwari'),
('gwagwalada', 'Gwagwalada'),
('kuje', 'Kuje'),
('kwali', 'Kwali'),
('amac', 'Abuja Municipal Area Council')
ON CONFLICT (id) DO NOTHING;
