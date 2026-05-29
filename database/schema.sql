-- 01_users.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'leader', 'teacher')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for faster lookups during login
CREATE INDEX idx_users_email ON users(email);

-- 02_projects.sql
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

-- 03_project_members.sql
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_in_project VARCHAR(100),
    CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_project_user UNIQUE (project_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- 04_phases.sql
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

-- 05_phase_evaluations.sql
CREATE TABLE phase_evaluations (
    id SERIAL PRIMARY KEY,
    phase_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    participation_score NUMERIC(5, 2) NOT NULL CHECK (participation_score >= 0 AND participation_score <= 100),
    justification_text TEXT,
    evaluated_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eval_phase FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE,
    CONSTRAINT fk_eval_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_eval_evaluator FOREIGN KEY (evaluated_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_phase_user_eval UNIQUE (phase_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_phase_evaluations_phase_id ON phase_evaluations(phase_id);
CREATE INDEX idx_phase_evaluations_user_id ON phase_evaluations(user_id);

-- 06_final_results.sql
CREATE TABLE final_results (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    final_average NUMERIC(5, 2) NOT NULL,
    eligible_for_defense BOOLEAN NOT NULL,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_result_project_user UNIQUE (project_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_final_results_project_id ON final_results(project_id);
CREATE INDEX idx_final_results_user_id ON final_results(user_id);
