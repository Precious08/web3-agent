// Alerts inbox (US-18): digest honors threshold + daily cap, dedupes by subject.
// Same-origin POST for mark-read (no CORS). Offline: honest empty state.
import { getAlerts, type AlertView } from "../../lib/api";
import { Eyebrow, StatusPill, SectionHead, row } from "../../components/chrome";
import Dismiss from "./dismiss";

export const dynamic = "force-dynamic";

export default async function Alerts() {
  const { items, live } = await getAlerts();
  const unread = items.filter((a) => !a.read);
  return (
    <main className="page">
      <div style={{ display: "grid", gap: 12 }}>
        <Eyebrow>Alerts · meaningful changes only</Eyebrow>
        <h1 className="hero-title">Signal, not noise.</h1>
        <div style={row()}>
          <StatusPill live={live} />
          <span className="tabular" style={{ fontSize: 12.5, color: "var(--text-faint)" }}>
            {unread.length} unread · capped daily, deduped by subject
          </span>
        </div>
      </div>

      {!live && (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>You're offline — alerts need a live connection. Saved highlights are on Home.</p>
      )}

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title="Inbox" hint="Newest first. Read items stay for reference." />
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
          {items.map((a: AlertView) => (
            <div key={a.id} className="rowhover" style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderBottom: "1px solid var(--border-soft)", opacity: a.read ? 0.6 : 1 }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, marginTop: 6, background: a.read ? "var(--text-faint)" : "var(--accent-2)", boxShadow: a.read ? "none" : "0 0 10px var(--accent-2)" }} />
              <div style={{ display: "grid", gap: 4, flex: 1, minWidth: 0 }}>
                <a href={`/entity/${a.refId}`} style={{ fontSize: 14, fontWeight: 650, color: "var(--text)", textDecoration: "none" }}>{a.title}</a>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>{a.body}</p>
              </div>
              {!a.read && <Dismiss id={a.id} />}
            </div>
          ))}
          {items.length === 0 && live && (
            <p style={{ padding: 18, margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>All quiet — no new signals above your threshold.</p>
          )}
        </div>
      </section>
    </main>
  );
}
