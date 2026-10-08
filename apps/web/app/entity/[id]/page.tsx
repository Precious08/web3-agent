// Entity Intelligence dossier (PRD Sec 13 pruned: 6 blocks). /entity/:id
import { SignalBadge, EvidenceInline, FactTakeUnknown, ConnectionEdge, CounterCallout, WhyThisSheet } from "@web3-agent/ui";
import { api } from "../../../lib/trpc";
import { FALLBACK } from "../../../lib/fallback";
import { Eyebrow, KindTag, Panel, Stat, SectionHead, row } from "../../../components/chrome";

export const dynamic = "force-dynamic";

/** Derived, honestly-labeled edges from whyCodes (real edge store wires in Phase 7). */
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
    <main style={{ padding: "44px 24px 80px", display: "grid", gap: 28, maxWidth: 780, margin: "0 auto" }}>
      <Panel pad={22}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={row()}>
            <Eyebrow>{d.kind} · Dossier</Eyebrow>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: -0.3 }}>{d.title}</h1>
            <SignalBadge state={strong ? "strong" : "emerging"} />
          </div>
          <p style={{ margin: 0, color: "var(--text)", fontSize: 15, lineHeight: 1.65 }}>{d.why}</p>
          <div style={{ display: "flex", gap: 32, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
            <Stat label="Converging signals" value={String(conv)} />
            <Stat label="Sources cited" value={String(d.evidence.length)} />
            <Stat label="Counters" value={String(d.counters.length)} />
          </div>
        </div>
      </Panel>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Signals" hint="Each type below is independently observed — convergence is the thesis." />
        <Panel>
          <div style={{ display: "grid", gap: 10 }}>
            {d.signals.map((s) => (
              <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <SignalBadge state={s.state} label={s.type} />
                <span style={{ fontSize: 13.5 }}>{s.magnitude}</span>
                <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>evidence: {s.evidenceIds.join(", ")}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Evidence" hint="Claims stay attached to sources — never a dumped link list." />
        <Panel>
          <EvidenceInline claim={d.why} evidence={d.evidence} />
        </Panel>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Connections" hint="Derived and unverified until the edge store lands in Phase 7." />
        <Panel>
          {derivedEdges(d.whyCodes, d.title).map((e) => (
            <ConnectionEdge key={`${e.from}${e.to}`} {...e} />
          ))}
        </Panel>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Challenge the thesis" hint="Both sides, always — counters are required, never optional." />
        <Panel>
          <div style={{ display: "grid", gap: 14 }}>
            <CounterCallout points={d.counters} />
            <FactTakeUnknown fact={d.why} take={d.next.join(" → ")} unknown={d.unknowns.join(" ")} />
          </div>
        </Panel>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="What to investigate next" hint="Follow the thread deeper." />
        <Panel>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8 }}>
            {d.next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div style={{ marginTop: 12 }}>
            <WhyThisSheet reasons={d.whyCodes} tuneHref="/settings#relevant" />
          </div>
        </Panel>
      </section>

      <p style={{ margin: 0, fontSize: 13 }}>
        <a href="/discover">← Back to Discover</a>
        {" · "}<KindTag kind={d.kind} />
      </p>
    </main>
  );
}
