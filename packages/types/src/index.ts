// Shared DTOs — single source for web + api (ADR-001). MVP Basic only (PRD Sec 44-46 pruned, Sec 48 out-of-scope).

export type ProjectStage = "idea" | "prelaunch" | "testnet" | "mainnet-beta" | "live" | "established";
export type TokenStatus = "none" | "points" | "tge-upcoming" | "liquid" | "none-planned";
export type UserRole = "airdrop" | "investor" | "developer" | "researcher" | "creator";
export type Sensitivity = "conservative" | "balanced" | "aggressive";
export type AlertThreshold = "strong" | "moderate" | "any";
export type SignalState = "strong" | "emerging" | "uncertain" | "noise";
export type EdgeConfidence = "confirmed" | "strong" | "possible" | "unverified";

/** MVP Basic UserSettings (PRD 44.1 basic + follow/mute + surprise + sensitivity + alert cap + history). */
export type UserSettings = {
  stages: ProjectStage[];
  sectors: string[];
  chains: string[];
  tokenStatus: TokenStatus[];
  role: UserRole;
  followedNarratives: string[];
  mutedNarratives: string[];
  blocked: string[];
  surpriseMe: number; // 0-100, default 25
  sensitivity: Sensitivity;
  globalAlertThreshold: AlertThreshold;
  maxPerDay: number;
  saveHistory: boolean;
};

export const DEFAULT_SETTINGS: UserSettings = {
  stages: [],
  sectors: [],
  chains: [],
  tokenStatus: [],
  role: "researcher",
  followedNarratives: [],
  mutedNarratives: [],
  blocked: [],
  surpriseMe: 25,
  sensitivity: "balanced",
  globalAlertThreshold: "moderate",
  maxPerDay: 10,
  saveHistory: true,
};

export type EvidenceRef = { id: string; title: string; url: string; source: string };
export type Signal = {
  id: string;
  type: "dev" | "ecosystem" | "funding" | "social" | "market" | "onchain-lite";
  state: SignalState;
  magnitude: string;
  evidenceIds: string[];
};
export type Discovery = {
  id: string;
  kind: "project" | "token" | "narrative" | "ecosystem" | "person";
  title: string;
  why: string;
  signals: Signal[];
  evidence: EvidenceRef[];
  counters: string[];
  unknowns: string[];
  next: string[];
  whyCodes: string[]; // reasonCodes for WhyThisSheet (PRD 46.5)
};
