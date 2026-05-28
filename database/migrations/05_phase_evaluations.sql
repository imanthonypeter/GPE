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
