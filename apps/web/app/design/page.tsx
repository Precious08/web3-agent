// /design — dark-only showcase. Mocked, no backend.
import { Showcase, Eyebrow } from "./_showcase";

export default function DesignPage() {
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <Eyebrow>Design language</Eyebrow>
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
          A live preview of badges, discovery cards, evidence discipline and comparison.
        </p>
      </div>
      <Showcase />
    </main>
  );
}
