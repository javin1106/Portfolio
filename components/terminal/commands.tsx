"use client";

import type { ReactNode } from "react";
import { experience, hobbies, profile, projects, stack } from "@/content/profile";
import { composeEmail, formatDuration, isLight, replayIntro, setTheme, timeAgo } from "@/lib/client";
import type { NowPlaying } from "@/lib/spotify";

export type Ctx = {
  navigate: (href: string) => void;
  close: () => void;
  clear: () => void;
};

type Output = ReactNode | Promise<ReactNode>;
type Command = { help: string; run: (args: string[], ctx: Ctx) => Output; hidden?: boolean };

const SECTIONS = ["work", "experience", "activity", "gallery", "contact"];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    className="text-fg underline decoration-[var(--accent)] decoration-1 underline-offset-[3px] hover:text-accent"
  >
    {children}
  </a>
);

const Dim = ({ children }: { children: ReactNode }) => <span className="text-fg-4">{children}</span>;
const Hi = ({ children }: { children: ReactNode }) => <span className="text-fg">{children}</span>;

function findProject(query: string) {
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  return projects.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(q));
}

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

type Activity = {
  github: { total: number; repos: number | null; stars: number | null; followers: number | null } | null;
  push: { repo: string; url: string; at: string } | null;
  leetcode: {
    total: number;
    ranking: number | null;
    buckets: { difficulty: string; solved: number; available: number }[];
  } | null;
};

