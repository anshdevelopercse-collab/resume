"use client";

import { useEffect, useRef } from "react";
import { isReady, setIntro } from "@/lib/intro";

/*
 * Liquid-gold preloader.
 *   1. A hairline draws, a counter ticks from REAL loading signals (fonts, window load, hero scene).
 *   2. Molten gold rises inside the letterforms of the name (animated wave surface, meniscus, back layer).
 *   3. At 100% the gold overflows into a full-screen flood, then drains downward in a liquid curtain,
 *      revealing the hero that is already animating underneath.
 * The wave and sheet are plain SVG paths rewritten each frame: one rAF loop, no WebGL, no layout work.
 */

const MIN_MS = 2600; // so the pour is always seen, even on a warm cache
const HARD_TIMEOUT_MS = 8000; // never trap the visitor if the 3D scene stalls
const SKIP_AFTER_MS = 1000;
const FLOOD_MS = 1050;
const DRAIN_MS = 1500;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Gold tongues that lead the flood / cling during the drain.
const TONGUES = [
  { cx: 8, w: 3.4, d: 0.05, len: 16 },
  { cx: 21, w: 2.4, d: 0.18, len: 24 },
  { cx: 34, w: 3.8, d: 0.0, len: 13 },
  { cx: 47, w: 2.2, d: 0.26, len: 27 },
  { cx: 58, w: 3.0, d: 0.1, len: 18 },
  { cx: 71, w: 2.6, d: 0.22, len: 25 },
  { cx: 83, w: 3.6, d: 0.04, len: 15 },
  { cx: 94, w: 2.8, d: 0.15, len: 21 },
];

