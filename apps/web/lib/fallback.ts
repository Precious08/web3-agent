// Fallback discoveries when the API is down (build time, API not running).
// Mirrors apps/api mock titles/whys; single source of truth moves server-side in Phase 7.
import type { Discovery } from "@web3-agent/types";

export const FALLBACK: Discovery[] = [
  {
    id: "helios-depin", kind: "project", title: "Helios DePIN — Base",
    why: "Dev activity + ecosystem participation up 3 weeks while social awareness stays low.",
    signals: [
      { id: "s1", type: "dev", state: "strong", magnitude: "commits 4x", evidenceIds: ["e1"] },
      { id: "s2", type: "ecosystem", state: "strong", magnitude: "+12 integrations", evidenceIds: ["e2"] },
    ],
    evidence: [{ id: "e1", title: "Helios repo pulse", url: "https://example.com/helios-repo", source: "GitHub" }],
    counters: ["Testnet only; no audit yet — traction unproven."],
    unknowns: ["Mainnet date, token, audit status unconfirmed."],
    next: ["Check testnet users", "Audit status"],
    whyCodes: ["matches:Base", "fallback:api-down"],
  },
  {
    id: "dreamcanvas-ai", kind: "project", title: "DreamCanvas AI — Solana",
    why: "Social mentions spiking with new contributors, but funding unverified.",
    signals: [{ id: "s3", type: "social", state: "emerging", magnitude: "mentions 6x", evidenceIds: ["e4"] }],
    evidence: [{ id: "e4", title: "Contributor graph", url: "https://example.com/dc-graph", source: "GitHub" }],
    counters: ["Hype exceeds evidence; token unclear."],
    unknowns: ["Funding source unverified."],
    next: ["Verify team", "Holder distribution"],
    whyCodes: ["matches:Solana", "fallback:api-down"],
  },
  {
    id: "restaking-narrative", kind: "narrative", title: "Restaking narrative — Ethereum",
    why: "Funding + mainnet activity converging across 4 protocols this month.",
    signals: [{ id: "s5", type: "funding", state: "emerging", magnitude: "4 rounds", evidenceIds: ["e6"] }],
    evidence: [{ id: "e6", title: "Restaking monthly review", url: "https://example.com/restake-review", source: "Research" }],
    counters: ["Concentrated stake; slashing unproven."],
    unknowns: ["Fee capture sustainability unknown."],
    next: ["Compare operators"],
    whyCodes: ["matches:Ethereum", "fallback:api-down"],
  },
];
