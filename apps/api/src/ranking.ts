// Ranking (Phase 7b, ADR-006): filters → convergence → surprise.
// Thresholds mirror engine.assess (worker pipeline); this module orders Discover
// payloads. Engine governs ingestion-side scoring in Phase 9; both obey ADR-006.
import type { Discovery, UserSettings } from "@web3-agent/types";

const STATE_W = { strong: 3, emerging: 2, uncertain: 1, noise: 0 } as const;

const hits = (text: string, terms: string[]) => {
  const t = text.toLowerCase();
  return terms.some((w) => w && t.includes(w.toLowerCase()));
};

export function score(d: Discovery): number {
  // Convergence first: distinct types weigh more than raw counts.
  const types = new Set(d.signals.map((s) => s.type)).size;
  const weight = d.signals.reduce((n, s) => n + STATE_W[s.state], 0);
  return types * 10 + weight + Math.min(d.evidence.length, 5);
}

export function rank(items: Discovery[], s: UserSettings): Discovery[] {
  // 1. Filters: blocked terms never surface (direct search may still find them);
  // muted narratives sink to the bottom, labeled by their own whyCodes.
  const kept = items.filter((d) => !hits(`${d.title} ${d.why} ${d.kind}`, s.blocked));
  const muted = (d: Discovery) => hits(d.title, s.mutedNarratives);

  // 2. Sensitivity thresholds (ADR-006): conservative = Strong only.
  const pass = (d: Discovery) => {
    const hasStrong = d.signals.some((x) => x.state === "strong");
    if (s.sensitivity === "conservative") return hasStrong;
    if (s.sensitivity === "balanced") return hasStrong || d.signals.some((x) => x.state === "emerging");
    return true;
  };

  const core = kept
    .filter((d) => !d.whyCodes.some((c) => c.includes("adjacent") || c.includes("outside-watchlist")))
    .filter(pass)
    .sort((a, b) => score(b) - score(a) || (muted(a) ? 1 : 0) - (muted(b) ? 1 : 0));
  const adjacent = kept
    .filter((d) => d.whyCodes.some((c) => c.includes("adjacent") || c.includes("outside-watchlist")))
    .filter(pass)
    .sort((a, b) => score(b) - score(a));

  // 3. Surprise injection: ~surpriseMe% adjacent, interleaved, always labeled.
  if (s.surpriseMe <= 0 || adjacent.length === 0) return core;
  const every = Math.max(1, Math.round(100 / s.surpriseMe) - 1);
  const out: Discovery[] = [];
  let ai = 0;
  core.forEach((d, i) => {
    out.push(d);
    if ((i + 1) % every === 0 && ai < adjacent.length) out.push(adjacent[ai++]);
  });
  return [...out, ...adjacent.slice(ai)];
}
