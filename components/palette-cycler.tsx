"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Palette } from "@/lib/accent";

/*
 * The site's colours cycle through the banner photos' palettes on *every*
 * page, not just Home. The cycler lives in the root layout (which never
 * unmounts during navigation), and the Home banner simply follows the shared
 * index — so whichever section you're on, the colour keeps moving, and the
 * banner is always showing the photo the colours came from.
 */

export const HOLD = 6500;

let index = 0;
let count = 0;
let lastChange = 0;
const listeners = new Set<() => void>();

function emit() {
  lastChange = Date.now();
  listeners.forEach((l) => l());
}

export function setSlide(i: number) {
  if (!count) return;
  index = ((i % count) + count) % count;
  emit();
}

export function useSlide() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => index,
    () => 0,
  );
}

/**
 * Hues are numbers the browser interpolates (see @property in globals.css),
 * so each one takes the shortest way round the colour wheel: 350° → 10°
 * travels +20°, not −340° through every green and blue.
 */
function applyPalette(p: Palette) {
  const root = document.documentElement;
  const toward = (prop: string, target: number) => {
    const current =
      parseFloat(root.style.getPropertyValue(prop)) ||
      parseFloat(getComputedStyle(root).getPropertyValue(prop)) ||
      target;
    const delta = ((((target - current) % 360) + 540) % 360) - 180;
    root.style.setProperty(prop, String(Math.round((current + delta) * 10) / 10));
  };
  toward("--ah", p.ah);
  toward("--gh", p.ah);
  toward("--th", p.th);
  root.style.setProperty("--as", `${p.as}%`);
  root.style.setProperty("--gs", `${p.as}%`);
  root.style.setProperty("--ts", `${p.ts}%`);
}

export function PaletteCycler({ palettes }: { palettes: Palette[] }) {
  const current = useSlide();

  useEffect(() => {
    count = palettes.length;
  }, [palettes.length]);

  /* One timer for the whole site. A manual pick (banner dots) restarts the wait. */
  useEffect(() => {
    if (palettes.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? HOLD * 2 : HOLD;
    const timer = setInterval(() => {
      if (Date.now() - lastChange >= hold - 50) setSlide(index + 1);
    }, 500);
    return () => clearInterval(timer);
  }, [palettes.length]);

  useEffect(() => {
    if (palettes[current]) applyPalette(palettes[current]);
  }, [current, palettes]);

  return null;
}
