"use client";

/**
 * Tiny cross-component signals. The terminal and the onboarding are mounted
 * once in the root layout; anything can poke them through window events
 * without threading context through every page.
 */

export function openTerminal(command?: string) {
  window.dispatchEvent(new CustomEvent("terminal:open", { detail: { command } }));
}

export function replayIntro() {
  window.dispatchEvent(new Event("intro:replay"));
}

/** Theme switch that cross-fades the whole page where View Transitions exist. */
export function setTheme(light: boolean) {
  const apply = () => {
    document.documentElement.classList.toggle("light", light);
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch {
      /* private mode: the choice just won't persist */
    }
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "startViewTransition" in document) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

/**
 * A pre-filled email to you, opened in Gmail on the web. A plain mailto: link
 * does nothing on the many computers with no desktop mail app set up, which
 * is why "book a call" seemed dead.
 */
export function composeEmail(to: string, subject: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`;
}

export function isLight() {
  return document.documentElement.classList.contains("light");
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.max(1, Math.round((now - new Date(iso).getTime()) / 1000));
  const steps: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [30, "d"],
    [12, "mo"],
  ];
  let value = seconds;
  for (const [size, unit] of steps) {
    if (value < size) return `${value}${unit} ago`;
    value = Math.floor(value / size);
  }
  return `${value}y ago`;
}
