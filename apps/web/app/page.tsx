// Home: For You + Watchlist updates + Continue Research (PRD Sec 10 pruned).
import { DiscoveryCard, SignalBadge } from "@web3-agent/ui";
import { getDiscover, getWatchlist } from "../lib/api";
import { Eyebrow } from "./design/_showcase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ items, live }, watch] = await Promise.all([getDiscover("foryou"), getWatchlist()]);
  return (
    <main style={{ padding: "40px 24px 72px", display: "grid", gap: 32, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 10 }}>
        <Eyebrow>Home · Intelligence dashboard</Eyebrow>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: -0.3 }}>
          What matters, <span style={{ color: "var(--text-muted)" }}>why it matters.</span>
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-faint)" }}>
          {live ? "Live from API :4000." : "API offline — showing fallback. Start it: pnpm --filter @web3-agent/api dev."}{" "}
          <a href="/discover">Open Discover →</a>
        </p>
      </div>

      <section style={{ display: "grid", gap: 12 }}>
        <Eyebrow>For you</Eyebrow>
        <div style={{ display: "grid", gap: 14 }}>
          {items.map((d) => (
            <a key={d.id} href={`/entity/${d.id}`} style={{ textDecoration: "none" }}>
            <DiscoveryCard
              key={d.id}
              item={{
                id: d.id, title: d.title, why: d.why,
                signals: d.signals.some((s) => s.state === "strong") ? "strong" : "emerging",
                signalLabel: d.signals.map((s) => s.type).join(" + "),
                evidenceStrength: `${d.evidence.length} source${d.evidence.length === 1 ? "" : "s"}`,
                counter: d.counters[0] ?? "", next: d.next[0] ?? "", reasons: d.whyCodes,
              }}
            />
            </a>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <Eyebrow>Your watchlist</Eyebrow>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {watch.items.map((w) => (
            <span key={`${w.kind}:${w.refId}`} style={{ border: "1px solid var(--border-soft)", borderRadius: 999, padding: "4px 12px", fontSize: 13, color: "var(--text-muted)" }}>
              {w.refId}
            </span>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <Eyebrow>Continue research</Eyebrow>
        <div style={{ display: "flex", gap: 8 }}>
          <SignalBadge state="emerging" label="Helios DePIN" />
          <a href="/design" style={{ fontSize: 13, alignSelf: "center" }}>Design language →</a>
        </div>
      </section>
    </main>
  );
}
