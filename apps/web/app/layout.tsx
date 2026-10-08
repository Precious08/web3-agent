import type { Metadata } from "next";
import "./globals.css";
import Nav from "./nav";
import Menu from "./menu";

export const metadata: Metadata = {
  title: "Web3 Agent — Research Terminal",
  description: "Web3 research and alpha discovery — what matters, why it matters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside className="sidebar" aria-label="Command deck">
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 12px 16px", textDecoration: "none", color: "var(--text)" }}>
              <span aria-hidden style={{ width: 12, height: 12, borderRadius: 999, background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)", boxShadow: "0 0 16px rgb(109 155 255 / 0.55)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: 0.2, fontSize: 15 }}>Web3 Agent</span>
            </a>
            <Nav />
            <div style={{ marginTop: "auto", padding: "12px 12px 0", borderTop: "1px solid var(--border-soft)", display: "grid", gap: 4 }}>
              <p style={{ margin: 0, fontSize: 11.5, color: "var(--text-faint)", letterSpacing: 0.6 }}>TERMINAL · DARK ONLY</p>
              <a href="https://github.com/Precious08/web3-agent" style={{ fontSize: 12 }}>Source on GitHub ↗</a>
            </div>
          </aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", background: "rgb(5 7 12 / 0.72)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
              <Menu />
              <form action="/search" role="search" className="topbar-search">
                <input name="q" placeholder="Search…  (⌕)" aria-label="Search"
                  style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "var(--text)" }} />
              </form>
              <span className="hide-sm" style={{ marginLeft: "auto", fontSize: 11.5, letterSpacing: 1.2, color: "var(--text-faint)", border: "1px solid var(--border-soft)", borderRadius: 999, padding: "5px 12px", whiteSpace: "nowrap" }}>
                DARK · TERMINAL
              </span>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
