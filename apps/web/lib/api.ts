// Data helpers: live tRPC when the API is up, FALLBACK when it is not.
// Pages stay server components; prerender uses fallback, live dev uses the API.
import { api } from "./trpc";
import { FALLBACK } from "./fallback";
import type { Discovery } from "@web3-agent/types";

export async function getDiscover(view: "foryou" | "early"): Promise<{ items: Discovery[]; live: boolean }> {
  try {
    const items = await api().discover.query({ view });
    return { items, live: true };
  } catch {
    const items = view === "early" ? FALLBACK.filter((d) => d.signals.some((s) => s.state !== "strong")) : FALLBACK;
    return { items, live: false };
  }
}

export async function getWatchlist(): Promise<{ items: { kind: string; refId: string }[]; live: boolean }> {
  try {
    return { items: await api().watchlistList.query(), live: true };
  } catch {
    return { items: [{ kind: "project", refId: "helios-depin" }], live: false };
  }
}

export async function getHistory(): Promise<{ items: { id: string; label: string; href: string; at: string }[]; live: boolean }> {
  try {
    return { items: await api().historyList.query(), live: true };
  } catch {
    return { items: [], live: false };
  }
}

export type AlertView = { id: string; refId: string; title: string; body: string; read: boolean; at: string };

export async function getAlerts(): Promise<{ items: AlertView[]; live: boolean }> {
  try {
    await api().alertsDigest.query();
    return { items: await api().alertsList.query(), live: true };
  } catch {
    return { items: [], live: false };
  }
}

export async function getSearch(q: string): Promise<{ items: Discovery[]; live: boolean }> {
  if (!q.trim()) return { items: [], live: true };
  try {
    return { items: await api().search.query({ q }), live: true };
  } catch {
    const needle = q.toLowerCase();
    return { items: FALLBACK.filter((d) => (d.title + d.why).toLowerCase().includes(needle)), live: false };
  }
}
