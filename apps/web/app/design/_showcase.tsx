// Shared dark showcase (mocks + sections). Single home: /design.
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

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 11.5,
        letterSpacing: 1.6,
        textTransform: "uppercase",
        color: "var(--text-faint)",
      }}
    >
      {children}
    </p>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div>
        <Eyebrow>{title}</Eyebrow>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{hint}</p>
      </div>
      {children}
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)",
        boxShadow: "var(--card-shadow)",
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

export function Showcase() {
  return (
    <>
      <Section title="Signal language" hint="Four states. Dots and hairlines carry the color — copy never depends on hue.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SignalBadge state="strong" />
          <SignalBadge state="emerging" />
          <SignalBadge state="uncertain" />
          <SignalBadge state="noise" />
        </div>
      </Section>

      <Section title="Discoveries" hint="What happened → why it matters → evidence → counter → next.">
        <div style={{ display: "grid", gap: 14 }}>
          {MOCKS.map((m) => (
            <DiscoveryCard key={m.id} item={m} />
          ))}
        </div>
      </Section>

      <Section title="Research quality" hint="Fact, take and unknown stay visually separated.">
        <Panel>
          <FactTakeUnknown
            fact="Helios testnet launched 18 days ago (docs + GitHub)."
            take="Early dev + ecosystem convergence is worth investigating."
            unknown="Mainnet date, token, audit status unconfirmed."
          />
        </Panel>
      </Section>

      <Section title="Compare" hint="Two projects, meaningful differences — never scores alone.">
        <Panel>
          <CompareTable2Way
            a={{ Development: "Strong", Ecosystem: "High", Funding: "Seed" }}
            b={{ Development: "Moderate", Ecosystem: "Early", Funding: "Unverified" }}
          />
        </Panel>
      </Section>
    </>
  );
}
