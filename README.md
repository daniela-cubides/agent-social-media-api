# AI Content Scheduler API

The goal of this application is to help marketing and publicity companies automatically generate, manage, and publish AI-generated social media content.

This is a NestJS + MongoDB (Mongoose) CRUD API that will later integrate with AI providers to generate and schedule content. It was bootstrapped with the Nest CLI using `nest new project-name`.

## Scope

- CRUD for AI content items.
- Storage in MongoDB via Mongoose.
- Future integration with AI content generation and scheduling providers (TBD).

## Tech Stack

- Node.js + TypeScript
- NestJS
- MongoDB
- Mongoose

## Project Structure

- `src/` application source
- `src/ai-content/` AI content feature module (controllers, services, schemas)
- `src/ai-content/schemas/` Mongoose schemas

## Getting Started

```bash
npm install
```

## Project Bootstrap Steps (What I Did)

```bash
# Create the project
nest new project-name

# Manually remove default example files and tests
rm src/app.controller.ts
rm src/app.controller.spec.ts
rm src/app.service.ts
rm src/ai-content/ai-content.controller.spec.ts
rm src/ai-content/ai-content.service.spec.ts
rm -rf src/ai-content/entities
rm -rf test
```

### Generate AI Content Feature (Nest CLI)

```bash
# Generate a full CRUD resource (module + controller + service + DTOs)
nest generate resource ai-content
```

### Development (Local Docker Compose)

```bash
docker compose up -d
```

Tail the API logs:

```bash
docker compose logs -f app
```

### Production (Local)

```bash
npm run build
npm run start:prod
```

## Environment

Where to set the MongoDB connection string:

- If you run locally (not using Docker Compose): edit `.env` and set:

```bash
MONGODB_URI=mongodb://localhost:27017/agent-social-media
```

- If you run with Docker Compose: the value is already set in `docker-compose.yml`
  under the app service environment section. Update it there if needed.

## Mastra + Gemini (Short Setup)

1. Install deps:

```bash
npm install @mastra/core @ai-sdk/google
```

2. Add your Gemini key in `.env`:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

3. Minimal usage (server-side):

```ts
import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

const agent = new Agent({
  id: 'caption-agent',
  name: 'caption-agent',
  instructions: 'Improve the caption and return only the final text.',
  model: google('gemini-2.5-flash'),
});
```

Use `agent.generateLegacy(...)` if you see the “AI SDK v4 model not compatible with generate()” error.

## Local MongoDB With Docker (Compose)

```bash
# Start MongoDB locally
docker compose up -d

# Stop and remove containers
docker compose down
```

## MongoDB Compass (Local)

Use this connection string in Compass:

```bash
mongodb://admin:admin123@localhost:27017/agent-social-media?authSource=admin
```

## Deployment (Outline)

1. Provision a MongoDB instance (Atlas or self-hosted).
2. Set `MONGODB_URI` in the runtime environment.
3. Build and run:

```bash
npm run build
npm run start:prod
```

## Notes

- AI provider integration is planned but not defined yet.
- Scheduling behavior will be added after the base CRUD is stable.
