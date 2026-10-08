// dev-sync: GitHub API free (5k/hr unauthenticated bucket shared; token if present).
// Tracks releases + contributor velocity for known demo repos. Confidence: high (primary source).
import { now, type JobResult, type NormalizedItem, type Writer } from "./types";
import { persistMarketDev } from "./types";

const REPOS = ["ethereum/go-ethereum", "solana-labs/solana"];
const DRY: NormalizedItem[] = REPOS.map((repo) => ({
  scope: "dev" as const,
  externalId: `gh:${repo}:release`,
  title: `${repo} — latest release tracked`,
  url: `https://github.com/${repo}/releases`,
  source: "GitHub",
  fetchedAt: now(),
  confidence: "high" as const,
  summary: "Release cadence signal; velocity computed in Phase 5.",
  projectHint: { name: repo.split("/")[1] },
}));

async function live(token?: string): Promise<NormalizedItem[]> {
  const out: NormalizedItem[] = [];
  for (const repo of REPOS) {
    try {
      const r = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=3`, {
        headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!r.ok) continue;
      const arr = (await r.json()) as { tag_name: string; html_url: string; published_at: string; name?: string }[];
      for (const rel of arr) {
        out.push({ scope: "dev", externalId: `gh:${repo}:${rel.tag_name}`, title: `${repo} ${rel.tag_name}`, url: rel.html_url, source: "GitHub", fetchedAt: now(), confidence: "high", summary: `Released ${(rel.name ?? "").slice(0, 100)} on ${rel.published_at}.`, projectHint: { name: repo.split("/")[1] } });
      }
    } catch { /* offline -> dry fallback below */ }
  }
  return out.length > 0 ? out : DRY;
}

export async function devSync(opts: { dry?: boolean; db?: Writer } = {}): Promise<JobResult> {
  const items = opts.dry ? DRY : await live(process.env.GITHUB_TOKEN);
  const wrote = await persistMarketDev(opts.db, items, !!opts.dry || !opts.db);
  return { job: "dev-sync", items, dry: !!opts.dry || items === DRY, wrote };
}
