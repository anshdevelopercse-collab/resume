"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { credentials, education } from "@/content/profile";
import { LightSweep, SectionHead } from "./ui";

const columns = [
  { title: "Certifications", items: credentials.certifications },
  { title: "Hackathons & Leadership", items: credentials.leadership },
  { title: "Competitions", items: credentials.competitions },
] as const;

export default function Education() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, () => {
    const st = (t: string, start = "top 82%") => ({ trigger: t, start, once: true }) as const;

    gsap.fromTo("[data-degree]", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.out", scrollTrigger: st("[data-degree]") });
    gsap.from("[data-degree-bit]", { y: 30, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.09, delay: 0.25, scrollTrigger: st("[data-degree]") });

    const cg = { v: 0 };
    gsap.to(cg, {
      v: 6.4,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        const el = document.querySelector("[data-cgpa]");
        if (el) el.textContent = cg.v.toFixed(1);
      },
      scrollTrigger: st("[data-cgpa]", "top 90%"),
    });

    gsap.from("[data-school]", { x: 50, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.14, scrollTrigger: st("[data-schools]") });

    gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, i) => {
      const s = { trigger: col, start: "top 88%", once: true } as const;
      gsap.fromTo(col.querySelector("[data-col-rule]"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.3, ease: "power3.inOut", delay: i * 0.08, scrollTrigger: s });
      gsap.from(col.querySelectorAll("li"), { autoAlpha: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.2 + i * 0.08, scrollTrigger: s });
    });
  });

  const d = education.degree;

  return (
    <section id="education" ref={root} className="relative px-[var(--gutter)] pb-[clamp(6rem,12vw,12rem)] pt-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-[1500px]">
        <SectionHead
          index="05"
          label="Education"
          variant="scale"
          lines={[{ text: "Learning," }, { text: "& proof", className: "italic text-gold-300" }]}
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-12 gap-x-6 gap-y-12">
          <div data-degree className="surface col-span-12 p-[clamp(1.5rem,3vw,3rem)] lg:col-span-7">
            <p data-degree-bit className="label label-gold">
              {d.period}
            </p>
            <h3 data-degree-bit className="display mt-5 text-[clamp(2.2rem,4.6vw,4.4rem)] text-bone">
              {d.school}
            </h3>
            <p data-degree-bit className="mt-4 max-w-xl font-display text-xl italic leading-snug text-gold-300">
              {d.title}
            </p>
            <div data-degree-bit className="mt-10 flex items-end gap-5 border-t border-[var(--obsidian-line)] pt-6">
              <span className="label">CGPA</span>
              <span data-cgpa className="display text-[clamp(4rem,8vw,7rem)] leading-[0.8] text-bone">
                6.4
              </span>
            </div>
          </div>

          <div data-schools className="col-span-12 flex flex-col justify-end lg:col-span-5">
            {education.school.map((s) => (
              <div key={s.name} data-school className="flex items-baseline justify-between gap-6 border-t border-[var(--obsidian-line)] py-6 last:border-b">
                <div>
                  <p className="font-display text-[clamp(1.4rem,2.3vw,2rem)] leading-tight text-bone">{s.name}</p>
                  {s.detail && <p className="label mt-2">{s.detail}</p>}
                </div>
                <span className="display text-[clamp(2.4rem,4vw,3.8rem)] text-gold-500">{s.year}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {columns.map((c, i) => (
            <div key={c.title} data-col>
              <span data-col-rule className="rule mb-5 block h-px" />
              <p className="label label-gold mb-6">
                {String(i + 1).padStart(2, "0")} · {c.title}
              </p>
              <ul className="space-y-4">
                {c.items.map((it) => (
                  <li key={it} className="relative pl-6 font-display text-[1.35rem] leading-snug text-bone/90">
                    <span aria-hidden="true" className="absolute left-0 top-[0.62em] h-[7px] w-[7px] rotate-45 border border-gold-500" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <LightSweep />
      </div>
    </section>
  );
}
