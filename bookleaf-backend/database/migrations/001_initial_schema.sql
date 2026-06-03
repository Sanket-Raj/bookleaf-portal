-- Up Migration
BEGIN;

-- Enable UUID extension to allow generating secure unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the user roles enum for Role-Based Access Control (RBAC)
CREATE TYPE user_role AS ENUM ('admin', 'author', 'reader');

-- Create the baseline users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'reader',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- Down Migration
/*
BEGIN;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role;
DROP EXTENSION IF EXISTS "uuid-ossp";
COMMIT;
*/