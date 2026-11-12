import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import type { Slide } from "@/lib/banner";
import type { LatestPush } from "@/lib/github";
import { Banner } from "./banner";
import { Clock } from "./clock";
import { NameCycle } from "./name-cycle";
import { NowPlaying } from "./now-playing";
import { Skills } from "./skills";
import { TimeAgo } from "./time-ago";

/** Each line comes into focus a beat after the last. */
const step = (i: number) => ({ animationDelay: `${120 + i * 90}ms` });

const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/108410532?v=4";

type Props = { push: LatestPush | null; slides: Slide[]; photo: Slide | null };

export function Hero({ push, slides, photo }: Props) {
  return (
    <div id="top">
      {slides.length ? (
        <div className="rise" style={step(0)}>
          <Banner slides={slides} />
        </div>
      ) : null}

      {/* Profile photo, overlapping the banner like a social profile header */}
      <div className={slides.length ? "rise relative z-10 -mt-11 ml-5" : "rise"} style={step(1)}>
        <span className="relative block h-[88px] w-[88px] overflow-hidden rounded-full border-[5px] border-bg bg-bg-2 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)]">
          <Image
            src={photo?.src ?? GITHUB_AVATAR}
            alt={profile.name}
            fill
            priority
            sizes="88px"
            placeholder={photo ? "blur" : "empty"}
            blurDataURL={photo?.blur}
            className="object-cover"
          />
        </span>
      </div>

      <p
        className="rise rise-focus mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-tight text-fg-3"
        style={step(2)}
      >
        <span className="live-dot" aria-hidden />
        <span className="text-fg-2">{profile.availability}</span>
        <span className="text-fg-4">/</span>
        <span>{profile.location.split(" · ")[0]}</span>
        <span className="text-fg-4">/</span>
        <span>
          <Clock /> IST
        </span>
      </p>

      <h1 className="rise rise-focus serif mt-3 text-[clamp(2.7rem,8.5vw,4.4rem)] leading-[0.98] text-fg" style={step(3)}>
        <NameCycle />
      </h1>

      <p className="rise rise-focus mt-3 max-w-[44ch] text-[clamp(1rem,2.4vw,1.12rem)] leading-[1.55] text-fg-2" style={step(4)}>
        {profile.pitch.map((seg, i) =>
          seg.href ? (
            <a key={i} href={seg.href} target="_blank" rel="noreferrer" className="link">
              {seg.text}
            </a>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      {/* Two clear next steps. Socials live in the dock (desktop) and on Contact. */}
      <div className="rise mt-5 flex flex-wrap items-center gap-2.5" style={step(5)}>
        {profile.links.resume ? (
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 font-mono text-[11.5px] tracking-tight text-bg transition-colors duration-300 hover:bg-fg-2"
          >
            Résumé
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px">
              ↗
            </span>
          </a>
        ) : null}
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 font-mono text-[11.5px] tracking-tight text-fg-2 transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          Get in touch
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="rise mt-6 max-w-[34rem]" style={step(6)}>
        <NowPlaying />
        <p className="mt-2.5 flex flex-wrap gap-x-2 font-mono text-[10.5px] text-fg-4">
          {push ? (
            <>
              <span>
                last commit →{" "}
                <a href={push.url} target="_blank" rel="noreferrer" className="link-quiet !text-fg-3">
                  {push.repo}
                </a>{" "}
                <TimeAgo iso={push.at} />
              </span>
            </>
          ) : null}
        </p>
      </div>

      <div className="rise mt-5" style={step(7)}>
        <Skills />
      </div>
    </div>
  );
}
