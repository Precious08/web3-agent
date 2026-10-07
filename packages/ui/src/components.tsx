// Phase 1 real markup — no deps, CSS vars, keyboard + SR accessible. Tailwind/shadcn classes added when Next.js lands.
import type { SignalState, EdgeConfidence, FactTake } from "./theme";

const LABEL: Record<SignalState, string> = {
  strong: "Strong signal",
  emerging: "Emerging",
  uncertain: "Uncertain",
  noise: "Noise",
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
        gap: 6,
        padding: "2px 10px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${color}`,
        background: "var(--surface-2)",
        color: "var(--text)",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        aria-hidden
        style={{ width: 8, height: 8, borderRadius: 999, background: color }}
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
      <blockquote style={{ margin: 0, color: "var(--text)" }}>{claim}</blockquote>
      <figcaption>
        <ul style={{ paddingLeft: 18, margin: "6px 0", color: "var(--text-muted)" }}>
          {evidence.map((e) => (
            <li key={e.id}>
              <a href={e.url} style={{ color: "var(--accent)" }}>
                {e.title}
              </a>{" "}
              <span>· {e.source}</span>
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
      {tabs.map((t) => (
        <button
          key={t.k}
          role="tab"
          aria-selected={active === t.k}
          title={t.body}
          style={{
            marginRight: 8,
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: active === t.k ? "var(--surface-2)" : "transparent",
            color: "var(--text)",
          }}
        >
          {t.label}
        </button>
      ))}
      <p style={{ color: "var(--text-muted)" }}>{tabs.find((t) => t.k === active)?.body}</p>
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
    <p style={{ color: "var(--text)" }} title={why}>
      <strong>{from}</strong> <span style={{ color: "var(--text-muted)" }}>—{relation}→</span>{" "}
      <strong>{to}</strong>{" "}
      <span
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "0 6px",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        {confidence}
      </span>
    </p>
  );
}

export function CounterCallout({ points }: { points: string[] }) {
  return (
    <aside aria-label="Counter-signals" style={{ borderLeft: "3px solid var(--signal-uncertain)", paddingLeft: 10 }}>
      <strong style={{ color: "var(--text)" }}>Why it might be weaker</strong>
      <ul style={{ margin: "4px 0", color: "var(--text-muted)" }}>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </aside>
  );
}

export function WhyThisSheet({ reasons, tuneHref }: { reasons: string[]; tuneHref: string }) {
  return (
    <details>
      <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Why am I seeing this?</summary>
      <ul style={{ color: "var(--text-muted)" }}>
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <a href={tuneHref} style={{ color: "var(--accent)" }}>
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
  return (
    <article
      aria-labelledby={`${item.id}-title`}
      tabIndex={0}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        padding: 14,
        maxWidth: 560,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <h3 id={`${item.id}-title`} style={{ margin: 0, color: "var(--text)" }}>
          {item.title}
        </h3>
        <SignalBadge state={item.signals} />
      </div>
      <p style={{ color: "var(--text)" }}>{item.why}</p>
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
        Signals: {item.signalLabel} · Evidence: {item.evidenceStrength}
      </p>
      <CounterCallout points={[item.counter]} />
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Next: {item.next}</p>
      <WhyThisSheet reasons={item.reasons} tuneHref="/settings#relevant" />
    </article>
  );
}

export function CompareTable2Way({ a, b }: { a: Record<string, string>; b: Record<string, string> }) {
  const rows = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  return (
    <table style={{ borderCollapse: "collapse", color: "var(--text)" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 6 }}>Area</th>
          <th style={{ textAlign: "left", padding: 6 }}>A</th>
          <th style={{ textAlign: "left", padding: 6 }}>B</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r} style={{ borderTop: "1px solid var(--border)" }}>
            <td style={{ padding: 6, color: "var(--text-muted)" }}>{r}</td>
            <td style={{ padding: 6 }}>{a[r] ?? "—"}</td>
            <td style={{ padding: 6 }}>{b[r] ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ResearchSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading research" style={{ padding: 14, color: "var(--text-muted)" }}>
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
