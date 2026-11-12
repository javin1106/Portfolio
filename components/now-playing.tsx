"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDuration, timeAgo } from "@/lib/client";
import type { NowPlaying as Data } from "@/lib/spotify";
import { cn } from "@/lib/utils";
import { useNow } from "./clock";

const POLL = 30_000;

/** What the API returned, plus when *this browser* received it (immune to clock skew). */
type Received = Data & { receivedAt: number };

export function NowPlaying({ className }: { className?: string }) {
  const [data, setData] = useState<Received | null>(null);
  /** The embed URL the visitor chose to play, or null when the player is closed. */
  const [embed, setEmbed] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const poll = async () => {
      if (document.hidden) {
        timer = setTimeout(poll, POLL);
        return;
      }
      try {
        const res = await fetch("/api/now-playing");
        const next = (await res.json()) as Data;
        if (!alive) return;
        setData({ ...next, receivedAt: Date.now() });

        // If the song ends before the next regular poll, check right after it.
        let delay = POLL;
        if (next.isPlaying && next.track && next.progressMs !== null) {
          delay = Math.min(POLL, next.track.durationMs - next.progressMs + 1500);
        }
        timer = setTimeout(poll, Math.max(delay, 5000));
      } catch {
        timer = setTimeout(poll, POLL * 2);
      }
    };

    void poll();
    const onVisible = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        void poll();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (data && !data.configured) {
    return process.env.NODE_ENV === "development" ? (
      <p className={cn("font-mono text-[11px] text-fg-4", className)}>
        ♫ spotify not connected — run <span className="text-fg-3">npm run spotify:token</span>
      </p>
    ) : null;
  }

  if (!data) {
    return (
      <div
        className={cn("h-[74px] animate-pulse rounded-xl border border-dashed border-line-2", className)}
        aria-hidden
      />
    );
  }

  if (!data.track) return null;

  const { track, isPlaying } = data;
  const elapsed = now !== null && isPlaying ? now - data.receivedAt : 0;
  const progress =
    data.progressMs !== null ? Math.min(data.progressMs + elapsed, track.durationMs) : null;

  const embeddable = embedFor(track.url);
  const isOpen = embed !== null;

  return (
    <div
      className={cn(
        "group rounded-xl border border-line bg-[color-mix(in_oklab,var(--bg-1)_60%,transparent)] transition-colors duration-500 hover:border-line-2",
        className,
      )}
    >
    <div className="relative flex items-center gap-4 p-2.5 pr-4">
      <button
        type="button"
        onClick={() => setEmbed(isOpen ? null : embeddable)}
        disabled={!embeddable}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close player" : `Play ${track.title} here`}
        className="group/cover relative h-[54px] w-[54px] shrink-0 disabled:cursor-default"
      >
        {track.art ? (
          <>
            {/* The cover, blurred, as a soft halo behind itself */}
            <Image
              src={track.art}
              alt=""
              fill
              unoptimized
              aria-hidden
              className="scale-125 rounded-md opacity-50 blur-xl transition-opacity duration-700 group-hover:opacity-80"
            />
            <Image
              src={track.art}
              alt={`${track.album} cover`}
              fill
              unoptimized
              className="rounded-md object-cover shadow-[0_6px_20px_-6px_rgb(0_0_0/0.6)]"
            />
          </>
        ) : (
          <div className="h-full w-full rounded-md bg-bg-2" />
        )}
        {embeddable ? (
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 grid place-items-center rounded-md bg-black/45 text-[15px] text-white backdrop-blur-[1px] transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100",
            )}
          >
            {isOpen ? "✕" : "▶"}
          </span>
        ) : null}
      </button>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg-4">
          <span className="eq flex h-[11px] items-end gap-[2px]" data-paused={!isPlaying} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          {isPlaying
            ? "Now playing"
            : data.playedAt
              ? `Last played · ${timeAgo(data.playedAt, now ?? data.receivedAt)}`
              : "Paused"}
          <a
            href={track.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto normal-case tracking-normal text-fg-4 transition-colors hover:text-accent"
          >
            Spotify ↗
          </a>
        </p>
        <p className="mt-0.5 truncate text-[14px] leading-snug text-fg">{track.title}</p>
        <p className="truncate text-[12.5px] leading-snug text-fg-3">{track.artist}</p>

        {progress !== null ? (
          <div className="mt-1.5 flex items-center gap-2.5" aria-hidden>
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--heat-0)]">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
                style={{ width: `${(progress / track.durationMs) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[9.5px] tabular-nums text-fg-4">
              {formatDuration(progress)} / {formatDuration(track.durationMs)}
            </span>
          </div>
        ) : null}
      </div>
    </div>

      {/*
        Spotify's own player, mounted only after a click: nothing from Spotify
        (script, cookies) loads for visitors who never press play. It holds on
        to the song that was clicked, even if the live card moves on.
      */}
      <div className="expand" data-open={isOpen}>
        <div>
          {embed ? (
            <div className="px-2.5 pb-2.5">
              <iframe
                key={embed}
                src={embed}
                title={`Spotify player — ${track.title}`}
                className="block h-[80px] w-full rounded-[10px] border-0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <p className="mt-1.5 px-0.5 font-mono text-[9.5px] text-fg-4">
                full track if you’re logged in to Spotify · 30s preview otherwise
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** open.spotify.com/track/ID → the embeddable player URL for the same item. */
function embedFor(url: string) {
  const match = url.match(/open\.spotify\.com\/(track|episode)\/([A-Za-z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator` : null;
}
