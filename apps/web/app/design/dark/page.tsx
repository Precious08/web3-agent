// /design/dark — always dark, ignores header toggle (vars scoped to wrapper).
import { Showcase } from "../_showcase";

export default function DesignDarkPage() {
  return (
    <div data-theme="dark" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <main style={{ padding: "24px 24px 48px", display: "grid", gap: 24, maxWidth: 720, margin: "0 auto" }}>
        <div>
          <h1 style={{ margin: "4px 0", fontSize: 22 }}>Dark mode</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
            Locked dark. Compare: <a href="/design/light">/design/light</a> · <a href="/design">toggle version</a>
          </p>
        </div>
        <Showcase />
      </main>
    </div>
  );
}
