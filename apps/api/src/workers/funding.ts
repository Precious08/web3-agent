// funding-sync: RSS (free) + manual curation table (seeded, honest).
// RSS items are medium confidence; curated rows are high (human-verified).
import { XMLParser } from "fast-xml-parser";
import { now, type JobResult, type NormalizedItem } from "./types";

const FEEDS = [
  "https://blog.ethereum.org/feed",
  "https://solana.com/rss.xml",
];

const CURATED: NormalizedItem[] = [
  { scope: "funding", externalId: "cur:helios-seed", title: "Helios announces seed round", url: "https://example.com/helios-seed", source: "Curated", author: "team", fetchedAt: now(), confidence: "high", summary: "Human-verified seed announcement for demo.", projectHint: { name: "Helios", chain: "Base" } },
];

const parser = new XMLParser({ ignoreAttributes: false });

async function live(): Promise<NormalizedItem[]> {
  const out: NormalizedItem[] = [...CURATED];
  for (const feed of FEEDS) {
    try {
      const r = await fetch(feed, { headers: { "User-Agent": "web3-agent-mvp" } });
      if (!r.ok) continue;
      const xml = await r.text();
      const doc = parser.parse(xml) as { rss?: { channel?: { item?: { title?: string; link?: string } | { title?: string; link?: string }[] } } };
      const items = doc.rss?.channel?.item;
      const arr = Array.isArray(items) ? items : items ? [items] : [];
      for (const it of arr.slice(0, 5)) {
        if (!it.title) continue;
        out.push({ scope: "funding", externalId: `rss:${feed}:${it.title.slice(0, 40)}`, title: it.title.slice(0, 140), url: typeof it.link === "string" ? it.link : feed, source: "RSS", fetchedAt: now(), confidence: "medium", summary: "Funding/launches feed hit — needs human or Phase-5 check before scoring." });
      }
    } catch { /* offline -> curated only */ }
  }
  return out;
}

export async function fundingSync(opts: { dry?: boolean } = {}): Promise<JobResult> {
  const items = opts.dry ? [...CURATED] : await live();
  return { job: "funding-sync", items, dry: !!opts.dry, wrote: 0 };
}
