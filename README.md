# BookLeaf Publishing Platform

A modern, full-stack publishing platform with AI-powered features for authors and publishers.

## 🎯 Overview

BookLeaf is a comprehensive publishing solution that combines:
- **Backend API** - Express + TypeScript + PostgreSQL
- **Frontend Web** - React + Vite + TypeScript
- **Real-time Service** - Server-Sent Events (SSE) + Redis
- **AI Integration** - Anthropic Claude for content analysis and insights
- **Cloud Ready** - Docker containerization with docker-compose

---

## 🚀 Setup & Quick Start

### 1. Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** (for local development)
- **PostgreSQL 15+** (for local development)
- **Redis 7+** (for local development)
- **ANTHROPIC_API_KEY** (from Anthropic dashboard)

### 2. Environment Configuration

Clone the repository and set up your environment variables:

```bash
git clone [https://github.com/Sanket-Raj/bookleaf-portal.git](https://github.com/Sanket-Raj/bookleaf-portal.git)
cd bookleaf-portal

# Copy the example file and edit it to include your specific keys
cp .env.example .env

docker-compose up --build
cd bookleaf-backend && npm install && cd ..
cd bookleaf-frontend && npm install && cd ..
cd bookleaf-sse && npm install && cd ..


bookleaf-portal/
├── bookleaf-backend/    # Express API, Database models, and Business Logic
├── bookleaf-frontend/   # React SPA, UI Components, and State Management
├── bookleaf-sse/        # Dedicated service for real-time notifications via Redis
├── docker-compose.yml   # Orchestration for all services
└── .env.example         # Template for environment configuration
