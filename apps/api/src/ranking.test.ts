// Ranking unit tests (ADR-006): filters bite, thresholds hold, surprise injects.
import { describe, expect, it } from "vitest";
import { rank, score } from "./ranking";
import { MOCK_DISCOVERIES } from "./mock";
import { DEFAULT_SETTINGS } from "@web3-agent/types";

describe("score", () => {
  it("rewards convergence over single-type", () => {
    expect(score(MOCK_DISCOVERIES[0])).toBeGreaterThan(score(MOCK_DISCOVERIES[3]));
  });
  it("caps evidence contribution", () => {
    const padded = { ...MOCK_DISCOVERIES[0], evidence: Array.from({ length: 50 }, (_, i) => ({ id: `x${i}`, title: "t", url: "https://example.com", source: "s" })) };
    const slim = { ...padded, evidence: padded.evidence.slice(0, 5) };
    expect(score(padded) - score(slim)).toBe(0);
  });
});

describe("rank", () => {
  it("puts convergent strong first", () => {
    expect(rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS })[0].id).toBe("helios-depin");
  });
  it("blocked terms never surface", () => {
    const out = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, blocked: ["solana", "ethereum"] });
    expect(out.every((d) => !`${d.title} ${d.why}`.toLowerCase().includes("solana"))).toBe(true);
  });
  it("conservative is strong-only, aggressive widens", () => {
    const cons = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, sensitivity: "conservative" });
    const aggr = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, sensitivity: "aggressive" });
    expect(cons.length).toBeGreaterThanOrEqual(1);
    expect(cons.every((d) => d.signals.some((s) => s.state === "strong"))).toBe(true);
    expect(aggr.length).toBeGreaterThan(cons.length);
  });
  it("surprise 0 removes adjacent, default injects", () => {
    const base = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS });
    const none = rank(MOCK_DISCOVERIES, { ...DEFAULT_SETTINGS, surpriseMe: 0 });
    expect(base.some((d) => d.id === "dreamcanvas-ai")).toBe(true);
    expect(none.some((d) => d.id === "dreamcanvas-ai")).toBe(false);
  });
});
