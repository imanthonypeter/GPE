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
