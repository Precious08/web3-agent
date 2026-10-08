"use client";

import { useState } from "react";
import { DEFAULT_SETTINGS, type UserSettings } from "@web3-agent/types";
import { loadLocal, saveLocal, syncToApi } from "../../lib/settings";

const field = (): React.CSSProperties => ({ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "8px 12px", fontSize: 14, width: "100%" });
const lab = (): React.CSSProperties => ({ display: "grid", gap: 6, fontSize: 13, color: "var(--text-muted)" });

export default function Form({ initial }: { initial: UserSettings }) {
  const [s, setS] = useState<UserSettings>(() => {
    if (typeof window === "undefined") return initial;
    const local = loadLocal();
    return local === DEFAULT_SETTINGS ? initial : { ...initial, ...JSON.parse(localStorage.getItem("web3-settings") ?? "{}") };
  });
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    saveLocal(s);
    setMsg((await syncToApi(s)) ? "Saved + synced to API." : "Saved locally (API offline — will sync later).");
  };
  const reset = () => {
    setS({ ...DEFAULT_SETTINGS });
    saveLocal({ ...DEFAULT_SETTINGS });
    setMsg("Reset to defaults.");
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <label style={lab()}>Chains (comma separated)
        <input value={s.chains.join(", ")} onChange={(e) => setS({ ...s, chains: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} /></label>
      <label style={lab()}>Sectors (comma separated)
        <input value={s.sectors.join(", ")} onChange={(e) => setS({ ...s, sectors: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} /></label>
      <label style={lab()}>Blocked terms (comma separated)
        <input value={s.blocked.join(", ")} onChange={(e) => setS({ ...s, blocked: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} /></label>
      <label style={lab()}>Sensitivity
        <select value={s.sensitivity} onChange={(e) => setS({ ...s, sensitivity: e.target.value as UserSettings["sensitivity"] })} style={field()}>
          <option value="conservative">Conservative — fewer, stronger</option>
          <option value="balanced">Balanced</option>
          <option value="aggressive">Aggressive — more, earlier</option>
        </select></label>
      <label style={lab()}>Alert threshold
        <select value={s.globalAlertThreshold} onChange={(e) => setS({ ...s, globalAlertThreshold: e.target.value as UserSettings["globalAlertThreshold"] })} style={field()}>
          <option value="strong">Strong only</option>
          <option value="moderate">Moderate and up</option>
          <option value="any">Any emerging</option>
        </select></label>
      <label style={lab()}>Max alerts per day: {s.maxPerDay}
        <input type="range" min={1} max={50} value={s.maxPerDay} onChange={(e) => setS({ ...s, maxPerDay: Number(e.target.value) })} style={{ width: "100%" }} /></label>
      <label style={{ display: "flex", gap: 8, fontSize: 14 }}>
        <input type="checkbox" checked={s.saveHistory} onChange={(e) => setS({ ...s, saveHistory: e.target.checked })} /> Save research history</label>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={save} style={{ background: "var(--accent)", color: "#06121f", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 650, cursor: "pointer" }}>Save</button>
        <button onClick={reset} style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 18px", cursor: "pointer" }}>Reset to defaults</button>
      </div>
      {msg && <p role="status" style={{ fontSize: 13, color: "var(--text-muted)" }}>{msg}</p>}
    </div>
  );
}
