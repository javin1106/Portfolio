"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { composeEmail } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Clock, useNow } from "./clock";
import { ChevronLeft, ChevronRight } from "./icons";

/*
 * An iOS-style calendar that drops out of the clock in the top bar.
 * Today (in IST) gets the filled accent circle; days you committed to GitHub
 * get a dot whose strength follows the count. Tap a day to see the number.
 */

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Today's date as the people in Jalandhar see it, whatever the visitor's timezone. */
function istToday(ms: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ms);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month") - 1, d: get("day") };
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export function CalendarButton() {
  const [open, setOpen] = useState(false);
  // The panel isn't built until it's first wanted, so it costs nothing (not
  // even its once-a-second clock) for visitors who never open it.
  const [mounted, setMounted] = useState(false);

  const toggle = () => {
    if (!mounted) {
      setMounted(true);
      // Let it mount closed for one frame so the open transition can run.
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      return;
    }
    setOpen((v) => !v);
  };
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="pointer-events-auto relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open calendar"
        className={cn(
          "rounded-md px-2 py-1 font-mono text-[11px] transition-colors duration-300",
          open ? "bg-bg-2 text-fg" : "text-fg-3 hover:bg-bg-1 hover:text-fg",
        )}
      >
        <Clock seconds={false} /> IST
      </button>
      {mounted ? <CalendarPanel open={open} /> : null}
    </div>
  );
}

type Counts = Record<string, number>;

function CalendarPanel({ open }: { open: boolean }) {
  const now = useNow();
  const today = now === null ? null : istToday(now);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [direction, setDirection] = useState(0);

  // Load the contribution days the first time the panel opens.
  useEffect(() => {
    if (!open || counts) return;
    fetch("/api/activity")
      .then((r) => r.json())
      .then((d: { calendar?: Counts }) => setCounts(d.calendar ?? {}))
      .catch(() => setCounts({}));
  }, [open, counts]);

  const current = view ?? (today ? { y: today.y, m: today.m } : null);
  if (!current || !today) {
    return null;
  }

  const first = new Date(Date.UTC(current.y, current.m, 1)).getUTCDay();
  const days = new Date(Date.UTC(current.y, current.m + 1, 0)).getUTCDate();
  const isThisMonth = current.y === today.y && current.m === today.m;
  const todayKey = iso(today.y, today.m, today.d);
  const pick = selected ?? todayKey;
  const pickCount = counts?.[pick] ?? 0;
  const pickDate = new Date(`${pick}T00:00:00`);

  const shift = (delta: number) => {
    const d = new Date(Date.UTC(current.y, current.m + delta, 1));
    setDirection(delta);
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const monthTotal = counts
    ? Object.entries(counts)
        .filter(([k]) => k.startsWith(iso(current.y, current.m, 1).slice(0, 7)))
        .reduce((sum, [, n]) => sum + n, 0)
    : null;

  return (
    <div
      role="dialog"
      aria-label="Calendar"
      aria-hidden={!open}
      className={cn(
        "absolute right-0 top-full mt-2 w-[296px] origin-top-right rounded-[22px] border border-line-2 bg-[color-mix(in_oklab,var(--bg-1)_86%,transparent)] p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-2xl transition-[opacity,scale,filter,translate] duration-[380ms] ease-[var(--ease-out-expo)]",
        open ? "visible translate-y-0 scale-100 opacity-100 blur-0" : "invisible -translate-y-1 scale-[0.92] opacity-0 blur-sm",
      )}
    >
      {/* Month header, iOS-style: month in the accent, year quieter */}
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-semibold tracking-tight">
          <span className="text-accent">{MONTHS[current.m]}</span>{" "}
          <span className="text-fg-3">{current.y}</span>
        </p>
        <div className="flex items-center gap-0.5">
          {!isThisMonth ? (
            <button
              type="button"
              onClick={() => {
                setDirection(0);
                setView(null);
                setSelected(null);
              }}
              className="mr-1 rounded-full bg-bg-2 px-2 py-0.5 font-mono text-[10px] text-fg-2 hover:text-fg"
            >
              Today
            </button>
          ) : null}
          <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="grid h-7 w-7 place-items-center rounded-full text-accent hover:bg-bg-2">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => shift(1)} aria-label="Next month" className="grid h-7 w-7 place-items-center rounded-full text-accent hover:bg-bg-2">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="pb-1.5 text-[10.5px] font-semibold text-fg-4">
            {d}
          </span>
        ))}
      </div>

      <div
        key={`${current.y}-${current.m}`}
        className="grid grid-cols-7 gap-y-0.5 text-center"
        style={{ animation: `cal-slide-${direction > 0 ? "next" : direction < 0 ? "prev" : "none"} 320ms var(--ease-soft) both` }}
      >
        {Array.from({ length: first }, (_, i) => (
          <span key={`pad${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const key = iso(current.y, current.m, d);
          const isToday = key === todayKey;
          const isPicked = key === pick && !isToday;
          const count = counts?.[key] ?? 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className="group relative mx-auto grid h-9 w-9 place-items-center"
              aria-label={`${d} ${MONTHS[current.m]}: ${count} contribution${count === 1 ? "" : "s"}`}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-[14px] tabular-nums transition-colors duration-200",
                  isToday && "bg-accent font-semibold text-bg",
                  isPicked && "bg-bg-2 font-semibold text-fg",
                  !isToday && !isPicked && "text-fg-2 group-hover:bg-bg-2",
                )}
              >
                {d}
              </span>
              {count > 0 ? (
                <span
                  aria-hidden
                  className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-accent"
                  style={{ opacity: Math.min(1, 0.35 + count / 8) }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* The selected day, and a way to reach me */}
      <div className="mt-3 border-t border-line-2 pt-3">
        <p className="text-[12.5px] text-fg-2">
          {pickDate.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          <span className="text-fg-4"> · </span>
          {counts === null
            ? "…"
            : pickCount
              ? `${pickCount} contribution${pickCount === 1 ? "" : "s"} on GitHub`
              : "no commits"}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-3 whitespace-nowrap font-mono text-[10.5px] text-fg-4">
          <span>{monthTotal !== null ? `${monthTotal} contributions this month` : " "}</span>
          <a
            href={profile.links.booking || composeEmail(profile.email, "Let’s find a time to talk")}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            book a call →
          </a>
        </div>
      </div>
    </div>
  );
}
