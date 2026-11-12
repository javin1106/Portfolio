"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Prompt, TerminalWindow } from "./terminal/window";

/**
 * First-visit onboarding.
 *
 *   1. names     your name cycles through scripts, each coming into focus
 *   2. terminal  a window opens and types two commands
 *   3. dock      the window flies into the nav's >_ button as the page appears
 *
 * The overlay is server-rendered and shown by CSS only when <html> has the
 * `intro` class (set by the boot script for first visits), so it covers the
 * page from the very first frame — and returning visitors never see a flash.
 */

type Phase = "names" | "terminal" | "dock" | "done";

const FIRST_HOLD = 650;
const NAME_HOLD = 340;
const FULL_NAME_HOLD = 650;
const TYPE_SPEED = 32;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function Onboarding() {
  const [phase, setPhase] = useState<Phase>("names");
  const [nameIndex, setNameIndex] = useState(0);
  const [showFullName, setShowFullName] = useState(false);
  const [typed, setTyped] = useState<{ cmd: string; out: boolean }[]>([]);
  const [leaving, setLeaving] = useState(false);
  const [run, setRun] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);

  const finish = useCallback(() => {
    cancelled.current = true;
    setLeaving(true);
    document.documentElement.classList.remove("intro");
    try {
      localStorage.setItem("intro-seen", "1");
    } catch {
      /* fine — it'll just play again next time */
    }
    setTimeout(() => setPhase("done"), 650);
  }, []);

  /* The sequence itself. Re-runs when `run` changes (the `replay` command). */
  useEffect(() => {
    // Returning visitors: CSS already keeps the overlay hidden; nothing to run.
    if (!document.documentElement.classList.contains("intro")) return;
    cancelled.current = false;

    const sequence = async () => {
      const scripts = profile.scripts;
      await wait(FIRST_HOLD);
      for (let i = 1; i < scripts.length; i++) {
        if (cancelled.current) return;
        setNameIndex(i);
        await wait(NAME_HOLD);
      }
      if (cancelled.current) return;
      setShowFullName(true);
      await wait(FULL_NAME_HOLD);

      if (cancelled.current) return;
      setPhase("terminal");
      await wait(380);

      for (const line of profile.terminalIntro) {
        // A fresh prompt line, then type into it one character at a time.
        setTyped((t) => [...t, { cmd: "", out: false }]);
        for (let c = 1; c <= line.cmd.length; c++) {
          if (cancelled.current) return;
          const partial = line.cmd.slice(0, c);
          setTyped((t) => [...t.slice(0, -1), { cmd: partial, out: false }]);
          // A little jitter so it reads as a person typing, not a ticker.
          await wait(TYPE_SPEED + Math.random() * 30);
        }
        await wait(160);
        setTyped((t) => [...t.slice(0, -1), { cmd: line.cmd, out: true }]);
        await wait(520);
      }
      setTyped((t) => [...t, { cmd: "", out: false }]);

      if (cancelled.current) return;
      await wait(250);
      dock();
    };

    /* Fly the window into the nav button, then let the page take over. */
    const dock = () => {
      setPhase("dock");
      const win = windowRef.current;
      const target = document.getElementById("terminal-trigger");
      if (win && target && "animate" in win) {
        const a = win.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const dx = b.left + b.width / 2 - (a.left + a.width / 2);
        const dy = b.top + b.height / 2 - (a.top + a.height / 2);
        const scale = Math.max(b.width / a.width, 0.04);
        win.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1, filter: "blur(0)" },
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0, filter: "blur(2px)" },
          ],
          { duration: 720, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
        );
        // Give the nav button a small "received" pulse as the window lands.
        target.animate(
          [{ scale: "1" }, { scale: "1.25" }, { scale: "1" }],
          { duration: 420, delay: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
      setTimeout(finish, 380);
    };

    void sequence();
    return () => {
      cancelled.current = true;
    };
  }, [run, finish]);

  /* Esc or any click skips. */
  useEffect(() => {
    if (phase === "done" || leaving) return;
    const onKey = (e: KeyboardEvent) => {
      if (!document.documentElement.classList.contains("intro")) return;
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, leaving, finish]);

  /* `replay` in the terminal brings it all back. */
  useEffect(() => {
    const onReplay = () => {
      document.documentElement.classList.add("intro");
      setLeaving(false);
      setNameIndex(0);
      setShowFullName(false);
      setTyped([]);
      setPhase("names");
      setRun((r) => r + 1);
    };
    window.addEventListener("intro:replay", onReplay);
    return () => window.removeEventListener("intro:replay", onReplay);
  }, []);

  if (phase === "done") return null;

  const script = profile.scripts[nameIndex];

  return (
    <div
      id="onboarding"
      role="presentation"
      onClick={finish}
      // `finish` removes html.intro (which is what CSS uses to show this), so
      // hold it on screen inline while it fades out.
      style={leaving ? { display: "grid" } : undefined}
      className={cn(
        "grain fixed inset-0 z-[100] cursor-pointer place-items-center bg-bg transition-[opacity,filter] duration-[650ms] ease-[var(--ease-soft)]",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <div className="glow" />

      {/* 1 — names */}
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-[opacity,filter,scale] duration-500 ease-[var(--ease-soft)]",
          phase !== "names" && "scale-[0.97] opacity-0 blur-md",
        )}
        aria-hidden={phase !== "names"}
      >
        <h1 className="sr-only">{profile.name}</h1>
        {showFullName ? (
          <p
            key="full"
            className="serif text-center text-[clamp(2.6rem,9vw,5.5rem)] leading-none text-fg"
            style={{ animation: "script-in 520ms var(--ease-soft) both" }}
          >
            {profile.name}
          </p>
        ) : (
          <p
            key={script.text}
            lang={script.lang}
            className="serif text-center text-[clamp(2.6rem,9vw,5.5rem)] leading-[1.2] text-fg"
            style={{ animation: "script-in 300ms var(--ease-soft) both" }}
          >
            {script.text}
          </p>
        )}
      </div>

      {/* 2 — terminal */}
      {phase === "terminal" || phase === "dock" ? (
        <div className="relative w-full max-w-[520px] px-5">
          <TerminalWindow
            ref={windowRef}
            title="javin — zsh"
            className="w-full"
            bodyClassName="min-h-[150px] px-4 py-3"
            style={{ animation: "script-in 420ms var(--ease-out-expo) both" }}
          >
            {typed.map((line, i) => {
              const intro = profile.terminalIntro.find((l) => l.cmd === line.cmd);
              const isLast = i === typed.length - 1;
              return (
                <div key={i}>
                  <div>
                    <Prompt />
                    <span className="text-fg">{line.cmd}</span>
                    {isLast && !line.out ? <span className="caret ml-0.5 text-accent" /> : null}
                  </div>
                  {line.out && intro ? (
                    <div className="text-fg-3" style={{ animation: "fade-in 300ms ease both" }}>
                      {intro.out}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {typed.length === 0 ? (
              <div>
                <Prompt />
                <span className="caret ml-0.5 text-accent" />
              </div>
            ) : null}
          </TerminalWindow>
        </div>
      ) : null}

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10.5px] tracking-tight text-fg-4">
        click or press <kbd>esc</kbd> to skip
      </p>
    </div>
  );
}
