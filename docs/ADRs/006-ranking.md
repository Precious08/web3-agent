# ADR-006: Deterministic Pre-Rank → LLM Re-Rank + Explain
Date: 2026-10-08
Status: accepted
Decided with: user pick (pre-rank + re-rank over pure-LLM / heuristics-only)

## Context
Single Discover stream (Secs 16-17 unified) must order items per-user, explain
each one (PRD Sec 6.6), and honor Basic settings (Sec 44-45 pruned: single
Sensitivity, convergence default 2+ per Sec 6.3). Free LLM budget (ADR-004).

## Decision
1. Deterministic pre-rank (plain code, testable): apply `UserSettings` filters
   (Blocked never surfaces except direct search w/ warning; Must-have boosts) →
   convergence count (≥2 beats 1) → recency → evidence strength.
2. LLM re-rank + explain on the top-N only: edge-case ordering plus the
   "why it matters" prose and `why[]` reasonCodes for WhyThisSheet (40.7).
3. Single `sensitivity` maps to thresholds: conservative (Strong only) /
   balanced (Strong + high Emerging) / aggressive (Emerging welcome). No weight
   sliders in MVP (Sec 48C).
4. `surpriseMe` (default 25%) injects adjacent outside-watchlist items post-rank,
   labeled as such (Sec 18 anti-bubble).

## Why (not pure-LLM / heuristics-only)
- Pure LLM: nondeterministic ordering, unanswerable "why #1?", billed per feed
  render — violates explainability and budget.
- Heuristics-only: no natural-language significance — the core promise is
  "understand why it matters," not a score table.

## Consequences
- Ranking is unit-testable (fixtures: blocked filtered, 2-signal beats 1-signal,
  sensitivity thresholds); LLM layer covered by golden evals (ADR-004).
- Feed cost stays flat: LLM touches top-N candidates, never the full corpus.
- Phase 2 complete (ADRs 001-006). Next: Phase 3 data model + backend skeleton.
