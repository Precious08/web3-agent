// Seed: 20 demo projects + evidence + signals + a few edges.
// Run: DATABASE_URL=... pnpm --filter @web3-agent/api db:push && db:seed
// (needs Postgres: `docker compose -f infra/docker-compose.yml up db` or Neon).
import { PrismaClient } from "@prisma/client";
import { MOCK_DISCOVERIES } from "../src/mock";

const prisma = new PrismaClient();

async function main() {
  for (const d of MOCK_DISCOVERIES.filter((m) => m.kind === "project")) {
    const project = await prisma.project.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        name: d.title,
        stage: "testnet",
        summary: d.why,
      },
    });
    for (const e of d.evidence) {
      await prisma.evidence.upsert({
        where: { id: e.id },
        update: {},
        create: { id: e.id, title: e.title, url: e.url, source: e.source },
      });
    }
    for (const s of d.signals) {
      await prisma.signal.create({
        data: {
          id: `${d.id}-${s.id}`,
          projectId: project.id,
          type: s.type,
          state: s.state,
          magnitude: s.magnitude,
        },
      });
    }
  }
  await prisma.edge.createMany({
    data: [
      { fromKind: "project", fromId: "helios-depin", toKind: "ecosystem", toId: "base", relation: "builds-on", confidence: "confirmed", why: "seed: docs" },
      { fromKind: "project", fromId: "dreamcanvas-ai", toKind: "ecosystem", toId: "solana", relation: "builds-on", confidence: "strong", why: "seed: repo" },
      { fromKind: "project", fromId: "helios-depin", toKind: "narrative", toId: "restaking-narrative", relation: "adjacent-to", confidence: "possible", why: "seed: demo" },
    ],
    skipDuplicates: true,
  });
  // eslint-disable-next-line no-console
  console.log(`seeded ${MOCK_DISCOVERIES.length} discoveries`);
}

main().finally(() => void prisma.$disconnect());
