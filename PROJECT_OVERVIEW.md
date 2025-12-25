# VocaVision Project Overview

VocaVision is an AI-powered vocabulary learning platform that blends spaced repetition, multimedia content, and gamification across web and mobile clients.

## Platform Goals
- Deliver science-backed learning with SM-2 spacing, adaptive difficulty, and multiple mnemonic modalities (images, video, rhyming, etymology). 
- Provide rich content (101+ curated words with pronunciation, synonyms/antonyms, examples, and AI-generated mnemonics) and motivation through achievements, daily goals, and streaks.
- Keep progress synchronized across devices through responsive web and React Native apps backed by a unified API.

## Technology Stack at a Glance
- **Backend:** Express.js + TypeScript API with PostgreSQL (Prisma ORM), JWT auth, OpenAI integration for AI content, and Stripe for payments.
- **Web Frontend:** Next.js 14 (App Router) with TypeScript, Tailwind CSS, Zustand state, and Framer Motion animations.
- **Mobile:** React Native + Expo with React Navigation and React Native Paper UI.
- **DevOps:** Docker/Docker Compose orchestration with Nginx reverse proxy, GitHub Actions CI/CD, and Jest + Playwright for automated testing.

## Monorepo Layout
- `backend/`: Express API entrypoint, route/controller/middleware layers, and `prisma/` schema plus seed data for 101 words.
- `web/`: Next.js app organized under `src/app` for dashboard, learning flows, quizzes, word browsing, collections, achievements, bookmarks, history, statistics, settings, and pricing, supported by shared components and libs.
- `mobile/`: React Native/Expo app with screens, shared components, services, and navigation configuration.
- `queue-system/`: Bull/Redis-based batch-processing service for image/content generation, CSV/Excel imports, exports, progress SSE, prioritization, retries, and admin dashboard UI.
- Operations: `docker-compose.yml`, `nginx.conf`, deployment scripts, and environment templates for full-stack orchestration.

## Key Supporting Documentation
- Quick start, deployment, and API references: `QUICKSTART.md`, `DEPLOYMENT.md`, Swagger at `/api-docs`, and backend API docs.
- Additional deep dives: architecture (`ARCHITECTURE.md`), implementation phases (`IMPLEMENTATION_SUMMARY.md`), CI/CD, incident response, and other operational guides located at the repository root and under `docs/`.
