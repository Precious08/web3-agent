// Sidebar: product navigation ONLY (Onboarding = flow, Design = internal, Search = topbar).
// Grouped with captions, active row carries an accent edge + glow icon.
"use client";

import { usePathname } from "next/navigation";

type Link = { href: string; label: string; icon: string; match: (p: string) => boolean };

const GROUPS: { caption: string; links: Link[] }[] = [
  {
    caption: "Research",
    links: [
      { href: "/", label: "Overview", icon: "◈", match: (p) => p === "/" },
      { href: "/discover?view=all", label: "Discover", icon: "◎", match: (p) => p === "/discover" },
      { href: "/discover?view=early", label: "Early radar", icon: "✦", match: () => false },
    ],
  },
  {
    caption: "System",
    links: [{ href: "/settings", label: "Settings", icon: "⚙", match: (p) => p === "/settings" }],
  },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Primary" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {GROUPS.map((g) => (
        <div key={g.caption} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ margin: "0 0 2px 12px", fontSize: 10.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--text-faint)" }}>
            {g.caption}
          </p>
          {g.links.map((l) => {
            const on = l.match(path);
            return (
              <a key={l.href + l.label} href={l.href}
                aria-current={on ? "page" : undefined}
                style={{
                  position: "relative",
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                  fontSize: 13.5, fontWeight: on ? 700 : 500, textDecoration: "none",
                  color: on ? "var(--text)" : "var(--text-muted)",
                  background: on ? "linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent)" : "transparent",
                  border: "1px solid transparent",
                  minHeight: 44,
                }}>
                <span aria-hidden style={{
                  position: "absolute", left: 0, top: 8, bottom: 8, width: 2, borderRadius: 2,
                  background: on ? "linear-gradient(180deg, var(--accent), var(--accent-2))" : "transparent",
                  boxShadow: on ? "0 0 8px var(--accent)" : "none",
                }} />
                <span aria-hidden style={{ width: 16, textAlign: "center", color: on ? "var(--accent-2)" : "var(--text-faint)", textShadow: on ? "0 0 12px var(--accent-2)" : "none" }}>{l.icon}</span>
                {l.label}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
