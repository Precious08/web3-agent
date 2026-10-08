// tRPC proxy client for server components (Phase 6a).
// Talks to apps/api standalone on NEXT_PUBLIC_API_URL (default :4000).
// Callers MUST catch and fall back to ./fallback (API may be down; build has no API).
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@web3-agent/api";

export function api() {
  return createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({ url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}` })],
  });
}
