# ADR-004: OpenRouter Primary → Groq Fallback (+ Gemini Long-Doc Specialist)
Date: 2026-10-08
Status: accepted
Decided with: user pick (recommendation; Google-only and paid-direct rejected)

## Context
Every answer must cite sources or say Unknown (PRD Sec 6.2/23). MVP spend is $0
(PRD Sec 49). Free tiers verified Oct 2026 (plan Appendix A). One deep research
answer ≈ 5 requests (extract + assess + counter + connect + answer).

## Decision
- Primary: OpenRouter free (20+ models, 20 RPM, 50 req/day, one OpenAI-compatible
  key, auto-failover, no training on data).
- Fallback: Groq direct (30 RPM, 1,000 req/day, Llama 3.3 70B @ ~320 tok/s) via
  base-URL swap when OpenRouter throttles.
- Specialist: Google AI Studio (Gemini Flash, 1M context) for long-doc jobs only
  (whole-codebase / multi-doc synthesis), called via native SDK.
- Temp 0 for extraction/assessment/counters; higher temp for synthesis only.
- All prompts versioned in `packages/prompts`; evals run on Groq direct (a full
  20-project eval ≈ 120 requests would alone exceed OpenRouter's 50/day).

## Why (not paid-direct / Google-only)
- Combined free ≈ 200+ answers/day — covers MVP validation (5 test users) at $0.
- Paid-direct bills from request one with nothing proven; rejected per Sec 49.
- Google-only rejected: 5–15 RPM + as low as 20/day caps and partial OpenAI
  compatibility make it fragile as the single pipe; kept as specialist instead.

## Consequences
- First-ever spend trigger: $10 OpenRouter top-up → 1,000 req/day + stable failover,
  when eval loops start or user #6 arrives (before $7 Render, before any DB spend).
- Every claim carries `sourceIds` or is marked Unknown; missing citations fail evals.
- No-training-data posture preserved across all three providers; PII redacted
  pre-prompt (Phase 8).
