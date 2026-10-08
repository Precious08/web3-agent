// tRPC client (Phase 7a): browser → same-origin /api/trpc (never CORS);
// server components → UPSTREAM directly (relative URLs don't resolve server-side).
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@web3-agent/api";

const url = typeof window === "undefined" ? process.env.API_URL ?? "http://localhost:4000" : "/api/trpc";

export function api() {
  return createTRPCProxyClient<AppRouter>({ links: [httpBatchLink({ url })] });
}
