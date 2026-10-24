"use client";

import { useSyncExternalStore } from "react";

// pending: loader on screen · revealing: gold is draining, hero should animate in · done: loader gone
export type IntroState = "pending" | "revealing" | "done";

let state: IntroState = "pending";
const listeners = new Set<() => void>();

export function getIntro(): IntroState {
  return state;
}

export function setIntro(next: IntroState) {
  if (state === next) return;
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// For non-React consumers (e.g. Lenis).
export function subscribeIntro(cb: (s: IntroState) => void) {
  return subscribe(() => cb(state));
}

export function useIntro(): IntroState {
  return useSyncExternalStore(subscribe, getIntro, () => "pending" as IntroState);
}

// Real loading signals the preloader waits for.
const signals: Record<string, boolean> = {};
const signalListeners = new Set<() => void>();

export function markReady(key: string) {
  if (signals[key]) return;
  signals[key] = true;
  signalListeners.forEach((l) => l());
}

export function isReady(key: string) {
  return !!signals[key];
}

export function onSignal(cb: () => void) {
  signalListeners.add(cb);
  return () => signalListeners.delete(cb);
}
