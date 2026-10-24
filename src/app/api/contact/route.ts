import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  message: z.string().trim().min(10, "Please write at least a few words.").max(4000),
  company: z.string().max(200).optional(), // honeypot
});

// Best-effort in-memory limiter: 5 submissions / 10 minutes per IP. (Per instance; fine for a portfolio.)
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot filled → pretend success, send nothing.
  if (company && company.trim() !== "") return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Not configured: the client falls back to a prefilled mailto: link.
    return NextResponse.json({ ok: false, error: "Mail service not configured." }, { status: 501 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
      html: `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p><hr><p>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send the message. Please email directly." }, { status: 502 });
  }
}
