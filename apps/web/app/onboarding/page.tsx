// Onboarding wizard (P0-9): 4 steps, <3 min, skippable. Saves local + best-effort API sync.
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
    setDone((await syncToApi(s)) ? "Saved + synced to API." : "Saved locally (API offline — will sync later).");
  };

  const steps = [
    { t: "Which chains?", body: CHAINS.map((c) => (
      <label key={c} style={chip(s.chains.includes(c))}><input type="checkbox" checked={s.chains.includes(c)} onChange={() => tog("chains", c)} /> {c}</label>)) },
    { t: "Which sectors?", body: SECTORS.map((c) => (
      <label key={c} style={chip(s.sectors.includes(c))}><input type="checkbox" checked={s.sectors.includes(c)} onChange={() => tog("sectors", c)} /> {c}</label>)) },
    { t: "Stage + token?", body: (
      <div style={{ display: "grid", gap: 8 }}>
        <select aria-label="Stage" value={s.stages[0] ?? ""} onChange={(e) => setS({ ...s, stages: e.target.value ? [e.target.value as UserSettings["stages"][number]] : [] })} style={field()}>
          <option value="">Any stage</option>
          {["idea", "testnet", "mainnet-beta", "live", "established"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select aria-label="Token" value={s.tokenStatus[0] ?? ""} onChange={(e) => setS({ ...s, tokenStatus: e.target.value ? [e.target.value as UserSettings["tokenStatus"][number]] : [] })} style={field()}>
          <option value="">Any token status</option>
          {["none", "points", "tge-upcoming", "liquid"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>) },
    { t: "Role + narratives?", body: (
      <div style={{ display: "grid", gap: 8 }}>
        <select aria-label="Role" value={s.role} onChange={(e) => setS({ ...s, role: e.target.value as UserSettings["role"] })} style={field()}>
          {["airdrop", "investor", "developer", "researcher", "creator"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <input aria-label="Followed narratives, comma separated" placeholder="e.g. Restaking, DePIN" defaultValue={s.followedNarratives.join(", ")}
          onBlur={(e) => setS({ ...s, followedNarratives: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} style={field()} />
        <label style={{ fontSize: 13, color: "var(--text-muted)" }}>Surprise me ({s.surpriseMe}%)
          <input type="range" min={0} max={100} value={s.surpriseMe} onChange={(e) => setS({ ...s, surpriseMe: Number(e.target.value) })} style={{ width: "100%" }} />
        </label>
      </div>) },
  ];

  if (done) return <main style={wrap()}><h1 style={h1()}>You're set.</h1><p>{done}</p><a href="/">Go to Home →</a></main>;
  return (
    <main style={wrap()}>
      <p style={eyebrow()}>Onboarding · step {step + 1} of 4</p>
      <h1 style={h1()}>{steps[step].t}</h1>
      <div style={{ display: "grid", gap: 8 }}>{steps[step].body}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {step > 0 && <button onClick={() => setStep(step - 1)} style={btn(false)}>Back</button>}
        {step < 3 ? <button onClick={() => setStep(step + 1)} style={btn(true)}>Next</button>
          : <button onClick={finish} style={btn(true)}>Finish</button>}
        <a href="/" style={{ marginLeft: "auto", alignSelf: "center", fontSize: 13 }}>Skip →</a>
      </div>
    </main>
  );
}

const wrap = (): React.CSSProperties => ({ padding: "40px 24px", display: "grid", gap: 14, maxWidth: 560, margin: "0 auto" });
const h1 = (): React.CSSProperties => ({ margin: 0, fontFamily: "var(--font-display)", fontSize: 26 });
const eyebrow = (): React.CSSProperties => ({ margin: 0, fontSize: 11.5, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--text-faint)" });
const chip = (on: boolean): React.CSSProperties => ({ display: "flex", gap: 8, alignItems: "center", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "8px 12px", fontSize: 14, background: on ? "var(--surface-3)" : "transparent", cursor: "pointer" });
const field = (): React.CSSProperties => ({ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "8px 12px", fontSize: 14 });
const btn = (p: boolean): React.CSSProperties => ({ background: p ? "var(--accent)" : "transparent", color: p ? "#06121f" : "var(--text)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 18px", fontWeight: 650, cursor: "pointer" });
