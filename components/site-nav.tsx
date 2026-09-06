"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { nav, profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "./icons";

const SECTION_IDS = ["work", "experience", "stats", "now", "contact"];

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(!isHome);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /* Chrome state: hairline + blur once you leave the very top. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(!isHome || window.scrollY > window.innerHeight * 0.62);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* Active anchor highlight, home page only. */
  useEffect(() => {
    if (!isHome) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (onScreen[0]) setActive(onScreen[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  /* Lock the page while the mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      if (href.startsWith("/#")) return isHome && active === href.slice(2);
      return pathname === href;
    },
    [active, isHome, pathname],
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-bg/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-6 sm:px-8">
          {/* Identity — stays out of the way until the hero has scrolled past */}
          <Link
            href="/"
            aria-label={profile.name}
            className={cn(
              "font-mono text-[12.5px] tracking-tight text-fg transition-all duration-500",
              pastHero ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            )}
          >
            {profile.name.toLowerCase().replace(" ", "")}
            <span className="text-accent">.</span>
          </Link>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center gap-1 sm:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block px-2.5 py-1.5 font-mono text-[11.5px] tracking-tight transition-colors duration-300",
                      isActive(item.href)
                        ? "text-fg"
                        : "text-fg-3 hover:text-fg",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-2.5 -bottom-px h-px origin-left bg-accent transition-transform duration-400 ease-[var(--ease-out-expo)]",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="ml-0.5 grid h-8 w-8 place-items-center rounded-md text-fg-2 transition-colors hover:bg-bg-1 hover:text-fg sm:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300 ease-[var(--ease-out-expo)]",
                    open ? "top-1.5 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px bg-current transition-all duration-300 ease-[var(--ease-out-expo)]",
                    open ? "top-1.5 w-4 -rotate-45" : "top-2.5 w-3",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl transition-opacity duration-400 sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      >
        <ul className="flex flex-col gap-1 px-8 pt-24">
          {nav.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block border-b border-line py-4 font-serif text-2xl transition-all duration-500 ease-[var(--ease-out-expo)]",
                  isActive(item.href) ? "text-accent" : "text-fg",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * The `light` class on <html> is the source of truth — an inline script in the
 * document head sets it before first paint. Subscribing to it rather than
 * mirroring it into state keeps the two from ever disagreeing.
 */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const readTheme = () => document.documentElement.classList.contains("light");
const readThemeOnServer = () => false; // dark is the default

function ThemeToggle() {
  const light = useSyncExternalStore(subscribeToTheme, readTheme, readThemeOnServer);

  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      /* private mode — the choice just won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className="grid h-8 w-8 place-items-center rounded-md text-fg-3 transition-colors duration-300 hover:bg-bg-1 hover:text-fg"
    >
      <span className="relative block h-4 w-4">
        <Sun
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-500 ease-[var(--ease-out-expo)]",
            light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-500 ease-[var(--ease-out-expo)]",
            !light ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0",
          )}
        />
      </span>
    </button>
  );
}
