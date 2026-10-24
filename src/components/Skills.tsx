"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { skills } from "@/content/profile";
import { LightSweep, Marquee, SectionHead } from "./ui";
import { tick } from "@/lib/sound";

const MARQUEE = ["React", "Next.js", "Node.js", "TypeScript", "Python", "PostgreSQL", "LangChain", "RAG", "OpenCV", "Docker", "LLM APIs", "Prisma"];

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, () => {
    gsap.utils.toArray<HTMLElement>("[data-skill-row]").forEach((row) => {
      const st = { trigger: row, start: "top 86%", once: true } as const;
      gsap.fromTo(row.querySelector("[data-row-rule]"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.4, ease: "power3.inOut", scrollTrigger: st });
      gsap.from(row.querySelector("[data-row-label]"), { autoAlpha: 0, x: -20, duration: 1, ease: "power3.out", scrollTrigger: st });
      gsap.from(row.querySelectorAll("[data-skill]"), {
        autoAlpha: 0,
        y: 22,
        filter: "blur(10px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.15,
        scrollTrigger: st,
      });
    });
  });

  return (
    <section id="skills" ref={root} className="relative pb-[clamp(6rem,12vw,12rem)] pt-[clamp(5rem,10vw,9rem)]">
      <div className="mb-[clamp(3rem,7vw,6rem)]">
        <Marquee items={MARQUEE} />
      </div>

      <div className="px-[var(--gutter)]">
        <div className="mx-auto max-w-[1500px]">
          <SectionHead
            index="04"
            label="Skills"
            variant="slide"
            lines={[{ text: "The" }, { text: "toolkit", className: "italic text-gold-300" }]}
          />

          <ul className="mt-[clamp(3rem,7vw,6rem)]">
            {skills.map((g, i) => (
              <li key={g.group} data-skill-row className="group/row relative grid grid-cols-12 gap-x-6 pb-8 pt-6">
                <span data-row-rule className="rule absolute inset-x-0 top-0 block h-px" />
                <div data-row-label className="col-span-12 mb-4 flex items-baseline gap-4 md:col-span-3 md:mb-0 md:block">
                  <span className="label label-gold md:mb-2 md:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label text-bone">{g.group}</span>
                </div>
                <ul className="col-span-12 flex flex-wrap items-baseline gap-x-[0.5em] gap-y-1 font-display text-[clamp(1.5rem,3.2vw,3.1rem)] font-light leading-[1.18] md:col-span-9">
                  {g.items.map((it, j) => (
                    <li
                      key={it}
                      data-skill
                      onMouseEnter={tick}
                      className="group/item flex items-baseline gap-[0.5em] text-bone/90 transition-colors duration-500 hover:text-gold-300"
                    >
                      <span className="transition-all duration-500 group-hover/item:italic">{it}</span>
                      {j < g.items.length - 1 && (
                        <span aria-hidden="true" className="text-[0.55em] text-gold-700">
                          /
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <LightSweep />
      </div>
    </section>
  );
}
