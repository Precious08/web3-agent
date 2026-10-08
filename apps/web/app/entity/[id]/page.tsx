// Entity Intelligence page (PRD Sec 13 pruned: 6 blocks). /entity/:id
import { SignalBadge, EvidenceInline, FactTakeUnknown, ConnectionEdge, CounterCallout, WhyThisSheet } from "@web3-agent/ui";
import { api } from "../../../lib/trpc";
import { FALLBACK } from "../../../lib/fallback";
import { Eyebrow } from "../../design/_showcase";

export const dynamic = "force-dynamic";

/** Derived, honestly-labeled edges from whyCodes (real edge store wires in Phase 7). */
function derivedEdges(whyCodes: string[], title: string) {
  return whyCodes
    .filter((c) => c.startsWith("matches:") || c.startsWith("narrative:"))
    .map((c) => {
      const [, v] = c.split(":");
      return {
        from: title, to: v, relation: c.startsWith("matches:") ? "builds-on" : "adjacent-to",
        confidence: "possible" as const, why: `Derived from ${c} — unverified until edge store lands.`,
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
  return (
    <main style={{ padding: "40px 24px 72px", display: "grid", gap: 24, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 8 }}>
        <Eyebrow>{d.kind} · Intelligence</Eyebrow>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 28 }}>{d.title}</h1>
          <SignalBadge state={strong ? "strong" : "emerging"} />
        </div>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{d.why}</p>
      </div>

      <section style={{ display: "grid", gap: 8 }}>
        <Eyebrow>Signals</Eyebrow>
        {d.signals.map((s) => (
          <p key={s.id} style={{ margin: 0, fontSize: 14 }}>
            <SignalBadge state={s.state} label={s.type} />{" "}
            <span style={{ color: "var(--text-muted)" }}>{s.magnitude} · evidence: {s.evidenceIds.join(", ")}</span>
          </p>
        ))}
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <Eyebrow>Evidence</Eyebrow>
        <EvidenceInline claim={d.why} evidence={d.evidence} />
      </section>

      <section style={{ display: "grid", gap: 4 }}>
        <Eyebrow>Connections</Eyebrow>
        {derivedEdges(d.whyCodes, d.title).map((e) => (
          <ConnectionEdge key={`${e.from}${e.to}`} {...e} />
        ))}
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <Eyebrow>Counter-signals</Eyebrow>
        <CounterCallout points={d.counters} />
        <FactTakeUnknown fact={d.why} take={d.next.join(" → ")} unknown={d.unknowns.join(" ")} />
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <Eyebrow>Next</Eyebrow>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 14 }}>
          {d.next.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <WhyThisSheet reasons={d.whyCodes} tuneHref="/settings#relevant" />
      </section>
    </main>
  );
}
