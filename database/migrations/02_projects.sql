CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(255),
    leader_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_leader FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index on leader_id for faster lookups
CREATE INDEX idx_projects_leader_id ON projects(leader_id);
