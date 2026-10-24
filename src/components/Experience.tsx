"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { experience } from "@/content/profile";
import { LightSweep, SectionHead } from "./ui";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, () => {
    // The gold spine draws as the timeline is scrolled.
    gsap.fromTo(
      "[data-spine]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 70%", scrub: 0.5 },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((entry) => {
      const marker = entry.querySelector("[data-marker]");
      const rule = entry.querySelector("[data-entry-rule]");
      const role = entry.querySelector<HTMLElement>("[data-role]");
      const bits = entry.querySelectorAll("[data-bit]");
      const trigger = { trigger: entry, start: "top 78%", once: true } as const;

      gsap.fromTo(entry, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "expo.out", scrollTrigger: trigger });
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut", transformOrigin: "left", scrollTrigger: trigger });
      gsap.fromTo(marker, { scale: 0, rotate: -90 }, { scale: 1, rotate: 45, duration: 1, ease: "back.out(2)", scrollTrigger: trigger });
      if (role) {
        const s = SplitText.create(role, { type: "lines", mask: "lines" });
        gsap.from(s.lines, { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1, scrollTrigger: trigger });
      }
      gsap.from(bits, { y: 26, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.09, delay: 0.2, scrollTrigger: trigger });
    });
  });

  return (
    <section id="experience" ref={root} className="relative px-[var(--gutter)] pb-[clamp(6rem,12vw,12rem)] pt-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead
              index="02"
              label="Experience"
              variant="rise"
              lines={[{ text: "Where" }, { text: "I've built", className: "italic text-gold-300" }]}
            />
            <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-ash">
              Three internships, shown in the order they appear on the resume.
            </p>
          </div>
        </div>

        <div data-timeline className="relative col-span-12 mt-16 lg:col-span-7 lg:mt-0">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-[var(--obsidian-line)] md:left-[9px]" />
          <span
            data-spine
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700 md:left-[9px]"
          />
          <ol>
            {experience.map((e, i) => (
              <li key={e.company} data-entry className="relative pb-[clamp(4rem,8vw,7rem)] pl-10 last:pb-0 md:pl-14">
                <span
                  data-marker
                  aria-hidden="true"
                  className="absolute left-0 top-[0.55rem] h-[15px] w-[15px] rotate-45 border border-gold-500 bg-obsidian-950 md:h-[19px] md:w-[19px]"
                />
                <div data-entry-rule className="rule mb-6 h-px" />
                <p data-bit className="label label-gold">
                  {String(i + 1).padStart(2, "0")} · {e.period}
                </p>
                <h3 data-role className="display mt-4 text-[clamp(2.1rem,4.4vw,4.1rem)] text-bone">
                  {e.role}
                </h3>
                <p data-bit className="mt-3 font-display text-xl italic text-gold-300">
                  {e.company}
                  <span className="not-italic text-ash"> — {e.place}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {e.points.map((p) => (
                    <li key={p} data-bit className="relative max-w-xl pl-6 text-[0.95rem] leading-relaxed text-bone/80">
                      <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-3 bg-gold-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <LightSweep />
      </div>
    </section>
  );
}
