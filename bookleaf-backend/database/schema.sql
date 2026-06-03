-- ==========================================
-- BOOKLEAF MASTER DATABASE SCHEMA REFERENCE
-- ==========================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables/types if resetting (Optional reference)
-- DROP TABLE IF EXISTS ai_knowledge_cache CASCADE;
-- DROP TABLE IF EXISTS tickets CASCADE;
-- DROP TABLE IF EXISTS royalties CASCADE;
-- DROP TABLE IF EXISTS books CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TYPE IF EXISTS ticket_status;
-- DROP TYPE IF EXISTS book_status;
-- DROP TYPE IF EXISTS user_role;

-- 1. ENUMS & CUSTOM TYPES
CREATE TYPE user_role AS ENUM ('admin', 'author', 'reader');
CREATE TYPE book_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- 2. CORE USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'reader',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BOOKS & MANUSCRIPTS TABLE
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Stored as markdown or raw manuscript text
    status book_status DEFAULT 'draft',
    price_cents INTEGER DEFAULT 0, -- Stored in cents to avoid precision floating-point issues
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ROYALTY TRANSACTIONS TABLE
CREATE TABLE royalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SUPPORT & AI HELP TICKETS TABLE
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AI CONTEXT VECTOR CACHE TABLE
CREATE TABLE ai_knowledge_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    embedding REAL[], -- Native representation of generated text vectors
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_royalties_author ON royalties(author_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);