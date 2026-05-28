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
