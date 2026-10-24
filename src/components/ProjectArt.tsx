/*
 * Generated art for the three projects: illustrative, not screenshots.
 * All geometry is deterministic so server and client markup match.
 */

const GOLD = "#c8a24a";
const GOLD_L = "#e7d3a1";
const BONE = "#ede6d6";
const ASH = "#8c877c";

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}
const f = (n: number) => Number(n.toFixed(2));

/* ---------- 01 · Resume analyser: a document under a scanning beam, with an ATS score ring ---------- */
function ResumeArt() {
  const r = rng(11);
  const rows = Array.from({ length: 14 }, (_, i) => ({
    y: 150 + i * 19,
    w: f(120 + r() * 100),
    hit: [2, 5, 8, 11].includes(i),
  }));
  const C = 2 * Math.PI * 40;
  return (
    <svg viewBox="0 0 400 480" className="h-full w-full" role="img" aria-label="Illustration: a résumé being scanned and scored">
      <defs>
        <linearGradient id="ra-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset="1" stopColor={GOLD_L} stopOpacity="0.55" />
        </linearGradient>
        <clipPath id="ra-doc">
          <path d="M80 36 H266 L322 92 V444 H80 Z" />
        </clipPath>
      </defs>
      <path d="M80 36 H266 L322 92 V444 H80 Z" fill="#0d0d0f" stroke={GOLD} strokeOpacity="0.55" />
      <path d="M266 36 V92 H322" fill="none" stroke={GOLD} strokeOpacity="0.55" />
      <rect x="104" y="64" width="86" height="9" fill={BONE} fillOpacity="0.85" />
      <rect x="104" y="82" width="132" height="5" fill={ASH} fillOpacity="0.6" />
      <rect x="104" y="116" width="210" height="1" fill={GOLD} fillOpacity="0.4" />
      {rows.map((row) => (
        <g key={row.y}>
          <rect x="104" y={row.y} width={row.w} height="4.5" fill={row.hit ? GOLD : ASH} fillOpacity={row.hit ? 0.9 : 0.4} />
          {row.hit && <rect x={104 + row.w + 8} y={row.y - 1} width="22" height="6.5" fill="none" stroke={GOLD_L} strokeOpacity="0.7" strokeWidth="0.8" />}
        </g>
      ))}
      <g clipPath="url(#ra-doc)">
        <g className="art-scan">
          <rect x="70" y="-60" width="270" height="60" fill="url(#ra-scan)" />
          <rect x="70" y="-1" width="270" height="1.6" fill={GOLD_L} />
        </g>
      </g>
      {/* ATS score ring */}
      <g transform="translate(318 118)">
        <circle r="52" fill="#050506" stroke={GOLD} strokeOpacity="0.25" />
        {Array.from({ length: 40 }, (_, i) => {
          const a = (i / 40) * Math.PI * 2;
          return <line key={i} x1={f(Math.cos(a) * 46)} y1={f(Math.sin(a) * 46)} x2={f(Math.cos(a) * (i % 5 ? 49 : 51))} y2={f(Math.sin(a) * (i % 5 ? 49 : 51))} stroke={ASH} strokeOpacity="0.5" />;
        })}
        <circle r="40" fill="none" stroke="#1d1d20" strokeWidth="5" />
        <circle
          r="40"
          fill="none"
          stroke={GOLD_L}
          strokeWidth="5"
          strokeLinecap="butt"
          strokeDasharray={f(C)}
          strokeDashoffset={f(C * 0.18)}
          transform="rotate(-90)"
          className="art-ring"
        />
        <text y="4" textAnchor="middle" fill={BONE} style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 500 }}>
          ATS
        </text>
        <text y="20" textAnchor="middle" fill={ASH} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 7.5, letterSpacing: 1.8 }}>
          SCORED
        </text>
      </g>
      <text x="80" y="468" fill={ASH} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        PARSE · SCORE · MATCH · ROADMAP
      </text>
    </svg>
  );
}

