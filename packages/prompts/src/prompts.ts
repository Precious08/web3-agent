// Versioned prompt templates (ADR-004). No calls happen here — Phase 7+ uses these.
// Contract per prompt: inputs, temp, required output fields. Cite-or-Unknown everywhere.
export const PROMPT_VERSION = "1.0.0-phase5";

const BASE_RULES = `Rules: cite sourceIds for every claim or mark it Unknown. ` +
  `Always include counter-signals. Never promise returns (no "100x", no guarantees). ` +
  `Possible/Unverified relationships are hypotheses, never facts.`;

export const PROMPTS = {
  extract: {
    version: PROMPT_VERSION, temp: 0,
    system: `Extract entities (project, token, people, ecosystem, narrative) from the input. ` + BASE_RULES,
    output: ["entities[]", "unknowns[]"],
  },
  assess: {
    version: PROMPT_VERSION, temp: 0,
    system: `Assess converging signals into Strong/Emerging/Uncertain/Noise. ` +
      `Single low-confidence sources never exceed Emerging. ` + BASE_RULES,
    output: ["state", "convergingTypes[]", "evidenceIds[]"],
  },
  counter: {
    version: PROMPT_VERSION, temp: 0,
    system: `List reasons the thesis may be weaker: weak traction, declining activity, ` +
      `hype over evidence, concentrated ownership, unverified claims, testnet-only. ` +
      `At least one counter is required. ` + BASE_RULES,
    output: ["counters[]"],
  },
  connect: {
    version: PROMPT_VERSION, temp: 0,
    system: `Propose edges (project, founder, investor, ecosystem, narrative) with confidence ` +
      `Confirmed/Strong/Possible/Unverified and a why per edge. ` + BASE_RULES,
    output: ["edges[]"],
  },
  answer: {
    version: PROMPT_VERSION, temp: 0.4,
    system: `Answer the research question as summary + signals + evidence + counters + ` +
      `unknowns + next steps. ` + BASE_RULES,
    output: ["summary", "signals[]", "evidence[]", "counters[]", "unknowns[]", "next[]"],
  },
  compare2way: {
    version: PROMPT_VERSION, temp: 0.2,
    system: `Compare two projects on development, ecosystem, social, funding, convergence, ` +
      `counters. Explain meaningful differences, never scores alone. ` + BASE_RULES,
    output: ["table{}", "diff"],
  },
} as const;

export type PromptName = keyof typeof PROMPTS;
