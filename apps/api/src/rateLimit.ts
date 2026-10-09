// In-process token bucket (single instance; Redis sliding window lands with Phase 9
// horizontal scaling — documented in the threat model, not hidden).
const buckets = new Map<string, number[]>();

export function checkLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
