"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { markReady } from "@/lib/intro";
import ShardPoster from "./ShardPoster";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Mode = "checking" | "webgl" | "poster";
const noopSubscribe = () => () => {};
let cachedMode: Mode | null = null;
function detectMode(): Mode {
  if (cachedMode) return cachedMode;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  cachedMode = !hasWebGL() || reduced ? "poster" : "webgl";
  return cachedMode;
}

/** Lazy 3D hero: static poster first, canvas fades in when ready, poster stays if WebGL is missing. */
export default function HeroCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const mode = useSyncExternalStore(noopSubscribe, detectMode, (): Mode => "checking");
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (mode === "poster") {
      markReady("hero");
      return;
    }
    if (mode !== "webgl") return;
    const t = window.setTimeout(() => setShown(true), 900);
    return () => window.clearTimeout(t);
  }, [mode]);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: mode === "webgl" && shown ? 0 : 1 }}>
        <ShardPoster />
      </div>
      {mode === "webgl" && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: shown ? 1 : 0 }}>
          <HeroScene active={visible} />
        </div>
      )}
    </div>
  );
}
