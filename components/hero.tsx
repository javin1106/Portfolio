import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { GitHub, LeetCode, LinkedIn, Mail, XTwitter } from "./icons";

const socials = [
  { href: profile.links.github, label: "GitHub", Icon: GitHub },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedIn },
  { href: profile.links.twitter, label: "X", Icon: XTwitter },
  { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCode },
  { href: profile.links.email, label: "Email", Icon: Mail },
];

/** Delay helper so the entrance reads as one continuous movement. */
const step = (i: number) => ({ animationDelay: `${140 + i * 95}ms` });

export function Hero() {
  return (
    <header className="relative isolate">
      {/* Photograph */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={profile.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
          style={{ objectPosition: profile.hero.position }}
        />
        {/* Flat darkening keeps the type legible in both themes … */}
        <div className="absolute inset-0 bg-black/58" />
        {/* … and this dissolves the photograph into the page background. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(0 0 0 / 0.35) 0%, transparent 28%, transparent 52%, var(--bg) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 30%, transparent 40%, rgb(0 0 0 / 0.4) 100%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[92svh] max-w-3xl flex-col justify-end px-6 pb-24 pt-32 sm:px-8 sm:pb-28">
        <p className="rise label !text-[color:rgb(245_240_232/0.62)]" style={step(0)}>
          {profile.role}
        </p>

        <h1
          className="rise serif mt-3 text-[clamp(2.75rem,10.5vw,5.25rem)] leading-[0.95] text-[#f6f1ea]"
          style={step(1)}
        >
          {profile.name}
        </h1>

        {/* Metadata strip — the small mono keys are the site's signature */}
        <dl
          className="rise mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[rgb(245_240_232/0.14)] py-5 sm:grid-cols-3"
          style={step(2)}
        >
          <Meta label="Location" value={profile.location} />
          <Meta
            label="Email"
            value={profile.email}
            href={profile.links.email}
          />
          <Meta label="Status" value={profile.availability} accent />
        </dl>

        <p
          className="rise mt-8 max-w-[58ch] text-[15px] leading-[1.75] text-[rgb(245_240_232/0.82)]"
          style={step(3)}
        >
          {profile.bio.map((seg, i) =>
            seg.href ? (
              <Link
                key={i}
                href={seg.href}
                target={seg.href.startsWith("http") ? "_blank" : undefined}
                rel={seg.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-[#f6f1ea] underline decoration-[rgb(224_133_86/0.85)] decoration-1 underline-offset-[3px] transition-colors duration-300 hover:text-[#e08556]"
              >
                {seg.text}
              </Link>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>

        <div className="rise mt-9 flex flex-wrap items-center gap-1" style={step(4)}>
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              className="group grid h-9 w-9 place-items-center rounded-md text-[rgb(245_240_232/0.6)] transition-all duration-300 hover:bg-[rgb(245_240_232/0.09)] hover:text-[#f6f1ea]"
            >
              <Icon className="h-[15px] w-[15px] transition-transform duration-300 group-hover:-translate-y-px" />
            </a>
          ))}

          <span className="mx-2 h-4 w-px bg-[rgb(245_240_232/0.18)]" />

          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 rounded-md border border-[rgb(245_240_232/0.2)] px-3.5 py-1.5 font-mono text-[11px] tracking-tight text-[rgb(245_240_232/0.85)] transition-all duration-300 hover:border-[rgb(245_240_232/0.45)] hover:text-[#f6f1ea]"
          >
            Résumé
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>

      {profile.hero.credit ? (
        <a
          href={profile.hero.creditHref}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-6 right-5 font-mono text-[9.5px] tracking-wide text-[rgb(245_240_232/0.25)] transition-colors hover:text-[rgb(245_240_232/0.6)] sm:right-7"
        >
          {profile.hero.credit}
        </a>
      ) : null}
    </header>
  );
}

function Meta({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string;
  href?: string;
  accent?: boolean;
}) {
  const body = (
    <span
      className={
        accent
          ? "text-[13px] text-[#e5a077]"
          : "text-[13px] text-[rgb(245_240_232/0.88)]"
      }
    >
      {value}
    </span>
  );

  return (
    <div className="min-w-0">
      <dt className="label mb-1.5 !text-[9.5px] !text-[color:rgb(245_240_232/0.45)]">
        {label}
      </dt>
      <dd className="truncate">
        {href ? (
          <a
            href={href}
            className="text-[13px] text-[rgb(245_240_232/0.88)] transition-colors duration-300 hover:text-[#e08556]"
          >
            {value}
          </a>
        ) : (
          body
        )}
      </dd>
    </div>
  );
}
