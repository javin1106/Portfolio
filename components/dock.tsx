"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { openTerminal, setTheme } from "@/lib/client";
import { cn } from "@/lib/utils";
import { CalendarButton } from "./calendar";
import { GitHub, LinkedIn, Moon, Sun, XTwitter } from "./icons";

/* --------------------------------------------------------------- icons */

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
const HomeIcon = () => (
  <Svg>
    <path d="M3.5 10.5 12 3.5l8.5 7" />
    <path d="M5.5 9v11h13V9" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);
const WorkIcon = () => (
  <Svg>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8.5 7V5.5A2 2 0 0 1 10.5 3.5h3a2 2 0 0 1 2 2V7" />
    <path d="M3 12.5h18" />
  </Svg>
);
const ExperienceIcon = () => (
  <Svg>
    <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
  </Svg>
);
const ActivityIcon = () => (
  <Svg>
    <path d="M3 12.5h4l2.5-7 5 14 2.5-7H21" />
  </Svg>
);
const GalleryIcon = () => (
  <Svg>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    <circle cx="9" cy="9" r="1.8" />
    <path d="m20.5 15.5-5-5L5 21" />
  </Svg>
);
const ContactIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </Svg>
);
const ResumeIcon = () => (
  <Svg>
    <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3.5V8h4.5" />
    <path d="M9 13h6M9 16.5h4" />
  </Svg>
);
const TerminalIcon = () => (
  <Svg>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="m7 9.5 3 2.5-3 2.5M12.5 15h4" />
  </Svg>
);

/* --------------------------------------------------------------- items */

type Item =
  | { kind: "link"; href: string; label: string; icon: ReactNode; external?: boolean; desktopOnly?: boolean }
  | { kind: "terminal" }
  | { kind: "theme" }
  | { kind: "divider"; desktopOnly?: boolean };

const ITEMS: Item[] = [
  { kind: "link", href: "/", label: "Home", icon: <HomeIcon /> },
  { kind: "link", href: "/work", label: "Work", icon: <WorkIcon /> },
  { kind: "link", href: "/experience", label: "Experience", icon: <ExperienceIcon /> },
  { kind: "link", href: "/activity", label: "Activity", icon: <ActivityIcon /> },
  { kind: "link", href: "/gallery", label: "Off the clock", icon: <GalleryIcon /> },
  { kind: "link", href: "/contact", label: "Contact", icon: <ContactIcon /> },
  { kind: "divider", desktopOnly: true },
  { kind: "link", href: profile.links.github, label: "GitHub", icon: <GitHub />, external: true, desktopOnly: true },
  { kind: "link", href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedIn />, external: true, desktopOnly: true },
  { kind: "link", href: profile.links.twitter, label: "X", icon: <XTwitter />, external: true, desktopOnly: true },
  { kind: "divider" },
  ...(profile.links.resume
    ? [{ kind: "link" as const, href: profile.links.resume, label: "Résumé", icon: <ResumeIcon />, external: true }]
    : []),
  { kind: "terminal" },
  { kind: "theme" },
];

/* --------------------------------------------------------------- dock */

const BASE = 40;
const MAX = 60;
const RANGE = 130;

/** Routes rendered for screenshots (the share card), where no chrome should show. */
const BARE = ["/og-preview"];
/** Routes whose <Screen> uses the wide column. */
const WIDE = ["/work", "/gallery"];

/** The slim bar every page shares: name on the left, live IST time on the right. */
export function TopBar() {
  const pathname = usePathname();
  if (BARE.includes(pathname)) return null;
  // Line the bar up with the page below it: Work and Gallery use the wide column.
  const wide = WIDE.some((p) => pathname.startsWith(p));
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "mx-auto flex h-14 items-center justify-between px-5 sm:px-8",
          wide ? "max-w-[64rem]" : "max-w-[52rem]",
        )}
      >
        <Link href="/" className="pointer-events-auto font-mono text-[12.5px] tracking-tight text-fg">
          javin<span className="text-accent">.</span>
        </Link>
        <CalendarButton />
      </div>
    </header>
  );
}

export function Dock() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  /*
   * Magnification without re-rendering: on each animation frame, every icon's
   * size is written straight to a CSS variable from its distance to the
   * pointer (a cosine falloff, like the real dock). Touch screens skip it.
   */
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const x = e.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.querySelectorAll<HTMLElement>(".dock-item").forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(x - (r.left + r.width / 2));
        const k = d > RANGE ? 0 : (1 + Math.cos((d / RANGE) * Math.PI)) / 2;
        el.style.setProperty("--size", `${BASE + (MAX - BASE) * k}px`);
      });
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    ref.current?.querySelectorAll<HTMLElement>(".dock-item").forEach((el) => el.style.removeProperty("--size"));
  };

  if (BARE.includes(pathname)) return null;

  return (
    <>
      <div className="dock-fade" aria-hidden />
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-5"
      >
        <div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="dock flex h-[54px] items-end gap-1 rounded-[18px] border border-line-2 px-2 pb-[6px] sm:gap-1.5"
        >
          {ITEMS.map((item, i) => {
            if (item.kind === "divider") {
              return (
                <span
                  key={`d${i}`}
                  aria-hidden
                  className={cn("mx-0.5 mb-2 h-7 w-px self-end bg-line-2", item.desktopOnly && "hidden sm:block")}
                />
              );
            }
            if (item.kind === "terminal") {
              return (
                <DockButton key="terminal" label="Terminal  ⌘K" onClick={() => openTerminal()} id="terminal-trigger">
                  <TerminalIcon />
                </DockButton>
              );
            }
            if (item.kind === "theme") return <ThemeButton key="theme" />;

            const active = !item.external && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
            return (
              <Tip key={item.href} label={item.label} className={cn(item.desktopOnly && "hidden sm:block")}>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "dock-item grid place-items-center rounded-full",
                    active ? "bg-bg-2 text-fg" : "text-fg-3 hover:bg-bg-2 hover:text-fg",
                  )}
                >
                  {item.icon}
                </Link>
                {/* macOS-style "running" dot under the current section */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-[5px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </Tip>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function Tip({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("group/tip relative", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-line-2 bg-bg-1 px-2 py-0.5 font-mono text-[10.5px] text-fg-2 opacity-0 shadow-lg transition-all duration-200 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

function DockButton({
  label,
  onClick,
  children,
  id,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tip label={label}>
      <button
        id={id}
        type="button"
        onClick={onClick}
        aria-label={label}
        className="dock-item grid place-items-center rounded-full text-fg-3 hover:bg-bg-2 hover:text-fg"
      >
        {children}
      </button>
    </Tip>
  );
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function ThemeButton() {
  const light = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("light"),
    () => false,
  );
  return (
    <DockButton label={light ? "Dark mode" : "Light mode"} onClick={() => setTheme(!light)}>
      {light ? <Moon /> : <Sun />}
    </DockButton>
  );
}
