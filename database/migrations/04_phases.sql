CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_phase_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index on project_id for faster lookups
CREATE INDEX idx_phases_project_id ON phases(project_id);
