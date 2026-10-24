"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

/** Element that leans toward the pointer. Wrap buttons / links. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

export type HeadVariant = "rise" | "fall" | "slide" | "scale" | "scatter";

/**
 * Section heading: mono index, a display title, a drawn rule.
 * Each variant animates differently so no two sections arrive the same way.
 */
export function SectionHead({
  index,
  label,
  lines,
  variant,
  className = "",
}: {
  index: string;
  label: string;
  lines: { text: string; className?: string }[];
  variant: HeadVariant;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const rule = el.querySelector<HTMLElement>("[data-head-rule]");
      const meta = el.querySelectorAll<HTMLElement>("[data-head-meta]");
      const targets = el.querySelectorAll<HTMLElement>("[data-head-line]");

      const base = { trigger: el, start: "top 82%", once: true } as const;
      const tl = gsap.timeline({ scrollTrigger: base, defaults: { ease: "power4.out" } });
      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        tl.to(rule, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0);
      }
      gsap.set(meta, { autoAlpha: 0, y: 12 });
      tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.1);

      targets.forEach((t, i) => {
        const at = 0.15 + i * 0.12;
        if (variant === "rise") {
          const s = SplitText.create(t, { type: "lines", mask: "lines", autoSplit: true });
          gsap.set(s.lines, { yPercent: 115, skewY: 6 });
          tl.to(s.lines, { yPercent: 0, skewY: 0, duration: 1.4, stagger: 0.1 }, at);
        } else if (variant === "fall") {
          const s = SplitText.create(t, { type: "chars", mask: "chars" });
          gsap.set(s.chars, { yPercent: -118, rotate: -7 });
          tl.to(s.chars, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.035, ease: "expo.out" }, at);
        } else if (variant === "slide") {
          const s = SplitText.create(t, { type: "words", mask: "words" });
          gsap.set(s.words, { xPercent: -105 });
          tl.to(s.words, { xPercent: 0, duration: 1.3, stagger: 0.12, ease: "expo.out" }, at);
        } else if (variant === "scatter") {
          const s = SplitText.create(t, { type: "chars", mask: "chars" });
          gsap.set(s.chars, { yPercent: () => gsap.utils.random(-130, 130), xPercent: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-14, 14) });
          tl.to(s.chars, { yPercent: 0, xPercent: 0, rotate: 0, duration: 1.6, stagger: { amount: 0.7, from: "random" }, ease: "expo.out" }, at);
        } else {
          const s = SplitText.create(t, { type: "chars" });
          gsap.set(s.chars, { autoAlpha: 0, scale: 1.7, filter: "blur(14px)" });
          tl.to(s.chars, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.04, ease: "power3.out" }, at);
        }
      });
    }, el);
    return () => ctx.revert();
  }, [variant]);

  return (
    <div ref={root} className={className}>
      <div className="mb-8 flex items-center gap-5">
        <span data-head-meta className="label label-gold">
          {index}
        </span>
        <span data-head-rule className="rule block h-px flex-1" />
        <span data-head-meta className="label">
          {label}
        </span>
      </div>
      <h2 className="display text-[clamp(3.4rem,10.5vw,10.5rem)] text-bone">
        {lines.map((l, i) => (
          <span key={i} data-head-line className={`block ${l.className ?? ""}`}>
            {l.text}
          </span>
        ))}
      </h2>
    </div>
  );
}

/** Infinite marquee whose speed and skew react to scroll velocity. */
export function Marquee({ items, className = "" }: { items: readonly string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(tr, { xPercent: -50, duration: 55, ease: "none", repeat: -1 });
      const skew = gsap.quickTo(tr, "skewX", { duration: 0.6, ease: "power3.out" });
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = self.direction;
          loop.timeScale(dir * (1 + Math.min(Math.abs(v) / 350, 7)));
          skew(gsap.utils.clamp(-14, 14, -v / 220));
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-[4vw] pr-[4vw]">
          <span className={i % 2 ? "outline-text" : "text-bone"}>{t}</span>
          <span className="text-[0.4em] text-gold-500" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div ref={root} className={`overflow-hidden border-y border-[var(--obsidian-line)] py-6 ${className}`} aria-hidden="true">
      <div ref={track} className="display flex w-max whitespace-nowrap text-[clamp(3rem,9vw,8.5rem)] font-light will-change-transform">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

/** A thin gold light that sweeps across a boundary the first time it scrolls into view. */
export function LightSweep() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.firstElementChild,
        { xPercent: -110 },
        { xPercent: 210, duration: 1.8, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 92%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="rule relative h-px overflow-hidden" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
    </div>
  );
}
