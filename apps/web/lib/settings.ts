// Settings helpers: localStorage is the offline source of truth; API sync is best-effort.
// (Same-origin API proxy lands in Phase 7 — browser→:4000 may hit CORS until then.)
"use client";

import { DEFAULT_SETTINGS, type UserSettings } from "@web3-agent/types";

const KEY = "web3-settings";

export function loadLocal(): UserSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* fresh defaults */ }
  return { ...DEFAULT_SETTINGS };
}

export function saveLocal(s: UserSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export async function syncToApi(s: UserSettings): Promise<boolean> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const input = { "0": { json: s } };
    const r = await fetch(`${base}/settingsUpdate?batch=1&input=${encodeURIComponent(JSON.stringify(input))}`, { method: "GET" });
    return r.ok;
  } catch {
    return false;
  }
}
