// Sidebar + drawer navigation. Drawer mode (detailed) adds numbers, hint lines,
// staggered entrance and an explicit close affordance.
"use client";

import { usePathname } from "next/navigation";

type Link = { href: string; label: string; icon: string; hint: string; match: (p: string) => boolean };

const GROUPS: { caption: string; links: Link[] }[] = [
  {
    caption: "Research",
    links: [
      { href: "/", label: "Overview", icon: "◈", hint: "Ranked for you", match: (p) => p === "/" },
      { href: "/discover?view=all", label: "Discover", icon: "◎", hint: "The full stream", match: (p) => p === "/discover" },
      { href: "/discover?view=early", label: "Early radar", icon: "✦", hint: "Pre-consensus signals", match: () => false },
      { href: "/ask", label: "Ask", icon: "?", hint: "Ask anything", match: (p) => p === "/ask" },
    ],
  },
  {
    caption: "System",
    links: [{ href: "/settings", label: "Settings", icon: "⚙", hint: "Tune your signal", match: (p) => p === "/settings" }],
  },
];

export default function Nav({ open = true, detailed = false }: { open?: boolean; detailed?: boolean }) {
  const path = usePathname();
  let n = 0;
  return (
    <nav aria-label="Primary" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {GROUPS.map((g) => (
        <div key={g.caption} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ margin: "0 0 2px 12px", fontSize: 10.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--text-faint)" }}>
            {g.caption}
          </p>
          {g.links.map((l) => {
            const on = l.match(path);
            const i = n++;
            return (
              <div key={l.href + l.label} className="nav-link"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateX(-14px)",
                  transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
                }}>
                <a href={l.href}
                  aria-current={on ? "page" : undefined}
                  style={{
                    position: "relative",
                    display: "flex", alignItems: "center", gap: 10, padding: detailed ? "11px 12px" : "10px 12px", borderRadius: 10,
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
                  {detailed && (
                    <span aria-hidden className="tabular" style={{ fontSize: 11, color: on ? "var(--accent-2)" : "var(--text-faint)", minWidth: 18 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span aria-hidden style={{ width: 16, textAlign: "center", color: on ? "var(--accent-2)" : "var(--text-faint)", textShadow: on ? "0 0 12px var(--accent-2)" : "none" }}>{l.icon}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span>{l.label}</span>
                    {detailed && <span style={{ fontSize: 11.5, color: "var(--text-faint)", fontWeight: 400 }}>{l.hint}</span>}
                  </span>
                  {detailed && (
                    <span aria-hidden style={{ marginLeft: "auto", color: "var(--text-faint)" }}>›</span>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
