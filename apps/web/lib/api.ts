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
