# Eval Report 01 — Phase 8a (2026-10-08)

## Unit suites (vitest, $0, no network)
- `apps/api`: 12/12 green — ranking (convergence ordering, blocked filter,
  conservative/aggressive spread, surprise on/off, evidence cap) + engine
  (states, sensitivity bite, low-never-converges, stub ceiling, counters-always-on,
  edge dedupe keeps best confidence).
- `packages/prompts`: 4/4 green — 6 templates pinned, temps ≤0.4,
  cite-or-Unknown + counters required, zero hype outside quoted prohibitions.
- **Total: 16/16.** Run: `pnpm -r test`.

## Behavioral smokes (tsx, no DB)
- `smoke.ts`: 11/11 (router round-trips, digest generates → dedupes → read).
- `smoke5.ts`: 11/11 golden engine fixtures.
- `smoke7b.ts`: 7/7 ranking fixtures.

## Honestly deferred (needs $ or prod)
- **Live-model evals** (faithfulness of real LLM outputs, counter coverage on
  generated text): require the $10 OpenRouter top-up — Phase 9, first spend per
  PRD Sec 49. Static contracts above are the $0 substitute, not the replacement.
- **e2e (Playwright)**: deferred to 8b with the security pass — needs browsers +
  both servers; nothing here contradicts it.
- **Perf budgets** (search p95 <800ms, entity <1.2s): measured against staging in
  Phase 9; local numbers would be theater.
