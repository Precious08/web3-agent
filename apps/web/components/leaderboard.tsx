// Leaderboard rows: our Discover stream dressed as a ranked terminal table.
// Same data, same links — presentation only.
import { SignalBadge } from "@web3-agent/ui";
import type { Discovery } from "@web3-agent/types";
import { KindTag, RankNum, SignalBar } from "./chrome";

export function stateOf(d: Discovery) {
  return d.signals.some((s) => s.state === "strong") ? "strong" : "emerging";
}

export function BoardRow({ i, d }: { i: number; d: Discovery }) {
  const st = stateOf(d);
  return (
    <a href={`/entity/${d.id}`} className="rowhover"
      style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto auto auto 16px", gap: 12, alignItems: "center", padding: "11px 14px", borderBottom: "1px solid var(--border-soft)", textDecoration: "none", color: "inherit" }}>
      <RankNum i={i} />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</span>
        <span style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <KindTag kind={d.kind} />
          <span style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.signals.map((s) => s.type).join(" + ")}</span>
        </span>
      </span>
      <span className="hide-mobile" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <SignalBadge state={st} />
        <SignalBar state={st} width={96} />
      </span>
      <span className="hide-mobile tabular" style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 58 }}>{d.evidence.length} src</span>
      <span className="hide-mobile tabular" style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 58 }}>{d.signals.length} sig</span>
      <span aria-hidden style={{ color: "var(--text-faint)" }}>›</span>
    </a>
  );
}

export function Board({ items }: { items: Discovery[] }) {
  return (
    <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
      {items.map((d, i) => (
        <BoardRow key={d.id} i={i} d={d} />
      ))}
      {items.length === 0 && (
        <p style={{ padding: 18, margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>Nothing here yet.</p>
      )}
    </div>
  );
}
