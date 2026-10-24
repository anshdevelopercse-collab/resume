"use client";

import type Lenis from "lenis";
import { links } from "@/content/links";
import { Magnetic } from "./ui";

export default function Footer() {
  return (
    <footer className="relative px-[var(--gutter)] pb-8 pt-10">
      <div className="rule mb-8" />
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-6">
        <p className="label">© 2026 Ansh Sharma</p>
        <p className="label hidden md:block">Next.js · GSAP · Three.js · designed in obsidian &amp; gold</p>
        <div className="flex items-center gap-8">
          <a href={links.github} target="_blank" rel="noreferrer" className="label link-draw">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="label link-draw">
            LinkedIn
          </a>
          <Magnetic strength={0.4}>
            <button
              type="button"
              data-cursor="Top"
              onClick={() => {
                const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
                if (lenis) lenis.scrollTo(0, { duration: 2 });
                else window.scrollTo(0, 0);
              }}
              className="label flex items-center gap-2 text-gold-300"
            >
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
