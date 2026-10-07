// Phase 1 theme tokens — mirrors tokens.css. Single source for Tailwind/Radix mapping.
export const theme = {
  defaultTheme: "dark" as const,
  fonts: { sans: "Inter, system-ui, sans-serif", display: "Space Grotesk, Inter, sans-serif" },
  radius: { sm: 10, lg: 14 },
  spacingBase: 4,
  density: "comfortable" as const, // MVP fixed; compact later (Sec 48D)
  signals: {
    strong: "var(--signal-strong)",
    emerging: "var(--signal-emerging)",
    uncertain: "var(--signal-uncertain)",
    noise: "var(--signal-noise)",
  },
  edges: {
    confirmed: "var(--edge-confirmed)",
    strong: "var(--edge-strong)",
    possible: "var(--edge-possible)",
    unverified: "var(--edge-unverified)",
  },
} as const;

export type SignalState = keyof typeof theme.signals; // strong|emerging|uncertain|noise (PRD Sec 22 pruned)
export type EdgeConfidence = keyof typeof theme.edges;
export type FactTake = "fact" | "take" | "unknown"; // PRD Sec 23 pruned
