// Intelligence engine (Phase 5): deterministic, no LLM calls.
// Items in → state + counters + unknowns + edges out. Matches @web3-agent/types.
import type { Sensitivity, SignalState } from "@web3-agent/types";
import type { Confidence, NormalizedItem } from "../workers/types";

export type Assessment = {
  state: SignalState;
  convergingTypes: string[];
  evidenceTitles: string[];
  counters: string[];
  unknowns: string[];
};

type Edge = {
  from: string;
  to: string;
  relation: string;
  confidence: "confirmed" | "strong" | "possible" | "unverified";
  why: string;
};

const confRank: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };
const toEdgeConf = (c: Confidence) =>
  (c === "high" ? "strong" : c === "medium" ? "possible" : "unverified") as Edge["confidence"];

export function assess(items: NormalizedItem[], sensitivity: Sensitivity): Assessment {
  if (items.length === 0) {
    return { state: "noise", convergingTypes: [], evidenceTitles: [], counters: ["No information — nothing to score."], unknowns: ["Everything."] };
  }
  // Low-confidence items support but never converge (ADR-004/005).
  const solid = items.filter((i) => i.confidence !== "low");
  const convergingTypes = [...new Set(solid.map((i) => i.scope))];
  const conv = convergingTypes.length;
  const allHigh = solid.length > 0 && solid.every((i) => i.confidence === "high");

  let state: SignalState;
  if (sensitivity === "conservative") {
    state = conv >= 3 || (conv >= 2 && allHigh) ? "strong" : conv >= 1 ? "emerging" : "uncertain";
  } else if (sensitivity === "balanced") {
    state = conv >= 2 ? "strong" : conv === 1 ? "emerging" : "uncertain";
  } else {
    const anyMedium = items.some((i) => confRank[i.confidence] >= 2);
    state = conv >= 2 ? "strong" : anyMedium ? "emerging" : "uncertain";
  }

  const counters: string[] = [];
  if (conv <= 1) counters.push("Only one independent signal type — convergence not met (needs 2+).");
  const thin = items.filter((i) => i.confidence === "low");
  if (thin.length > 0) counters.push(`Thin corroboration: ${thin.map((t) => t.title.slice(0, 60)).join("; ")}.`);
  if (items.some((i) => /testnet/i.test(i.summary + i.title))) counters.push("Pre-mainnet — traction unproven until mainnet + audit.");
  if (!items.some((i) => i.scope === "funding")) counters.push("No verified funding signal — runway/backing unknown.");
  if (counters.length === 0) counters.push("Strong convergence, but monitor for decay — no thesis without watch.");

  const unknowns = thin.map((t) => `Unverified: ${t.title.slice(0, 80)}`);
  if (unknowns.length === 0 && state !== "strong") unknowns.push("Insufficient corroboration to confirm significance.");

  return {
    state,
    convergingTypes,
    evidenceTitles: items.map((i) => i.title),
    counters,
    unknowns,
  };
}

export function connect(items: NormalizedItem[], projectName: string): Edge[] {
  const edges: Edge[] = [];
  for (const i of items) {
    if (i.projectHint?.chain) {
      edges.push({ from: projectName, to: i.projectHint.chain, relation: "builds-on", confidence: i.confidence === "high" && i.source === "Curated" ? "confirmed" : toEdgeConf(i.confidence), why: `${i.source}: ${i.title.slice(0, 60)}` });
    }
  }
  const rank = { confirmed: 4, strong: 3, possible: 2, unverified: 1 };
  const best = new Map<string, Edge>();
  for (const e of edges) {
    const k = `${e.from}${e.to}${e.relation}`;
    const cur = best.get(k);
    if (!cur || rank[e.confidence] > rank[cur.confidence]) best.set(k, e);
  }
  return [...best.values()];
}
