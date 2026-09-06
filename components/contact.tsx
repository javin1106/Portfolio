import { profile } from "@/content/profile";
import { Reveal } from "./reveal";
import { GitHub, LeetCode, LinkedIn, XTwitter } from "./icons";

const socials = [
  { href: profile.links.github, label: "GitHub", Icon: GitHub },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedIn },
  { href: profile.links.twitter, label: "X", Icon: XTwitter },
  { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCode },
];

export function Contact() {
  return (
    <div className="-mt-1">
      <Reveal>
        <p className="serif max-w-[20ch] text-[clamp(1.9rem,6vw,2.9rem)] leading-[1.12] text-fg">
          Let’s build something that has to stay up.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <p className="mt-5 max-w-[54ch] text-[14px] leading-[1.7] text-fg-3">
          I’m {profile.availability.toLowerCase()}, and I answer every email that isn’t a
          template. Systems work, backend roles, or an argument about event loops — all
          welcome.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <a href={profile.links.email} className="group mt-8 inline-block">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[clamp(0.95rem,3.4vw,1.2rem)] tracking-tight text-fg transition-colors duration-400 group-hover:text-accent">
              {profile.email}
            </span>
            <span className="inline-block text-accent opacity-0 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:opacity-100">
              →
            </span>
          </span>
          <span className="mt-1.5 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
        </a>
      </Reveal>

      <Reveal delay={200}>
        <ul className="mt-9 flex flex-wrap items-center gap-x-1 gap-y-2">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-[11.5px] tracking-tight text-fg-3 transition-colors duration-300 hover:bg-bg-1 hover:text-fg"
              >
                <Icon className="h-[13px] w-[13px] transition-transform duration-300 group-hover:-translate-y-px" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pt-7 pb-14">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-[10.5px] tracking-tight text-fg-4">
          © {new Date().getFullYear()} {profile.name} · {profile.timezone}
        </p>
        <p className="font-mono text-[10.5px] tracking-tight text-fg-4">
          Next.js · Tailwind ·{" "}
          <a
            href={`${profile.links.github}/Portfolio`}
            target="_blank"
            rel="noreferrer"
            className="link-quiet !text-fg-4"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
