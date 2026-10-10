// /design — internal component gallery. Not in product nav; reachable by URL.
import { Gallery, GalleryIndex } from "./_showcase";

export default function DesignPage() {
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--text-faint)" }}>
          Internal · component gallery
        </p>
        <h1 className="hero-title">Every atom, <span style={{ background: "linear-gradient(92deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>one calm room.</span></h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>
          Nine sections. If a component isn't here, it doesn't ship.
        </p>
        <GalleryIndex />
      </div>
      <Gallery />
    </main>
  );
}
