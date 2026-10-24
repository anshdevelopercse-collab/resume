"use client";

import { Fragment, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { LightSweep } from "./ui";

// Statement is the resume summary, tightened for rhythm. {braces} mark words that light up gold.
const STATEMENT =
  "B.Tech CSE student, graduating 2027, with two software development internships building {full-stack} web applications in React, Node.js and Express. Personal projects go further into {AI}: LLM integration, retrieval-augmented generation and computer vision.";

const facts = [
  { n: 3, pad: 2, label: "Internships", note: "TechJain IT · Dadamani · Digital Veda" },
  { n: 3, pad: 2, label: "Projects", note: "LLM apps, RAG, computer vision" },
  { n: 2, pad: 2, label: "Smart India Hackathons", note: "2024 and 2025" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, () => {
    // Words light up as the paragraph crosses the viewport.
    const words = gsap.utils.toArray<HTMLElement>("[data-word]");
    gsap.set(words, { opacity: 0.14 });
    gsap.to(words, {
      opacity: 1,
      ease: "none",
      stagger: 0.12,
      scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 48%", scrub: 0.6 },
    });

    gsap.from("[data-fact]", {
      y: 60,
      autoAlpha: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.14,
      scrollTrigger: { trigger: "[data-facts]", start: "top 85%", once: true },
    });
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const pad = Number(el.dataset.pad);
      const o = { v: 0 };
      gsap.to(o, {
        v: end,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(pad, "0")),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
  });

  const parts = STATEMENT.split(/(\{[^}]+\})/);

  return (
    <section id="profile" ref={root} className="relative px-[var(--gutter)] pb-[clamp(6rem,14vw,14rem)] pt-[clamp(6rem,14vw,13rem)]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-12 gap-x-6">
        <div className="col-span-12 mb-10 flex items-center gap-5 md:col-span-2 md:mb-0 md:block">
          <p className="label label-gold md:mb-4">01</p>
          <p className="label">Profile</p>
          <span className="rule block h-px flex-1 md:hidden" />
        </div>

        <div className="col-span-12 md:col-span-10">
          <p
            data-statement
            className="display text-[clamp(2rem,4.9vw,4.9rem)] font-light leading-[1.08] tracking-[-0.015em]"
            aria-label={STATEMENT.replace(/[{}]/g, "")}
          >
            {parts.map((part, i) => {
              const gold = part.startsWith("{");
              const text = gold ? part.slice(1, -1) : part;
              return (
                <Fragment key={i}>
                  {text.split(/(\s+)/).map((w, j) =>
                    /^\s+$/.test(w) || w === "" ? (
                      w
                    ) : (
                      <span
                        key={j}
                        data-word
                        aria-hidden="true"
                        className={gold ? "italic text-gold-300" : "text-bone"}
                      >
                        {w}
                      </span>
                    ),
                  )}
                </Fragment>
              );
            })}
          </p>

        </div>
      </div>

      <div data-facts className="mx-auto mt-[clamp(5rem,10vw,9rem)] grid max-w-[1500px] grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {facts.map((f) => (
          <div key={f.label} data-fact className="border-t border-[var(--obsidian-line)] pt-6">
            <div className="flex items-baseline justify-between">
              <span className="display text-[clamp(5rem,10vw,9.5rem)] leading-none text-bone" data-count={f.n} data-pad={f.pad}>
                {String(f.n).padStart(f.pad, "0")}
              </span>
              <span className="label label-gold">{f.label}</span>
            </div>
            <p className="label mt-4 normal-case tracking-[0.08em]">{f.note}</p>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <LightSweep />
      </div>
    </section>
  );
}
