"use client";

import Image from "next/image";
import { useState } from "react";
import type { Slide } from "@/lib/banner";
import { cn } from "@/lib/utils";
import { setSlide, useSlide } from "./palette-cycler";

export function Banner({ slides }: { slides: Slide[] }) {
  const index = useSlide() % Math.max(slides.length, 1);

  // Only photos that have been (or are about to be) shown are in the DOM, so
  // landing on Home decodes one image, not all of them at once.
  const next = (index + 1) % slides.length;
  const [seen, setSeen] = useState<Set<number>>(() => new Set([index, next]));
  if (!seen.has(index) || !seen.has(next)) {
    setSeen(new Set([...seen, index, next]));
  }

  return (
    <div className="relative h-40 overflow-hidden rounded-2xl border border-line-2 bg-bg-2 sm:h-[11.25rem]">
      {slides.map((slide, i) =>
        seen.has(i) ? (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-[var(--ease-soft)]"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {/* Each slide drifts on its own slow loop and pauses (rather than
              resetting) while hidden, so nothing ever snaps back. */}
          <div
            className="kenburns absolute inset-0"
            data-active={i === index}
            style={{ animationDelay: `${-i * 4}s` }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === index}
              sizes="(min-width: 640px) 46rem, 100vw"
              placeholder="blur"
              blurDataURL={slide.blur}
              className="object-cover"
            />
          </div>
        </div>
        ) : null,
      )}

      {/* Soft fade into the page at the bottom, under the avatar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />

      {slides.length > 1 ? (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-md">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Show banner photo ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-soft)]",
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
