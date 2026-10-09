// Engine unit tests (Phase 5 rules, pinned): states, counters-always-on,
// low-never-converges, stub ceiling, edge dedupe keeps best confidence.
import { describe, expect, it } from "vitest";
import { assess, connect } from "./engine";
import type { NormalizedItem } from "../workers/types";

const item = (p: Partial<NormalizedItem> & { scope: NormalizedItem["scope"]; title: string }): NormalizedItem => ({
  externalId: `t:${p.title.slice(0, 20)}`,
  url: "https://example.com/t",
  source: "Test",
  fetchedAt: new Date().toISOString(),
  confidence: "medium",
  summary: "test",
  ...p,
});

describe("assess", () => {
  it("strong on 3-type convergence (balanced)", () => {
    const a = assess(
      [item({ scope: "dev", title: "c", confidence: "high" }), item({ scope: "market", title: "m" }), item({ scope: "funding", title: "f", confidence: "high" })],
      "balanced",
    );
    expect(a.state).toBe("strong");
    expect(a.convergingTypes).toHaveLength(3);
  });
  it("sensitivity bites on pairs", () => {
    const pair = [item({ scope: "dev", title: "c", confidence: "high" }), item({ scope: "market", title: "m" })];
    expect(assess(pair, "balanced").state).toBe("strong");
    expect(assess(pair, "conservative").state).toBe("emerging");
  });
  it("low never converges; thin flagged unknown", () => {
    const a = assess([item({ scope: "social", title: "spike", confidence: "low" }), item({ scope: "dev", title: "dev" })], "balanced");
    expect(a.convergingTypes).not.toContain("social");
    expect(a.unknowns.some((u) => /Unverified/i.test(u))).toBe(true);
  });
  it("stub-only caps at uncertain, empty is noise", () => {
    expect(assess([item({ scope: "social", title: "stub", confidence: "low" })], "aggressive").state).toBe("uncertain");
    expect(assess([], "aggressive").state).toBe("noise");
  });
  it("counters always present", () => {
    const a = assess([item({ scope: "dev", title: "c", confidence: "high" }), item({ scope: "market", title: "m", confidence: "high" }), item({ scope: "funding", title: "f", confidence: "high" })], "balanced");
    expect(a.counters.length).toBeGreaterThanOrEqual(1);
  });
});

describe("connect", () => {
  it("dedupes keeping best confidence", () => {
    const edges = connect(
      [
        item({ scope: "dev", title: "r1", confidence: "high", projectHint: { chain: "Base" } }),
        item({ scope: "dev", title: "r2", confidence: "low", projectHint: { chain: "Base" } }),
      ],
      "Helios",
    );
    expect(edges).toHaveLength(1);
    expect(edges[0].confidence).toBe("strong");
  });
});
