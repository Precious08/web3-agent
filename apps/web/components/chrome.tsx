// Shared page chrome: eyebrows, panels, tags, stats, segmented controls, status.
// Dark-only. Pages compose these; visual identity lives here, not scattered inline.
import type { CSSProperties, ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--text-faint)" }}>
      {children}
    </p>
  );
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 34, lineHeight: 1.1, letterSpacing: -0.4 }}>
      {children}
    </h1>
  );
}

export function Gradient({ children }: { children: ReactNode }) {
  return (
    <span style={{ background: "linear-gradient(92deg, var(--accent) 0%, var(--accent-2) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
      {children}
    </span>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>{children}</p>;
}

export function Panel({ children, pad = 18 }: { children: ReactNode; pad?: number }) {
  return (
    <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)", boxShadow: "var(--card-shadow)", padding: pad }}>
      {children}
    </div>
  );
}

export function KindTag({ kind }: { kind: string }) {
  return (
    <span style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--accent-2)", border: "1px solid color-mix(in srgb, var(--accent-2) 38%, transparent)", borderRadius: 999, padding: "3px 10px", background: "color-mix(in srgb, var(--accent-2) 9%, transparent)" }}>
      {kind}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{label}</span>
    </div>
  );
}

export function StatusPill({ live }: { live: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-muted)", border: "1px solid var(--border-soft)", borderRadius: 999, padding: "5px 13px", background: "var(--surface)" }}>
      <span className="pulse-dot" aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: live ? "var(--signal-strong)" : "var(--signal-uncertain)", boxShadow: live ? "0 0 10px var(--signal-strong)" : "none" }} />
      {live ? "Live · API connected" : "Offline · fallback data"}
    </span>
  );
}

export function Segmented({ options }: { options: { href: string; label: string; active: boolean }[] }) {
  return (
    <nav aria-label="View" style={{ display: "inline-flex", gap: 2, padding: 3, borderRadius: 12, border: "1px solid var(--border-soft)", background: "var(--bg)" }}>
      {options.map((o) => (
        <a key={o.href} href={o.href} aria-current={o.active ? "page" : undefined}
          style={{ padding: "6px 16px", borderRadius: 9, fontSize: 13, fontWeight: o.active ? 650 : 500, textDecoration: "none", background: o.active ? "var(--surface-3)" : "transparent", color: o.active ? "var(--text)" : "var(--text-muted)" }}>
          {o.label}
        </a>
      ))}
    </nav>
  );
}

export function SectionHead({ title, hint, right }: { title: string; hint: string; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
      <div>
        <Eyebrow>{title}</Eyebrow>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{hint}</p>
      </div>
      {right}
    </div>
  );
}

export const row = (): CSSProperties => ({ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" });
