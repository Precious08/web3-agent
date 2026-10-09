// tRPC router stubs (3b). Backed by mocks + in-memory settings/watchlist.
// Prisma + real ranking land in Phase 4/5/7; every response already carries whyCodes.
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { DEFAULT_SETTINGS, type UserSettings } from "@web3-agent/types";
import { MOCK_DISCOVERIES } from "./mock";
import { rank } from "./ranking";

const t = initTRPC.create();
const SettingsInput = z.object({
  stages: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  chains: z.array(z.string()).optional(),
  tokenStatus: z.array(z.string()).optional(),
  role: z.string().optional(),
  followedNarratives: z.array(z.string()).optional(),
  mutedNarratives: z.array(z.string()).optional(),
  blocked: z.array(z.string()).optional(),
  surpriseMe: z.number().min(0).max(100).optional(),
  sensitivity: z.string().optional(),
  globalAlertThreshold: z.string().optional(),
  maxPerDay: z.number().optional(),
  saveHistory: z.boolean().optional(),
});

let settings: UserSettings = { ...DEFAULT_SETTINGS };
let watchlist: { kind: string; refId: string }[] = [];
type Hist = { id: string; label: string; href: string; at: string };
let history: Hist[] = [];
const remember = (h: Omit<Hist, "id" | "at">) => {
  if (!settings.saveHistory) return;
  history.unshift({ ...h, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, at: new Date().toISOString() });
  history = history.slice(0, 20);
};
type AlertItem = { id: string; refId: string; title: string; body: string; read: boolean; at: string };
let alerts: AlertItem[] = [];

export const appRouter = t.router({
  health: t.procedure.query(() => ({ ok: true, version: "0.0.0-phase3b" })),

  settingsGet: t.procedure.query(() => settings),
  settingsUpdate: t.procedure.input(SettingsInput).query(({ input }) => {
    settings = { ...settings, ...input } as UserSettings;
    return settings;
  }),
  settingsReset: t.procedure.mutation(() => {
    settings = { ...DEFAULT_SETTINGS };
    return settings;
  }),

  search: t.procedure.input(z.object({ q: z.string() })).query(({ input }) => {
    const q = input.q.toLowerCase();
    // Direct search may surface blocked items (with warning left to the UI);
    // ranking still orders by convergence.
    const hits = MOCK_DISCOVERIES.filter((d) => (d.title + d.why).toLowerCase().includes(q)).slice(0, 10);
    return rank(hits, settings);
  }),

  ask: t.procedure.input(z.object({ question: z.string() })).query(({ input }) => {
    const top = MOCK_DISCOVERIES[0];
    remember({ label: input.question.slice(0, 80), href: `/ask?q=${encodeURIComponent(input.question)}` });
    return {
      summary: `Stub answer for: ${input.question}`,
      signals: top.signals,
      evidence: top.evidence,
      counters: top.counters,
      unknowns: top.unknowns,
      next: top.next,
      whyCodes: ["stub:3b", "source:mock"],
    };
  }),

  discover: t.procedure
    .input(z.object({ view: z.enum(["foryou", "early"]).default("foryou") }).optional())
    .query(({ input }) => {
      const view = input?.view ?? "foryou";
      // Feed = ranked by settings (ADR-006); early view filters pre-consensus on top.
      const ordered = rank(MOCK_DISCOVERIES, settings);
      if (view === "early") return ordered.filter((d) => d.signals.some((s) => s.state === "emerging" || s.state === "uncertain"));
      return ordered.slice(0, 10);
    }),

  entity: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => {
    const found = MOCK_DISCOVERIES.find((d) => d.id === input.id);
    if (!found) throw new Error(`unknown id: ${input.id}`);
    remember({ label: found.title, href: `/entity/${found.id}` });
    return found;
  }),

  compare: t.procedure.input(z.object({ aId: z.string(), bId: z.string() })).query(({ input }) => {
    const a = MOCK_DISCOVERIES.find((d) => d.id === input.aId);
    const b = MOCK_DISCOVERIES.find((d) => d.id === input.bId);
    if (!a || !b) throw new Error("compare needs two known ids (projects only, MVP)");
    return { a, b, diff: `${a.title} shows stronger convergence than ${b.title} in these mocks.` };
  }),

  watchlistAdd: t.procedure.input(z.object({ kind: z.string(), refId: z.string() })).mutation(({ input }) => {
    if (!watchlist.some((w) => w.kind === input.kind && w.refId === input.refId)) watchlist.push(input);
    return watchlist;
  }),
  watchlistList: t.procedure.query(() => watchlist),
  watchlistRemove: t.procedure.input(z.object({ kind: z.string(), refId: z.string() })).mutation(({ input }) => {
    watchlist = watchlist.filter((w) => !(w.kind === input.kind && w.refId === input.refId));
    return watchlist;
  }),

  // Alerts digest (global threshold + daily cap, US-18). Generates from the ranked
  // stream, dedupes by refId, stores in-memory (Neon persistence lands Phase 9).
  alertsDigest: t.procedure.query(() => {
    const th = settings.globalAlertThreshold;
    const pass = (d: (typeof MOCK_DISCOVERIES)[number]) =>
      th === "strong"
        ? d.signals.some((s) => s.state === "strong")
        : th === "moderate"
          ? d.signals.some((s) => s.state === "strong" || s.state === "emerging")
          : d.signals.some((s) => s.state !== "noise");
    const fresh = rank(MOCK_DISCOVERIES, settings)
      .filter(pass)
      .filter((d) => !alerts.some((a) => a.refId === d.id))
      .slice(0, Math.max(0, settings.maxPerDay - alerts.filter((a) => !a.read).length));
    for (const d of fresh) {
      alerts.unshift({
        id: `${Date.now()}-${d.id}`, refId: d.id,
        title: d.title, body: `${d.why} — evidence: ${d.evidence.length}, counters: ${d.counters.length}.`,
        read: false, at: new Date().toISOString(),
      });
    }
    return fresh.map((d) => alerts.find((a) => a.refId === d.id)!);
  }),
  alertsList: t.procedure.query(() => alerts),
  alertsRead: t.procedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    alerts = alerts.map((a) => (a.id === input.id ? { ...a, read: true } : a));
    return alerts;
  }),

  historyList: t.procedure.query(() => history),
  historyClear: t.procedure.mutation(() => {
    history = [];
    return history;
  }),
});

export type AppRouter = typeof appRouter;
