// Same-origin API proxy (Phase 7a). Browser → /api/trpc/* (no CORS ever);
// server → UPSTREAM directly. UPSTREAM unreachable ⇒ honest 502, callers fall back.
import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.API_URL ?? "http://127.0.0.1:4000";

async function proxy(req: NextRequest, path: string[]) {
  const url = `${UPSTREAM}/${path.join("/")}${req.nextUrl.search}`;
  const init: RequestInit = {
    method: req.method,
    headers: { "content-type": req.headers.get("content-type") ?? "application/json" },
  };
  if (req.method !== "GET" && req.method !== "HEAD") init.body = await req.text();
  const upstream = await fetch(url, init).catch(() => null);
  if (!upstream) return NextResponse.json({ error: "API offline" }, { status: 502 });
  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(req: NextRequest, { params }: { params: { trpc: string[] } }) {
  return proxy(req, params.trpc);
}
export async function POST(req: NextRequest, { params }: { params: { trpc: string[] } }) {
  return proxy(req, params.trpc);
}
