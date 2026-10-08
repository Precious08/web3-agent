// Home: intelligence dashboard (PRD Sec 10 pruned).
import { DiscoveryCard, SignalBadge } from "@web3-agent/ui";
import { getDiscover, getWatchlist } from "../lib/api";
import { Eyebrow, HeroTitle, Gradient, Lede, StatusPill, Stat, KindTag, SectionHead, row } from "../components/chrome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ items, live }, watch] = await Promise.all([getDiscover("foryou"), getWatchlist()]);
  const strong = items.filter((d) => d.signals.some((s) => s.state === "strong")).length;
  const sources = items.reduce((n, d) => n + d.evidence.length, 0);
  return (
    <main style={{ padding: "44px 24px 80px", display: "grid", gap: 36, maxWidth: 780, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={row()}>
          <Eyebrow>Home · Intelligence dashboard</Eyebrow>
        </div>
        <HeroTitle>What matters, <Gradient>why it matters.</Gradient></HeroTitle>
        <div style={row()}>
          <StatusPill live={live} />
          {!live && <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Start it: pnpm --filter @web3-agent/api dev</span>}
        </div>
        <div style={{ display: "flex", gap: 36, padding: "14px 0", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
          <Stat label="Strong signals" value={String(strong)} />
          <Stat label="Tracked" value={String(watch.items.length)} />
          <Stat label="Sources cited" value={String(sources)} />
        </div>
        <Lede>Personalized discoveries, ranked by converging evidence — not hype. <a href="/discover">Open Discover →</a></Lede>
      </div>

      <section style={{ display: "grid", gap: 14 }}>
        <SectionHead title="For you" hint="Ranked for your chains, sectors and sensitivity." right={<a href="/discover?view=early" style={{ fontSize: 13 }}>Early view →</a>} />
        <div style={{ display: "grid", gap: 16 }}>
          {items.map((d) => (
            <div key={d.id} className="lift" style={{ display: "grid", gap: 8, borderRadius: "var(--radius-lg)" }}>
              <div style={row()}>
                <KindTag kind={d.kind} />
                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{d.signals.map((s) => s.type).join(" + ")}</span>
              </div>
              <DiscoveryCard
                item={{
                  id: d.id, title: d.title, why: d.why,
                  signals: d.signals.some((s) => s.state === "strong") ? "strong" : "emerging",
                  signalLabel: d.signals.map((s) => s.type).join(" + "),
                  evidenceStrength: `${d.evidence.length} source${d.evidence.length === 1 ? "" : "s"} · ${d.signals.length} signal${d.signals.length === 1 ? "" : "s"}`,
                  counter: d.counters[0] ?? "", next: d.next[0] ?? "", reasons: d.whyCodes,
                }}
              />
              <a href={`/entity/${d.id}`} style={{ fontSize: 13, justifySelf: "start" }}>Open intelligence →</a>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Your watchlist" hint="Recent movement on tracked subjects." right={<a href="/settings" style={{ fontSize: 13 }}>Tune alerts →</a>} />
        <div style={row()}>
          {watch.items.map((w) => (
            <a key={`${w.kind}:${w.refId}`} href={`/entity/${w.refId}`}
              style={{ border: "1px solid var(--border-soft)", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "var(--text)", textDecoration: "none", background: "var(--surface)" }}>
              {w.refId}
            </a>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Continue research" hint="Pick up where you left off." />
        <div style={row()}>
          <SignalBadge state="emerging" label="Helios DePIN" />
          <a href="/onboarding" style={{ fontSize: 13 }}>Retake onboarding →</a>
          <a href="/design" style={{ fontSize: 13 }}>Design language →</a>
        </div>
      </section>
    </main>
  );
}
