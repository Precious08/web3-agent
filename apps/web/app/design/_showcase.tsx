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
    <section id={`s${n}`} style={{ display: "grid", gap: 14, padding: "8px 0 28px", borderBottom: "1px solid var(--border-soft)", scrollMarginTop: 80 }}>
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

/** Specimen row: name + live specimens + one-line rule. The gallery's signature layout. */
function Spec({ name, rule, children }: { name: string; rule: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px minmax(0,1fr)", gap: 14, padding: "12px 0", borderTop: "1px solid var(--border-soft)" }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 650 }}>{name}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>{rule}</p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{children}</div>
    </div>
  );
}

const INDEX: [string, string][] = [
  ["01", "Signal badges"],
  ["02", "Strength bars"],
  ["03", "Data primitives"],
  ["04", "Discovery cards"],
  ["05", "Fact / Take / Unknown"],
  ["06", "Compare table"],
  ["07", "Trust furniture"],
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

const ANATOMY = ["Header + badge", "Why it matters", "Evidence weight", "Counter-thesis", "Next step"];

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

      <Section n="03" name="Data primitives" use="The smallest honest units. Each has one job — named, ruled, done.">
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: "4px 18px 14px" }}>
          <Spec name="Kind tag" rule="Classifies entity type. Never decorative.">
            <KindTag kind="project" />
            <KindTag kind="narrative" />
            <KindTag kind="ecosystem" />
          </Spec>
          <Spec name="Rank" rule="Orders boards. Top three lit, rest quiet.">
            <RankNum i={0} />
            <RankNum i={2} />
            <RankNum i={9} />
          </Spec>
          <Spec name="Stat" rule="Quantifies — always beside its label, never alone.">
            <Stat label="Converging" value="3" />
            <Stat label="Sources" value="12" />
          </Spec>
        </div>
      </Section>

      <Section n="04" name="Discovery cards" use="Five slots, always in this order. The card never links as a whole — actions stay explicit.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ANATOMY.map((slot, i) => (
            <span key={slot} style={{ fontSize: 12, color: "var(--text-muted)", border: "1px solid var(--border-soft)", borderRadius: 999, padding: "4px 12px", background: "var(--surface)" }}>
              <span className="tabular" style={{ color: "var(--accent-2)" }}>{i + 1} · </span>{slot}
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {MOCKS.map((m) => (
            <DiscoveryCard key={m.id} item={m} />
          ))}
        </div>
      </Section>

      <Section n="05" name="Fact / Take / Unknown" use="The quality split, shown in every state. Speculation can never wear fact's clothes.">
        <div style={{ display: "grid", gap: 12 }}>
          {(
            [
              ["Fact active", "fact"],
              ["Take active", "take"],
              ["Unknown active", "unknown"],
            ] as const
          ).map(([label, active]) => (
            <div key={label} style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: 16, display: "grid", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--text-faint)" }}>{label}</p>
              <FactTakeUnknown
                active={active}
                fact="Helios testnet launched 18 days ago (docs + GitHub)."
                take="Early dev + ecosystem convergence is worth investigating."
                unknown="Mainnet date, token, audit status unconfirmed."
              />
            </div>
          ))}
        </div>
      </Section>

      <Section n="06" name="Compare table" use="Two projects, one verdict up top. Differences explained — never scores alone.">
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: 16, display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            <strong>Verdict:</strong> Helios leads on shipped development and funding; DreamCanvas is earlier with thinner evidence.
          </p>
          <CompareTable2Way
            a={{ Development: "Strong", Ecosystem: "High", Funding: "Seed" }}
            b={{ Development: "Moderate", Ecosystem: "Early", Funding: "Unverified" }}
          />
        </div>
      </Section>

      <Section n="07" name="Trust furniture" use="Shown assembled as used: claim, counter, connection, provenance — the dossier's conscience.">
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: 16, display: "grid", gap: 14 }}>
          <EvidenceInline
            claim="Dev activity and ecosystem participation have increased while social awareness stays low."
            evidence={[{ id: "g1", title: "Helios repo pulse", url: "https://example.com/helios-repo", source: "GitHub" }]}
          />
          <CounterCallout points={["Testnet only; no audit yet.", "Hype exceeds evidence on social."]} />
          <ConnectionEdge from="Helios" to="Base" relation="builds-on" confidence="possible" why="Suggested automatically — treat as unverified." />
          <WhyThisSheet reasons={["matches:Base", "signal:dev+ecosystem"]} tuneHref="/settings#relevant" />
        </div>
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
      </Section>

      <Section n="09" name="States" use="Loading, empty, offline — every surface handles all three, honestly labeled.">
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
          <ResearchSkeleton />
        </div>
        <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
          <EmptyState hint="No discoveries match these filters." action={{ label: "Clear filters", href: "/discover" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <StatusPill live />
          <StatusPill live={false} />
        </div>
      </Section>
    </>
  );
}

export function Showcase() {
  return <Gallery />;
}
