// Worker CLI: pnpm --filter @web3-agent/api exec tsx src/workers/run.ts --job=all --dry
// --dry (default): fixtures / offline-safe, no DB. Omit --dry with DATABASE_URL to persist.
// Scheduling (BullMQ cron) wires in Phase 9; this is the job logic it will call.
import { marketSync } from "./market";
import { devSync } from "./dev";
import { fundingSync } from "./funding";
import { socialSync } from "./social";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);

const main = async () => {
  const job = (args.job as string) ?? "all";
  const dry = args.dry !== "false";
  const run = {
    market: () => marketSync({ dry }),
    dev: () => devSync({ dry }),
    funding: () => fundingSync({ dry }),
    social: () => socialSync({ dry }),
  } as const;
  const jobs = job === "all" ? Object.keys(run) : [job];
  for (const j of jobs) {
    const fn = (run as Record<string, () => Promise<{ job: string; items: unknown[]; dry: boolean; wrote: number }>>)[j];
    if (!fn) throw new Error(`unknown job: ${j} (market|dev|funding|social|all)`);
    const res = await fn();
    // eslint-disable-next-line no-console
    console.log(`${res.job}: ${res.items.length} items, dry=${res.dry}, wrote=${res.wrote}`);
  }
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
