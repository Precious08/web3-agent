// Phase 1 stubs — props match PRD, no logic yet. Full a11y + shadcn wiring is next iteration with you.
import type { SignalState, EdgeConfidence, FactTake } from "../theme";

export type SignalBadgeProps = { state: SignalState; label?: string };
export function SignalBadge({ state, label }: SignalBadgeProps) {
  return `<span data-signal="${state}">${label ?? state}</span>` as unknown as JSX.Element;
}

export type EvidenceRef = { id: string; title: string; url: string; source: string };
export type EvidenceInlineProps = { claim: string; evidence: EvidenceRef[] };
export function EvidenceInline(_props: EvidenceInlineProps) {
  return null as unknown as JSX.Element; // claim ↔ sources (PRD 13.4)
}

export type FactTakeUnknownProps = { fact: string; take: string; unknown: string; active?: FactTake };
export function FactTakeUnknown(_props: FactTakeUnknownProps) {
  return null as unknown as JSX.Element; // PRD Sec 23 pruned 3-way
}

export type ConnectionEdgeProps = {
  from: string;
  to: string;
  relation: string;
  confidence: EdgeConfidence;
  why: string;
};
export function ConnectionEdge(_props: ConnectionEdgeProps) {
  return null as unknown as JSX.Element; // PRD Sec 20
}

export function CounterCallout({ points }: { points: string[] }) {
  return null as unknown as JSX.Element; // always-on counters, US-10
}

export function WhyThisSheet({ reasons, tuneHref }: { reasons: string[]; tuneHref: string }) {
  return null as unknown as JSX.Element; // "Why am I seeing this? → Tune" (40.7)
}

export type Discovery = {
  id: string;
  title: string;
  why: string;
  signals: SignalState;
  evidenceStrength: string;
  counter: string;
  next: string;
};
export function DiscoveryCard({ item }: { item: Discovery }) {
  return null as unknown as JSX.Element; // PRD Sec 16 example
}

export function CompareTable2Way({ a, b }: { a: Record<string, string>; b: Record<string, string> }) {
  return null as unknown as JSX.Element; // projects only, 2-way (Sec 21 pruned)
}

export function ResearchSkeleton() {
  return null as unknown as JSX.Element;
}
export function EmptyState({ hint }: { hint: string }) {
  return null as unknown as JSX.Element;
}
