// Discover: single stream (PRD Sec 16-17 unified). ?view=all|early (early = Radar view).
import { DiscoveryCard } from "@web3-agent/ui";
import { getDiscover } from "../../lib/api";
import { Eyebrow } from "../design/_showcase";

export const dynamic = "force-dynamic";

export default async function Discover({ searchParams }: { searchParams: { view?: string } }) {
  const view = searchParams.view === "early" ? "early" : "foryou";
  const { items, live } = await getDiscover(view);
  return (
    <main style={{ padding: "40px 24px 72px", display: "grid", gap: 24, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 10 }}>
        <Eyebrow>{view === "early" ? "Emerging radar · early view" : "Discover · full stream"}</Eyebrow>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 30 }}>Discover</h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-faint)" }}>
          <a href="/discover?view=all" style={{ color: view === "foryou" ? "var(--text)" : undefined }}>All</a>
          {" · "}
          <a href="/discover?view=early" style={{ color: view === "early" ? "var(--text)" : undefined }}>Early</a>
          {" — "}{live ? "live from API." : "API offline — fallback."}
        </p>
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {items.map((d) => (
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
        ))}
      </div>
    </main>
  );
}
