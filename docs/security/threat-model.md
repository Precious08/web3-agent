# Threat Model — MVP (Phase 8b)

## Assets
User settings/watchlist/history, API compute + LLM budget, ingestion pipeline truth.

## Threats & mitigations
1. **Prompt injection via ingested content** (RSS, repo text, social): worker output is
   data, never instructions. Engine + prompts enforce cite-or-Unknown; generated text
   always carries counters. Sanitization point: `redact.ts` + evidence-titled display
   (no raw HTML rendering in UI).
2. **Abuse of expensive procedures** (ask/discover/entity/search): per-IP rate limits
   (ask 20/min, reads 60/min) with human 429 messages. Limiter is in-process —
   acceptable single-instance; Redis sliding window when Phase 9 scales horizontally.
3. **PII in questions/history**: emails, 64-hex keys and pasted secrets redacted
   before storage and echo. Wallet addresses (40-hex) intentionally kept — public content.
4. **Over-broad inputs**: Zod caps (q ≤500, question ≤2000, id ≤200) on every public
   procedure; tRPC input validation rejects the rest.
5. **Secrets in repo**: `.env.example` only, real `.env` gitignored. No keys in code —
   verified by review (no scanner yet; add gitleaks in Phase 9 CI).
6. **CORS / session**: browser talks same-origin `/api/trpc` only; Auth.js sessions
   arrive Phase 7+ (per-user history scoping then — today history is instance-local).

## Accepted risks (stated, not hidden)
- In-memory rate limits reset on restart; history/watchlist/alerts likewise until
  Neon lands (Phase 9).
- No WAF/bot management on free tiers; Cloudflare free in front at first abuse sign.
