"use client";

import { useState } from "react";
import { links } from "@/content/links";
import { Magnetic } from "./ui";

type Status = "idle" | "sending" | "sent" | "error" | "fallback";
type Fields = { name: string; email: string; message: string; company: string };

const field =
  "peer w-full border-0 border-b border-[var(--obsidian-line)] bg-transparent px-0 pb-3 pt-6 font-sans text-[1rem] text-bone placeholder-transparent outline-none transition-colors duration-500 focus:border-gold-500";
const lbl =
  "pointer-events-none absolute left-0 top-6 origin-left font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ash transition-all duration-500 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-gold-500 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const mailto = (f: Fields) =>
    `mailto:${links.email}?subject=${encodeURIComponent(`Portfolio message from ${f.name}`)}&body=${encodeURIComponent(`${f.message}\n\n— ${f.name} (${f.email})`)}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const f: Fields = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && data.ok) {
        setStatus("sent");
        setMessage("Message sent. Thank you — I'll reply by email.");
        (e.target as HTMLFormElement).reset();
      } else if (res.status === 501) {
        setStatus("fallback");
        setMessage("The mail service isn't connected on this deployment, so your email app is opening with the message prefilled.");
        window.location.href = mailto(f);
      } else if (res.status === 400 && data.fieldErrors) {
        setStatus("error");
        setErrors(data.fieldErrors as Partial<Record<keyof Fields, string>>);
        setMessage("Please check the highlighted fields.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again, or email directly.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again, or email directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="surface relative space-y-2 p-[clamp(1.5rem,3vw,3rem)]" aria-describedby="form-status">
      <p className="label label-gold mb-4">Send a message</p>

      <div className="relative">
        <input id="cf-name" name="name" type="text" required autoComplete="name" placeholder="Name" className={field} aria-invalid={!!errors.name} />
        <label htmlFor="cf-name" className={lbl}>Name</label>
        {errors.name && <p className="mt-2 font-mono text-[0.7rem] text-gold-300">{errors.name}</p>}
      </div>
      <div className="relative">
        <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} aria-invalid={!!errors.email} />
        <label htmlFor="cf-email" className={lbl}>Email</label>
        {errors.email && <p className="mt-2 font-mono text-[0.7rem] text-gold-300">{errors.email}</p>}
      </div>
      <div className="relative">
        <textarea id="cf-message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} aria-invalid={!!errors.message} />
        <label htmlFor="cf-message" className={lbl}>Message</label>
        {errors.message && <p className="mt-2 font-mono text-[0.7rem] text-gold-300">{errors.message}</p>}
      </div>

      {/* honeypot: real visitors never see or fill this */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 pt-8">
        <Magnetic>
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor="Send"
            className="group inline-flex items-center gap-4 bg-gold-500 px-8 py-4 font-mono text-[0.74rem] font-medium uppercase tracking-[0.22em] text-obsidian-950 transition-colors duration-500 hover:bg-gold-300 disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send message"}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </button>
        </Magnetic>
        <p id="form-status" role="status" aria-live="polite" className={`max-w-xs font-mono text-[0.72rem] leading-relaxed ${status === "error" ? "text-gold-300" : "text-ash"}`}>
          {message}
        </p>
      </div>
    </form>
  );
}
