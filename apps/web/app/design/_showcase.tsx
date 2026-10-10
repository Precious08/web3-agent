// Component gallery: every UI atom in one calm place. Sections 01–09 with usage notes.
// MOCKS stay the shared demo data; Eyebrow kept for compat.
import {
  SignalBadge,
  EvidenceInline,
  FactTakeUnknown,
  ConnectionEdge,
  CounterCallout,
  WhyThisSheet,
  DiscoveryCard,
  CompareTable2Way,
  ResearchSkeleton,
  EmptyState,
  type Discovery,
} from "@web3-agent/ui";
import { Eyebrow as ChromeEyebrow, KindTag, Stat, SignalBar, RankNum, StatusPill } from "../../components/chrome";

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
  return <ChromeEyebrow>{children}</ChromeEyebrow>;
}

function Section({ n, name, use, children }: { n: string; name: string; use: string; children: React.ReactNode }) {
  return (
    <section id={`s${n}`} style={{ display: "grid", gap: 12, padding: "8px 0 24px", borderBottom: "1px solid var(--border-soft)", scrollMarginTop: 80 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-faint)" }}>{n}</span>
        <div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17 }}>{name}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{use}</p>
        </div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </section>
  );
}

const INDEX: [string, string][] = [
  ["01", "Signal badges"],
  ["02", "Strength bars"],
  ["03", "Tags, ranks, stats"],
  ["04", "Discovery cards"],
  ["05", "Fact / Take / Unknown"],
  ["06", "Compare table"],
  ["07", "Callouts"],
  ["08", "Controls"],
  ["09", "States"],
];

export function GalleryIndex() {
  return (
    <nav aria-label="Gallery" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {INDEX.map(([n, name]) => (
        <a key={n} href={`#s${n}`} style={{ fontSize: 12.5, color: "var(--text-muted)", border: "1px solid var(--border-soft)", borderRadius: 999, padding: "5px 12px", textDecoration: "none", background: "var(--surface)" }}>
          <span className="tabular" style={{ color: "var(--text-faint)" }}>{n} </span>{name}
        </a>
      ))}
    </nav>
  );
}

export function Gallery() {
  return (
    <>
      <Section n="01" name="Signal badges" use="Four states only. Color lives on dots and hairlines — copy never depends on hue.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SignalBadge state="strong" />
          <SignalBadge state="emerging" />
          <SignalBadge state="uncertain" />
          <SignalBadge state="noise" />
          <SignalBadge state="strong" label="Custom label" />
        </div>
      </Section>

      <Section n="02" name="Strength bars" use="Convergence rendered as width. Boards and dossiers share this scale.">
        <div style={{ display: "grid", gap: 8 }}>
          {(["strong", "emerging", "uncertain", "noise"] as const).map((s) => (
            <SignalBar key={s} state={s} width={160} />
          ))}
        </div>
      </Section>

      <Section n="03" name="Tags, ranks, stats" use="Kind tags classify, ranks order, stats quantify — always with labels.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <KindTag kind="project" />
          <KindTag kind="narrative" />
          <KindTag kind="ecosystem" />
          <RankNum i={0} />
          <RankNum i={9} />
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <Stat label="Converging" value="3" />
          <Stat label="Sources" value="12" />
          <Stat label="Counters" value="4" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <StatusPill live />
          <StatusPill live={false} />
        </div>
      </Section>

      <Section n="04" name="Discovery cards" use="What happened → why it matters → evidence weight → counter → next. Never clickable as a whole — links stay explicit.">
        <div style={{ display: "grid", gap: 14 }}>
          {MOCKS.map((m) => (
            <DiscoveryCard key={m.id} item={m} />
          ))}
        </div>
      </Section>

      <Section n="05" name="Fact / Take / Unknown" use="The quality split. Speculation can never wear fact's clothes.">
        <FactTakeUnknown
          fact="Helios testnet launched 18 days ago (docs + GitHub)."
          take="Early dev + ecosystem convergence is worth investigating."
          unknown="Mainnet date, token, audit status unconfirmed."
        />
      </Section>

      <Section n="06" name="Compare table" use="Two projects, meaningful differences — never scores alone.">
        <CompareTable2Way
          a={{ Development: "Strong", Ecosystem: "High", Funding: "Seed" }}
          b={{ Development: "Moderate", Ecosystem: "Early", Funding: "Unverified" }}
        />
      </Section>

      <Section n="07" name="Callouts" use="Counters are required furniture; WhyThis links every surface to its settings.">
        <CounterCallout points={["Testnet only; no audit yet.", "Hype exceeds evidence on social."]} />
        <WhyThisSheet reasons={["matches:Base", "signal:dev+ecosystem"]} tuneHref="/settings#relevant" />
        <ConnectionEdge from="Helios" to="Base" relation="builds-on" confidence="possible" why="Suggested automatically — treat as unverified." />
      </Section>

      <Section n="08" name="Controls" use="One primary action per surface. Destructive and secondary stay quiet.">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{ background: "linear-gradient(92deg, var(--accent), var(--accent-2))", color: "#06121f", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer" }}>Primary</button>
          <button style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 18px", cursor: "pointer" }}>Quiet</button>
        </div>
        <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
          <input placeholder="Text input" aria-label="Text input specimen"
            style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "10px 14px", fontSize: 14 }} />
          <input type="range" min={0} max={100} defaultValue={25} aria-label="Range specimen" style={{ width: "100%", accentColor: "var(--accent)" }} />
        </div>
        <EvidenceInline
          claim="Evidence stays attached to its claim."
          evidence={[{ id: "g1", title: "Specimen source", url: "https://example.com", source: "Gallery" }]}
        />
      </Section>

      <Section n="09" name="States" use="Loading, empty and honest-offline — every surface handles all three.">
        <ResearchSkeleton />
        <EmptyState hint="Try widening filters or check back after refresh." />
      </Section>
    </>
  );
}

export function Showcase() {
  return <Gallery />;
}
