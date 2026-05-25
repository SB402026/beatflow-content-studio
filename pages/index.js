import { useState, useEffect } from "react";
import Head from "next/head";
import {
  genBeatTitles, genYouTubeSEO, genSocialCaptions, genBio, genPricingCopy,
  GENRES, ARTISTS, MOODS, PLATFORMS,
} from "../lib/generators";
import { canUse, recordUse, getRemainingAll, TOOL_KEYS, FREE_LIMIT } from "../lib/usage";

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { key: "beatTitles",     label: "Beat Titles",    icon: "🎵", desc: "6 SEO-ready titles + BeatStars tags" },
  { key: "youtubeSEO",     label: "YouTube SEO",    icon: "📺", desc: "Title · description · 20 tags · thumbnail" },
  { key: "socialCaptions", label: "Social Captions",icon: "📱", desc: "3 caption variants for IG, TikTok, Twitter" },
  { key: "bioWriter",      label: "Bio Writer",     icon: "✍️", desc: "Professional BeatStars producer bio" },
  { key: "pricingCopy",    label: "Pricing Copy",   icon: "💰", desc: "Conversion copy for all 5 license tiers" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={S.label}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={S.label}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={S.input} />
    </div>
  );
}

function UsagePip({ remaining, isPro }) {
  if (isPro) return <span style={{ ...S.pip, background: "var(--success)", color: "#000" }}>PRO ∞</span>;
  const color = remaining === 0 ? "var(--accent)" : remaining >= FREE_LIMIT ? "var(--success)" : "#F5A623";
  return (
    <span style={{ ...S.pip, background: color + "22", color, border: `1px solid ${color}44` }}>
      {remaining === 0 ? "Used today" : `${remaining}/${FREE_LIMIT} left`}
    </span>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()} className="fade-up">
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 36, letterSpacing: "0.05em", marginBottom: 8 }}>
          Daily Limit Reached
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 320 }}>
          Free accounts get <strong style={{ color: "var(--text)" }}>1 generation per tool per day</strong>.
          Upgrade to Pro for unlimited generations, priority output, and new tools every month.
        </div>

        <div style={S.pricingCard}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: "0.05em" }}>BeatScript Pro</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
            <span style={{ fontFamily: "Bebas Neue", fontSize: 48, color: "var(--accent)" }}>$9</span>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>/month</span>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>or $79/year — save 26%</div>
          {["Unlimited generations on all 5 tools","New generators added monthly","Priority output speed","Export to .txt one click","Early access to new features"].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: "var(--text)" }}>{f}</span>
            </div>
          ))}
          <button style={S.ctaBtn} onClick={() => alert("Connect your Stripe/Whop payment link here!")}>
            Upgrade to Pro →
          </button>
          <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>
            Cancel anytime · Instant access
          </div>
        </div>

        <button onClick={onClose} style={{ marginTop: 20, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab,  setActiveTab]  = useState(0);
  const [result,     setResult]     = useState("");
  const [copied,     setCopied]     = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [isPro,      setIsPro]      = useState(false);
  const [remaining,  setRemaining]  = useState({});

  // Core inputs
  const [producerName, setProducerName] = useState("");
  const [genre,        setGenre]        = useState("Trap");
  const [artist,       setArtist]       = useState("Drake");
  const [mood,         setMood]         = useState("Dark");
  const [bpm,          setBpm]          = useState("140");
  const [beatTitle,    setBeatTitle]    = useState("");
  const [platform,     setPlatform]     = useState("Instagram");
  const [bioArtists,   setBioArtists]   = useState("");
  const [bioAccomp,    setBioAccomp]    = useState("");

  useEffect(() => { setRemaining(getRemainingAll(isPro)); }, [isPro, activeTab]);

  const currentKey = TABS[activeTab].key;

  const handleGenerate = () => {
    if (!canUse(currentKey, isPro)) { setShowModal(true); return; }
    recordUse(currentKey);

    const opts = { genre, artist, mood, bpm, beatTitle, producerName, platform,
                   bioArtists, bioAccomplishments: bioAccomp };
    let out = "";
    if (currentKey === "beatTitles")     out = genBeatTitles(opts);
    if (currentKey === "youtubeSEO")     out = genYouTubeSEO(opts);
    if (currentKey === "socialCaptions") out = genSocialCaptions(opts);
    if (currentKey === "bioWriter")      out = genBio({ ...opts, bioArtists, bioAccomplishments: bioAccomp });
    if (currentKey === "pricingCopy")    out = genPricingCopy(opts);

    setResult(out);
    setRemaining(getRemainingAll(isPro));
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `beatscript-${currentKey}-${Date.now()}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>BeatScript — Marketing Tools for Music Producers</title>
        <meta name="description" content="Generate beat titles, YouTube SEO, social captions, bios, and pricing copy in seconds. Built for BeatStars producers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎛️</text></svg>" />
      </Head>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <header style={S.header}>
          <div style={S.headerInner}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={S.logo}>🎛️</div>
              <div>
                <div style={S.logoText}>BeatScript</div>
                <div style={S.logoSub}>Marketing tools for music producers</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {!isPro && (
                <button style={S.upgradeBtn} onClick={() => setShowModal(true)}>
                  Upgrade to Pro
                </button>
              )}
              {/* DEV toggle — remove in production */}
              <button style={S.devBtn} onClick={() => { setIsPro(p => !p); setResult(""); }}
                title="Dev: toggle Pro">
                {isPro ? "PRO ✓" : "FREE"}
              </button>
            </div>
          </div>
        </header>

        {/* ── Hero strip ── */}
        <div style={S.hero}>
          <div style={S.heroInner}>
            <div style={S.heroBadge}>✦ Free · No signup required</div>
            <h1 style={S.heroTitle}>
              Stop wasting time on marketing.<br />
              <span style={{ color: "var(--accent)" }}>Start selling beats.</span>
            </h1>
            <p style={S.heroSub}>
              5 AI-powered tools to generate beat titles, YouTube SEO, social captions,
              your producer bio, and license pricing copy — in seconds.
            </p>
          </div>
        </div>

        {/* ── Main layout ── */}
        <main style={S.main}>
          <div style={S.grid}>

            {/* ── LEFT: Inputs ── */}
            <aside style={S.aside}>
              <div style={S.card}>
                <div style={S.cardLabel}>Your Details</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Input label="Producer Name" value={producerName} onChange={setProducerName} placeholder="e.g. Metro Boomin" />
                  <Input label="Beat Title (optional)" value={beatTitle} onChange={setBeatTitle} placeholder="e.g. Midnight Drip" />
                  <Select label="Genre" value={genre} onChange={setGenre} options={GENRES} />
                  <Select label="Artist Style" value={artist} onChange={setArtist} options={ARTISTS} />
                  <Select label="Mood / Vibe" value={mood} onChange={setMood} options={MOODS} />
                  <Input label="BPM" value={bpm} onChange={setBpm} placeholder="140" />
                </div>
              </div>

              {/* Tab-specific extras */}
              {activeTab === 2 && (
                <div style={{ ...S.card, marginTop: 12 }}>
                  <div style={S.cardLabel}>Platform</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {PLATFORMS.map(p => (
                      <button key={p} onClick={() => setPlatform(p)}
                        style={{ ...S.chip, ...(platform === p ? S.chipActive : {}) }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div style={{ ...S.card, marginTop: 12 }}>
                  <div style={S.cardLabel}>Bio Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Input label="Sounds Like / Worked With" value={bioArtists} onChange={setBioArtists} placeholder="e.g. Future, Gunna, Lil Baby" />
                    <Input label="Accomplishments / Style Notes" value={bioAccomp} onChange={setBioAccomp} placeholder="e.g. 500+ beats, dark melodic sound" />
                  </div>
                </div>
              )}
            </aside>

            {/* ── RIGHT: Tabs + Output ── */}
            <section style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>

              {/* Tab bar */}
              <div style={S.tabBar}>
                {TABS.map((tab, i) => (
                  <button key={tab.key} onClick={() => { setActiveTab(i); setResult(""); }}
                    style={{ ...S.tab, ...(activeTab === i ? S.tabActive : {}) }}>
                    <span>{tab.icon}</span>
                    <span style={{ fontWeight: 600 }}>{tab.label}</span>
                    <UsagePip remaining={remaining[tab.key] ?? FREE_LIMIT} isPro={isPro} />
                  </button>
                ))}
              </div>

              {/* Tab description + generate */}
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: "0.05em" }}>
                      {TABS[activeTab].icon} {TABS[activeTab].label}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
                      {TABS[activeTab].desc}
                    </div>
                  </div>
                  <button onClick={handleGenerate} style={S.generateBtn}>
                    {canUse(currentKey, isPro) ? "⚡ Generate" : "🔒 Upgrade to Generate"}
                  </button>
                </div>
              </div>

              {/* Output */}
              <div style={{ ...S.card, flex: 1 }}>
                {result ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 12, color: "var(--success)", fontFamily: "DM Mono, monospace", letterSpacing: "0.06em" }}>
                        ✓ READY TO USE
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleDownload} style={S.actionBtn}>↓ Download</button>
                        <button onClick={handleCopy} style={{ ...S.actionBtn, ...(copied ? S.actionBtnSuccess : {}) }}>
                          {copied ? "✓ Copied!" : "Copy All"}
                        </button>
                      </div>
                    </div>
                    <pre style={S.output}>{result}</pre>
                  </>
                ) : (
                  <div style={S.emptyState}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎚️</div>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 26, letterSpacing: "0.05em", marginBottom: 8 }}>
                      Ready When You Are
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 14, maxWidth: 300, lineHeight: 1.7 }}>
                      Fill in your details on the left, pick a tool above, and hit <strong style={{ color: "var(--text)" }}>Generate</strong>.
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
                      {TABS.map(t => (
                        <div key={t.key} style={S.featureChip}>{t.icon} {t.label}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </section>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer style={S.footer}>
          <div style={{ opacity: 0.4, fontSize: 12, fontFamily: "DM Mono, monospace" }}>
            © {new Date().getFullYear()} BeatScript · Built for producers who move different
          </div>
        </footer>
      </div>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  header: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0, zIndex: 100,
  },
  headerInner: {
    maxWidth: 1200, margin: "0 auto", padding: "14px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  logo: {
    width: 40, height: 40, background: "var(--accent)", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
  },
  logoText: { fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: "0.06em" },
  logoSub:  { fontSize: 11, color: "var(--muted)", fontFamily: "DM Mono, monospace" },
  upgradeBtn: {
    padding: "8px 18px", borderRadius: 8, border: "1px solid var(--accent)",
    background: "transparent", color: "var(--accent)", cursor: "pointer",
    fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13,
    transition: "all 0.15s",
  },
  devBtn: {
    padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--surface3)", color: "var(--muted)", cursor: "pointer",
    fontFamily: "DM Mono, monospace", fontSize: 11,
  },

  hero: {
    borderBottom: "1px solid var(--border)",
    background: "linear-gradient(180deg, #0D0D20 0%, var(--bg) 100%)",
    padding: "48px 24px",
  },
  heroInner: { maxWidth: 720, margin: "0 auto", textAlign: "center" },
  heroBadge: {
    display: "inline-block", padding: "4px 14px", borderRadius: 20,
    border: "1px solid var(--border)", fontSize: 11, color: "var(--muted)",
    fontFamily: "DM Mono, monospace", marginBottom: 20, letterSpacing: "0.06em",
  },
  heroTitle: {
    fontFamily: "Bebas Neue", fontSize: "clamp(36px, 6vw, 60px)",
    letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: 16,
  },
  heroSub: { color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" },

  main: { flex: 1, maxWidth: 1200, margin: "0 auto", padding: "28px 24px", width: "100%" },
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" },

  aside: { position: "sticky", top: 80 },
  card: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "20px",
  },
  cardLabel: {
    fontFamily: "Bebas Neue", fontSize: 15, letterSpacing: "0.1em",
    color: "var(--muted)", marginBottom: 16, textTransform: "uppercase",
  },

  label: {
    fontSize: 11, color: "var(--muted)", fontFamily: "DM Mono, monospace",
    textTransform: "uppercase", letterSpacing: "0.08em",
  },
  input: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "10px 14px", color: "var(--text)",
    fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", width: "100%",
  },

  tabBar: {
    display: "flex", flexDirection: "column", gap: 6,
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: 10,
  },
  tab: {
    display: "flex", alignItems: "center", gap: 10, padding: "11px 16px",
    borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
    background: "transparent", color: "var(--muted)", fontSize: 14,
    fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
  },
  tabActive: {
    background: "var(--surface3)", color: "var(--text)",
    boxShadow: "inset 0 0 0 1px var(--border)",
  },

  pip: {
    marginLeft: "auto", padding: "2px 8px", borderRadius: 20,
    fontSize: 10, fontFamily: "DM Mono, monospace", fontWeight: 500,
    flexShrink: 0,
  },

  chip: {
    padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)",
    background: "var(--surface2)", color: "var(--muted)", cursor: "pointer",
    fontSize: 13, fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
  },
  chipActive: {
    background: "rgba(255,77,0,0.12)", color: "var(--accent)",
    border: "1px solid rgba(255,77,0,0.35)",
  },

  generateBtn: {
    padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, var(--accent), #FF3E3E)",
    color: "#fff", fontFamily: "DM Sans, sans-serif", fontWeight: 700,
    fontSize: 15, boxShadow: "0 0 24px var(--glow)", whiteSpace: "nowrap",
    transition: "opacity 0.2s",
  },

  output: {
    whiteSpace: "pre-wrap", wordBreak: "break-word",
    fontFamily: "DM Mono, monospace", fontSize: 12.5,
    lineHeight: 1.85, color: "var(--text)",
    maxHeight: 520, overflowY: "auto",
  },

  actionBtn: {
    padding: "7px 16px", borderRadius: 8, border: "1px solid var(--border)",
    background: "var(--surface2)", color: "var(--muted)", cursor: "pointer",
    fontFamily: "DM Mono, monospace", fontSize: 12, transition: "all 0.15s",
  },
  actionBtnSuccess: {
    background: "rgba(0,229,160,0.12)", color: "var(--success)",
    border: "1px solid rgba(0,229,160,0.3)",
  },

  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "48px 24px", textAlign: "center",
    minHeight: 320,
  },
  featureChip: {
    padding: "6px 14px", borderRadius: 20, fontSize: 12,
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--muted)",
  },

  footer: {
    borderTop: "1px solid var(--border)", padding: "20px 24px", textAlign: "center",
  },

  // Modal
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1000, padding: 20,
  },
  modal: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 20, padding: "36px 28px", maxWidth: 420, width: "100%",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
  },
  pricingCard: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "24px", width: "100%", textAlign: "left",
  },
  ctaBtn: {
    width: "100%", padding: "14px", borderRadius: 10, border: "none",
    cursor: "pointer", background: "linear-gradient(135deg, var(--accent), #FF3E3E)",
    color: "#fff", fontFamily: "DM Sans, sans-serif", fontWeight: 700,
    fontSize: 15, boxShadow: "0 0 24px var(--glow)", marginTop: 20,
  },
};
