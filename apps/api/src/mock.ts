// Mock data for 3b stubs. Same 3 entities as /design + generated depth to 20.
// Every discovery carries whyCodes (PRD 46.5) — no mock without a reason.
import type { Discovery } from "@web3-agent/types";

const base = (d: Discovery): Discovery => d;

export const MOCK_DISCOVERIES: Discovery[] = [
  base({
    id: "helios-depin",
    kind: "project",
    title: "Helios DePIN — Base",
    why: "Dev activity + ecosystem participation up 3 weeks while social awareness stays low.",
    signals: [
      { id: "s1", type: "dev", state: "strong", magnitude: "commits 4x", evidenceIds: ["e1"] },
      { id: "s2", type: "ecosystem", state: "strong", magnitude: "+12 integrations", evidenceIds: ["e2"] },
    ],
    evidence: [
      { id: "e1", title: "Helios repo pulse", url: "https://example.com/helios-repo", source: "GitHub" },
      { id: "e2", title: "Base ecosystem roundup", url: "https://example.com/base-roundup", source: "Docs" },
      { id: "e3", title: "Seed announcement", url: "https://example.com/helios-seed", source: "Blog" },
    ],
    counters: ["Testnet only; no audit yet — traction unproven."],
    unknowns: ["Mainnet date, token, audit status unconfirmed."],
    next: ["Check testnet users", "Audit status", "Compare vs peers"],
    whyCodes: ["matches:Base", "signal:dev+ecosystem", "evidence:3sources"],
  }),
  base({
    id: "dreamcanvas-ai",
    kind: "project",
    title: "DreamCanvas AI — Solana",
    why: "Social mentions spiking with new contributors, but funding unverified.",
    signals: [
      { id: "s3", type: "social", state: "emerging", magnitude: "mentions 6x", evidenceIds: ["e4"] },
      { id: "s4", type: "dev", state: "emerging", magnitude: "+9 contributors", evidenceIds: ["e4"] },
    ],
    evidence: [
      { id: "e4", title: "Contributor graph", url: "https://example.com/dc-graph", source: "GitHub" },
      { id: "e5", title: "Mention thread", url: "https://example.com/dc-thread", source: "Social" },
    ],
    counters: ["Hype exceeds evidence; token unclear; possible farmed activity."],
    unknowns: ["Funding source, holder distribution unverified."],
    next: ["Verify team", "Holder distribution", "Dev velocity"],
    whyCodes: ["matches:Solana", "signal:social+dev", "outside-watchlist:adjacent"],
  }),
  base({
    id: "restaking-narrative",
    kind: "narrative",
    title: "Restaking narrative — Ethereum",
    why: "Funding + mainnet activity converging across 4 protocols this month.",
    signals: [
      { id: "s5", type: "funding", state: "emerging", magnitude: "4 rounds", evidenceIds: ["e6"] },
      { id: "s6", type: "dev", state: "emerging", magnitude: "3 mainnet upgrades", evidenceIds: ["e6"] },
    ],
    evidence: [{ id: "e6", title: "Restaking monthly review", url: "https://example.com/restake-review", source: "Research" }],
    counters: ["Concentrated stake; slashing design unproven at scale."],
    unknowns: ["Fee capture sustainability unknown."],
    next: ["Compare operators", "Fee capture", "Slashing risk"],
    whyCodes: ["matches:Ethereum", "signal:funding+dev", "narrative:restaking"],
  }),
];

const CHAINS = ["Base", "Solana", "Ethereum", "Arbitrum", "Bitcoin L2", "Cosmos"];
const SECTORS = ["DePIN", "AI x Crypto", "Restaking", "RWA", "Gaming", "Privacy", "Interop", "DeFi"];

/** Generated depth: 17 more stubs so seed + discover have 20 (thin, honestly labeled). */
for (let i = 0; i < 17; i++) {
  const n = i + 4;
  MOCK_DISCOVERIES.push(
    base({
      id: `demo-project-${n}`,
      kind: i % 5 === 0 ? "narrative" : "project",
      title: `Demo ${SECTORS[i % SECTORS.length]} ${n} — ${CHAINS[i % CHAINS.length]}`,
      why: "Seeded demo: early dev uptick with thin corroboration.",
      signals: [{ id: `sg${n}`, type: "dev", state: "uncertain", magnitude: "early", evidenceIds: [`eg${n}`] }],
      evidence: [{ id: `eg${n}`, title: `Demo source ${n}`, url: "https://example.com/demo", source: "Seed" }],
      counters: ["Seeded demo — treat as Uncertain until real ingestion lands (Phase 4)."],
      unknowns: ["Everything material unverified."],
      next: ["Replace with Phase 4 ingestion"],
      whyCodes: ["seed:demo", "confidence:low"],
    }),
  );
}
