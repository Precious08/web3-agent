// Onboarding: same 4 steps, terminal dress — progress segments, full-width option rows.
"use client";

import { useState } from "react";
import { loadLocal, saveLocal, syncToApi } from "../../lib/settings";
import type { UserSettings } from "@web3-agent/types";

const CHAINS = ["Ethereum", "Solana", "Base", "Arbitrum", "Bitcoin L2", "Cosmos"];
const SECTORS = ["DeFi", "DePIN", "AI x Crypto", "Restaking", "RWA", "Gaming", "Privacy"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<UserSettings>(() => loadLocal());
  const [done, setDone] = useState<string | null>(null);
  const tog = (k: "chains" | "sectors", v: string) =>
    setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const finish = async () => {
    saveLocal(s);
    setDone((await syncToApi(s)) ? "Saved and synced." : "Saved on this device — syncs when you're back online.");
  };

  const rowOpt = (on: boolean): React.CSSProperties => ({
    display: "flex", gap: 10, alignItems: "center", border: `1px solid ${on ? "var(--accent)" : "var(--border-soft)"}`,
    borderRadius: 10, padding: "10px 14px", fontSize: 14, cursor: "pointer",
    background: on ? "var(--surface-2)" : "var(--surface)",
  });
  const field = (): React.CSSProperties => ({ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "10px 14px", fontSize: 14, width: "100%" });

  const steps = [
    { t: "Where do you hunt?", sub: "Chains shape everything downstream.", body: CHAINS.map((c) => (
      <label key={c} style={rowOpt(s.chains.includes(c))}><input type="checkbox" checked={s.chains.includes(c)} onChange={() => tog("chains", c)} style={{ accentColor: "var(--accent-2)" }} /> {c}<span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>{s.chains.includes(c) ? "ON" : ""}</span></label>)) },
    { t: "What sectors pull you?", sub: "Empty means everywhere — no bubble yet.", body: SECTORS.map((c) => (
      <label key={c} style={rowOpt(s.sectors.includes(c))}><input type="checkbox" checked={s.sectors.includes(c)} onChange={() => tog("sectors", c)} style={{ accentColor: "var(--accent-2)" }} /> {c}<span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>{s.sectors.includes(c) ? "ON" : ""}</span></label>)) },
    { t: "How early?", sub: "Stage and token status bound the universe.", body: (
      <div style={{ display: "grid", gap: 10 }}>
        <select aria-label="Stage" value={s.stages[0] ?? ""} onChange={(e) => setS({ ...s, stages: e.target.value ? [e.target.value as UserSettings["stages"][number]] : [] })} style={field()}>
          <option value="">Any stage</option>
          {["idea", "testnet", "mainnet-beta", "live", "established"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select aria-label="Token" value={s.tokenStatus[0] ?? ""} onChange={(e) => setS({ ...s, tokenStatus: e.target.value ? [e.target.value as UserSettings["tokenStatus"][number]] : [] })} style={field()}>
          <option value="">Any token status</option>
          {["none", "points", "tge-upcoming", "liquid"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>) },
    { t: "Who are you here as?", sub: "Role tunes what relevant means. Narratives seed the feed.", body: (
      <div style={{ display: "grid", gap: 10 }}>
        <select aria-label="Role" value={s.role} onChange={(e) => setS({ ...s, role: e.target.value as UserSettings["role"] })} style={field()}>
          {["airdrop", "investor", "developer", "researcher", "creator"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <input aria-label="Followed narratives, comma separated" placeholder="e.g. Restaking, DePIN" defaultValue={s.followedNarratives.join(", ")}
          onBlur={(e) => setS({ ...s, followedNarratives: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} />
        <label style={{ fontSize: 13, color: "var(--text-muted)", display: "grid", gap: 6 }}>Surprise me · {s.surpriseMe}% outside your bubble
          <input type="range" min={0} max={100} value={s.surpriseMe} onChange={(e) => setS({ ...s, surpriseMe: Number(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent)" }} />
        </label>
      </div>) },
  ];

  if (done)
    return (
      <main className="page page-narrow" style={{ gap: 12 }}>
        <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--accent-2)" }}>Calibrated</p>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 28 }}>Feed tuned to you.</h1>
        <p style={{ color: "var(--text-muted)" }}>{done}</p>
        <a href="/">Enter terminal →</a>
      </main>
    );

  return (
    <main className="page page-narrow" style={{ gap: 18 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= step ? "linear-gradient(90deg, var(--accent), var(--accent-2))" : "var(--surface-3)" }} />
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--text-faint)" }}>Calibrating · {step + 1} / 4</p>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: -0.3 }}>{steps[step].t}</h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>{steps[step].sub}</p>
      </div>
      <div style={{ display: "grid", gap: 8 }}>{steps[step].body}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {step > 0 && <button onClick={() => setStep(step - 1)} style={ghost()}>← Back</button>}
        {step < 3
          ? <button onClick={() => setStep(step + 1)} style={primary()}>Continue →</button>
          : <button onClick={finish} style={primary()}>Tune my feed</button>}
        <a href="/" style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-faint)" }}>Skip</a>
      </div>
    </main>
  );
}

const primary = (): React.CSSProperties => ({ background: "linear-gradient(92deg, var(--accent), var(--accent-2))", color: "#06121f", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer" });
const ghost = (): React.CSSProperties => ({ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 18px", cursor: "pointer" });
