"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { projects } from "@/content/profile";
import { Magnetic, SectionHead } from "./ui";
import ProjectArt from "./ProjectArt";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const count = projects.length;

  useGsapScope(root, () => {
    const mm = gsap.matchMedia();

    // ---- desktop: pinned horizontal gallery ----
    mm.add("(min-width: 1024px)", () => {
      const pin = root.current!.querySelector<HTMLElement>("[data-pin]")!;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const bar = root.current!.querySelector<HTMLElement>("[data-progress]")!;
      const counter = root.current!.querySelector<HTMLElement>("[data-counter]")!;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const scroll = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
            const idx = Math.min(count, Math.max(1, Math.round(self.progress * count + 0.35)));
            counter.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      root.current!.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        const art = panel.querySelector("[data-art]");
        const num = panel.querySelector("[data-num]");
        const text = panel.querySelectorAll("[data-text]");
        const st = { trigger: panel, containerAnimation: scroll, start: "left 92%", toggleActions: "play none none none" } as const;

        gsap.fromTo(art, { clipPath: "inset(0 0 100% 0)", scale: 1.12 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger: st });
        gsap.fromTo(text, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", stagger: 0.09, scrollTrigger: st });
        // parallax: art drifts slower than the track, numeral drifts faster
        gsap.fromTo(art, { xPercent: 9 }, { xPercent: -9, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo(num, { xPercent: 18 }, { xPercent: -26, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true } });
      });

      // tilt on the art frames
      const cleanups: (() => void)[] = [];
      root.current!.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 9);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      return () => cleanups.forEach((c) => c());
    });

    // ---- mobile / tablet: stacked, each block reveals on its own ----
    mm.add("(max-width: 1023px)", () => {
      root.current!.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        const st = { trigger: panel, start: "top 80%", once: true } as const;
        gsap.fromTo(panel.querySelector("[data-art]"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.out", scrollTrigger: st });
        gsap.from(panel.querySelectorAll("[data-text]"), { y: 36, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.09, scrollTrigger: st });
      });
    });

    return () => mm.revert();
  });

  return (
    <section id="work" ref={root} className="relative">
      <div data-pin className="relative overflow-hidden lg:h-screen">
        <div data-track className="flex flex-col lg:h-full lg:w-max lg:flex-row lg:items-center">
          {/* intro panel */}
          <div className="flex shrink-0 flex-col justify-center px-[var(--gutter)] pb-10 pt-[clamp(5rem,10vw,9rem)] lg:h-full lg:w-[min(78vw,1050px)] lg:pb-0 lg:pt-0">
            <SectionHead
              index="03"
              label="Work"
              variant="fall"
              lines={[{ text: "Selected" }, { text: "Work", className: "italic text-gold-300 outline-text" }]}
            />
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-ash">
              Three personal projects spanning LLM applications, local retrieval-augmented generation and real-time computer vision.
            </p>
            <p className="label mt-10 hidden items-center gap-4 lg:flex" aria-hidden="true">
              Keep scrolling
              <span className="relative block h-px w-20 overflow-hidden bg-[var(--obsidian-line)]">
                <span className="absolute inset-y-0 left-0 w-1/2 bg-gold-500" style={{ animation: "slide-x 2s var(--ease-lux) infinite" }} />
              </span>
            </p>
          </div>

          {projects.map((p) => (
            <article
              key={p.id}
              data-panel
              className="relative flex shrink-0 flex-col gap-10 px-[var(--gutter)] py-14 lg:h-full lg:w-[min(92vw,1280px)] lg:flex-row lg:items-center lg:gap-[5vw] lg:py-0"
            >
              <span
                data-num
                aria-hidden="true"
                className="outline-text display pointer-events-none absolute left-[1%] top-1/2 hidden -translate-y-1/2 select-none text-[clamp(14rem,30vw,30rem)] leading-none opacity-[0.3] lg:block"
              >
                {p.index}
              </span>

              <div className="relative z-10 w-full lg:w-[38%] lg:shrink-0" style={{ perspective: 1200 }}>
                <div
                  data-art
                  data-tilt
                  data-cursor="Explore"
                  className="surface relative mx-auto aspect-[5/6] w-full max-w-[460px] overflow-hidden p-5 lg:max-h-[68vh] lg:w-auto lg:max-w-none"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ProjectArt id={p.id} />
                  <span aria-hidden="true" className="absolute left-3 top-3 label">
                    Fig. {p.index}
                  </span>
                </div>
              </div>

              <div className="relative z-10 max-w-xl lg:flex-1">
                <p data-text className="label label-gold">
                  Project {p.index} / {String(count).padStart(2, "0")}
                </p>
                <h3 data-text className="display mt-4 text-[clamp(2.6rem,5.2vw,5rem)] text-bone">
                  {p.title}
                </h3>
                <ul data-text className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {p.stack.map((s) => (
                    <li key={s} className="border border-[var(--obsidian-line)] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-bone/80">
                      {s}
                    </li>
                  ))}
                </ul>
                <div data-text className="mt-7 space-y-4">
                  {p.points.map((pt) => (
                    <p key={pt} className="relative pl-6 text-[0.92rem] leading-relaxed text-bone/80">
                      <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-3 bg-gold-500" />
                      {pt}
                    </p>
                  ))}
                </div>
                <div data-text className="mt-8">
                  <Magnetic>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Open"
                      aria-label={`${p.title} on GitHub (opens in a new tab)`}
                      className="group inline-flex items-center gap-4 border border-gold-500/60 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-300 transition-colors duration-500 hover:bg-gold-500 hover:text-obsidian-950"
                    >
                      View on GitHub
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </Magnetic>
                </div>
              </div>
            </article>
          ))}

          <div aria-hidden="true" className="hidden h-full w-[12vw] shrink-0 lg:block" />
        </div>

        {/* progress (desktop only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden items-center gap-5 px-[var(--gutter)] lg:flex" aria-hidden="true">
          <span className="label label-gold">
            <span data-counter>01</span> / {String(count).padStart(2, "0")}
          </span>
          <span className="rule relative block h-px flex-1">
            <span data-progress className="absolute inset-0 origin-left bg-gold-500" style={{ transform: "scaleX(0)" }} />
          </span>
          <span className="label">Work</span>
        </div>
      </div>
    </section>
  );
}
