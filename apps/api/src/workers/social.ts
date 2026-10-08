// social-sync: STUB (ADR-005). Mention counts only, ALWAYS low confidence.
// A paid source (LunarCrush/Kaito) or proper pipeline lands post-MVP via new ADR.
// This stub exists so the pipeline shape is real but honesty is enforced in types.
import { now, type JobResult, type NormalizedItem } from "./types";

export async function socialSync(_opts: { dry?: boolean } = {}): Promise<JobResult> {
  const items: NormalizedItem[] = [
    { scope: "social", externalId: "stub:dreamcanvas-mentions", title: "DreamCanvas mention uptick (stub)", url: "https://example.com/dc-thread", source: "SocialStub", fetchedAt: now(), confidence: "low", summary: "STUB — replace with real pipeline post-MVP. Never scores above Emerging on its own.", projectHint: { name: "DreamCanvas", chain: "Solana" } },
  ];
  return { job: "social-sync", items, dry: true, wrote: 0 };
}
