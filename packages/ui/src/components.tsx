// Dark-only component language. Signal color lives on dots, glows and hairlines —
// body copy always stays on --text / --text-muted so contrast never depends on hue.
import type { SignalState, EdgeConfidence, FactTake } from "./theme";

const LABEL: Record<SignalState, string> = {
  strong: "Strong signal",
  emerging: "Emerging",
  uncertain: "Uncertain",
  noise: "Noise",
};

const GLOW: Record<SignalState, string> = {
  strong: "var(--glow-strong)",
  emerging: "var(--glow-emerging)",
  uncertain: "none",
  noise: "none",
};

export type SignalBadgeProps = { state: SignalState; label?: string };
export function SignalBadge({ state, label }: SignalBadgeProps) {
  const color = `var(--signal-${state})`;
  return (
    <span
      role="status"
      aria-label={label ?? LABEL[state]}
      data-signal={state}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 12px 4px 10px",
        borderRadius: 999,
        border: `1px solid color-mix(in srgb, ${color} 42%, transparent)`,
        background: `linear-gradient(180deg, color-mix(in srgb, ${color} 14%, var(--surface)) 0%, var(--surface) 100%)`,
        color: "var(--text)",
        fontSize: 12,
        fontWeight: 650,
        letterSpacing: 0.3,
        boxShadow: GLOW[state],
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {label ?? LABEL[state]}
    </span>
  );
}

