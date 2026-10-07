// /design preview — 3 hardcoded mocks (no backend). Phase 1 exit: badges + cards + compare + fact/take render from these.
import {
  SignalBadge,
  DiscoveryCard,
  CompareTable2Way,
  FactTakeUnknown,
  type Discovery,
} from "@web3-agent/ui";

const MOCKS: Discovery[] = [
  {
    id: "helios-depin",
    title: "Helios DePIN — Base",
    why: "Dev activity + ecosystem participation up 3 weeks while social awareness stays low.",
    signals: "strong",
    signalLabel: "Development + Ecosystem + Funding",
    evidenceStrength: "Strong (3 sources)",
    counter: "Testnet only; no audit yet — traction unproven.",
    next: "Check testnet users → audit status → compare vs peers.",
    reasons: ["matches:Base", "signal:dev+ecosystem", "evidence:3sources"],
  },
  {
    id: "dreamcanvas-ai",
    title: "DreamCanvas AI — Solana",
    why: "Social mentions spiking with new contributors, but funding unverified.",
    signals: "emerging",
    signalLabel: "Social + Development",
    evidenceStrength: "Moderate (2 sources)",
    counter: "Hype exceeds evidence; token unclear; possible farmed activity.",
    next: "Verify team → holder distribution → dev velocity.",
    reasons: ["matches:Solana", "signal:social+dev", "outside-watchlist:adjacent"],
  },
  {
    id: "restaking-narrative",
    title: "Restaking narrative — Ethereum",
    why: "Funding + mainnet activity converging across 4 protocols this month.",
    signals: "emerging",
    signalLabel: "Funding + Development",
    evidenceStrength: "Moderate (4 sources)",
    counter: "Concentrated stake; slashing design unproven at scale.",
    next: "Compare operators → fee capture → slashing risk.",
    reasons: ["matches:Ethereum", "signal:funding+dev", "narrative:restaking"],
  },
];

export default function DesignPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Design preview — mocked, no backend</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <SignalBadge state="strong" />
        <SignalBadge state="emerging" />
        <SignalBadge state="uncertain" />
        <SignalBadge state="noise" />
      </div>
      {MOCKS.map((m) => (
        <DiscoveryCard key={m.id} item={m} />
      ))}
      <FactTakeUnknown
        fact="Helios testnet launched 18 days ago (docs + GitHub)."
        take="Early dev + ecosystem convergence is worth investigating."
        unknown="Mainnet date, token, audit status unconfirmed."
      />
      <CompareTable2Way
        a={{ Development: "Strong", Ecosystem: "High", Funding: "Seed" }}
        b={{ Development: "Moderate", Ecosystem: "Early", Funding: "Unverified" }}
      />
    </main>
  );
}
