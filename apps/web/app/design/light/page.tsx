// /design/light — always light, ignores header toggle (vars scoped to wrapper).
import { Showcase } from "../_showcase";

export default function DesignLightPage() {
  return (
    <div data-theme="light" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <main style={{ padding: "24px 24px 48px", display: "grid", gap: 24, maxWidth: 720, margin: "0 auto" }}>
        <div>
          <h1 style={{ margin: "4px 0", fontSize: 22 }}>Light mode</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
            Locked light. Compare: <a href="/design/dark">/design/dark</a> · <a href="/design">toggle version</a>
          </p>
        </div>
        <Showcase />
      </main>
    </div>
  );
}
