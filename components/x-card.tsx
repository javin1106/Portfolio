"use client";

import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { XTwitter } from "./icons";

/**
 * Your X profile as a physical card: it tilts toward the pointer and a soft
 * glare follows it, like light on a glossy print. All motion is written to
 * CSS variables on one element, so React never re-renders while you hover.
 */
export function XCard() {
  const card = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0 → 1
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--glare", "1");
  };
  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    ["--rx", "--ry", "--glare"].forEach((p) => el.style.removeProperty(p));
  };

  const { x } = profile;

  return (
    <a
      href={profile.links.twitter}
      target="_blank"
      rel="noreferrer"
      className="block [perspective:900px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`${x.name} on X (@${x.handle})`}
    >
      <div
        ref={card}
        className="relative overflow-hidden rounded-2xl border border-line-2 bg-bg-1 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transition:transform_0.5s_var(--ease-soft)]"
      >
        {/* Banner */}
        <div className="dotgrid relative h-20 border-b border-line bg-bg-2">
          <XTwitter className="absolute right-4 top-4 h-4 w-4 text-fg-3" />
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-8 flex items-end justify-between">
            <span className="relative block h-16 w-16 overflow-hidden rounded-full border-4 border-bg-1 bg-bg-2">
              <Image
                src="https://avatars.githubusercontent.com/u/108410532?v=4"
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <span className="mb-1 rounded-full bg-fg px-3.5 py-1.5 text-[12px] font-semibold text-bg">Follow</span>
          </div>
          <p className="mt-3 text-[16px] font-semibold leading-tight text-fg">{x.name}</p>
          <p className="text-[13px] text-fg-3">@{x.handle}</p>
          <p className="mt-3 text-[13.5px] leading-[1.6] text-fg-2">{x.bio}</p>
        </div>

        {/* Glare that tracks the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[var(--glare,0)] mix-blend-overlay [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.35),transparent_55%)] [transition:opacity_0.4s]"
        />
      </div>
    </a>
  );
}
