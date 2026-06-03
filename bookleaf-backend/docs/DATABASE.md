# BookLeaf Database Schema Reference

The BookLeaf database uses PostgreSQL and utilizes the `uuid-ossp` extension for secure, unguessable primary keys.

## Custom Enums
* `user_role`: 'admin', 'author', 'reader'
* `book_status`: 'draft', 'review', 'published'
* `ticket_status`: 'open', 'in_progress', 'resolved', 'closed'

## Tables

### 1. `users`
Stores all account information and role-based access levels.
* `id` (UUID, Primary Key)
* `email` (Unique String)
* `password_hash` (Bcrypt Hash)
* `role` (user_role Enum)

### 2. `books`
Stores both the metadata and the actual manuscript content of books.
* `id` (UUID, Primary Key)
* `author_id` (Foreign Key -> users.id)
* `title`, `description`, `content`
* `status` (book_status Enum)
* `price_cents` (Integer - stores currency safely without floating points)

### 3. `royalties`
Ledger for tracking author earnings from book sales.
* `id` (UUID, Primary Key)
* `author_id` (Foreign Key -> users.id)
* `book_id` (Foreign Key -> books.id)
* `amount_cents` (Integer)

### 4. `tickets`
Support system and AI-assistance request tracking.
* `id` (UUID, Primary Key)
* `user_id` (Foreign Key -> users.id)
* `status` (ticket_status Enum)

### 5. `ai_knowledge_cache`
Stores vector embeddings and cached contextual data for Claude AI to perform RAG (Retrieval-Augmented Generation).
* `id` (UUID, Primary Key)
* `slug` (Unique String)
* `content` (Text)
* `embedding` (REAL[] - Vector array)