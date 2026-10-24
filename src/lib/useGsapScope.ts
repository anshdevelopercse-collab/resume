"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Runs `setup` inside a gsap.context scoped to `scope`, reverting every tween / ScrollTrigger on cleanup
 * (safe under React strict mode). `setup` is skipped entirely under prefers-reduced-motion, which leaves
 * the content fully visible and static.
 */
export function useGsapScope(
  scope: RefObject<HTMLElement | null>,
  setup: () => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup();
    }, el);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
