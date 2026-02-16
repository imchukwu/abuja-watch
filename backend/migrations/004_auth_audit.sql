-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'editor', -- 'admin' or 'editor'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin (password: password123)
-- Hash generated using bcrypt cost 10
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$10$jOrLm14R0JAt/SQ6AnIbD.e2NjnOM4o5A/xQVeLzo831VpCFCOaSa', 'admin')
ON CONFLICT (username) DO NOTHING;
