// /design — dark-only showcase. Mocked, no backend.
import { Showcase, Eyebrow } from "./_showcase";

export default function DesignPage() {
  return (
    <main style={{ padding: "40px 24px 72px", display: "grid", gap: 32, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 10 }}>
        <Eyebrow>Phase 1 · Design language</Eyebrow>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 34,
            lineHeight: 1.12,
            letterSpacing: -0.3,
          }}
        >
          Research that reads{" "}
          <span
            style={{
              background: "linear-gradient(92deg, var(--accent) 0%, var(--accent-2) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            like signal
          </span>
          , not noise.
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>
          Dark-only preview of badges, discovery cards, evidence discipline and comparison —
          before any backend exists.
        </p>
      </div>
      <Showcase />
    </main>
  );
}
