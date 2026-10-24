"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { links } from "@/content/links";
import { Magnetic, SectionHead } from "./ui";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

const socials = [
  { label: "LinkedIn", href: links.linkedin, text: "ansh-sharmax17" },
  { label: "GitHub", href: links.github, text: "anshsharmax17" },
  { label: "Phone", href: links.phoneHref, text: links.phone },
] as const;

export default function Contact() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScope(root, () => {
    // The warmth near the end of the page: a horizon of gold light rises as the section arrives.
    ScrollTrigger.create({
      trigger: root.current,
      start: "top 85%",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        root.current?.style.setProperty("--gold-heat", String(self.progress));
      },
    });

    const st = (t: string) => ({ trigger: t, start: "top 85%", once: true }) as const;
    gsap.from("[data-email]", { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: st("[data-email]") });
    gsap.from("[data-social]", { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: st("[data-socials]") });
    gsap.from("[data-form]", { autoAlpha: 0, y: 60, duration: 1.4, ease: "power4.out", scrollTrigger: st("[data-form]") });
  });

  return (
    <div ref={root} className="relative overflow-hidden">
    <section id="contact" className="relative px-[var(--gutter)] pb-[clamp(5rem,9vw,8rem)] pt-[clamp(5rem,10vw,9rem)]">
      {/* gold horizon, driven by --gold-heat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-30%] h-[70%] rounded-[50%]"
        style={{
          background: "radial-gradient(closest-side, rgba(200,162,74,0.55), rgba(122,95,34,0.22) 55%, transparent 100%)",
          opacity: "calc(var(--gold-heat, 0) * 0.55)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px]">
        <SectionHead
          index="06"
          label="Contact"
          variant="scatter"
          lines={[{ text: "Get in" }, { text: "touch", className: "italic text-gold-300" }]}
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden pb-2">
              <a
                data-email
                href={`mailto:${links.email}`}
                data-cursor="Write"
                className="link-draw display block break-all text-[clamp(1.7rem,3.9vw,3.7rem)] leading-[1.05] text-bone transition-colors duration-500 hover:text-gold-300"
              >
                {links.email}
              </a>
            </div>

            <ul data-socials className="mt-12 border-t border-[var(--obsidian-line)]">
              {socials.map((s) => (
                <li key={s.label} data-social className="border-b border-[var(--obsidian-line)]">
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    data-cursor="Open"
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="label group-hover:text-gold-500">{s.label}</span>
                    <span className="flex items-center gap-4 font-display text-[1.5rem] text-bone transition-transform duration-500 group-hover:-translate-x-2">
                      {s.text}
                      <span aria-hidden="true" className="text-gold-500 transition-transform duration-500 group-hover:translate-x-1">
                        ↗
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Magnetic strength={0.25}>
                <a
                  href={links.resume}
                  download="Ansh_Sharma_Resume.pdf"
                  data-cursor="Download"
                  className="group inline-flex items-center gap-5 border border-gold-500 px-8 py-4 font-mono text-[0.74rem] uppercase tracking-[0.22em] text-gold-300 transition-colors duration-500 hover:bg-gold-500 hover:text-obsidian-950"
                >
                  Download résumé
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-1">
                    ↓
                  </span>
                </a>
              </Magnetic>
              <p className="label mt-3">PDF · Ansh_Sharma_Resume.pdf</p>
            </div>
          </div>

          <div data-form className="col-span-12 lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </div>
  );
}
