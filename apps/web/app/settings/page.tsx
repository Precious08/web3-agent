// Settings form (Basic only, PRD 44-46 pruned). Server wrapper loads current; client form edits.
import { api } from "../../lib/trpc";
import { DEFAULT_SETTINGS } from "@web3-agent/types";
import Form from "./form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let initial = { ...DEFAULT_SETTINGS };
  try {
    initial = await api().settingsGet.query();
  } catch { /* offline → defaults, form loads local */ }
  return (
    <main style={{ padding: "40px 24px 72px", display: "grid", gap: 16, maxWidth: 640, margin: "0 auto" }}>
      <div>
        <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--text-faint)" }}>Control center · basic</p>
        <h1 style={{ margin: "4px 0", fontFamily: "var(--font-display)", fontSize: 28 }}>What you want to see</h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>Advanced tuning (weights, KOLs, audit) is P2 — see PRD Sec 48.</p>
      </div>
      <Form initial={initial} />
    </main>
  );
}
