# BookLeaf System Architecture

BookLeaf is a modern, decoupled web application designed for scalability and real-time interactions. It utilizes a microservices-inspired approach for handling real-time data separately from standard HTTP requests.

## 1. Core Tech Stack

* **Frontend:** React (Vite build system), TypeScript
* **Backend API:** Node.js, Express, TypeScript
* **Real-time Service:** Node.js, Server-Sent Events (SSE)
* **Database:** PostgreSQL (Relational Data & Vector Storage)
* **Caching & Message Broker:** Redis (Pub/Sub for SSE)
* **AI Integration:** Anthropic Claude 3 (via SDK)
* **Containerization:** Docker & Docker Compose

## 2. Service Boundaries

### `bookleaf-backend` (Main API Gateway)
Handles all standard CRUD operations, database queries, authentication (JWT/bcrypt), and AI prompting. It connects directly to PostgreSQL.

### `bookleaf-sse` (Real-Time Service)
A dedicated, lightweight Node service responsible solely for maintaining long-lived HTTP connections with clients for real-time notifications (e.g., ticket updates, AI completion events). It subscribes to Redis channels published by the main backend.

### `bookleaf-frontend` (Client UI)
The user-facing application. It makes standard REST calls to the backend and subscribes to the SSE service for real-time updates.

## 3. Deployment Flow
The entire stack is containerized using Docker. The `docker-compose.yml` orchestrates the initialization of PostgreSQL, Redis, the Backend, the SSE service, and the Frontend for seamless local development and production deployment.