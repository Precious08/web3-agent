# Implementation Plan — Web3 Research & Alpha Discovery Agent
Source: `Web3 Agent.md` v0.2-pruned (Secs 1-48, US-01..US-28) + `README.md`
Repo state: docs-only, `master` @ `v0.2-pruned`, no code. Remote: `Precious08/web3-agent`.
Goal MVP: prove `SEARCH/ASK → UNDERSTAND → SIGNALS → EVIDENCE → CONNECTIONS → CHALLENGE → WATCH` with 1 Discover stream, 4-state signals, 3-way Fact/Take/Unknown, Basic Control Center.

---
## Phase 0 — Foundations (repo, tooling, conventions)
**Goal:** buildable repo, no docs drift.
**Tasks:**
- Update `README.md` to v0.2 (Secs 1-48, 4-state, 3-way, Basic vs Advanced, Sec 48 link). Add `Status: v0.2-pruned`.
- Add `/docs/ADRs/`, `.gitignore` (node/python/env), `LICENSE` (decide: MIT vs proprietary TBD in README:82), `.editorconfig`, `CONTRIBUTING.md` (branch `feat/*`, conventional commits).
- Decide monorepo layout now:
```
/apps/web (Next.js 14 App Router, TS)
/apps/api (NestJS or FastAPI — see Phase 2 ADR-001)
/packages/ui (design system)
/packages/types (UserSettings, Signal, Evidence DTOs)
/packages/prompts (agent system prompts, eval sets)
/infra (docker-compose, GH Actions, Terraform stub)
/docs (PRD link, ADRs, API contracts, eval reports)
```
- CI: lint+typecheck+unit on PR, preview deploy for web.
**Exit:** `pnpm|npm` install clean, CI green, structure matches this tree.
**Maps to:** Sec 38 core loop, Sec 47.2 P0 item 9.

## Phase 1 — Design System (before any feature UI)
**Goal:** no ad-hoc UI; every PRD block has a component.
**Decisions (ADR-002):** Tailwind + shadcn/ui + Radix, dark-first (default dark per 46.1), Inter/Space Grotesk, CSS vars for tokens.
**Tokens:** colors `bg/surface/border/signal-strong|emerging|uncertain|noise`, spacing 4pt, radius 10/14, `Compact/Comfortable` density var (default Comfortable, no toggle in MVP).
**Core components (packages/ui):**
- `SignalBadge` (4 states only — Sec 22 pruned), `EvidenceInline` (claim↔sources, Sec 13.4), `FactTakeUnknown` tabs (Sec 23 pruned), `ConnectionEdge` (Confirmed/Strong/Possible/Unverified, Sec 20), `CounterCallout`, `WhyThisSheet` (reason → Tune link, Sec 43.3), `DiscoveryCard` (what/why/signals/evidence-strength/counter/next), `CompareTable2Way` (Sec 21 pruned), `Empty/Loading/Error` + skeleton for research.
- Storybook or `/design` preview route with a11y (keyboard, contrast, focus) checks.
**Exit:** all components render mocked PRD examples (Sec 13.3 table, Sec 16 example, Sec 21 table) with dark theme, no backend.

## Phase 2 — Architectural Decisions (ADRs — decide before coding)
**ADR-001 Stack:** Recommended: Next.js 14 (TS) + tRPC or REST + Prisma/Postgres (pgvector) + Redis/BullMQ + Python worker for ingestion/embeddings. Alt: FastAPI backend if team is Python-heavy. Record choice + why (hiring, RAG libs, pgvector maturity).
**ADR-002 Auth/session:** MVP: email+magic link (Auth.js/Clerk). No wallets (Sec 48E cut). `userId` on every recommendation call.
**ADR-003 Data shape:** Postgres canonical (projects, signals, evidence, edges, watchlist) + pgvector for semantic search; Redis for feed rank cache + alert dedupe. No separate graph DB in MVP (edges in SQL, traverse 2 hops).
**ADR-004 LLM:** Provider-agnostic gateway (OpenAI/Anthropic switchable), temp 0 for extraction/assessment, higher for synthesis; all prompts versioned in `packages/prompts`; every claim must carry `sourceIds` or be marked Unknown (Sec 6.2, 23).
**ADR-005 Ingestion:** Pull-only MVP (cron workers, no websockets): CoinGecko/CoinMarketCap (market), GitHub API (dev), RSS/research blogs + docs (funding/launches), Kaito/LunarCrush-or-manual-social-stub (social — explicitly best-effort). On-chain wallet-level = stubbed per Sec 8 pruned.
**ADR-006 Ranking:** Deterministic pre-rank (filters → convergence count → recency/evidence) then LLM re-rank/explain. Convergence default 2+ (Sec 6.3). Single `sensitivity` maps to thresholds (conservative/balanced/aggressive) — no weight sliders in MVP (Sec 45.3 pruned).
**Exit:** 6 ADRs merged in `/docs/ADRs`, API base (`/api/health`, `/api/me/settings`) stubbed.

