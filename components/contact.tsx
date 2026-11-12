import { profile } from "@/content/profile";
import { CopyEmail } from "./copy-email";
import { GitHub, LeetCode, LinkedIn } from "./icons";
import { Reveal } from "./reveal";
import { XCard } from "./x-card";
import { XPosts } from "./x-posts";

// X has its own card beside this list.
const socials = [
  { href: profile.links.github, label: "GitHub", handle: `@${profile.github}`, Icon: GitHub },
  { href: profile.links.linkedin, label: "LinkedIn", handle: "in/javin-chutani", Icon: LinkedIn },
  { href: profile.links.leetcode, label: "LeetCode", handle: `@${profile.leetcode}`, Icon: LeetCode },
];

export function Contact() {
  return (
    <div>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_300px]">
        <div>
          <Reveal>
            <p className="serif max-w-[16ch] text-[clamp(2rem,6.5vw,3.1rem)] leading-[1.06] text-fg">
              Get in touch.
            </p>
          </Reveal>

          <Reveal delay={70}>
            <p className="mt-5 max-w-[50ch] text-[14px] leading-[1.75] text-fg-3">
              I’m {profile.availability.toLowerCase()} in backend and AI engineering. Email is the
              best way to reach me. You can also press{" "}
              <kbd>⌘K</kbd> to open the terminal and look around.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <CopyEmail />
          </Reveal>

          <Reveal delay={200}>
            <ul className="mt-7 grid max-w-[26rem] gap-0.5">
              {socials.map(({ href, label, handle, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group -mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] text-fg-2 transition-colors duration-300 hover:bg-bg-1 hover:text-fg"
                  >
                    <Icon className="h-[14px] w-[14px] text-fg-3 transition-colors duration-300 group-hover:text-accent" />
                    <span>{label}</span>
                    <span className="ml-auto font-mono text-[11px] text-fg-4">{handle}</span>
                    <span className="text-fg-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <XCard />
        </Reveal>
      </div>

      <Reveal delay={240}>
        <div className="mt-12">
          <XPosts />
        </div>
      </Reveal>
    </div>
  );
}
