# ADR-005: Pull-Only Cron Ingestion on 4 Core Scopes
Date: 2026-10-08
Status: accepted
Decided with: user pick (pull-only cron over realtime streams)

## Context
PRD Sec 8 pruned MVP to 4 core scopes (Projects, Tokens/Market, Social, Funding +
Dev). People-graph depth, wallet-level on-chain, and cultural trends are stubbed
(Sec 48). Free tiers only (PRD Sec 49); Render free sleeps between runs.

## Decision
BullMQ cron workers, pull-only, no websockets:
- `market-sync` — DexScreener (free, no key; early/DEX tokens) + CoinGecko free
  (10–30/min; listed tokens): prices, liquidity, listings, volume deltas.
- `dev-sync` — GitHub API free (5k/hr): releases, commit velocity, contributors.
- `funding-sync` — RSS (blogs, docs, mirrors) + manual curation table: rounds,
  grants, partnerships, launches.
- `social-sync` — mention counts / sentiment stub, ALWAYS labeled Low confidence.
- Canonical `Project` resolver (name/symbol/chain/contract dedupe); every row
  carries `fetchedAt/url/author`. Daily refresh is the MVP guarantee; Timeline
  shows "key events if available," never a promised full history (Sec 13.7 pruned).

## Why (not realtime streams)
- Product promises assessed signals, not tick data — freshness daily is enough
  to prove the loop; streams need always-on connections that fight Render sleep
  and trigger paid tiers with zero validation gain.
- $0: all sources free; sleeps between runs cost nothing.

## Consequences
- Explicit stubs return `Unknown` + `confidence: low`, never fabricated
  (PRD Sec 6.7): wallet flows, KOL trust, audit auto-verification, trend detection.
- On-chain-lite only: liquidity/holder deltas from market APIs (Alchemy/Moralis
  free tier later, via new ADR if rate limits block refresh jobs — Sec 49 trigger).
- Revisit (new ADR) for P1 monitoring phase if users demand sub-hour freshness.