## Phase 3 — Data Model + Backend Skeleton
**Tables (Prisma):** `User, UserSettings, Project, Token, Narrative, Ecosystem, Person, Signal, Evidence, Edge, WatchItem, Alert, ResearchSession, ResearchEvent`.
**UserSettings (MVP Basic only):** `{ stages[], sectors[], chains[], tokenStatus[], role, followedNarratives[], mutedNarratives[], blocked[], surpriseMe(0-100, def 25), sensitivity(balanced), globalAlertThreshold, maxPerDay, saveHistory(bool) }` — everything else is P2 (Sec 48A-F). One `PUT /me/settings` with Zod validation + `Reset to defaults`.
**Core APIs (REST/tRPC):**
- `GET /search?q` → ranked entities + investigation paths (US-01)
- `POST /ask` → structured answer { summary, signals, evidence[], counters[], unknowns[], next[] } (US-02)
- `GET /discover?view=foryou|early` → single stream; `early` = Radar view (Secs 16-17 unified)
- `GET /entity/:type/:id` → Intelligence Page payload (6 blocks pruned: overview/signals/evidence/connections/counters/next)
- `POST /compare` (2 ids max, projects only), `GET/POST /watchlist`, `GET /alerts/preview`, `GET/DELETE /history`
- Every discovery returns `why: string[]` for WhyThisSheet.
**Exit:** CRUD + settings round-trip tested, seed script loads 20 demo projects with signals/evidence/edges.

## Phase 4 — Ingestion (4 core scopes only — Sec 8 pruned)
**Build workers (BullMQ cron):** `market-sync` (prices/liq/listings), `dev-sync` (releases/commits/contributors velocity), `funding-sync` (rounds/grants/partnerships via RSS+manual curation table), `social-sync` (mention counts/sentiment stub — label confidence Low).
**Explicit stubs:** wallet flows, KOL trust, audit/team-transparency auto-verification, cultural-trend detection → return `Unknown` + `confidence: low`, never fake (Sec 6.7).
**Dedupe/normalize:** canonical `Project` resolver (name/symbol/chain/contract), source registry with `fetchedAt/url/author`.
**Exit:** daily refresh job green, Intelligence Page shows `Key events (if available)` not full Timeline (Sec 13.7 pruned).

## Phase 5 — Intelligence Engine (the differentiator)
**Pipeline:** extract entities → attach evidence → detect signals per type → convergence check (≥2) → assess (Strong/Emerging/Uncertain/Noise) → generate counters → suggest next.
**Signal types MVP:** dev, ecosystem, funding, social, market (+ on-chain-lite: liquidity/holder deltas only). Each with `evidenceIds[]`, `magnitude`, `recency`.
**Connections:** rule+LLM edges Project→Founder→Investor→Ecosystem→Narrative with confidence labels; never present Possible/Unverified as fact (Sec 20).
**Counter-signals (always on):** weak traction, declining activity, hype>evidence, concentrated ownership, unverified claims — template + evidence lookup (US-10).
**Prompts:** `extract / assess / counter / connect / answer-with-citations / compare2way`, pinned versions + golden eval set (20 projects × expected signals/counters). Fail if citations missing.
**Exit:** evals pass: ≥80% strong signals have 2+ evidence, 100% have counter section or explicit Unknown.

## Phase 6 — Frontend MVP (App Router)
**Routes:** `/` (For You + Watchlist updates + Continue Research — Sec 10 pruned), `/discover` (`?view=all|early`, single stream), `/search`, `/ask`, `/p/:id + /t/:id + /n/:id` (shared Intelligence template), `/compare` (2-way only), `/watchlist`, `/history`, `/settings` (Basic only: 44.1 basic + follow/mute + surprise + sensitivity + alert threshold/cap + history ON/OFF).
**Inline tuning:** every card → `Why am I seeing this? → Tune` deep-links to `/settings#relevant` (US-27, 40.7 <2 clicks).
**Onboarding wizard (P0-9):** 4 steps (chains → sectors → stage/token → role + follow 3 narratives) completable <3 min, skippable (US-23).
**Exit:** full click path works on seeded data: search → open → see signals/evidence/counters/connections → save → appears in watchlist → settings change re-ranks feed instantly.

## Phase 7 — Personalization, Alerts, History (thin slice)
**Ranking:** apply `UserSettings` pre-filter → convergence/recency score → `surpriseMe` injects 25% adjacent (outside watchlist, Sec 18 anti-bubble warning if filters too narrow).
**Alerts MVP (global only):** nightly digest job, threshold filter, `maxPerDay` cap, in-app list + email optional. No per-item, no Telegram/Discord, no quiet hours (Sec 48E).
**History:** `saveHistory` toggle, list/resume/delete/clear-all (US-21, US-28 minus export; export → P1).
**Exit:** 40.6 testable: new user rates feed relevance; changing a Blocked term removes it except via direct search with warning.

