# Feature Flag Platform

A backend feature-flag and experimentation service: create flags, target them by user attributes or reusable segments, roll them out gradually with deterministic percentage bucketing, and measure the outcome with built-in exposure/conversion tracking. Real-time flag changes propagate to connected clients via Server-Sent Events, and a Node SDK does local, zero-network-call evaluation with an automatic polling fallback if the live connection drops.

## Architecture

- **API** — Fastify, exposing flag/segment/experiment CRUD and evaluation endpoints
- **Persistence** — PostgreSQL (flags, segments, exposures, outcomes)
- **Caching** — Redis, caching flag lookups on the hot evaluation path, invalidated on every write
- **Propagation** — Redis Pub/Sub → Server-Sent Events, so flag changes reach connected clients within ~1–2 seconds without polling
- **SDK** — `src/sdk/client.ts`, a client library that fetches initial state, subscribes to live updates, evaluates flags locally, and falls back to polling with automatic reconnection if the stream drops

## Prerequisites

- Node.js 20+
- Docker Desktop (for Postgres and Redis)

## Setup

1. Clone the repo and install dependencies:
npm install

2. Copy the example environment file and adjust if needed:
cp .env.example .env

3. Start Postgres and Redis:
docker compose up -d

4. Load the database schema:
Get-Content db/schema.sql | docker exec -i feature-flag-platform-postgres-1 psql -U ffp -d feature_flags

5. Run the test suite to confirm everything is working:
npm test

6. Start the API server:
npx ts-node src/index.ts

## API Overview

| Method | Route | Purpose |
|---|---|---|
| POST | `/flags` | Create a flag |
| GET | `/flags` | List all flags |
| GET | `/flags/:id` | Get a flag by id |
| PATCH | `/flags/:id` | Update description/enabled/defaultValue |
| DELETE | `/flags/:id` | Delete a flag |
| PUT | `/flags/:id/rules` | Set targeting rules |
| PUT | `/flags/:id/rollout` | Set a percentage rollout |
| POST | `/evaluate/:key` | Evaluate a flag for a given user; logs an exposure |
| GET | `/stream` | Server-Sent Events stream of flag changes |
| POST | `/segments` | Create a reusable user segment |
| GET | `/segments` | List all segments |
| DELETE | `/segments/:id` | Delete a segment |
| POST | `/outcomes` | Log a conversion event for a user |
| GET | `/experiments/:key/stats?event=` | Per-variant exposure/conversion stats for a flag |

## Testing

All automated tests run against real Postgres and Redis containers (via Docker), not mocks, for anything touching persistence or caching. The evaluation engine and SDK's local evaluation logic are pure unit tests with no external dependencies.
npm test

## Project Status

Core backend (flag CRUD, rule/segment-based targeting, percentage rollouts, caching, real-time propagation, SDK, experimentation stats) is complete and tested. Not yet built: a management dashboard UI, authentication/authorization, and a deployed environment.