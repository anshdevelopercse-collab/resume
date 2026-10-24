"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { getIntro, subscribeIntro } from "@/lib/intro";

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Scroll is locked until the loader has finished.
    if (getIntro() !== "done") lenis.stop();
    const off = subscribeIntro((s) => {
      if (s === "done") lenis.start();
      else lenis.stop();
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      off();
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
