"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, type UserSettings } from "@web3-agent/types";
import { saveLocal, syncToApi } from "../../lib/settings";
import { Eyebrow } from "../../components/chrome";

const field = (): React.CSSProperties => ({ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "9px 13px", fontSize: 14, width: "100%" });
const panel: React.CSSProperties = { border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)", boxShadow: "var(--card-shadow)", padding: 18, display: "grid", gap: 14 };
const lab = (): React.CSSProperties => ({ display: "grid", gap: 7, fontSize: 13.5, fontWeight: 600 });
const hint = (): React.CSSProperties => ({ margin: 0, fontSize: 12.5, color: "var(--text-faint)", fontWeight: 400 });

function Group({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section style={panel}>
      <div>
        <Eyebrow>{title}</Eyebrow>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
      </div>
      {children}
    </section>
  );
}

const SENS: { v: UserSettings["sensitivity"]; t: string; d: string }[] = [
  { v: "conservative", t: "Conservative", d: "Fewer, stronger" },
  { v: "balanced", t: "Balanced", d: "The default" },
  { v: "aggressive", t: "Aggressive", d: "More, earlier" },
];

export default function Form({ initial }: { initial: UserSettings }) {
  const [s, setS] = useState<UserSettings>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem("web3-settings");
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial;
    }
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState<"idle" | "working" | "done">("idle");
  const [lastOk, setLastOk] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const save = async () => {
    if (saving === "working") return;
    setSaving("working");
    saveLocal(s);
    const ok = await syncToApi(s);
    setLastOk(ok);
    setMsg(ok ? "Saved and synced." : "Saved on this device — syncs when you're back online.");
    setSaving("done");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaving("idle"), 2000);
  };
  const reset = () => {
    setS({ ...DEFAULT_SETTINGS });
    saveLocal({ ...DEFAULT_SETTINGS });
    setMsg("Reset to defaults — your watchlist is untouched.");
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Group title="Discovery" sub="The universe your feed ranks. Blocked terms never surface.">
        <label style={lab()}>Chains
          <span style={hint()}>e.g. Base, Solana — empty means everywhere.</span>
          <input value={s.chains.join(", ")} onChange={(e) => setS({ ...s, chains: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} /></label>
        <label style={lab()}>Sectors
          <span style={hint()}>e.g. DePIN, Restaking — empty means all sectors.</span>
          <input value={s.sectors.join(", ")} onChange={(e) => setS({ ...s, sectors: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} /></label>
        <label style={lab()}>Muted & blocked
          <span style={hint()}>Comma separated. Blocked is absolute — direct search only.</span>
          <input value={[...s.mutedNarratives, ...s.blocked].join(", ")} onChange={(e) => setS({ ...s, blocked: e.target.value.split(",").map((x) => x.trim()).filter(Boolean), mutedNarratives: [] })} style={field()} /></label>
      </Group>

      <Group title="Signal temperament" sub="One control for noise vs. earliness. No knob forests.">
        <div role="radiogroup" aria-label="Sensitivity" style={{ display: "grid", gap: 8 }}>
          {SENS.map((o) => (
            <label key={o.v} style={{ display: "flex", gap: 10, alignItems: "center", border: `1px solid ${s.sensitivity === o.v ? "var(--accent)" : "var(--border-soft)"}`, borderRadius: 10, padding: "9px 13px", cursor: "pointer", background: s.sensitivity === o.v ? "var(--surface-3)" : "transparent" }}>
              <input type="radio" name="sens" checked={s.sensitivity === o.v} onChange={() => setS({ ...s, sensitivity: o.v })} />
              <span style={{ fontSize: 14, fontWeight: 650 }}>{o.t}</span>
              <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{o.d}</span>
            </label>
          ))}
        </div>
        <label style={lab()}>Surprise me: {s.surpriseMe}%
          <span style={hint()}>Adjacent discoveries outside your watchlist. 25% keeps the bubble open.</span>
          <input type="range" min={0} max={100} value={s.surpriseMe} onChange={(e) => setS({ ...s, surpriseMe: Number(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent)" }} /></label>
      </Group>

      <Group title="Alerts" sub="Meaningful changes only — never a firehose.">
        <label style={lab()}>Notify me on
          <select value={s.globalAlertThreshold} onChange={(e) => setS({ ...s, globalAlertThreshold: e.target.value as UserSettings["globalAlertThreshold"] })} style={field()}>
            <option value="strong">Strong signals only</option>
            <option value="moderate">Moderate and up</option>
            <option value="any">Anything emerging</option>
          </select></label>
        <label style={lab()}>Max per day: {s.maxPerDay}
          <input type="range" min={1} max={50} value={s.maxPerDay} onChange={(e) => setS({ ...s, maxPerDay: Number(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent)" }} /></label>
      </Group>

      <Group title="Privacy" sub="Your research stays yours.">
        <label style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "center" }}>
          <input type="checkbox" checked={s.saveHistory} onChange={(e) => setS({ ...s, saveHistory: e.target.checked })} style={{ accentColor: "var(--accent)" }} />
          Save research history</label>
      </Group>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={save} disabled={saving === "working"}
          style={{
            background: saving === "done" ? "linear-gradient(92deg, var(--accent-2), var(--accent))" : "linear-gradient(92deg, var(--accent), var(--accent-2))",
            color: "#06121f", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700,
            cursor: saving === "working" ? "wait" : "pointer", minWidth: 168, opacity: saving === "working" ? 0.75 : 1,
          }}>
          {saving === "working" ? "Saving…" : saving === "done" ? (lastOk ? "Saved & synced ✓" : "Saved ✓") : "Save preferences"}
        </button>
        <button onClick={reset} style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 18px", cursor: "pointer" }}>Reset</button>
      </div>
      {msg && <p role="status" style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>{msg}</p>}
    </div>
  );
}