## Phase 8 — Quality, Evals, Security, Perf
**Tests:** unit (ranking, convergence, settings validation), contract (API Zod), e2e (Playwright: onboarding→search→save→alert→tune), LLM evals (faithfulness: no uncited claims; counter coverage; anti-hype: no 100x language per Sec 16).
**Security/privacy:** rate-limit ask/discover, PII redaction in prompts, history delete cascades, no secrets in repo, audit log for settings reset.
**Perf budgets:** search p95 <800ms cached, entity page <1.2s, discover <1s (skeleton + streaming answer for ask).
**Exit:** eval report in `/docs/evals`, `pnpm test:e2e` green, threat-model note (prompt injection via ingested content → sanitize + cite-only).

## Phase 9 — DevOps, Deploy, Observe
**Infra:** `docker-compose` (web/api/db/redis/worker), GH Actions (lint/type/test/build/push), preview envs, prod (Vercel for web + Render/Fly for api/worker, Neon/Supabase Postgres). Backups + `pg_dump` for seed.
**Observability:** OpenTelemetry traces `ask/discover/entity`, log `why[]` + sensitivity + convergence for debugging; dashboards: feed relevance votes, alert volume vs cap, ingestion freshness, LLM cost/latency.
**Launch gate (Sec 40 + 47.3):** 5 users complete core loop without help; >70% For You rated relevant; every Strong has evidence+counter; no alert exceeds cap; settings reset preserves watchlist.
**Exit:** staging URL + runbook + rollback (revert image + keep DB migration forward-only).

## Phase 10 — P1/P2 Roadmap (do NOT start before gate)
P1: per-item alerts, quiet hours, compare polish, full history/export, Why-this inferred-interest editor, dashboard polish. P2/Sec 48: audit/team/KOL filters, weight sliders, themes/density, wallets, Telegram/Discord, collab, graph DB if edges >100k.

---
## Risks & Mitigations
Social/on-chain data licensed or thin → label Low confidence, keep dev/funding/market as primary. LLM hallucinates alpha → enforce cite-or-Unknown + counter-required + no-guarantee copy (Sec 6.7). Settings bloat regresses → PR check against Sec 48 list. Scope creep to 10 areas → ingestion PRs must map to 4 core or be rejected.

## Definition of Done (MVP)
Single Discover stream live; Intelligence 6-block page with evidence+counters on seeded + 50 real projects; Basic onboarding+settings re-ranks instantly; global alerts capped; history toggle works; evals + e2e green; deployed staging with metrics; README updated from v0.1 → v0.2.

---
## Appendix A — Best Free / Almost-Free Tools (reviewed Oct 2026, repo is public so CI free)

Recommendation first: cheapest buildable MVP = Next.js on Vercel Hobby + API/worker on Render Free + Neon Postgres free + Auth.js (self-host, $0) + OpenRouter free + Groq fallback + Upstash Redis free + Resend + PostHog + Sentry. Total $0 until real users; first paid step = $10 OpenRouter top-up, then $7 Render (no sleep) — not Vercel Pro.

