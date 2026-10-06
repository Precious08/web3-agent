# Web3 Research & Alpha Discovery Agent

> **Don't just find what's happening in Web3. Understand why it matters, what connects to it, and what is worth investigating next.**

A research and intelligence product for **Web3 alpha hunters, researchers, and analysts** — to cut through information overload, uncover meaningful signals, connect the dots, and investigate emerging opportunities.

Full spec: [`Web3 Agent.md`](./Web3%20Agent.md) (Sections 1-47, PRD + User Control Center)

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
2. **Research Intelligence Page** — Overview → Why It Matters → Signal Breakdown → Evidence → Connections → Counter-Signals → Timeline → Deep Research
3. **Alpha Discovery** — early projects, emerging narratives, on-chain / ecosystem / dev / social / funding / market signals
4. **Signal Assessment** — Evidence + Convergence + Impact + Magnitude + Early Potential + Uniqueness + Relevance → Strong / Moderate / Weak / Uncertain
5. **Natural-Language Research Assistant** with suggested follow-ups + Compare Mode + Drill-down
6. **Evidence Trail** — claims linked to sources, Fact vs Interpretation vs Signal vs Hypothesis vs Uncertainty
7. **Connections Graph** — Project → Founder → Previous Project → Investor → Ecosystem → Partner → Narrative (Confirmed / Strong / Possible / Unverified)
8. **Alpha Feed / Emerging Radar** — continuously updated discovery stream with filters
9. **User Control Center (Backend / Settings Dashboard)** — user owns the algorithm (see below)

## User Control Center — Settings Dashboard

Every user can change anything that affects what they see. Location: gear icon + inline `Why am I seeing this? → Tune`.

- **Discovery Preferences:** Stage (idea/testnet/mainnet), Sector (DeFi, L1/L2, DePIN, AI x Crypto, etc.), Chains, Token Status (no-token/points/TGE/liquid), Market cap/liquidity, Funding stage, Team transparency, Audit minimum, Role (airdrop/investor/dev/researcher) + Must-have / Interested / Muted / Blocked
- **Narratives & Ecosystems:** Followed/Muted + Surprise Me slider (default 25% to avoid bubble)
- **Signal Tuning:** Weights for Dev/Ecosystem/Social/Funding/On-chain/Market, Sensitivity (conservative ↔ aggressive), Convergence min, Hype filter, Early-stage bias
- **Feed/Radar Defaults:** Content mix, min strength, timeframe, evidence requirement
- **Alerts:** Global + per-item overrides, thresholds, channels, quiet hours, max/day cap
- **Research Depth:** Quick / Standard / Deep, evidence display, technical vs simplified
- **Dashboard:** Reorderable sections, landing tab, density, theme
- **Privacy:** View/edit inferred interests, history ON/OFF/clear, behavioral learning opt-out, export

Backend: `UserSettings` JSON model + `reasonCodes` on every recommendation for transparency. See `Web3 Agent.md` Sec 43-47.

## Repo Structure (initial version)

```text
/
├── Web3 Agent.md  # Full PRD (Secs 1-42 + Secs 43-47 Control Center, US-01 to US-28)
└── README.md      # This file
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

`v0.1-initial` — PRD + Control Center spec complete, no code yet. Next: tech architecture / data sources / build plan.

## License

TBD
