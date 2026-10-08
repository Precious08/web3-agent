// Hamburger + slide-in drawer — phones only (desktop keeps the sidebar).
// Burger morphs to X, scrim dismisses, Escape closes, scroll locks while open.
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Nav from "./nav";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <>
      <button
        className={`menu-btn${open ? " open" : ""}`}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden />
        <span aria-hidden />
        <span aria-hidden />
      </button>
      <div className={`scrim${open ? " open" : ""}`} aria-hidden="true" onClick={() => setOpen(false)} />
      <aside className={`drawer${open ? " open" : ""}`} aria-hidden={!open} aria-label="Menu">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden style={{ width: 12, height: 12, borderRadius: 999, background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)", boxShadow: "0 0 16px rgb(109 155 255 / 0.55)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Web3 Agent</span>
          </span>
        </div>
        <div onClick={() => setOpen(false)}>
          <Nav />
        </div>
        <div style={{ marginTop: "auto", padding: "12px 12px 0", borderTop: "1px solid var(--border-soft)" }}>
          <a href="https://github.com/Precious08/web3-agent" style={{ fontSize: 12 }}>Source on GitHub ↗</a>
        </div>
      </aside>
    </>
  );
}
