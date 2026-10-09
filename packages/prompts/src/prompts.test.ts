// Prompt-contract evals (static, $0): every template carries version + temp,
// cite-or-Unknown discipline, mandatory counters, and zero hype language.
// Live-model evals (faithfulness on real outputs) need the $10 top-up — Phase 9.
import { describe, expect, it } from "vitest";
import { PROMPTS, PROMPT_VERSION, type PromptName } from "./prompts";

const BANNED = ["100x", "1000x", "guaranteed", "can't lose", "moon", "to the moon"];

describe("prompt contracts", () => {
  const names = Object.keys(PROMPTS) as PromptName[];
  it("covers extract/assess/counter/connect/answer/compare2way", () => {
    expect(names.sort()).toEqual(["answer", "assess", "compare2way", "connect", "counter", "extract"]);
  });
  it("all pinned to current version with sane temps", () => {
    for (const n of names) {
      expect(PROMPTS[n].version).toBe(PROMPT_VERSION);
      expect(PROMPTS[n].temp).toBeLessThanOrEqual(0.4);
    }
  });
  it("cite-or-Unknown + counters required everywhere", () => {
    for (const n of names) {
      expect(PROMPTS[n].system).toMatch(/Unknown/);
      expect(PROMPTS[n].system).toMatch(/counter/i);
    }
  });
  it("zero hype language outside quoted prohibitions", () => {
    for (const n of names) {
      // Quoted spans are prohibitions ("no ..."), not usage — strip before checking.
      const body = PROMPTS[n].system.replace(/"[^"]*"/g, "").toLowerCase();
      for (const b of BANNED) {
        expect(body).not.toContain(b);
      }
    }
  });
});
