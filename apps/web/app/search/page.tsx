// Search results (PRD Sec 11 — our own search API, plain results. No borrowed concepts).
import { DiscoveryCard } from "@web3-agent/ui";
import { getSearch } from "../../lib/api";
import { Eyebrow, KindTag, StatusPill, row } from "../../components/chrome";

export const dynamic = "force-dynamic";

export default async function Search({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const { items, live } = await getSearch(q);
  return (
    <main className="page">
      <div style={{ display: "grid", gap: 12 }}>
        <Eyebrow>Search</Eyebrow>
        <h1 className="hero-title">
          {q ? <>{q}</> : "Ask anything."}
        </h1>
        <div style={row()}>
          <StatusPill live={live} />
          <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{items.length} result{items.length === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((d) => (
          <div key={d.id} style={{ display: "grid", gap: 8 }}>
            <div style={row()}>
              <KindTag kind={d.kind} />
            </div>
            <DiscoveryCard
              item={{
                id: d.id, title: d.title, why: d.why,
                signals: d.signals.some((s) => s.state === "strong") ? "strong" : "emerging",
                signalLabel: d.signals.map((s) => s.type).join(" + "),
                evidenceStrength: `${d.evidence.length} source${d.evidence.length === 1 ? "" : "s"}`,
                counter: d.counters[0] ?? "", next: d.next[0] ?? "", reasons: d.whyCodes,
              }}
            />
            <a href={`/entity/${d.id}`} style={{ fontSize: 13, justifySelf: "start" }}>Open intelligence →</a>
          </div>
        ))}
        {q && items.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Nothing matches “{q}” yet. Try a chain, sector or narrative.</p>
        )}
      </div>
    </main>
  );
}
