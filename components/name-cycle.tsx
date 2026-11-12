"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/**
 * Your first name, which flips through its scripts once on hover — a quiet
 * echo of the onboarding for people who skipped it.
 */
export function NameCycle() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const play = () => {
    if (timer.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      if (i >= profile.scripts.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setIndex(0);
        return;
      }
      setIndex(i);
    }, 150);
  };

  const script = profile.scripts[index];
  const [first, ...rest] = profile.name.split(" ");

  // While cycling, the surname steps aside and the script is laid over the
  // whole line, so nothing reflows however wide a script renders.
  const cycling = index > 0;

  return (
    <span onMouseEnter={play} aria-label={profile.name} className="relative inline-block">
      <span aria-hidden className={cycling ? "invisible" : undefined}>
        {first}
      </span>
      <span
        aria-hidden
        className="transition-[opacity,filter] duration-300 ease-[var(--ease-soft)]"
        style={cycling ? { opacity: 0, filter: "blur(6px)" } : undefined}
      >
        {" "}
        {rest.join(" ")}
      </span>
      {cycling ? (
        <span
          key={index}
          aria-hidden
          lang={script.lang}
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{ animation: "script-in 220ms var(--ease-soft) both" }}
        >
          {script.text}
        </span>
      ) : null}
    </span>
  );
}
