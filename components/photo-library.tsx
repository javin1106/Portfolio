"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Close } from "./icons";

/*
 * An iOS Photos-style library: a tight square grid grouped by month, and a
 * viewer that *zooms out of the thumbnail you tapped* — the same box animates
 * from the grid cell's rectangle to the photo's full-size rectangle, while
 * object-fit: cover un-crops it on the way.
 */

type Rect = { left: number; top: number; width: number; height: number };

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function groupByMonth(photos: Photo[]) {
  const groups: { label: string; items: { photo: Photo; index: number }[] }[] = [];
  photos.forEach((photo, index) => {
    const label = photo.date ? MONTH.format(new Date(`${photo.date}T00:00:00`)) : "Earlier";
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push({ photo, index });
    else groups.push({ label, items: [{ photo, index }] });
  });
  return groups;
}

/** Where a photo of this size sits when fitted into the viewer's stage. */
function fitRect(photo: Photo): Rect {
  const top = 64;
  const bottom = 96;
  const side = window.innerWidth < 640 ? 0 : 72;
  const W = window.innerWidth - side * 2;
  const H = window.innerHeight - top - bottom;
  const scale = Math.min(W / photo.width, H / photo.height);
  const width = photo.width * scale;
  const height = photo.height * scale;
  return { left: (window.innerWidth - width) / 2, top: top + (H - height) / 2, width, height };
}

const toKeyframe = (r: Rect) => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

export function PhotoLibrary({ photos }: { photos: Photo[] }) {
  const groups = useMemo(() => groupByMonth(photos), [photos]);
  const [index, setIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const zoomFrom = useRef<Rect | null>(null);

  const open = index !== null;
  const photo = open ? photos[index] : null;

  const cellRect = (i: number): Rect | null => {
    const el = cells.current[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return null;
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const openAt = (i: number) => {
    zoomFrom.current = cellRect(i);
    setIndex(i);
  };

  /* Zoom in from the cell when opening. */
  useEffect(() => {
    if (index === null || !box.current || !zoomFrom.current) return;
    const from = zoomFrom.current;
    zoomFrom.current = null;
    box.current.animate([toKeyframe(from), toKeyframe(fitRect(photos[index]))], {
      duration: 420,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
  }, [index, photos]);

  const close = useCallback(() => {
    if (index === null || closing) return;
    const target = cellRect(index);
    setClosing(true);
    const done = () => {
      setClosing(false);
      setIndex(null);
    };
    if (target && box.current) {
      box.current
        .animate([toKeyframe(fitRect(photos[index])), toKeyframe(target)], {
          duration: 360,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        })
        .finished.then(done, done);
    } else {
      setTimeout(done, 250);
    }
  }, [index, closing, photos]);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  /* Keyboard + scroll lock while the viewer is up. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  /* Keep the active thumbnail centred in the strip. */
  useEffect(() => {
    if (index === null) return;
    strip.current
      ?.querySelector<HTMLElement>(`[data-i="${index}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  /* Swipe: the photo follows your finger, and lets go past 60px. */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null) setDrag(e.clientX - dragStart.current);
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    if (drag < -60) step(1);
    else if (drag > 60) step(-1);
    dragStart.current = null;
    setDragging(false);
    setDrag(0);
  };

  return (
    <>
      <div className="-mx-5 sm:mx-0">
        {groups.map((group) => (
          <section key={group.label} className="mb-6">
            <h2 className="sticky top-14 z-10 bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] px-5 py-2.5 text-[15px] font-semibold tracking-tight text-fg backdrop-blur-md sm:px-0">
              {group.label}
              <span className="ml-2 font-mono text-[10.5px] font-normal text-fg-4">{group.items.length}</span>
            </h2>
            <div className="grid grid-cols-3 gap-[2px] sm:grid-cols-4 sm:gap-1 lg:grid-cols-5">
              {group.items.map(({ photo: p, index: i }) => (
                <button
                  key={p.src}
                  ref={(el) => {
                    cells.current[i] = el;
                  }}
                  type="button"
                  onClick={() => openAt(i)}
                  aria-label={`Open ${p.caption || "photo"}`}
                  className={cn(
                    "photo-cell relative aspect-square overflow-hidden bg-bg-2 sm:rounded-[3px]",
                    open && i === index && "opacity-0",
                  )}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 33vw"
                    placeholder="blur"
                    blurDataURL={p.blur}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {photo ? (
        <div
          className="fixed inset-0 z-[70] select-none"
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption || "Photo"}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black transition-opacity duration-300",
              closing ? "opacity-0" : "opacity-100",
            )}
            style={{ animation: closing ? undefined : "fade-in 300ms ease both" }}
            onClick={close}
          />

          {/* Top bar: date/caption like iOS, count, close */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 flex h-16 items-center justify-between px-4 text-white transition-opacity duration-300 sm:px-6",
              closing ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="min-w-0">
              {photo.date ? (
                <p className="text-[14px] font-semibold">{DAY.format(new Date(`${photo.date}T00:00:00`))}</p>
              ) : null}
              <p className="font-mono text-[10.5px] text-white/50">
                {index! + 1} of {photos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>

          {/* The photo box — this is what zooms between grid and viewer */}
          <div
            ref={box}
            className="absolute touch-none overflow-hidden"
            style={{
              ...toKeyframe(fitRect(photo)),
              translate: `${drag}px 0`,
              transition: dragging ? "none" : "translate 0.3s cubic-bezier(0.2,0.8,0.2,1)",
              borderRadius: closing ? 3 : 0,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={photo.blur}
              draggable={false}
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/10 p-2.5 text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white sm:grid"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/10 p-2.5 text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white sm:grid"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* iOS-style scrubber */}
          <div
            ref={strip}
            className={cn(
              "absolute inset-x-0 bottom-5 flex justify-start gap-[3px] overflow-x-auto px-[50vw] transition-opacity duration-300 [scrollbar-width:none]",
              closing ? "opacity-0" : "opacity-100",
            )}
          >
            {photos.map((p, i) => (
              <button
                key={p.src}
                data-i={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                className={cn(
                  "relative h-11 shrink-0 overflow-hidden rounded-[3px] transition-[width,opacity] duration-300 ease-[var(--ease-soft)]",
                  i === index ? "w-16 opacity-100" : "w-7 opacity-60 hover:opacity-90",
                )}
              >
                <Image src={p.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
