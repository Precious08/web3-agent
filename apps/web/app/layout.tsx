import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web3 Agent — Design Preview",
  description: "Phase 1 dark-only design preview.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px",
            borderBottom: "1px solid var(--border-soft)",
            background: "rgb(5 7 12 / 0.72)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                boxShadow: "0 0 16px rgb(109 155 255 / 0.55)",
              }}
            />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: 0.2 }}>
              Web3 Agent
            </span>
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "4px 12px",
              background: "var(--surface)",
              letterSpacing: 0.4,
            }}
          >
            DARK · PHASE 1
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
