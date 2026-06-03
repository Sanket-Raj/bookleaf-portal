-- Up Migration (Applying changes)
BEGIN;

CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_knowledge_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    embedding REAL[], -- Array representation of embeddings for Vector Search
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- Down Migration (Reverting changes)
/*
BEGIN;
DROP TABLE IF EXISTS ai_knowledge_cache CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TYPE IF EXISTS ticket_status;
COMMIT;
*/