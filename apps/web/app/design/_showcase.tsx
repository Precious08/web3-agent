// Shared showcase (mocks + sections). Rendered by /design, /design/dark, /design/light.
import {
  SignalBadge,
  DiscoveryCard,
  CompareTable2Way,
  FactTakeUnknown,
  type Discovery,
} from "@web3-agent/ui";

export const MOCKS: Discovery[] = [
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

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 10 }}>
      <div>
        <h2 style={{ margin: "8px 0 2px", fontSize: 15, color: "var(--text)" }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>{hint}</p>
      </div>
      {children}
    </section>
  );
}

export function Showcase() {
  return (
    <>
      <Section title="Signal badges" hint="4 states only (PRD Sec 22 pruned). Label is body text — dots carry the color.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SignalBadge state="strong" />
          <SignalBadge state="emerging" />
          <SignalBadge state="uncertain" />
          <SignalBadge state="noise" />
        </div>
      </Section>

      <Section title="Discoveries" hint="What happened → why it matters → evidence → counter → next (PRD Sec 16).">
        <div style={{ display: "grid", gap: 12 }}>
          {MOCKS.map((m) => (
            <DiscoveryCard key={m.id} item={m} />
          ))}
        </div>
      </Section>

      <Section title="Fact / Take / Unknown" hint="3-way quality split (PRD Sec 23 pruned).">
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 14, background: "var(--surface)" }}>
          <FactTakeUnknown
            fact="Helios testnet launched 18 days ago (docs + GitHub)."
            take="Early dev + ecosystem convergence is worth investigating."
            unknown="Mainnet date, token, audit status unconfirmed."
          />
        </div>
      </Section>

      <Section title="Compare (2-way)" hint="Projects only in MVP (PRD Sec 21 pruned).">
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 14, background: "var(--surface)" }}>
          <CompareTable2Way
            a={{ Development: "Strong", Ecosystem: "High", Funding: "Seed" }}
            b={{ Development: "Moderate", Ecosystem: "Early", Funding: "Unverified" }}
          />
        </div>
      </Section>
    </>
  );
}
