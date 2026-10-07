// /design — hub with toggle version + links to locked dark/light pages.
import { Showcase } from "./_showcase";

export default function DesignPage() {
  return (
    <main style={{ padding: "24px 24px 48px", display: "grid", gap: 24, maxWidth: 720, margin: "0 auto" }}>
      <div>
        <h1 style={{ margin: "4px 0", fontSize: 22 }}>Design preview</h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
          Mocked, no backend. This page follows your header toggle. Locked versions:{" "}
          <a href="/design/dark">/design/dark</a> · <a href="/design/light">/design/light</a>
        </p>
      </div>
      <Showcase />
    </main>
  );
}
