// Mark-read button: POSTs through the same-origin proxy. Offline: says so, keeps state.
"use client";

import { useState } from "react";

export default function Dismiss({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "working" | "done" | "offline">("idle");
  const click = async () => {
    if (state === "working" || state === "done") return;
    setState("working");
    try {
      const body = { "0": { json: { id } } };
      const r = await fetch("/api/trpc/alertsRead?batch=1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("offline");
      setState("done");
      location.reload();
    } catch {
      setState("offline");
      setTimeout(() => setState("idle"), 2000);
    }
  };
  return (
    <button onClick={click} aria-label="Mark as read"
      style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-muted)", fontSize: 12, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>
      {state === "working" ? "…" : state === "done" ? "✓" : state === "offline" ? "Offline" : "Done"}
    </button>
  );
}