export type EvidenceRef = { id: string; title: string; url: string; source: string };
export type EvidenceInlineProps = { claim: string; evidence: EvidenceRef[] };
export function EvidenceInline({ claim, evidence }: EvidenceInlineProps) {
  return (
    <figure style={{ margin: 0 }}>
      <blockquote style={{ margin: 0, color: "var(--text)", lineHeight: 1.55 }}>{claim}</blockquote>
      <figcaption>
        <ul style={{ paddingLeft: 18, margin: "8px 0 0", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
          {evidence.map((e) => (
            <li key={e.id}>
              <a href={e.url} style={{ color: "var(--accent)" }}>
                {e.title}
              </a>{" "}
              <span style={{ color: "var(--text-faint)" }}>· {e.source}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

export type FactTakeUnknownProps = { fact: string; take: string; unknown: string; active?: FactTake };
export function FactTakeUnknown({ fact, take, unknown, active = "fact" }: FactTakeUnknownProps) {
  const tabs: { k: FactTake; label: string; body: string }[] = [
    { k: "fact", label: "Fact", body: fact },
    { k: "take", label: "Take", body: take },
    { k: "unknown", label: "Unknown", body: unknown },
  ];
  return (
    <div role="tablist" aria-label="Fact, take, unknown">
      <div
        style={{
          display: "inline-flex",
          gap: 2,
          padding: 3,
          borderRadius: 12,
          border: "1px solid var(--border-soft)",
          background: "var(--bg)",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.k}
            role="tab"
            aria-selected={active === t.k}
            title={t.body}
            style={{
              padding: "6px 14px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: active === t.k ? "var(--surface-3)" : "transparent",
              color: active === t.k ? "var(--text)" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: active === t.k ? 650 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.65 }}>
        {tabs.find((t) => t.k === active)?.body}
      </p>
    </div>
  );
}

export type ConnectionEdgeProps = {
  from: string;
  to: string;
  relation: string;
  confidence: EdgeConfidence;
  why: string;
};
export function ConnectionEdge({ from, to, relation, confidence, why }: ConnectionEdgeProps) {
  return (
    <p style={{ color: "var(--text)", margin: "6px 0" }} title={why}>
      <strong style={{ fontWeight: 650 }}>{from}</strong>{" "}
      <span style={{ color: "var(--text-faint)", fontSize: 13 }}>—{relation}→</span>{" "}
      <strong style={{ fontWeight: 650 }}>{to}</strong>{" "}
      <span
        style={{
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "1px 8px",
          fontSize: 11.5,
          letterSpacing: 0.3,
          color: "var(--text-muted)",
          background: "var(--surface-2)",
        }}
      >
        {confidence}
      </span>
    </p>
  );
}

export function CounterCallout({ points }: { points: string[] }) {
  return (
    <aside
      aria-label="Counter-signals"
      style={{
        border: "1px solid color-mix(in srgb, var(--signal-uncertain) 30%, transparent)",
        borderLeft: "3px solid var(--signal-uncertain)",
        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
        background: "color-mix(in srgb, var(--signal-uncertain) 7%, var(--surface))",
        padding: "10px 12px",
      }}
    >
      <strong style={{ color: "var(--text)", fontSize: 12.5, letterSpacing: 0.6, textTransform: "uppercase" }}>
        Why it might be weaker
      </strong>
      <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.65 }}>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </aside>
  );
}

export function WhyThisSheet({ reasons, tuneHref }: { reasons: string[]; tuneHref: string }) {
  return (
    <details style={{ fontSize: 13 }}>
      <summary style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 600 }}>
        Why am I seeing this?
      </summary>
      <ul style={{ color: "var(--text-muted)", paddingLeft: 18, lineHeight: 1.7 }}>
        {reasons.map((r, i) => (
          <li key={i}>
            <code
              style={{
                fontSize: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--border-soft)",
                borderRadius: 6,
                padding: "1px 6px",
                color: "var(--text)",
              }}
            >
              {r}
            </code>
          </li>
        ))}
      </ul>
      <a href={tuneHref} style={{ color: "var(--accent)", fontWeight: 600 }}>
        Tune preferences →
      </a>
    </details>
  );
}

export type Discovery = {
  id: string;
  title: string;
  why: string;
  signals: SignalState;
  signalLabel: string;
  evidenceStrength: string;
  counter: string;
  next: string;
  reasons: string[];
};
export function DiscoveryCard({ item }: { item: Discovery }) {
  const color = `var(--signal-${item.signals})`;
  return (
    <article
      aria-labelledby={`${item.id}-title`}
      tabIndex={0}
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        background: `linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)`,
        boxShadow: "var(--card-shadow)",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h3
            id={`${item.id}-title`}
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: 17,
              letterSpacing: 0.1,
              color: "var(--text)",
            }}
          >
            {item.title}
          </h3>
          <SignalBadge state={item.signals} />
        </div>
        <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.6, fontSize: 14 }}>{item.why}</p>
        <p style={{ margin: 0, color: "var(--text-faint)", fontSize: 12.5, letterSpacing: 0.2 }}>
          {item.signalLabel} <span aria-hidden> · </span> {item.evidenceStrength}
        </p>
        <CounterCallout points={[item.counter]} />
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13 }}>
          <span style={{ color: "var(--text-faint)" }}>Next → </span>
          {item.next}
        </p>
        <WhyThisSheet reasons={item.reasons} tuneHref="/settings#relevant" />
      </div>
    </article>
  );
}

export function CompareTable2Way({ a, b }: { a: Record<string, string>; b: Record<string, string> }) {
  const rows = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  return (
    <table style={{ borderCollapse: "collapse", color: "var(--text)", width: "100%", fontSize: 13.5 }}>
      <thead>
        <tr style={{ color: "var(--text-faint)", fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>
          <th style={{ textAlign: "left", padding: "8px 10px" }}>Area</th>
          <th style={{ textAlign: "left", padding: "8px 10px" }}>A</th>
          <th style={{ textAlign: "left", padding: "8px 10px" }}>B</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r} style={{ borderTop: "1px solid var(--border-soft)" }}>
            <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>{r}</td>
            <td style={{ padding: "8px 10px" }}>{a[r] ?? "—"}</td>
            <td style={{ padding: "8px 10px" }}>{b[r] ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ResearchSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading research" style={{ padding: 14, color: "var(--text-faint)" }}>
      Loading research…
    </div>
  );
}
export function EmptyState({ hint }: { hint: string }) {
  return (
    <p role="status" style={{ color: "var(--text-muted)" }}>
      Nothing here yet. {hint}
    </p>
  );
}
