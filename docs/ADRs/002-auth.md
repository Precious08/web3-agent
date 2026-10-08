# ADR-002: Auth.js v5 Self-Hosted Auth on Neon
Date: 2026-10-08
Status: accepted
Decided with: user pick (Auth.js; combos with Supabase considered and rejected)

## Context
MVP needs email magic-link + Google/GitHub OAuth (Phase 7, US-16..18 watchlist
alerts are per-user). ADR-001 locked Neon Postgres + TS monorepo. No orgs/SSO in
MVP (PRD Sec 48E). Free tiers only (PRD Sec 49).

## Decision
Auth.js v5 (NextAuth) self-hosted in `apps/web`, Prisma/Neon adapter, DB sessions.
Providers for MVP: email magic-link (Resend free) + Google + GitHub OAuth.

## Why (not Supabase Auth / Clerk / dual-auth)
- $0 unlimited MAU forever, no per-user meter, no extra vendor or dashboard.
- Lives where the app lives; `userId` flows straight into every recommendation call
  (PRD Sec 46.5) with no cross-service session sync.
- Supabase Auth's headline benefit (row-level security) requires a Supabase database;
  we run Neon, so it would be a second vendor for no integration gain.
- Clerk is faster to set up but introduces per-user billing and lock-in pre-revenue.
- Dual auth (Supabase Auth + Auth.js) rejected: two user tables, two sessions —
  bug surface with zero user gain.

## Consequences
- We build and own sign-in UI + session edge cases (~1-2 days, shadcn components).
- Magic-link email via Resend free tier (3k/mo); alert digests reuse the same sender.
- Revisit only if: org/SSO demand appears (P2) or auth maintenance exceeds ~1 day/mo —
  then evaluate Clerk with fresh pricing, via new ADR.
