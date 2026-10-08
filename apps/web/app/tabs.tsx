// Bottom tab bar — phones only (hidden on desktop by .mobile-tabs CSS).
// Five destinations, Ask raised center. Active = top indicator + lit icon.
"use client";

import { usePathname, useSearchParams } from "next/navigation";

type Tab = { href: string; label: string; icon: string; on: (p: string, v: string | null) => boolean; center?: boolean };

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: "◈", on: (p) => p === "/" },
  { href: "/discover?view=all", label: "Discover", icon: "◎", on: (p, v) => p === "/discover" && v !== "early" },
  { href: "/ask", label: "Ask", icon: "?", on: (p) => p === "/ask", center: true },
  { href: "/discover?view=early", label: "Early", icon: "✦", on: (p, v) => p === "/discover" && v === "early" },
  { href: "/settings", label: "Settings", icon: "⚙", on: (p) => p === "/settings" },
];

export default function Tabs() {
  const path = usePathname();
  const view = useSearchParams().get("view");
  return (
    <nav aria-label="Primary" className="mobile-tabs">
      {TABS.map((t) => {
        const on = t.on(path, view);
        if (t.center) {
          return (
            <a key={t.href} href={t.href} aria-label="Ask" aria-current={on ? "page" : undefined}
              style={{ flex: 1, display: "flex", justifyContent: "center", textDecoration: "none" }}>
              <span style={{
                width: 52, height: 52, marginTop: -22, borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, color: "#06121f",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                boxShadow: "0 6px 24px rgb(109 155 255 / 0.5)",
                border: on ? "2px solid #fff" : "none",
              }}>
                {t.icon}
              </span>
            </a>
          );
        }
        return (
          <a key={t.href + t.label} href={t.href} aria-current={on ? "page" : undefined}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "8px 0 4px", textDecoration: "none", minHeight: 52, position: "relative",
              color: on ? "var(--text)" : "var(--text-faint)",
            }}>
            <span aria-hidden style={{
              position: "absolute", top: 0, width: 24, height: 2, borderRadius: 2,
              background: on ? "linear-gradient(90deg, var(--accent), var(--accent-2))" : "transparent",
              boxShadow: on ? "0 0 8px var(--accent)" : "none",
            }} />
            <span aria-hidden style={{ fontSize: 20, lineHeight: 1, textShadow: on ? "0 0 12px var(--accent-2)" : "none" }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: 0.4 }}>{t.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
