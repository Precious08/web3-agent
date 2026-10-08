// market-sync: DexScreener (free, no key) + CoinGecko free (10-30/min).
// Live mode hits network; dry mode returns fixtures. Confidence: medium (aggregated APIs).
import { now, type JobResult, type NormalizedItem, type Writer } from "./types";
import { persistMarketDev } from "./types";

const DRY: NormalizedItem[] = [
  { scope: "market", externalId: "dex:helios-base", title: "HELIOS liquidity +38% on Base DEX", url: "https://dexscreener.com/base/helios", source: "DexScreener", fetchedAt: now(), confidence: "medium", summary: "Liquidity and volume up on Base pair; corroborate before scoring.", projectHint: { name: "Helios", chain: "Base" } },
  { scope: "market", externalId: "cg:dreamcanvas", title: "DreamCanvas listed on second CEX", url: "https://coingecko.com/dreamcanvas", source: "CoinGecko", fetchedAt: now(), confidence: "medium", summary: "New listing expands access; watch for listing-spike fade.", projectHint: { name: "DreamCanvas", chain: "Solana" } },
];

async function live(): Promise<NormalizedItem[]> {
  const out: NormalizedItem[] = [];
  // DexScreener: token profiles latest (free, no key). Keep tiny: search our demo names.
  try {
    const r = await fetch("https://api.dexscreener.com/token-profiles/latest/v1");
    if (r.ok) {
      const arr = (await r.json()) as { url?: string; tokenAddress?: string; description?: string }[];
      for (const t of arr.slice(0, 5)) {
        out.push({ scope: "market", externalId: `dex:${t.tokenAddress ?? "unknown"}`, title: (t.description ?? "DEX profile").slice(0, 120), url: t.url ?? "https://dexscreener.com", source: "DexScreener", fetchedAt: now(), confidence: "low", summary: "Untriaged DEX profile — low confidence until matched to a known project." });
      }
    }
  } catch { /* offline -> caller falls back to dry */ }
  // CoinGecko free: markets page (rate-limited; failures are fine in MVP).
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=5&page=1", { headers: { "User-Agent": "web3-agent-mvp" } });
    if (r.ok) {
      const arr = (await r.json()) as { id: string; symbol: string; name: string; price_change_percentage_24h?: number }[];
      for (const c of arr) {
        out.push({ scope: "market", externalId: `cg:${c.id}`, title: `${c.name} 24h ${(c.price_change_percentage_24h ?? 0).toFixed(1)}%`, url: `https://coingecko.com/en/coins/${c.id}`, source: "CoinGecko", fetchedAt: now(), confidence: "medium", summary: `24h move for ${c.symbol.toUpperCase()}; context needed before it means anything.`, projectHint: { name: c.name, symbol: c.symbol } });
      }
    }
  } catch { /* offline -> dry */ }
  return out.length > 0 ? out : DRY;
}

export async function marketSync(opts: { dry?: boolean; db?: Writer } = {}): Promise<JobResult> {
  const items = opts.dry ? DRY : await live();
  const wrote = await persistMarketDev(opts.db, items, !!opts.dry || !opts.db);
  return { job: "market-sync", items, dry: !!opts.dry || items === DRY, wrote };
}
