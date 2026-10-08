// Worker shared types (Phase 4). Every item carries provenance + confidence.
// Thin sources MUST be confidence: "low" and surfaced as Unknown downstream (ADR-005).
export type Confidence = "high" | "medium" | "low";

export type NormalizedItem = {
  scope: "market" | "dev" | "funding" | "social";
  externalId: string;
  title: string;
  url: string;
  source: string;
  author?: string;
  fetchedAt: string;
  confidence: Confidence;
  summary: string;
  projectHint?: { name?: string; symbol?: string; chain?: string };
};

export type JobResult = {
  job: string;
  items: NormalizedItem[];
  dry: boolean;
  wrote: number;
};

const now = () => new Date().toISOString();

/** Minimal DB surface workers need — PrismaClient satisfies this live; smoke passes a fake. */
export type Writer = {
  project: {
    upsert: (args: unknown) => Promise<{ id: string }>;
  };
  evidence: {
    upsert: (args: unknown) => Promise<unknown>;
  };
};

export async function persistMarketDev(
  db: Writer | undefined,
  items: NormalizedItem[],
  dry: boolean,
): Promise<number> {
  if (dry || !db) return 0;
  let wrote = 0;
  for (const it of items) {
    const pid = `${it.scope}:${it.externalId}`.slice(0, 60);
    await db.project.upsert({
      where: { id: pid },
      update: { summary: it.summary, fetchedAt: new Date(it.fetchedAt) },
      create: { id: pid, name: it.projectHint?.name ?? it.title, symbol: it.projectHint?.symbol, chain: it.projectHint?.chain, summary: it.summary },
    });
    await db.evidence.upsert({
      where: { id: `ev:${pid}`.slice(0, 60) },
      update: {},
      create: { id: `ev:${pid}`.slice(0, 60), title: it.title, url: it.url, source: it.source },
    });
    wrote += 2;
  }
  return wrote;
}

export { now };
