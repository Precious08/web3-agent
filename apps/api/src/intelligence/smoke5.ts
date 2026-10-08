// Golden eval fixtures (Phase 5 exit): engine behavior pinned, no network, no DB.
// Run: pnpm --filter @web3-agent/api exec tsx src/intelligence/smoke5.ts
import { assess, connect } from "./engine";
import type { NormalizedItem } from "../workers/types";

const item = (p: Partial<NormalizedItem> & { scope: NormalizedItem["scope"]; title: string }): NormalizedItem => ({
  externalId: `t:${p.title.slice(0, 20)}`,
  url: "https://example.com/t",
  source: "Test",
  fetchedAt: new Date().toISOString(),
  confidence: "medium",
  summary: "test",
  ...p,
});

const assert = (cond: unknown, name: string) => {
  if (!cond) throw new Error(`golden FAIL: ${name}`);
  // eslint-disable-next-line no-console
  console.log(`ok: ${name}`);
};

const main = async () => {
  // 1. Helios-like: dev(high) + ecosystem(medium) + funding(high) → strong (balanced), counters present.
  const helios = [
    item({ scope: "dev", title: "commits 4x", confidence: "high" }),
    item({ scope: "market", title: "+12 integrations" }),
    item({ scope: "funding", title: "seed round", confidence: "high" }),
  ];
  const a1 = assess(helios, "balanced");
  assert(a1.state === "strong" && a1.convergingTypes.length === 3, "helios strong, conv 3");
  assert(a1.counters.length >= 1, "counters always on");

  // 2. Same pair under conservative with only 2 types, not all-high → emerging (sensitivity bites).
  const pair = helios.slice(0, 2);
  assert(assess(pair, "balanced").state === "strong", "pair strong when balanced");
  assert(assess(pair, "conservative").state === "emerging", "pair emerging when conservative");

  // 3. DreamCanvas-like: social(low) + dev(medium) → emerging, thin flagged unknown, low never converges.
  const dc = [
    item({ scope: "social", title: "mention spike", confidence: "low" }),
    item({ scope: "dev", title: "+9 contributors" }),
  ];
  const a3 = assess(dc, "balanced");
  assert(a3.state === "emerging", "dreamcanvas emerging");
  assert(!a3.convergingTypes.includes("social"), "low never converges");
  assert(a3.unknowns.some((u) => /Unverified/i.test(u)), "thin marked unknown");

  // 4. Social-stub-only → uncertain ceiling, never emerging+.
  const stubOnly = [item({ scope: "social", title: "stub uptick", confidence: "low" })];
  assert(assess(stubOnly, "aggressive").state === "uncertain", "stub caps at uncertain");

  // 5. Empty → noise.
  assert(assess([], "aggressive").state === "noise", "empty is noise");

  // 6. Edges: chain hint → builds-on edge, deduped, confidence mapped.
  const edges = connect(
    [item({ scope: "dev", title: "r1", confidence: "high", projectHint: { chain: "Base" } }), item({ scope: "dev", title: "r2", confidence: "low", projectHint: { chain: "Base" } })],
    "Helios",
  );
  assert(edges.length === 1 && edges[0].relation === "builds-on", "edges dedupe + relation");
  assert(edges[0].confidence === "strong" || edges[0].confidence === "possible", "edge confidence mapped");

  // eslint-disable-next-line no-console
  console.log("golden: ALL GREEN");
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
