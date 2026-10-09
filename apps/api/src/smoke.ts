// Smoke: calls every router procedure in-process (no DB, no HTTP).
// Run: pnpm --filter @web3-agent/api exec tsx src/smoke.ts
import { appRouter } from "./router";

const caller = appRouter.createCaller({ ip: "smoke" });
const assert = (cond: unknown, name: string) => {
  if (!cond) throw new Error(`smoke FAIL: ${name}`);
  // eslint-disable-next-line no-console
  console.log(`ok: ${name}`);
};

const main = async () => {
  const h = await caller.health();
  assert(h.ok, "health");

  const s0 = await caller.settingsGet();
  assert(s0.surpriseMe === 25, "settings defaults");

  const s1 = await caller.settingsUpdate({ chains: ["Base"], sensitivity: "aggressive" });
  assert(s1.chains.includes("Base"), "settings update");

  const found = await caller.search({ q: "base" });
  assert(found.length >= 1 && found.every((d) => d.whyCodes.length > 0), "search + whyCodes");

  const ans = await caller.ask({ question: "Why is Helios interesting?" });
  assert(ans.counters.length > 0 && ans.unknowns.length > 0, "ask counters+unknowns");

  const feed = await caller.discover({ view: "foryou" });
  const early = await caller.discover({ view: "early" });
  assert(feed.length === 10 && early.length >= 1, "discover views");

  const ent = await caller.entity({ id: "helios-depin" });
  assert(ent.evidence.length === 3, "entity evidence");

  const cmp = await caller.compare({ aId: "helios-depin", bId: "dreamcanvas-ai" });
  assert(!!cmp.diff, "compare");

  await caller.watchlistAdd({ kind: "project", refId: "helios-depin" });
  const wl = await caller.watchlistList();
  assert(wl.length === 1, "watchlist add/list");
  await caller.watchlistRemove({ kind: "project", refId: "helios-depin" });

  const fresh = await caller.alertsDigest();
  assert(fresh.length >= 1, "digest generates");
  const again = await caller.alertsDigest();
  assert(again.length === 0, "digest dedupes");
  await caller.alertsRead({ id: fresh[0].id });
  const listed = await caller.alertsList();
  assert(listed.length >= 1 && listed.some((a) => a.read), "alerts list + read");

  await caller.historyClear();
  // eslint-disable-next-line no-console
  console.log("smoke: ALL GREEN");
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
