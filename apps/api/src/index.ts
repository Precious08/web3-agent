// Phase 3a placeholder. Routes land in 3b (search/ask/discover/entity/compare/watchlist/alerts/history).
// Health check only, so `typecheck` and `dev` have an entrypoint.
export function health() {
  return { ok: true, version: "0.0.0-phase3a" };
}

if (require.main === module) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(health()));
}
