"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { profile } from "@/content/profile";
import HeroCanvas from "./HeroCanvas";
import { heroScroll } from "@/lib/heroScroll";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const intro = useIntro();
  const played = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Hide everything the entrance will animate, then wait for the loader to start draining.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const splits = gsap.utils.toArray<HTMLElement>("[data-split]").map((n) =>
        SplitText.create(n, { type: "chars", mask: "chars", charsClass: "hero-char", maskClass: "hero-mask" }),
      );
      const chars = splits.flatMap((s) => s.chars);
      gsap.set(chars, { yPercent: 118, rotate: 5 });
      gsap.set("[data-fade]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-stage]", { autoAlpha: 0, scale: 1.12 });
      gsap.set("[data-rule]", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      tl.to("[data-stage]", { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power3.out" }, 0)
        .to(chars, { yPercent: 0, rotate: 0, duration: 1.5, stagger: { each: 0.045, from: "start" } }, 0.15)
        .to("[data-rule]", { scaleX: 1, duration: 1.6, ease: "power3.inOut" }, 0.7)
        .to("[data-fade]", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 }, 1.0);
      timeline.current = tl;

      // Scroll: text drifts up and thins, 3D scene reads the progress
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          heroScroll.value = self.progress;
        },
      });
      gsap.to("[data-name]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-stage]", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => {
      timeline.current = null;
      played.current = false;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (intro !== "pending" && !played.current) {
      played.current = true;
      timeline.current?.play();
    }
  }, [intro]);

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-[var(--gutter)] pb-8 pt-28"
      aria-label="Introduction"
    >
      {/* soft warm light behind the shard, not a gradient blob: a thin, hard-edged halo ring */}
      <div data-stage className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full md:w-[70%]">
        <HeroCanvas />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-1/2 -z-20 hidden h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full border border-gold-500/10 md:block"
      />

      <div className="flex items-start justify-between">
        <p data-fade className="label">
          Portfolio <span className="mx-2 text-gold-500">/</span> 2026
        </p>
        <p data-fade className="label hidden text-right sm:block">
          B.Tech CSE <span className="mx-2 text-gold-500">/</span> Class of 2027
        </p>
      </div>

      <div data-name className="relative z-10 my-auto py-10">
        <h1 className="display select-none" aria-label={profile.name}>
          <span
            data-split
            aria-hidden="true"
            className="block text-[clamp(5.2rem,21vw,23rem)] font-light leading-[0.82] tracking-[-0.035em] text-bone"
          >
            ANSH
          </span>
          <span
            data-split
            aria-hidden="true"
            className="outline-text block pl-[6vw] text-[clamp(5.2rem,21vw,23rem)] font-medium italic leading-[0.82] tracking-[-0.03em] md:pl-[14vw]"
          >
            SHARMA
          </span>
        </h1>
        <div data-rule className="mt-8 h-px w-full max-w-[min(46rem,80vw)] bg-gold-500/70 md:ml-[14vw]" />
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl md:ml-[14vw]">
          <p data-fade className="label label-gold mb-3">
            {profile.role}
          </p>
          <p data-fade className="font-display text-[clamp(1.3rem,2.2vw,2rem)] font-light italic leading-[1.15] text-bone/90">
            Building full-stack products and AI applications, from REST APIs to RAG pipelines.
          </p>
        </div>
        <a
          data-fade
          href="#profile"
          data-cursor="Scroll"
          className="group flex items-center gap-4 self-start md:self-end"
          onClick={(e) => {
            e.preventDefault();
            (window as unknown as { __lenis?: { scrollTo: (t: string, o: object) => void } }).__lenis?.scrollTo("#profile", { duration: 1.6 });
          }}
        >
          <span className="label transition-colors group-hover:text-bone">Scroll</span>
          <span className="relative block h-14 w-px overflow-hidden bg-[var(--obsidian-line)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gold-500" style={{ animation: "scroll-cue 2.2s var(--ease-lux) infinite" }} />
          </span>
        </a>
      </div>
    </section>
  );
}
