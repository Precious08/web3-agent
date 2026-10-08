// Discover: single stream (PRD Sec 16-17 unified). ?view=all|early (early = Radar view).
import { DiscoveryCard } from "@web3-agent/ui";
import { getDiscover } from "../../lib/api";
import { Eyebrow, HeroTitle, StatusPill, KindTag, Segmented, SectionHead, row } from "../../components/chrome";

export const dynamic = "force-dynamic";

export default async function Discover({ searchParams }: { searchParams: { view?: string } }) {
  const view = searchParams.view === "early" ? "early" : "foryou";
  const { items, live } = await getDiscover(view);
  const title = view === "early" ? "Early whispers." : "The stream.";
  return (
    <main style={{ padding: "44px 24px 80px", display: "grid", gap: 28, maxWidth: 780, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 14 }}>
        <Eyebrow>{view === "early" ? "Emerging radar · early, outside your bubble" : "Discover · the full stream"}</Eyebrow>
        <HeroTitle>{title}</HeroTitle>
        <div style={row()}>
          <Segmented options={[
            { href: "/discover?view=all", label: "All", active: view === "foryou" },
            { href: "/discover?view=early", label: "Early", active: view === "early" },
          ]} />
          <StatusPill live={live} />
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-faint)" }}>
          {items.length} {items.length === 1 ? "discovery" : "discoveries"}
          {view === "early" ? " · filtered to pre-consensus signals" : " · ranked by convergence for you"}
        </p>
      </div>

      <section style={{ display: "grid", gap: 16 }}>
        <SectionHead title={view === "early" ? "Before it's obvious" : "Ranked for you"} hint="Every card carries its evidence and its counter-thesis." />
        <div style={{ display: "grid", gap: 16 }}>
          {items.map((d, i) => (
            <div key={d.id} className="lift" style={{ display: "grid", gap: 8 }}>
              <div style={row()}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-faint)", minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
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
    </main>
  );
}
