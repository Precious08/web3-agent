import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./ThemeToggle";

export const metadata: Metadata = {
  title: "Web3 Agent — Design Preview",
  description: "Phase 1 design preview (/design), dark-first with light toggle.",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("web3-theme");document.documentElement.dataset.theme=(t==="light"?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <a href="/" style={{ fontWeight: 700, textDecoration: "none", color: "var(--text)" }}>
            Web3 Agent
          </a>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