export const commands: Record<string, Command> = {
  help: {
    help: "list commands",
    run: () => (
      <div className="grid grid-cols-[max-content_1fr] gap-x-6">
        {Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => (
            <div key={name} className="contents">
              <Hi>{name}</Hi>
              <Dim>{c.help}</Dim>
            </div>
          ))}
      </div>
    ),
  },

  whoami: {
    help: "the short version",
    run: () => (
      <div>
        <Hi>{profile.name}</Hi> <Dim>—</Dim> {profile.role.toLowerCase()}
        <br />
        <Dim>{profile.pitch.map((seg) => seg.text).join("")}</Dim>
      </div>
    ),
  },

  about: {
    help: "the slightly longer version",
    run: () => <p className="max-w-[60ch]">{profile.bio.map((s) => s.text).join("")}</p>,
  },

  ls: {
    help: "list sections",
    run: () => (
      <div className="flex flex-wrap gap-x-5">
        {SECTIONS.map((s) => (
          <Hi key={s}>{s}/</Hi>
        ))}
        <span className="text-accent">resume.pdf</span>
      </div>
    ),
  },

  cd: {
    help: "jump to a section — cd work",
    run: ([target], ctx) => {
      const t = (target ?? "~").replace(/\/$/, "").toLowerCase();
      if (t === "~" || t === "/" || t === "..") {
        ctx.close();
        ctx.navigate("/");
        return null;
      }
      if (SECTIONS.includes(t)) {
        ctx.close();
        ctx.navigate(`/${t}`);
        return null;
      }
      return <span>cd: no such directory: {target}</span>;
    },
  },

  projects: {
    help: "what I've built — projects <name> for detail",
    run: ([name]) => {
      if (name) {
        const p = findProject(name);
        if (!p) return <span>projects: nothing called “{name}”. try `projects`.</span>;
        return (
          <div className="space-y-1.5">
            <p>
              <Hi>{p.name}</Hi> <Dim>· {p.year} · {p.status}</Dim>
            </p>
            <p className="max-w-[64ch]">{p.blurb}</p>
            <p>
              <Dim>stack:</Dim> {p.stack.join(", ")}
            </p>
            <p className="flex gap-4">
              {p.repo ? <A href={p.repo}>source ↗</A> : null}
              {p.live ? <A href={p.live}>live ↗</A> : null}
            </p>
          </div>
        );
      }
      return (
        <div className="grid grid-cols-[max-content_1fr] gap-x-5">
          {projects.map((p) => (
            <div key={p.name} className="contents">
              <Hi>{p.name.toLowerCase().replace(/\s+/g, "-")}</Hi>
              <Dim>{p.summary}</Dim>
            </div>
          ))}
        </div>
      );
    },
  },

  open: {
    help: "open a project — open flokidb",
    run: ([name]) => {
      const p = name ? findProject(name) : undefined;
      const href = p?.live ?? p?.repo;
      if (!p || !href) return <span>open: which one? try `projects`.</span>;
      window.open(href, "_blank", "noopener");
      return <Dim>opening {p.name}…</Dim>;
    },
  },

  experience: {
    help: "where I've worked",
    run: () => (
      <div className="space-y-2">
        {experience.map((job) => (
          <div key={job.org}>
            <Hi>{job.role}</Hi> <Dim>@</Dim> {job.org}
            <br />
            <Dim>{job.period}</Dim>
          </div>
        ))}
      </div>
    ),
  },

  stack: {
    help: "tools I reach for",
    run: () => (
      <div className="grid grid-cols-[max-content_1fr] gap-x-5">
        {Object.entries(stack).map(([group, items]) => (
          <div key={group} className="contents">
            <Hi>{group.toLowerCase()}</Hi>
            <Dim>{items.join(" · ")}</Dim>
          </div>
        ))}
      </div>
    ),
  },

  hobbies: {
    help: "what I do away from the keyboard",
    run: () => (
      <div>
        {hobbies.map((h) => (
          <div key={h.title}>
            <span className="text-accent">{h.title.toLowerCase().padEnd(13)}</span>
            {h.note ?? ""}
          </div>
        ))}
      </div>
    ),
  },

  music: {
    help: "what I'm listening to, live",
    run: async () => {
      const np = await getJSON<NowPlaying>("/api/now-playing");
      if (!np?.configured) return <Dim>spotify isn’t connected yet.</Dim>;
      if (!np.track) return <Dim>silence. nothing played recently.</Dim>;
      const t = np.track;
      return (
        <div>
          <span className="text-accent">♫</span> <Hi>{t.title}</Hi> <Dim>—</Dim> {t.artist}
          <br />
          <Dim>
            {np.isPlaying && np.progressMs !== null
              ? `playing now · ${formatDuration(np.progressMs)} / ${formatDuration(t.durationMs)}`
              : np.playedAt
                ? `last played ${timeAgo(np.playedAt)}`
                : "paused"}
          </Dim>{" "}
          · <A href={t.url}>open in spotify ↗</A>
        </div>
      );
    },
  },
  np: { help: "alias for music", hidden: true, run: (a, c) => commands.music.run(a, c) },

  github: {
    help: "contributions, live",
    run: async () => {
      const data = await getJSON<Activity>("/api/activity");
      if (!data?.github) return <Dim>github is not answering right now.</Dim>;
      const g = data.github;
      return (
        <div>
          <Hi>{g.total.toLocaleString()}</Hi> contributions in the last year
          <br />
          <Dim>
            {g.repos ?? "?"} repos · {g.stars ?? "?"} stars · {g.followers ?? "?"} followers
          </Dim>
          {data.push ? (
            <>
              <br />
              last push → <A href={data.push.url}>{data.push.repo}</A>{" "}
              <Dim>{timeAgo(data.push.at)}</Dim>
            </>
          ) : null}
        </div>
      );
    },
  },

  leetcode: {
    help: "problems solved, live",
    run: async () => {
      const data = await getJSON<Activity>("/api/activity");
      const l = data?.leetcode;
      if (!l) return <Dim>leetcode is not answering right now.</Dim>;
      return (
        <div>
          <Hi>{l.total}</Hi> solved
          {l.ranking ? <Dim> · rank #{l.ranking.toLocaleString()}</Dim> : null}
          {l.buckets.map((b) => (
            <div key={b.difficulty}>
              <span className="inline-block w-16">{b.difficulty.toLowerCase()}</span>
              <span className="text-accent">
                {"█".repeat(Math.max(1, Math.round((b.solved / b.available) * 24)))}
              </span>{" "}
              <Dim>{b.solved}</Dim>
            </div>
          ))}
        </div>
      );
    },
  },

  contact: {
    help: "how to reach me",
    run: () => (
      <div className="grid grid-cols-[max-content_1fr] gap-x-5">
        <Dim>email</Dim>
        <A href={profile.links.email}>{profile.email}</A>
        <Dim>github</Dim>
        <A href={profile.links.github}>github.com/{profile.github}</A>
        <Dim>linkedin</Dim>
        <A href={profile.links.linkedin}>linkedin.com/in/javin-chutani</A>
        <Dim>x</Dim>
        <A href={profile.links.twitter}>@JavinChutani</A>
      </div>
    ),
  },

  email: {
    help: "copy my email",
    run: async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        return (
          <span>
            <span className="text-accent">✓</span> copied {profile.email}
          </span>
        );
      } catch {
        return <A href={profile.links.email}>{profile.email}</A>;
      }
    },
  },

  resume: {
    help: "open the résumé",
    run: () => {
      if (!profile.links.resume) return <Dim>résumé link coming soon.</Dim>;
      window.open(profile.links.resume, "_blank", "noopener");
      return <Dim>opening résumé on google drive…</Dim>;
    },
  },

  gallery: {
    help: "photographs",
    run: (_, ctx) => {
      ctx.close();
      ctx.navigate("/gallery");
      return null;
    },
  },

  theme: {
    help: "theme light | dark",
    run: ([mode]) => {
      const light = mode ? mode === "light" : !isLight();
      setTheme(light);
      return <Dim>theme → {light ? "light" : "dark"}</Dim>;
    },
  },

  replay: {
    help: "watch the intro again",
    run: (_, ctx) => {
      ctx.close();
      window.scrollTo({ top: 0 });
      replayIntro();
      return null;
    },
  },

  date: {
    help: "what time it is for me",
    run: () =>
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(new Date()) + " IST",
  },

  echo: { help: "echo", hidden: true, run: (args) => args.join(" ") },

  sudo: {
    help: "try it",
    run: async (args) => {
      if (args.join(" ").toLowerCase() === "hire javin") {
        await new Promise((r) => setTimeout(r, 650));
        setTimeout(() => {
          window.open(composeEmail(profile.email, "Let’s talk"), "_blank", "noopener");
        }, 900);
        return (
          <div>
            <Dim>[sudo] password for recruiter: ••••••••</Dim>
            <br />
            <span className="text-accent">access granted.</span> drafting an email…
          </div>
        );
      }
      return <span>nice try. this incident will be reported. (hint: sudo hire javin)</span>;
    },
  },

  rm: { help: "", hidden: true, run: () => <span>absolutely not.</span> },
  vim: { help: "", hidden: true, run: () => <span>you’re trapped now. (type `exit`)</span> },
  clear: { help: "clear the screen", run: (_, ctx) => (ctx.clear(), null) },
  exit: { help: "close the terminal", run: (_, ctx) => (ctx.close(), null) },
};

export const commandNames = Object.keys(commands).filter((n) => !commands[n].hidden);
