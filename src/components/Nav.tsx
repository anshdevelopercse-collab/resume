"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { chime, setSound, tick } from "@/lib/sound";
import { links } from "@/content/links";

export const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

type LenisWindow = Window & { __lenis?: Lenis };

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as LenisWindow).__lenis;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: "auto" });
}

export default function Nav() {
  const intro = useIntro();
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const lastActive = useRef(-1);

  // Scroll progress hairline
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  // Active section
  useEffect(() => {
    const triggers = SECTIONS.map((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) {
            setActive(i);
            if (lastActive.current !== i && lastActive.current !== -1) chime(i);
            lastActive.current = i;
          }
        },
      });
    });
    // Back at the very top → no active section
    const top = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 0.45,
      refreshPriority: -1,
      onToggle: (self) => {
        if (self.isActive) {
          setActive(-1);
          lastActive.current = -1;
        }
      },
    });
    return () => {
      triggers.forEach((t) => t?.kill());
      top.kill();
    };
  }, []);

  const toggleSound = useCallback(async () => {
    const next = !soundOn;
    setSoundOn(next);
    await setSound(next);
  }, [soundOn]);

  // Lock scroll while the menu is open
  useEffect(() => {
    const lenis = (window as LenisWindow).__lenis;
    if (open) lenis?.stop();
    else if (intro === "done") lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, intro]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(id), 60);
  };

  const visible = intro !== "pending";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between bg-gradient-to-b from-obsidian-950 via-obsidian-950/80 to-transparent px-[var(--gutter)] pb-9 pt-5 transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            const lenis = (window as LenisWindow).__lenis;
            if (lenis) lenis.scrollTo(0, { duration: 1.6 });
            else window.scrollTo(0, 0);
          }}
          aria-label="Ansh Sharma — back to top"
          data-cursor="Top"
          className="group flex items-center gap-3"
        >
          <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
            <polygon points="24,2 44,16 38,42 10,42 4,16" fill="none" stroke="#c8a24a" strokeWidth="1.2" />
            <text
              x="24"
              y="31"
              textAnchor="middle"
              fill="#ede6d6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19 }}
            >
              AS
            </text>
          </svg>
          <span className="label hidden transition-colors group-hover:text-bone sm:inline">Ansh Sharma</span>
        </a>

        <div className="label hidden items-center gap-3 md:flex" aria-live="polite">
          <span className="text-gold-500">{active >= 0 ? String(active + 1).padStart(2, "0") : "00"}</span>
          <span className="h-px w-8 bg-[var(--obsidian-line)]" />
          <span>{active >= 0 ? SECTIONS[active].label : "Index"}</span>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn ambient sound off" : "Turn ambient sound on"}
            onMouseEnter={tick}
            className="flex h-9 items-center gap-2"
          >
            <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[2px] origin-bottom bg-gold-500"
                  style={{
                    height: soundOn ? "100%" : "25%",
                    animation: soundOn ? `eq 1.${i + 1}s ease-in-out ${i * 0.12}s infinite alternate` : "none",
                  }}
                />
              ))}
            </span>
            <span className="label hidden sm:inline">Sound {soundOn ? "on" : "off"}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            data-cursor="Menu"
            className="label flex items-center gap-3 text-bone"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className="absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-500" style={{ transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
              <span className="absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-500" style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>

        <div
          ref={progress}
          className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gold-500"
          style={{ transform: "scaleX(0)" }}
          aria-hidden="true"
        />
      </header>

      {/* Full-screen menu */}
      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className="fixed inset-0 z-[65] bg-obsidian-950"
        style={{
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
          visibility: open ? "visible" : "hidden",
          transitionProperty: "clip-path, visibility",
          transitionDelay: open ? "0s" : "0s, 0.9s",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1500px] flex-col justify-center px-[var(--gutter)] pb-10 pt-24">
          <nav aria-label="Sections">
            <ul>
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="overflow-hidden border-b border-[var(--obsidian-line)]">
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    onMouseEnter={tick}
                    tabIndex={open ? 0 : -1}
                    className="group flex w-full items-baseline gap-6 py-[clamp(0.6rem,1.6vh,1.2rem)] text-left"
                    style={{
                      transform: open ? "translateY(0)" : "translateY(110%)",
                      transition: `transform 0.9s var(--ease-lux) ${open ? 0.25 + i * 0.07 : 0}s`,
                    }}
                  >
                    <span className="label w-8 text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[clamp(2.4rem,7.5vh,6rem)] text-bone transition-all duration-500 group-hover:translate-x-4 group-hover:italic group-hover:text-gold-300">
                      {s.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a href={`mailto:${links.email}`} className="label link-draw text-bone">
              {links.email}
            </a>
            <div className="flex gap-6">
              <a href={links.github} target="_blank" rel="noreferrer" className="label link-draw">
                GitHub
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="label link-draw">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
