// Settings form (Basic only, PRD 44-46 pruned). Server wrapper loads current; client form edits.
import { api } from "../../lib/trpc";
import { DEFAULT_SETTINGS } from "@web3-agent/types";
import { Eyebrow } from "../../components/chrome";
import Form from "./form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let initial = { ...DEFAULT_SETTINGS };
  try {
    initial = await api().settingsGet.query();
  } catch { /* offline → defaults, form loads local */ }
  return (
    <main className="page page-narrow" style={{ gap: 20 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <Eyebrow>Control center · basic</Eyebrow>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: -0.3 }}>Tune your <span style={{ background: "linear-gradient(92deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>signal.</span></h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>Everything that decides what you see lives here — and every change takes effect immediately. Advanced tuning stays P2 (PRD Sec 48).</p>
      </div>
      <Form initial={initial} />
    </main>
  );
}
