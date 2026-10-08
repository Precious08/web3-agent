// Home: terminal overview. Same data (For You, watchlist, continue) — ranked rows, no hero cards.
import { SignalBadge } from "@web3-agent/ui";
import { getDiscover, getWatchlist } from "../lib/api";
import { Eyebrow, StatusPill, Stat, SectionHead, row } from "../components/chrome";
import { Board } from "../components/leaderboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ items, live }, watch] = await Promise.all([getDiscover("foryou"), getWatchlist()]);
  const strong = items.filter((d) => d.signals.some((s) => s.state === "strong")).length;
  const sources = items.reduce((n, d) => n + d.evidence.length, 0);
  return (
    <main className="page" style={{ gap: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <Eyebrow>Overview</Eyebrow>
          <h1 className="hero-title">Good evening, hunter.</h1>
          <div style={row()}>
            <StatusPill live={live} />
            {!live && <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Start it: pnpm --filter @web3-agent/api dev</span>}
          </div>
        </div>
        <div className="stats-strip">
          <Stat label="Strong" value={String(strong)} />
          <Stat label="Tracked" value={String(watch.items.length)} />
          <Stat label="Sources" value={String(sources)} />
        </div>
      </div>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="For you" hint="Ranked by converging evidence." right={<a href="/discover?view=early" style={{ fontSize: 13 }}>Early view →</a>} />
        <Board items={items} />
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Watchlist" hint="Tracked subjects." right={<a href="/settings" style={{ fontSize: 13 }}>Tune alerts →</a>} />
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
          {watch.items.map((w) => (
            <a key={`${w.kind}:${w.refId}`} href={`/entity/${w.refId}`} className="rowhover"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-soft)", textDecoration: "none", color: "var(--text)", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600 }}>{w.refId}</span>
              <span style={{ color: "var(--text-faint)" }}>›</span>
            </a>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Continue" hint="Pick up the thread." />
        <div style={row()}>
          <SignalBadge state="emerging" label="Helios DePIN" />
          <a href="/ask" style={{ fontSize: 13 }}>Ask a question →</a>
          <a href="/onboarding" style={{ fontSize: 13 }}>Retake onboarding →</a>
        </div>
      </section>
    </main>
  );
}