| Phase / Need | Best FREE (start here) | Why | Almost-free upgrade (when it hurts) | Avoid for MVP |
|---|---|---|---|---|
| Web hosting (Next.js) | **Vercel Hobby** — 100GB bandwidth, 1M invocations, previews, no card | Native Next.js, ISR/middleware, best DX | **$20/mo Pro** only if commercial use (Hobby = non-commercial only) or need no cold-start. Alt commercial-free: **Cloudflare Workers/Pages** (100k req/d, unlimited static, commercial OK, no cold starts) | Fly.io/Koyeb (no free for new accts), Heroku (no free) |
| API + workers | **Render Free web service** — 512MB/0.1CPU, 750 hrs/mo, Docker, no card | Only free that runs Docker API + BullMQ worker + git push deploy | **$7/mo Render Starter** (stays on, no 15-min sleep/1-min wake). VPS alt: **Hetzner €4.50/mo** (20TB bandwidth, best $/perf, you manage) | Railway Free ($1/mo credit after trial — pauses, not persistent) |
| Postgres + pgvector (RAG, no separate Pinecone) | **Neon Free** — ~1GB/proj, 100 projects, 100 CU-hrs/proj/mo, pgvector, branching (10/proj), scale-to-zero ~570ms wake, no card, commercial OK | No manual restore (vs Supabase 7-day pause), branches for PR DBs + migration tests, Vercel-native | **Neon Launch pay-as-you-go** (~$0.106/CU-hr) when >1GB or always-on needed | Render Postgres Free (1GB but **expires day 30 + deleted day 44** — demos only); Railway DB (burns credits, unmanaged backups) |
| Auth | **Auth.js v5 (self-host, Neon adapter)** — unlimited MAU, $0, 80+ OAuth, Edge-ready | Zero bill at any scale, you own data, pairs with Neon | If you want managed UI fast: **Supabase Auth Free 50k MAU** (if already on Supabase, RLS built-in) or **Clerk Hobby 50k MRU free** (best DX/orgs, then $25/mo Pro). Clerk US-data/GDPR caveat | Auth0 (base plan poor value pre-SSO, steep tiers) |
| All-in-one backend alt | **Supabase Free** — 500MB DB + 1GB storage + 50k auth MAU + 500k edge fn + realtime, no card | Replaces Auth+DB+storage+API for solo builder; RLS = secure multi-tenant fast | **$25/mo Pro** (100k MAU, backups, no pause) | — (pick Supabase *or* Neon, not both for same data) |
| LLM gateway (failover, cite-or-Unknown) | **OpenRouter free** (20+ models, 20 RPM, 50/d, no card, no training) primary + **Groq free** (30 RPM, 1k/d, Llama 3.3 70B @ ~320 tok/s) secondary via baseURL swap | One OpenAI-compatible key, auto-failover; Groq = speed for chat, OpenRouter = variety | **$10 OpenRouter top-up** → 1k/d free-model quota + stable failover (best $10). Long docs: **Google AI Studio free** (Gemini Flash 1M ctx, 20-1500/d). Gateway alt: **Vercel AI Gateway** ($5 free credits, zero markup, 200+ models) | Paid OpenAI/Anthropic direct before evals pass; Mistral Experiment (trains on data); Cohere free (non-commercial only) |
| Embeddings/cache/queue | **Upstash Redis Free** (serverless, no card, survives Render sleep) for rank cache + alert dedupe + rate-limit | No ops, edge-ready, free survives MVP | Upstash pay-as-you-go; BullMQ on Render worker (already free) | Self-host Redis on Render Free (loses data on sleep, in-memory only on free KV) |
| Market / dev / social data (4 core scopes) | **DexScreener (free, no key)** for early/DEX tokens + **CoinGecko Free** (10-30/min, no card) for listed + **GitHub API Free** (5k/hr) for dev + **RSS** for funding/launches | Covers Projects/Market/Dev/Funding $0; DexScreener beats CMC free for micro-caps | CoinGecko paid only if rate-limited in prod; **Alchemy/Moralis free tier** for on-chain-lite (liquidity/holders); LunarCrush/Kaito paid → keep social as Low-confidence stub per Sec 8 | Kaito/LunarCrush paid, CMC paid tier, wallet-tracing APIs (stubbed Sec 48) |
| Email (digest alerts) | **Resend Free** (3k/mo, 100/d, best DX) | Transactional digest, React Email | Brevo free 300/d alt; own SMTP on Hetzner if volume spikes | Telegram/Discord bots (P2, Sec 48E) |
| Design + icons | **Figma Free** (3 files) + **shadcn/ui + Tailwind + Lucide** (all free/OSS) | Matches Phase 1 tokens/components $0 | Penpot (free OSS Figma alt, self-host) | Paid UI kits, custom icon sets |
| Analytics / errors / uptime | **PostHog Free** (1M events/mo — feed relevance votes for 40.6) + **Sentry Free** (5k errors/mo) + **UptimeRobot Free** (50 monitors) + **Grafana Cloud Free** | Proves 40.x success criteria $0 | PostHog/Sentry pay-as-you-go only after scale | Full Datadog/New Relic (overkill cost) |
| CI/CD | **GitHub Actions** (public repo = unlimited free minutes) + Vercel/Render auto-deploys | Already have it (this repo public) | — | Paid CI runners |

**Decision locked for MVP (ADR update):** Neon (not Supabase DB) + Auth.js (not Clerk) + Vercel Hobby (non-commercial prototype; move to Cloudflare or Vercel Pro if monetized) + Render Free API/worker + OpenRouter→Groq failover (+$10 top-up first spend) + Upstash + Resend + PostHog/Sentry. If you prefer one vendor over two DBs, swap Neon+Auth.js → Supabase (DB+Auth+storage) and accept 7-day pause (add cron ping) — record in ADR-001/002.
**Plan gaps fixed in this review:** Phase 1 needed Figma/Penpot + Lucide (added); Phase 2 stack indecision resolved to TS monorepo first (Python worker only if embeddings demand it); Phase 4 data sources now named with free limits; Phase 8/9 observability now mapped to free tiers (PostHog relevance, Sentry, UptimeRobot); Sec 48 guardrail added to CI (reject PRs adding audit/KOL/wallet/theme/weight-sliders).
