-- Party Configuration per Area Council
CREATE TABLE IF NOT EXISTS area_council_parties (
    area_council_id VARCHAR(50) PRIMARY KEY REFERENCES area_councils(id),
    parties JSONB NOT NULL DEFAULT '["APC", "LP", "PDP", "NNPP", "APGA", "ADC", "SDP", "YPP"]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default configuration for all existing Area Councils
INSERT INTO area_council_parties (area_council_id)
SELECT id FROM area_councils
ON CONFLICT (area_council_id) DO NOTHING;
