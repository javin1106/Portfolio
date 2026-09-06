"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/content/profile";
import { Reveal } from "./reveal";
import { ChevronLeft, ChevronRight, Close } from "./icons";

export function GalleryGrid() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? null : (current + delta + gallery.length) % gallery.length,
      ),
    [],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const active = open === null ? null : gallery[open];

  return (
    <>
      <div className="collage">
        {gallery.map((item, i) => (
          <Reveal key={item.src} delay={(i % 3) * 70}>
            <figure
              className="plate"
              tabIndex={0}
              role="button"
              aria-label={`Open ${item.caption}`}
              onClick={() => setOpen(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setOpen(i);
                }
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={Math.round(1200 / item.ratio)}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="font-mono text-[10.5px] tracking-tight">
                {item.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black/94 backdrop-blur-sm"
          style={{ animation: "fade-in 260ms var(--ease-out-expo)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <p className="font-mono text-[11px] tracking-tight text-white/55 tabular-nums">
              {String((open ?? 0) + 1).padStart(2, "0")}
              <span className="text-white/25"> / {String(gallery.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>

          <div
            className="relative flex-1 px-5 pb-2 sm:px-16"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              priority
              className="object-contain"
              style={{ animation: "fade-in 400ms var(--ease-out-expo)" }}
            />

            <Arrow side="left" onClick={() => step(-1)} />
            <Arrow side="right" onClick={() => step(1)} />
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <p className="font-mono text-[11px] tracking-tight text-white/70">{active.caption}</p>
            {active.href ? (
              <a
                href={active.href}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="font-mono text-[10px] tracking-tight text-white/35 transition-colors hover:text-white/75"
              >
                Unsplash ↗
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-white/15 p-2.5 text-white/60 transition-all duration-300 hover:border-white/40 hover:text-white sm:grid ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
