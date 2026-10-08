// Entity dossier, terminal-dense. Same 6 blocks, tighter rows, stat strip, numbered evidence.
import { SignalBadge, EvidenceInline, FactTakeUnknown, ConnectionEdge, CounterCallout, WhyThisSheet } from "@web3-agent/ui";
import { api } from "../../../lib/trpc";
import { FALLBACK } from "../../../lib/fallback";
import { Eyebrow, KindTag, Stat, SignalBar, SectionHead, row } from "../../../components/chrome";

export const dynamic = "force-dynamic";

function derivedEdges(whyCodes: string[], title: string) {
  return whyCodes
    .filter((c) => c.startsWith("matches:") || c.startsWith("narrative:"))
    .map((c) => {
      const [, v] = c.split(":");
      return {
        from: title, to: v, relation: c.startsWith("matches:") ? "builds-on" : "adjacent-to",
        confidence: "possible" as const, why: `Derived from ${c} — unverified until the edge store lands.`,
      };
    });
}

const box: React.CSSProperties = { border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" };

export default async function EntityPage({ params }: { params: { id: string } }) {
  let d;
  try {
    d = await api().entity.query({ id: params.id });
  } catch {
    d = FALLBACK.find((f) => f.id === params.id) ?? FALLBACK[0];
  }
  const strong = d.signals.some((s) => s.state === "strong");
  const conv = new Set(d.signals.map((s) => s.type)).size;
  return (
    <main className="page">
      <div style={{ display: "grid", gap: 10 }}>
        <div style={row()}>
          <Eyebrow>{d.kind} · Dossier</Eyebrow>
          <KindTag kind={d.kind} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <h1 className="hero-title">{d.title}</h1>
          <SignalBadge state={strong ? "strong" : "emerging"} />
        </div>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>{d.why}</p>
        <div className="stats-strip" style={{ alignItems: "center" }}>
          <Stat label="Converging" value={String(conv)} />
          <Stat label="Sources" value={String(d.evidence.length)} />
          <Stat label="Counters" value={String(d.counters.length)} />
          <span className="hide-sm"><SignalBar state={strong ? "strong" : "emerging"} width={140} /></span>
        </div>
      </div>

      <section style={{ display: "grid", gap: 10 }}>
        <SectionHead title="Signals" hint="Independently observed types — convergence is the thesis." />
        <div style={box}>
          {d.signals.map((s) => (
            <div key={s.id} className="rowhover" style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-soft)", flexWrap: "wrap" }}>
              <SignalBadge state={s.state} label={s.type} />
              <span className="tabular" style={{ fontSize: 13.5 }}>{s.magnitude}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>ev: {s.evidenceIds.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <SectionHead title="Evidence" hint="Attached to claims, numbered for reference." />
        <div style={{ ...box, padding: 16 }}>
          <EvidenceInline claim={d.why} evidence={d.evidence} />
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <SectionHead title="Connections" hint="Derived, unverified — edge store lands in Phase 7." />
        <div style={{ ...box, padding: "4px 16px" }}>
          {derivedEdges(d.whyCodes, d.title).map((e) => (
            <ConnectionEdge key={`${e.from}${e.to}`} {...e} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <SectionHead title="Challenge" hint="Counters required. Unknowns explicit." />
        <div style={{ ...box, padding: 16, display: "grid", gap: 14 }}>
          <CounterCallout points={d.counters} />
          <FactTakeUnknown fact={d.why} take={d.next.join(" → ")} unknown={d.unknowns.join(" ")} />
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <SectionHead title="Next" hint="Follow the thread." />
        <div style={box}>
          {d.next.map((n, i) => (
            <div key={n} style={{ display: "flex", gap: 12, padding: "10px 14px", borderBottom: "1px solid var(--border-soft)", fontSize: 13.5 }}>
              <span className="tabular" style={{ color: "var(--text-faint)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
        <WhyThisSheet reasons={d.whyCodes} tuneHref="/settings#relevant" />
        <p style={{ margin: 0, fontSize: 13 }}><a href="/discover">← Back to Discover</a></p>
      </section>
    </main>
  );
}
