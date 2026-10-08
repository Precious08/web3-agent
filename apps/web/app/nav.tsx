// Sidebar command deck (Kaito school): icon + label rows, active highlighted.
"use client";

import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Overview", icon: "◈", match: (p: string) => p === "/" },
  { href: "/discover?view=all", label: "Discover", icon: "◎", match: (p: string) => p === "/discover" },
  { href: "/discover?view=early", label: "Early radar", icon: "✦", match: () => false },
  { href: "/search", label: "Search", icon: "⌕", match: (p: string) => p === "/search" },
  { href: "/onboarding", label: "Onboarding", icon: "▤", match: (p: string) => p === "/onboarding" },
  { href: "/settings", label: "Settings", icon: "⚙", match: (p: string) => p === "/settings" },
  { href: "/design", label: "Design", icon: "◐", match: (p: string) => p === "/design" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Primary" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {LINKS.map((l) => {
        const on = l.match(path);
        return (
          <a key={l.href + l.label} href={l.href}
            aria-current={on ? "page" : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10,
              fontSize: 13.5, fontWeight: on ? 700 : 500, textDecoration: "none",
              color: on ? "var(--text)" : "var(--text-muted)",
              background: on ? "var(--surface-2)" : "transparent",
              border: on ? "1px solid var(--border-soft)" : "1px solid transparent",
            }}>
            <span aria-hidden style={{ width: 16, textAlign: "center", color: on ? "var(--accent-2)" : "var(--text-faint)" }}>{l.icon}</span>
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}
