# ADR-001: TypeScript Monorepo Backend Stack
Date: 2026-10-08
Status: accepted
Decided with: user pick (TS monorepo over Python FastAPI)

## Context
PRD Secs 11-13, 16-17 need an API (search, ask, discover, entity, compare, watchlist,
alerts, history) plus cron workers (Phase 4: market/dev/funding/social sync) on free
tiers only (PRD Sec 49: Render Free + Neon Free + pgvector). Solo builder + AI agent.

## Decision
Next.js 14 (App Router) + tRPC + Prisma + Postgres + pgvector + BullMQ, in this pnpm
monorepo (`apps/web`, `apps/api`, `packages/types|ui|prompts`). LLM via OpenRouter
primary → Groq fallback (OpenAI-compatible, `packages/prompts` versioned).

## Why (not FastAPI)
- One language, shared `@web3-agent/types` end-to-end (UserSettings, Signal, Evidence)
  — no DTO drift between frontend and backend.
- tRPC = type-safe APIs with zero OpenAPI maintenance; matches scaffold on disk.
- Prisma + pgvector covers canonical store + embeddings (no separate Pinecone).
- One install, one CI, one Render service pair — fits free hours; FastAPI would split
  them across two runtimes and two languages.
- Our LLM work is hosted API calls, not local models — Python's ML edge doesn't apply.

## Consequences
- Python escape hatch: a dedicated scraping/embeddings worker (FastAPI) may be added
  later ONLY if TS scraping proves insufficient — needs a new ADR + free-tier check.
- Prisma raw SQL for vector similarity until Prisma ships first-class vector ops.
- All recommendation endpoints take `userId` and apply `UserSettings` pre-filters
  (PRD Sec 46.5 / Phase 3).