/* ---------- 02 · NexoraRAG: vector-space constellation, a query retrieving its nearest chunks ---------- */
function RagArt() {
  const r = rng(29);
  const q = { x: 210, y: 232 };
  const pts = Array.from({ length: 58 }, (_, i) => ({
    i,
    x: f(36 + r() * 328),
    y: f(40 + r() * 372),
    s: f(1.4 + r() * 2),
  })).filter((p) => Math.hypot(p.x - q.x, p.y - q.y) > 22);
  const near = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 5);
  const nearIds = new Set(near.map((n) => n.i));
  return (
    <svg viewBox="0 0 400 480" className="h-full w-full" role="img" aria-label="Illustration: a query retrieving nearest chunks in a vector space">
      {[60, 110, 165].map((rad, i) => (
        <circle key={rad} cx={q.x} cy={q.y} r={rad} fill="none" stroke={GOLD} strokeOpacity={0.22 - i * 0.05} strokeDasharray="2 5" />
      ))}
      <line x1="20" y1={q.y} x2="380" y2={q.y} stroke={ASH} strokeOpacity="0.12" />
      <line x1={q.x} y1="24" x2={q.x} y2="436" stroke={ASH} strokeOpacity="0.12" />
      {pts
        .filter((p) => !nearIds.has(p.i))
        .map((p) => (
          <circle key={p.i} cx={p.x} cy={p.y} r={p.s} fill={ASH} fillOpacity="0.55" />
        ))}
      {near.map((n, k) => (
        <g key={n.i}>
          <line
            x1={q.x}
            y1={q.y}
            x2={n.x}
            y2={n.y}
            stroke={GOLD_L}
            strokeWidth="1"
            strokeDasharray="4 4"
            className="art-flow"
            style={{ animationDelay: `${k * 0.25}s` }}
          />
          <circle cx={n.x} cy={n.y} r="9" fill="none" stroke={GOLD} strokeOpacity="0.7" className="art-pulse" style={{ animationDelay: `${k * 0.4}s` }} />
          <circle cx={n.x} cy={n.y} r="3.4" fill={GOLD_L} />
          <text x={n.x + 12} y={n.y + 3} fill={GOLD_L} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 7.5, letterSpacing: 1.2 }}>
            {`chunk_${String(n.i).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      <circle cx={q.x} cy={q.y} r="16" fill="none" stroke={BONE} strokeOpacity="0.5" className="art-pulse" />
      <circle cx={q.x} cy={q.y} r="5.5" fill={BONE} />
      <text x={q.x + 12} y={q.y - 12} fill={BONE} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        QUERY
      </text>
      <text x="36" y="466" fill={ASH} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        FAISS · TOP-K · RE-RANK
      </text>
    </svg>
  );
}

/* ---------- 03 · Computer vision: 21 hand landmarks, five fingers tracked ---------- */
const LM: [number, number][] = [
  [200, 404], [158, 372], [122, 330], [98, 288], [80, 250],
  [160, 292], [150, 226], [145, 180], [142, 140],
  [200, 276], [200, 200], [200, 150], [200, 106],
  [240, 288], [252, 222], [258, 176], [262, 136],
  [276, 312], [298, 264], [311, 230], [321, 200],
];
const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];
const TIPS = new Set([4, 8, 12, 16, 20]);

function GestureArt() {
  return (
    <svg viewBox="0 0 400 480" className="h-full w-full" role="img" aria-label="Illustration: hand landmarks tracked for gesture control">
      <g fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1.2">
        {[
          "M52 72 V52 H72", "M348 72 V52 H328", "M52 428 V448 H72", "M348 428 V448 H328",
        ].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <rect x="62" y="82" width="276" height="336" fill="none" stroke={GOLD_L} strokeOpacity="0.28" strokeDasharray="3 6" />
      <g stroke={BONE} strokeOpacity="0.55" strokeWidth="1.2">
        {BONES.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={LM[a][0]} y1={LM[a][1]} x2={LM[b][0]} y2={LM[b][1]} />
        ))}
      </g>
      {LM.map(([x, y], i) => (
        <g key={i} className={TIPS.has(i) ? "art-tip" : undefined} style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
          {TIPS.has(i) && <circle cx={x} cy={y} r="11" fill="none" stroke={GOLD} strokeOpacity="0.6" className="art-pulse" style={{ animationDelay: `${(i % 5) * 0.3}s` }} />}
          <circle cx={x} cy={y} r={TIPS.has(i) ? 4.4 : 2.6} fill={TIPS.has(i) ? GOLD_L : BONE} />
        </g>
      ))}
      <text x="62" y="72" fill={GOLD_L} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        HAND · 21 LANDMARKS
      </text>
      <text x="62" y="440" fill={ASH} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        FINGERS 5 → ZOOM / ROTATE
      </text>
      <text x="338" y="440" textAnchor="end" fill={BONE} style={{ fontFamily: "var(--font-plex-mono)", fontSize: 8, letterSpacing: 2 }}>
        KNN
      </text>
    </svg>
  );
}

export default function ProjectArt({ id }: { id: string }) {
  if (id === "resume-analyser") return <ResumeArt />;
  if (id === "nexora-rag") return <RagArt />;
  return <GestureArt />;
}
