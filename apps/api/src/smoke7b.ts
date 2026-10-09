// Ranking smoke (Phase 7b exit): filters bite, sensitivity reorders, surprise injects.
// Run: pnpm --filter @web3-agent/api exec tsx src/smoke7b.ts
import { rank, score } from "./ranking";
import { MOCK_DISCOVERIES } from "./mock";
import { DEFAULT_SETTINGS } from "@web3-agent/types";

const assert = (cond: unknown, name: string) => {
  if (!cond) throw new Error(`rank FAIL: ${name}`);
  // eslint-disable-next-line no-console
  console.log(`ok: ${name}`);
};

const main = async () => {
  // 1. Convergence orders: Helios (2 types, strong) outscores single-type demos.
  const base = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS });
  assert(base[0].id === "helios-depin", "convergent strong first");
  assert(score(MOCK_DISCOVERIES[0]) > score(MOCK_DISCOVERIES[3]), "score rewards convergence");

  // 2. Blocked never surfaces in feed.
  const blocked = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, blocked: ["solana"] });
  assert(blocked.every((d) => !`${d.title} ${d.why}`.toLowerCase().includes("solana")), "blocked filtered");

  // 3. Conservative = Strong only; aggressive shows uncertain demos.
  const cons = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, sensitivity: "conservative" });
  assert(cons.length >= 1 && cons.every((d) => d.signals.some((s) => s.state === "strong")), "conservative strong-only");
  const aggr = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, sensitivity: "aggressive" });
  assert(aggr.length > cons.length, "aggressive widens the stream");

  // 4. Surprise injection: adjacent item (dreamcanvas carries outside-watchlist) appears with default 25%.
  assert(base.some((d) => d.id === "dreamcanvas-ai"), "adjacent injected");
  const none = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, surpriseMe: 0 });
  assert(!none.some((d) => d.id === "dreamcanvas-ai"), "surprise 0 removes adjacent");

  // eslint-disable-next-line no-console
  console.log("rank: ALL GREEN");
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
