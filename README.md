# Web3 Research & Alpha Discovery Agent

> **Don't just find what's happening in Web3. Understand why it matters, what connects to it, and what is worth investigating next.**

A research and intelligence product for **Web3 alpha hunters, researchers, and analysts** — to cut through information overload, uncover meaningful signals, connect the dots, and investigate emerging opportunities.

Full spec: [`Web3 Agent.md`](./Web3%20Agent.md) (v0.2-pruned, Secs 1-48, US-01 to US-28) + [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)

## Product Overview

Web3 info is fragmented across social, docs, research, markets, on-chain, dev, funding, and community sources. This product helps users:

**Discover information → Understand it → Connect the dots → Identify meaningful signals → Validate them → Monitor what matters**

Core loop: **Discover → Investigate → Validate → Save → Monitor → Discover Again**

Extended loop: **SEARCH → ASK → DISCOVER → RESEARCH → CONNECT → ASSESS → SAVE → MONITOR → DISCOVER AGAIN**

## Key Principles

1. **Research Before Alpha:** What happened → Why it matters → Evidence → What contradicts it
2. **Evidence Over Hype**
3. **Multiple Signals Beat Isolated Signals** (signal convergence, default 2+)
4. **Early Does Not Mean Valuable**
5. **Investigate Both Sides** (counter-signals)
6. **Explain the Reasoning**
7. **User Makes the Final Judgment**

## Core Features (P0 MVP)

1. **Intelligent Search & Research** — projects, tokens, protocols, people, ecosystems, narratives + natural-language questions
2. **Research Intelligence Page (6 blocks)** — Overview → Signals → Evidence → Connections → Counter-Signals → Next steps (Timeline = key events only, Deep = follow-up chat)
3. **Alpha Discovery (single stream)** — Alpha Feed = stream, Emerging Radar = early filtered view; early projects, narratives, dev / ecosystem / funding / social / market
4. **Signal Assessment (4 states)** — Strong / Emerging / Uncertain / Noise (7 factors internal only)
5. **Natural-Language Research Assistant** with suggested follow-ups + 2-way project Compare + Drill-down
6. **Evidence Trail** — claims linked to sources, Fact vs Take vs Unknown (5-way internal only)
7. **Connections Graph** — Project → Founder → Investor → Ecosystem → Narrative (Confirmed / Strong / Possible / Unverified)
8. **Alpha Feed / Emerging Radar (unified)** — one ranking backend + `surpriseMe` adjacent injection
9. **User Control Center Basic (MVP)** — Stage/Sector/Chain/Token/Role + Follow/Mute/Block + surprise slider + single Sensitivity + global alert threshold/cap + history ON/OFF. Advanced (weights, KOLs, audit, wallets, themes) → P2 per Sec 48.

## User Control Center — Settings Dashboard

Every user can change anything that affects what they see. Location: gear icon + inline `Why am I seeing this? → Tune`.

- **Discovery Preferences (MVP Basic):** Stage, Sector, Chains, Token Status, Role + Must-have / Interested / Muted / Blocked. Advanced (liquidity $X, funding granular, team transparency, audit) → P2 Sec 48.
- **Narratives & Ecosystems:** Followed/Muted + Surprise Me slider (default 25% to avoid bubble)
- **Signal Tuning (MVP):** Single Sensitivity (Conservative/Balanced/Aggressive) + always-on counters. 6 weight sliders, hype filter, early-bias → P2.
- **Feed/Radar:** single stream defaults only
- **Alerts (MVP):** global threshold + max/day + in-app. Per-item, Telegram/Discord, quiet hours → P1/P2.
- **Research Depth:** Standard only. **Dashboard:** fixed layout (For You + Watchlist + Continue Research). Theme/density/landing → P1 polish.
- **Privacy:** history ON/OFF/clear, behavioral opt-out (export → P1)

Out-of-scope (Sec 48): KOL trust, wallets, plan/usage, JSON/reasonCodes in PRD (moved to tech spec).

## Repo Structure (initial version)

```text
/
├── Web3 Agent.md         # Full PRD (v0.2-pruned, Secs 1-48, US-01 to US-28, Sec 48 out-of-scope)
├── IMPLEMENTATION_PLAN.md # Phased build plan + free-tools appendix
└── README.md             # This file
```

## MVP Roadmap

- **P0:** Search, Intelligence Page, Alpha Discovery, Signal Assessment, NL Research, Evidence, Connections, Feed/Radar + Onboarding Preferences + Basic Control Center
- **P1:** Personalized Dashboard, Watchlist, Alerts, Compare Mode, Counter-Signal Analysis, History, Advanced Tuning, Why-this editor
- **P2:** Research Workspace, Advanced Personalization/Monitoring, Collaborative Research, Wallet personalization

## Success Criteria

- Research Speed, Discovery Quality, Signal Usefulness, Research Depth, Continuous Value
- **Personal Relevance:** >70% For You items relevant in week 1
- **Control & Trust:** any filter changeable in <2 clicks from item, resettable without losing watchlist

## Status

`v0.2-pruned` — PRD pruned (single feed, 4-state, 3-way, Basic settings, Sec 48 out-of-scope), no code yet. Plan: `IMPLEMENTATION_PLAN.md` (phases 0-10 + free-tools appendix). Next: scaffold monorepo per Phase 0.

## License

TBD
