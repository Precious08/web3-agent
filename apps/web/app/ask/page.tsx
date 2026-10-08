// Ask: natural-language research (PRD Sec 12, US-02).
// GET form → server component calls api().ask (no browser CORS involved).
// Offline: honest prompt to start the API, plus example questions.
import { SignalBadge, EvidenceInline, CounterCallout } from "@web3-agent/ui";
import { api } from "../../lib/trpc";
import { Eyebrow, StatusPill, SectionHead, row } from "../../components/chrome";

export const dynamic = "force-dynamic";

const EXAMPLES = [
  "Which new DeFi projects are showing strong ecosystem growth?",
  "What narratives are starting to gain attention?",
  "Why is DreamCanvas getting unusual attention?",
];

export default async function Ask({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  let ans: Awaited<ReturnType<ReturnType<typeof api>["ask"]["query"]>> | null = null;
  let live = false;
  if (q) {
    try {
      ans = await api().ask.query({ question: q });
      live = true;
    } catch {
      ans = null;
    }
  }
  return (
    <main className="page">
      <div style={{ display: "grid", gap: 12 }}>
        <Eyebrow>Research assistant · ask anything</Eyebrow>
        <form action="/ask" role="search" style={{ display: "flex", gap: 8 }}>
          <input name="q" defaultValue={q} placeholder="Ask a research question…" aria-label="Research question"
            style={{ flex: 1, minWidth: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", fontSize: 15, color: "var(--text)" }} />
          <button type="submit" style={{ background: "linear-gradient(92deg, var(--accent), var(--accent-2))", color: "#06121f", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Ask
          </button>
        </form>
        <div style={row()}>
          <StatusPill live={live || !q} />
          {!q && <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Structured answers with evidence, counters and next steps.</span>}
        </div>
      </div>

      {!q && (
        <section style={{ display: "grid", gap: 10 }}>
          <SectionHead title="Try" hint="Example investigations." />
          <div style={{ display: "grid", gap: 8 }}>
            {EXAMPLES.map((e) => (
              <a key={e} href={`/ask?q=${encodeURIComponent(e)}`} className="rowhover"
                style={{ border: "1px solid var(--border-soft)", borderRadius: 12, background: "var(--surface)", padding: "12px 16px", fontSize: 14, textDecoration: "none", color: "var(--text)" }}>
                {e} <span aria-hidden style={{ color: "var(--text-faint)" }}>→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {q && !ans && (
        <section style={{ display: "grid", gap: 10 }}>
          <SectionHead title="You're offline" hint="Answers need a live connection." />
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65 }}>
            Nothing to show yet — answers are researched live, never guessed. Reconnect and ask again; your question is kept in the box above.
          </p>
        </section>
      )}

      {q && ans && (
        <>
          <section style={{ display: "grid", gap: 10 }}>
            <SectionHead title="Answer" hint="Summary first, receipts attached." />
            <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "linear-gradient(180deg, var(--surface-2), var(--surface))", boxShadow: "var(--card-shadow)", padding: 18, display: "grid", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>{ans.summary}</p>
              <div style={row()}>
                {ans.signals.map((s) => (
                  <SignalBadge key={s.id} state={s.state} label={`${s.type} · ${s.magnitude}`} />
                ))}
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: 10 }}>
            <SectionHead title="Evidence" hint="Every claim traces somewhere." />
            <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: 16 }}>
              <EvidenceInline claim={ans.summary} evidence={ans.evidence} />
            </div>
          </section>

          <section style={{ display: "grid", gap: 10 }}>
            <SectionHead title="Challenge" hint="The other side, on purpose." />
            <div style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", background: "var(--surface)", padding: 16 }}>
              <CounterCallout points={ans.counters} />
              <p style={{ fontSize: 13, color: "var(--text-faint)", margin: "10px 0 0" }}>Unknown: {ans.unknowns.join(" ")}</p>
            </div>
          </section>

          <section style={{ display: "grid", gap: 10 }}>
            <SectionHead title="Investigate next" hint="Follow-up threads." />
            <div style={{ display: "grid", gap: 8 }}>
              {ans.next.map((n) => (
                <a key={n} href={`/ask?q=${encodeURIComponent(`${n} — ${q}`)}`} className="rowhover"
                  style={{ border: "1px solid var(--border-soft)", borderRadius: 10, background: "var(--surface)", padding: "10px 14px", fontSize: 13.5, textDecoration: "none", color: "var(--text)" }}>
                  {n} <span aria-hidden style={{ color: "var(--text-faint)" }}>→</span>
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
