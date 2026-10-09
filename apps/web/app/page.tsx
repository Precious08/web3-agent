// Home: terminal overview. Same data (For You, watchlist, continue) — ranked rows, no hero cards.
import { SignalBadge } from "@web3-agent/ui";
import { getDiscover, getWatchlist, getHistory } from "../lib/api";
import { Eyebrow, StatusPill, SectionHead, row } from "../components/chrome";
import { Board } from "../components/leaderboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ items, live }, watch, hist] = await Promise.all([getDiscover("foryou"), getWatchlist(), getHistory()]);
  return (
    <main className="page" style={{ gap: 28 }}>
      <div style={{ display: "grid", gap: 10, maxWidth: 640 }}>
        <Eyebrow>Overview</Eyebrow>
        <h1 className="hero-title">Good evening, hunter.</h1>
        <div style={row()}>
          <StatusPill live={live} />
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>
          Your ranked stream — strongest convergence first. <a href="/discover">Open Discover →</a>
        </p>
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
        <SectionHead title="Continue" hint={hist.live && hist.items.length > 0 ? "Your recent trail — resumes where you left off." : "Pick up the thread."} />
        <div style={row()}>
          {hist.items.slice(0, 5).map((h) => (
            <a key={h.id} href={h.href}
              style={{ border: "1px solid var(--border-soft)", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "var(--text)", textDecoration: "none", background: "var(--surface)", maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {h.label}
            </a>
          ))}
          {hist.items.length === 0 && <SignalBadge state="emerging" label="Helios DePIN" />}
          <a href="/ask" style={{ fontSize: 13 }}>Ask a question →</a>
          <a href="/onboarding" style={{ fontSize: 13 }}>Retake onboarding →</a>
        </div>
      </section>
    </main>
  );
}
