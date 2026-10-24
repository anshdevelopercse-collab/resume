"use client";

/*
 * Ambient sound, synthesised with the Web Audio API. No audio files.
 * Off by default; nothing is created until the visitor flips the toggle (a user gesture).
 */

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let drone: { stop: () => void } | null = null;
let enabled = false;
let lastTick = 0;

const KEY = "obsidian-sound";

export function soundEnabled() {
  return enabled;
}

export function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

function ensureContext(): Ctx | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  return ctx;
}

function startDrone(c: Ctx) {
  if (drone || !master) return;
  const out = c.createGain();
  out.gain.value = 0.0;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  lp.Q.value = 0.6;
  lp.connect(out);
  out.connect(master);

  const freqs = [55, 82.4, 110.2, 164.9];
  const oscs = freqs.map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 4;
    const g = c.createGain();
    g.gain.value = 0.22 / (i + 1);
    o.connect(g);
    g.connect(lp);
    o.start();
    return o;
  });

  // Slow breathing in the filter.
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 140;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  out.gain.linearRampToValueAtTime(0.6, c.currentTime + 3);

  drone = {
    stop() {
      const t = c.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + 0.6);
      window.setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
        out.disconnect();
      }, 700);
    },
  };
}

export async function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  const c = ensureContext();
  if (!c || !master) return;
  if (on) {
    await c.resume();
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0.5, c.currentTime + 0.4);
    startDrone(c);
    chime(0);
  } else {
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    drone?.stop();
    drone = null;
  }
}

/** Glassy tick for hover. Throttled so scrubbing across a list stays pleasant. */
export function tick() {
  if (!enabled || !ctx || !master) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const now = performance.now();
  if (now - lastTick < 70) return;
  lastTick = now;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(2100 + Math.random() * 300, t);
  o.frequency.exponentialRampToValueAtTime(1500, t + 0.12);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + 0.2);
}

/** Two-partial gold chime, played when the active section changes. */
export function chime(step = 0) {
  if (!enabled || !ctx || !master) return;
  const base = [392, 440, 523.25, 587.33, 659.25, 783.99][step % 6];
  const t = ctx.currentTime;
  [1, 2.005].forEach((mul, i) => {
    const o = ctx!.createOscillator();
    o.type = "sine";
    o.frequency.value = base * mul;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(i ? 0.03 : 0.07, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(g);
    g.connect(master!);
    o.start(t);
    o.stop(t + 1.7);
  });
}
