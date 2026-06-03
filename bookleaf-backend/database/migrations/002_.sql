-- Up Migration (Applying changes)
BEGIN;

CREATE TYPE book_status AS ENUM ('draft', 'review', 'published');

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Markdown or plain text content of the book
    status book_status DEFAULT 'draft',
    price_cents INTEGER DEFAULT 0, -- Storing currency in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE royalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- Down Migration (Reverting changes)
/*
BEGIN;
DROP TABLE IF EXISTS royalties CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TYPE IF EXISTS book_status;
COMMIT;
*/