"use client";

import { useSyncExternalStore } from "react";

/*
 * One shared one-second ticker for every clock on the page. The server
 * snapshot is null, so server HTML renders a placeholder and the real time
 * appears on hydration — no mismatch warnings, no wrong timezone.
 */
let now = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

export function Clock({ seconds = true }: { seconds?: boolean }) {
  const t = useNow();
  if (t === null) return <span className="tabular-nums">--:--{seconds ? ":--" : ""}</span>;
  const text = timeFormat.format(t);
  return <span className="tabular-nums">{seconds ? text : text.slice(0, 5)}</span>;
}
