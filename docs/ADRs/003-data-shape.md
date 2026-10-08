# ADR-003: Postgres + pgvector With SQL Edges (No Graph DB in MVP)
Date: 2026-10-08
Status: accepted
Decided with: user pick (Postgres + pgvector over dedicated graph DB)

## Context
PRD Sec 20 connections (Project → Founder → Investor → Ecosystem → Narrative,
confidence-labeled, 2-hop walks) plus semantic search embeddings (Phase 5).
Free tiers only (PRD Sec 49: Neon + Upstash). MVP scale: <100k edges.

## Decision
- Canonical store: Postgres (Neon) — `Project, Token, Narrative, Ecosystem, Person,
  Signal, Evidence, Edge, WatchItem, Alert, ResearchSession, ResearchEvent` (Phase 3).
- `Edge(from, to, relation, confidence, why)` traversed in SQL (recursive CTE),
  capped at 2 hops. Confidence labels (Confirmed/Strong/Possible/Unverified) stored
  per edge; Possible/Unverified never presented as fact (PRD Sec 20).
- Embeddings in the same Postgres via pgvector — no separate vector DB.
- Redis (Upstash free) for feed-rank cache, alert dedupe, rate limits — not for truth.

## Why (not a graph DB now)
- 2-hop traversals at <100k edges answer in milliseconds in SQL; a graph engine
  buys nothing measurable at this scale.
- One database = one backup, one free-tier limit, one local `docker-compose`
  service — Neo4j Aura free would add sync jobs + a second failure domain.
- pgvector on Neon free doubles as the embeddings store (verified Oct 2026).

## Consequences
- Revisit (new ADR) when: edges >100k, queries need 4+ hops, or p95 edge-walk
  exceeds 300ms — then evaluate Kuzu (embedded) or Neptune/Neo4j.
- Prisma raw SQL for vector similarity + recursive edge walks until first-class
  support lands; keep those queries in one `packages/db/queries` module.
