import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[var(--gutter)] text-center">
      <svg viewBox="0 0 400 520" className="absolute left-1/2 top-1/2 h-[88vh] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden="true">
        <g stroke="#c8a24a" strokeOpacity="0.45" strokeLinejoin="round" fill="#0b0b0d">
          <polygon points="200,10 130,150 188,214" />
          <polygon points="200,10 188,214 268,160" fill="#141416" />
          <polygon points="130,150 96,330 188,214" fill="#08080a" />
          <polygon points="188,214 96,330 176,420" />
          {/* the crack: two halves pulled apart */}
          <polygon points="196,214 268,160 300,330 214,424" fill="#141416" transform="translate(16 6)" />
          <polygon points="176,420 214,424 190,510" fill="#08080a" transform="translate(-8 10)" />
        </g>
        <path d="M188 214 L200 262 L186 300 L206 350 L194 400 L212 424" fill="none" stroke="#e7d3a1" strokeWidth="1.4" />
      </svg>

      <p className="label label-gold relative z-10">Error 404</p>
      <h1 className="display relative z-10 mt-4 text-[clamp(5rem,18vw,16rem)] text-bone">
        Shattered<span className="text-gold-500">.</span>
      </h1>
      <p className="relative z-10 mt-4 max-w-sm text-ash">This page broke off somewhere. The rest of the site is intact.</p>
      <Link
        href="/"
        className="relative z-10 mt-10 border border-gold-500 px-8 py-4 font-mono text-[0.74rem] uppercase tracking-[0.22em] text-gold-300 transition-colors duration-500 hover:bg-gold-500 hover:text-obsidian-950"
      >
        Back home
      </Link>
    </main>
  );
}
