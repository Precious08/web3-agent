// Discover: the stream as a ranked table. ?view=all|early. Same data, terminal dress.
import { getDiscover } from "../../lib/api";
import { Eyebrow, Segmented, StatusPill, SectionHead, row } from "../../components/chrome";
import { Board } from "../../components/leaderboard";

export const dynamic = "force-dynamic";

export default async function Discover({ searchParams }: { searchParams: { view?: string } }) {
  const view = searchParams.view === "early" ? "early" : "foryou";
  const { items, live } = await getDiscover(view);
  return (
    <main className="page">
      <div style={{ display: "grid", gap: 12 }}>
        <Eyebrow>{view === "early" ? "Early radar · pre-consensus" : "Discover · ranked stream"}</Eyebrow>
        <div style={row()}>
          <Segmented options={[
            { href: "/discover?view=all", label: "All", active: view === "foryou" },
            { href: "/discover?view=early", label: "Early", active: view === "early" },
          ]} />
          <StatusPill live={live} />
          <span className="tabular" style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{items.length} rows</span>
        </div>
      </div>

      <section style={{ display: "grid", gap: 12 }}>
        <SectionHead title={view === "early" ? "Before it's obvious" : "Ranked for you"} hint="Strength bars read off convergence, not popularity." />
        <Board items={items} />
      </section>
    </main>
  );
}
