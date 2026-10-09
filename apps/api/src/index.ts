// Entrypoint: serves the tRPC router standalone on :4000 (dev only).
// Next.js integration (tRPC client + Auth.js session) lands with Phase 6.
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router";

export { appRouter, type AppRouter } from "./router";
export function health() {
  return { ok: true, version: "0.0.0-phase3b" };
}

if (require.main === module) {
  const port = Number(process.env.PORT ?? 4000);
  const { listen } = createHTTPServer({
    router: appRouter,
    createContext: ({ req }) =>
      ({ ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "local" }),
  });
  const server = listen(port);
  // eslint-disable-next-line no-console
  console.log(`api listening on :${port}`);
  void server;
}
