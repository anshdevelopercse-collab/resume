"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { tick } from "@/lib/sound";

/** Gold dot + trailing ring. Grows over interactive elements, shows a label from data-cursor="…". */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    gsap.set([d, r, l], { xPercent: -50, yPercent: -50 });
    gsap.set([d, r], { opacity: 0 });
    gsap.set(l, { opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });
    const lx = gsap.quickTo(l, "x", { duration: 0.55, ease: "power3.out" });
    const ly = gsap.quickTo(l, "y", { duration: 0.55, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([d, r, l], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.4 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      lx(e.clientX);
      ly(e.clientY);
    };

    const setHover = (target: EventTarget | null, enter: boolean) => {
      const el = (target as HTMLElement | null)?.closest?.("a, button, input, textarea, [data-cursor]") as HTMLElement | null;
      if (!el) return;
      const text = el.dataset.cursor ?? "";
      if (enter) {
        tick();
        gsap.to(r, {
          scale: text ? 3.2 : 1.9,
          backgroundColor: text ? "rgba(200,162,74,0.96)" : "rgba(200,162,74,0)",
          duration: 0.45,
          ease: "power3.out",
        });
        gsap.to(d, { scale: text ? 0 : 0.6, duration: 0.3 });
        l.textContent = text;
        gsap.to(l, { opacity: text ? 1 : 0, duration: 0.25 });
      } else {
        gsap.to(r, { scale: 1, backgroundColor: "rgba(200,162,74,0)", duration: 0.45, ease: "power3.out" });
        gsap.to(d, { scale: 1, duration: 0.3 });
        gsap.to(l, { opacity: 0, duration: 0.2 });
      }
    };
    const onOver = (e: PointerEvent) => setHover(e.target, true);
    const onOut = (e: PointerEvent) => setHover(e.target, false);
    const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.3 });
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const onEnter = () => shown && gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot h-[6px] w-[6px] rounded-full bg-gold-300" aria-hidden="true" />
      <div ref={ring} className="cursor-ring h-10 w-10 rounded-full border border-gold-500/70" aria-hidden="true" />
      <div
        ref={label}
        className="cursor-ring font-mono text-[10px] uppercase tracking-[0.22em] text-obsidian-950"
        aria-hidden="true"
      />
    </>
  );
}
