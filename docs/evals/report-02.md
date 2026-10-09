# Eval Report 02 — Phase 8b (2026-10-08)

## Security unit tests (vitest)
- Rate limiter: allows N then blocks per key/window; keys isolated. (4 tests)
- PII redaction: emails, 64-hex keys, pasted secrets redacted; 40-hex wallet
  addresses preserved as public content. (2 tests)
- Guards live on ask (20/min), search/discover/entity (60/min) + Zod input caps.
- See `docs/security/threat-model.md` for the full model + accepted risks.

## e2e (Playwright, Chromium)
- 6/6 green in **live mode** (API up): home board, early filter, dossier,
  ask answer, onboarding completion, save-button state cycle.
- Offline mode proven in the prior run (settings `Saved ✓` path) + curl-level
  proof that dead API ⇒ fallback payloads with `live:false`.
- Suites are mode-agnostic by design: they assert honest behavior in whichever
  mode the environment provides, never assuming API presence.
- Notable catch during the run: a stray API process from an earlier live test
  survived job cleanup and squatted on :4000 — killed, and the lesson is noted
  (background servers get verified dead, not assumed dead).