function sheetPath(base: number, amp: number, tongueT: number, time: number, sign: 1 | -1) {
  const N = 96;
  let top = "";
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 100;
    let y = base + amp * (Math.sin(x * 0.09 + time * 3.1) * 0.6 + Math.sin(x * 0.21 - time * 2.3) * 0.4);
    for (const t of TONGUES) {
      const k = easeOutCubic(clamp01((tongueT - t.d) / (1 - t.d)));
      const g = Math.exp(-Math.abs(x - t.cx) / t.w);
      y -= sign * t.len * k * g * (1 - tongueT * 0.35);
    }
    top += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return { fill: `${top}L100 140 L0 140 Z`, line: top.trim() };
}

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const waveFrontRef = useRef<SVGPathElement>(null);
  const waveBackRef = useRef<SVGPathElement>(null);
  const meniscusRef = useRef<SVGPathElement>(null);
  const nameStrokeRef = useRef<SVGTextElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sheetFillRef = useRef<SVGPathElement>(null);
  const sheetBackRef = useRef<SVGPathElement>(null);
  const sheetLineRef = useRef<SVGPathElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Returning visitor in the same session: no loader, hero still plays its own entrance.
    if (html.classList.contains("skip-intro")) {
      window.scrollTo(0, 0);
      setIntro("revealing");
      const id = window.setTimeout(() => setIntro("done"), 200);
      return () => window.clearTimeout(id);
    }

    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let skipRequested = false;
    let phase: "load" | "flood" | "drain" | "end" = "load";
    let phaseStart = 0;
    let shown = 0;
    let raf = 0;
    let fontsReady = false;
    let disposed = false;

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
      });
    } else {
      fontsReady = true;
    }

    const target = () => {
      let t = 0;
      if (fontsReady) t += 0.3;
      if (document.readyState === "complete") t += 0.4;
      if (isReady("hero")) t += 0.3;
      if (performance.now() - start > HARD_TIMEOUT_MS) t = 1;
      return t;
    };

    const finish = () => {
      if (disposed) return;
      phase = "end";
      html.style.overflow = "";
      try {
        sessionStorage.setItem("obsidian-intro-seen", "1");
      } catch {}
      setIntro("done");
      root.style.display = "none";
    };

    // ----- reduced motion: a short, calm gold fade, no liquid -----
    if (reduced) {
      root.dataset.mode = "reduced";
      const begin = () => {
        setIntro("revealing");
        root.style.transition = "opacity 400ms ease";
        root.style.opacity = "0";
        window.setTimeout(finish, 420);
      };
      const check = window.setInterval(() => {
        if (fontsReady && document.readyState === "complete" && performance.now() - start > 700) {
          window.clearInterval(check);
          begin();
        }
      }, 80);
      return () => {
        disposed = true;
        window.clearInterval(check);
        html.style.overflow = "";
      };
    }

    // ----- input: skip -----
    const onSkip = () => {
      if (performance.now() - start > SKIP_AFTER_MS && phase === "load") skipRequested = true;
    };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);
    const hintTimer = window.setTimeout(() => {
      if (hintRef.current) hintRef.current.style.opacity = "1";
    }, SKIP_AFTER_MS + 400);

    const frame = (now: number) => {
      if (disposed) return;
      const time = now / 1000;
      const elapsed = now - start;

      if (phase === "load") {
        const cap = Math.min(1, elapsed / MIN_MS);
        const goal = skipRequested ? 1 : Math.min(target(), cap);
        shown += (goal - shown) * (skipRequested ? 0.18 : 0.07);
        if (goal >= 1 && shown > 0.994) shown = 1;
        if (shown < 0.001) shown = 0;

        // Fill level inside the letterforms (SVG user units, viewBox 1200x320).
        const level = 252 - shown * 152;
        const amp = 9 * (1 - shown * 0.55);
        const pts = (phaseShift: number, lift: number) => {
          let d = "";
          for (let x = -20; x <= 1220; x += 20) {
            const y =
              level +
              lift +
              amp * Math.sin(x * 0.011 + time * 2.4 + phaseShift) +
              amp * 0.55 * Math.sin(x * 0.027 - time * 1.7 + phaseShift * 1.7);
            d += `${d ? "L" : "M"}${x} ${y.toFixed(1)} `;
          }
          return d;
        };
        const front = pts(0, 0);
        const back = pts(1.9, 7);
        waveFrontRef.current?.setAttribute("d", `${front}L1220 340 L-20 340 Z`);
        waveBackRef.current?.setAttribute("d", `${back}L1220 340 L-20 340 Z`);
        meniscusRef.current?.setAttribute("d", front.trim());

        const pct = Math.round(shown * 100);
        if (counterRef.current) counterRef.current.textContent = String(pct).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
        if (nameStrokeRef.current) nameStrokeRef.current.style.opacity = String(1 - shown * 0.7);

        if (shown >= 1) {
          phase = "flood";
          phaseStart = now;
        }
      } else if (phase === "flood") {
        const t = clamp01((now - phaseStart) / FLOOD_MS);
        const e = easeInOut(t);
        const base = 128 - e * 150; // 128 → -22
        const p = sheetPath(base, 3.2 + 2 * Math.sin(t * Math.PI), t, time, 1);
        const back = sheetPath(base + 2.4, 3.6, t, time + 0.4, 1);
        sheetFillRef.current?.setAttribute("d", p.fill);
        sheetBackRef.current?.setAttribute("d", back.fill);
        sheetLineRef.current?.setAttribute("d", p.line);
        if (stageRef.current) stageRef.current.style.transform = `scale(${1 + e * 0.04})`;
        if (t >= 1) {
          // Fully covered by gold: swap the black stage away, let the hero start, begin the drain.
          if (stageRef.current) stageRef.current.style.display = "none";
          root.style.background = "transparent";
          setIntro("revealing");
          phase = "drain";
          phaseStart = now;
        }
      } else if (phase === "drain") {
        const t = clamp01((now - phaseStart) / DRAIN_MS);
        // heavy start, then gravity
        const e = t < 0.18 ? 0.0063 * Math.pow(t / 0.18, 2) : 0.0063 + (1 - 0.0063) * easeInOut((t - 0.18) / 0.82);
        const base = -22 + e * 190; // -22 → 168
        const tongueT = Math.sin(clamp01(t * 1.15) * Math.PI);
        const p = sheetPath(base, 3.4 * (1 - t * 0.5), tongueT, time, -1);
        const back = sheetPath(base - 2.2, 3.8, tongueT * 0.9, time + 0.6, -1);
        sheetFillRef.current?.setAttribute("d", p.fill);
        sheetBackRef.current?.setAttribute("d", back.fill);
        sheetLineRef.current?.setAttribute("d", p.line);
        if (t >= 1) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(hintTimer);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      html.style.overflow = "";
    };
  }, []);

  return (
    <div
      id="preloader"
      ref={rootRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] overflow-hidden bg-obsidian-950"
    >
      <span className="sr-only">Loading the portfolio of Ansh Sharma</span>

      {/* Black stage with the liquid-filled name */}
      <div ref={stageRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center px-[3vw]">
          <svg viewBox="0 60 1200 220" className="w-full max-w-[1500px]" role="presentation">
            <defs>
              <linearGradient id="pl-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="0.25" stopColor="#e7d3a1" />
                <stop offset="0.55" stopColor="#c8a24a" />
                <stop offset="1" stopColor="#8a6a26" />
              </linearGradient>
              <clipPath id="pl-name">
                <text
                  x="600"
                  y="232"
                  textAnchor="middle"
                  textLength="1130"
                  lengthAdjust="spacing"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 165 }}
                >
                  ANSH SHARMA
                </text>
              </clipPath>
            </defs>
            <text
              ref={nameStrokeRef}
              x="600"
              y="232"
              textAnchor="middle"
              textLength="1130"
              lengthAdjust="spacing"
              fill="none"
              stroke="rgba(237,230,214,0.32)"
              strokeWidth="1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 165 }}
            >
              ANSH SHARMA
            </text>
            <line
              x1="0"
              y1="256"
              x2="1200"
              y2="256"
              stroke="rgba(200,162,74,0.55)"
              strokeWidth="1"
              pathLength="1"
              strokeDasharray="1"
              style={{ animation: "line-dash 1.6s var(--ease-lux) both" }}
            />
            <g clipPath="url(#pl-name)">
              <path ref={waveBackRef} fill="#7a5f22" />
              <path ref={waveFrontRef} fill="url(#pl-gold)" />
              <path ref={meniscusRef} fill="none" stroke="#fff4d2" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            </g>
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-[var(--gutter)] pb-8">
          <div className="flex items-baseline gap-4">
            <span ref={counterRef} className="font-mono text-5xl font-light tabular-nums text-bone md:text-7xl">
              000
            </span>
            <span className="label">Obsidian / Loading</span>
          </div>
          <span ref={hintRef} className="label opacity-0 transition-opacity duration-700">
            Press any key to skip
          </span>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold-500"
          ref={barRef}
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Full-screen gold sheet: floods upward, then drains downward in a liquid curtain */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sheet-gold" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="120">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="0.3" stopColor="#d9bb70" />
            <stop offset="0.65" stopColor="#b08d3c" />
            <stop offset="1" stopColor="#6d541d" />
          </linearGradient>
        </defs>
        <path ref={sheetBackRef} fill="#7a5f22" />
        <path ref={sheetFillRef} fill="url(#sheet-gold)" />
        <path
          ref={sheetLineRef}
          fill="none"
          stroke="#fff4d2"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
