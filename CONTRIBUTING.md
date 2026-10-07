# Contributing

PRD: `Web3 Agent.md` (v0.4, Secs 1-49). Plan: `IMPLEMENTATION_PLAN.md` (Phases 0-10 + Appendix A free tools).

## Branches
- `master` = releasable. Feature branches: `feat/<short-name>`, fixes: `fix/<short-name>`, docs: `docs/<short-name>`.

## Commits (conventional)
- `feat:`, `fix:`, `docs:`, `prune:`, `chore:`, `test:` — e.g. `feat: phase 1 SignalBadge`.
- One logical change per commit. Reference PRD Sec / US where relevant.

## Rules
- MVP = free tiers only (PRD Sec 49). No paid-only dep without free fallback + scale trigger.
- Respect Sec 48 out-of-scope: audit/KOL/wallets/themes/weight-sliders = P2, reject in review.
- Every discovery/answer must carry evidence or explicit Unknown (PRD Sec 6.2, 23).
- `pnpm install && pnpm -r typecheck && pnpm -r lint && pnpm -r test` must pass before push.
