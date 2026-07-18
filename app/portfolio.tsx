"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Briefcase,
  Camera,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  GitFork,
  Home,
  Layers,
  MapPin,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { FlipWords } from "@/components/ui/flip-words";
import { Timeline } from "@/components/ui/timeline";
import {
  experience,
  gallery,
  profile,
  projects,
  resumeHighlights,
  techGroups,
  techRibbon,
} from "@/content/portfolio";

type Theme = "light" | "dark";

type StatsPayload = {
  github: null | {
    repos: number | null;
    followers: number | null;
    profile: string;
  };
  contributions: {
    total: number | null;
    days: { date: string; count: number; level: number }[];
  };
  leetcode: null | {
    total: number | null;
    easy: number | null;
    medium: number | null;
    hard: number | null;
    ranking: number | null;
  };
};

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Work", href: "#projects", icon: Code2 },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Gallery", href: "#gallery", icon: Camera },
];

const fallbackLevels = Array.from({ length: 112 }, (_, index) => {
  const wave = Math.sin(index * 0.9) + Math.cos(index * 0.37);
  if (index % 11 === 0 || index % 17 === 0) return 0;
  if (wave > 1) return 4;
  if (wave > 0.35) return 3;
  if (wave > -0.4) return 2;
  return 1;
});

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="section-heading">
      <div className="section-kicker">
        <span>{index}</span>
        {eyebrow}
      </div>
      <div className="section-heading-row">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Reveal>
  );
}

function Header({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="floating-header"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.2 }}
    >
      <a className="brand-mark" href="#home" aria-label="Javin — back to home">
        J<span>.</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.name}>
            {item.name}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          type="button"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
        <a className="header-cta" href={profile.github} target="_blank" rel="noreferrer">
          <GitFork size={17} />
          <span>GitHub</span>
        </a>
        <button
          className="icon-button mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a href={item.href} key={item.name} onClick={() => setMenuOpen(false)}>
                  <Icon size={17} />
                  {item.name}
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero-section">
      <AuroraBackground className="hero-aurora">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />

        <div className="hero-content">
          <motion.div
            className="hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="status-pill">
              <span className="status-dot" />
              {profile.availability}
            </div>
            <p className="hero-overline">Hello, internet — I&apos;m</p>
            <h1>
              JAVIN<span className="hero-dot">.</span>
            </h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                Explore my work <ArrowDown size={18} />
              </a>
              <a className="ghost-button" href="#resume">
                Resume highlights <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: 3 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="portrait-card">
              <img src={profile.portrait} alt="Javin's current GitHub profile portrait" />
              <div className="portrait-overlay" />
              <div className="portrait-label">
                <span>Your portrait</span>
                <small>easy to replace later</small>
              </div>
            </div>
            <motion.div
              className="floating-note note-code"
              animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-3, -1, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Code2 size={18} />
              build / learn / repeat
            </motion.div>
            <motion.div
              className="floating-note note-location"
              animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [2, 4, 2] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <MapPin size={17} />
              India
            </motion.div>
          </motion.div>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>01</span>
          <div />
          <span>Portfolio / 2026</span>
        </div>
      </AuroraBackground>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section-about">
      <div className="page-shell">
        <SectionHeading
          index="02"
          eyebrow="About me"
          title="Curious by default. Precise by practice."
          description="I like work that crosses boundaries: protocol details and polished screens, ambitious ideas and the boring reliability that makes them real."
        />

        <div className="about-grid">
          <Reveal className="name-stage">
            <div className="name-glow" aria-hidden="true" />
            <p>One name, many scripts</p>
            <div className="translated-name" aria-live="polite">
              <FlipWords words={profile.scripts} duration={3600} />
            </div>
            <span>
              A quiet rotation through transliterations — because identity travels farther than one alphabet.
            </span>
            <div className="script-dots" aria-hidden="true">
              {profile.scripts.map((script) => (
                <i key={script} />
              ))}
            </div>
          </Reveal>

          <div className="about-cards">
            <Reveal className="about-card about-card-story" delay={0.08}>
              <Sparkles size={22} />
              <p className="card-label">What pulls me in</p>
              <h3>Hard systems, human interfaces.</h3>
              <p>
                I enjoy finding the clean model underneath a messy problem, then making that model feel natural to use.
              </p>
            </Reveal>
            <Reveal className="about-card about-card-location" delay={0.14}>
              <MapPin size={21} />
              <p className="card-label">Based in</p>
              <h3>{profile.location}</h3>
            </Reveal>
            <Reveal className="about-card about-card-current" delay={0.2}>
              <Cpu size={22} />
              <p className="card-label">Current rabbit holes</p>
              <div className="current-list">
                <span>Database internals</span>
                <span>Event-driven systems</span>
                <span>Delightful developer tools</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="section section-tech" id="stack">
      <div className="page-shell">
        <SectionHeading
          index="03"
          eyebrow="Toolkit"
          title="A stack with range."
          description="The tools change with the problem. The constant is a preference for understandable systems, clean boundaries, and fast feedback."
        />

        <div className="tech-orbit" aria-hidden="true">
          <div className="tech-orbit-core">J</div>
          <span className="orbit-chip chip-one">Go</span>
          <span className="orbit-chip chip-two">React</span>
          <span className="orbit-chip chip-three">Redis</span>
          <span className="orbit-chip chip-four">Python</span>
        </div>

        <div className="tech-groups">
          {techGroups.map((group, index) => {
            const Icon = index === 0 ? Cpu : index === 1 ? Layers : Database;
            return (
              <Reveal className={`tech-card accent-${group.accent}`} delay={index * 0.08} key={group.name}>
                <div className="tech-card-top">
                  <Icon size={23} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{group.name}</h3>
                <p>{group.note}</p>
                <div className="tech-chips">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="tech-marquee" aria-label={`Technologies: ${techRibbon.join(", ")}`}>
        <div className="marquee-track">
          {[...techRibbon, ...techRibbon].map((item, index) => (
            <span key={`${item}-${index}`}>
              <i /> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section section-projects" id="projects">
      <div className="page-shell">
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title="Things I cared enough to build properly."
          description="A mix of systems work, real-time products, open source, and full-stack engineering — each one taught me a different kind of rigor."
        />

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal
              className={`project-card project-${project.accent} ${project.size === "wide" ? "project-wide" : ""}`}
              delay={index * 0.08}
              key={project.title}
            >
              <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
                <div className="project-topline">
                  <span>{project.eyebrow}</span>
                  <ArrowUpRight size={21} />
                </div>
                <div className="project-visual" aria-hidden="true">
                  <div className="project-grid-lines" />
                  <span className="project-mark">{project.mark}</span>
                  <div className="project-pulse pulse-one" />
                  <div className="project-pulse pulse-two" />
                </div>
                <div className="project-copy">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <small>{project.impact}</small>
                  <div className="project-stack">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="all-projects-row">
          <p>More experiments, tools, and works-in-progress live on GitHub.</p>
          <a href={profile.github} target="_blank" rel="noreferrer">
            View all repositories <ArrowUpRight size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function CodePulse() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/stats", { signal: controller.signal })
      .then(async (response): Promise<StatsPayload | null> =>
        response.ok ? ((await response.json()) as StatsPayload) : null,
      )
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));

    return () => controller.abort();
  }, []);

  const levels = useMemo(() => {
    const live = stats?.contributions.days.map((day) => day.level) ?? [];
    return live.length ? live : fallbackLevels;
  }, [stats]);

  const leetcodeTotal = stats?.leetcode?.total;
  const ringDegrees = leetcodeTotal ? Math.min(360, Math.max(42, leetcodeTotal * 1.8)) : 248;

  return (
    <section className="code-pulse-section" aria-labelledby="code-pulse-title">
      <div className="page-shell">
        <Reveal className="code-pulse-card">
          <div className="pulse-intro">
            <div className="live-label">
              <span /> {stats ? "Live coding pulse" : loaded ? "Live sync ready" : "Syncing coding pulse"}
            </div>
            <h2 id="code-pulse-title">Quiet consistency, visible in green.</h2>
            <p>GitHub activity and problem-solving progress, kept small enough to support the work instead of becoming the whole story.</p>
            <div className="pulse-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <GitFork size={17} /> @{profile.handle}
              </a>
              {profile.leetcode ? (
                <a href={`https://leetcode.com/u/${profile.leetcode}/`} target="_blank" rel="noreferrer">
                  <Code2 size={17} /> LeetCode
                </a>
              ) : (
                <span className="pulse-link-pending" title="Add your LeetCode handle in content/portfolio.ts">
                  <Code2 size={17} /> LeetCode handle needed
                </span>
              )}
            </div>
          </div>

          <div className="github-panel">
            <div className="stat-row">
              <div>
                <strong>{stats?.github?.repos ?? (loaded ? "—" : "···")}</strong>
                <span>public repos</span>
              </div>
              <div>
                <strong>{stats?.contributions.total ?? (loaded ? "—" : "···")}</strong>
                <span>contributions / year</span>
              </div>
              <div>
                <strong>{stats?.github?.followers ?? (loaded ? "—" : "···")}</strong>
                <span>followers</span>
              </div>
            </div>
            <div className={`contribution-grid ${stats?.contributions.days.length ? "is-live" : "is-preview"}`}>
              {levels.slice(-112).map((level, index) => (
                <i key={index} data-level={level} />
              ))}
            </div>
            <div className="contribution-legend">
              <span>{stats?.contributions.days.length ? "Latest 16 weeks" : "Activity preview — live data reconnects automatically"}</span>
              <div>
                Less <i data-level="1" /> <i data-level="2" /> <i data-level="3" /> <i data-level="4" /> More
              </div>
            </div>
          </div>

          <div className="leetcode-panel">
            <div className="leetcode-ring" style={{ "--ring-degrees": `${ringDegrees}deg` } as React.CSSProperties}>
              <div>
                <strong>{leetcodeTotal ?? (loaded ? "—" : "···")}</strong>
                <span>solved</span>
              </div>
            </div>
            <div className="leetcode-breakdown">
              <span><i className="easy" /> Easy <strong>{stats?.leetcode?.easy ?? "—"}</strong></span>
              <span><i className="medium" /> Medium <strong>{stats?.leetcode?.medium ?? "—"}</strong></span>
              <span><i className="hard" /> Hard <strong>{stats?.leetcode?.hard ?? "—"}</strong></span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  const timelineData = experience.map((item) => ({
    title: item.year,
    content: (
      <article className={`experience-card experience-${item.color}`}>
        <p className="experience-org">{item.organization}</p>
        <h3>{item.role}</h3>
        <p>{item.summary}</p>
        <ul>
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </article>
    ),
  }));

  return (
    <section className="section section-experience" id="experience">
      <div className="page-shell">
        <SectionHeading
          index="05"
          eyebrow="Experience"
          title="A line through the work."
          description="The roles change, but the pattern stays consistent: understand the system, remove ambiguity, and leave the product stronger than I found it."
        />
      </div>
      <Timeline data={timelineData} />
    </section>
  );
}

function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : gallery[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((activeIndex + 1) % gallery.length);
      if (event.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + gallery.length) % gallery.length);
    };

    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  return (
    <section className="section section-gallery" id="gallery">
      <div className="page-shell">
        <SectionHeading
          index="06"
          eyebrow="Gallery"
          title="Life outside the commit history."
          description="A flexible collage ready for your own photographs. These editorial placeholders establish the rhythm without deciding your story for you."
        />

        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <Reveal className={`gallery-item ${image.className}`} delay={index * 0.05} key={image.title}>
              <button type="button" onClick={() => setActiveIndex(index)} aria-label={`Open ${image.title} photo`}>
                <img src={image.src} alt={image.caption} loading="lazy" />
                <span className="gallery-shade" />
                <span className="gallery-number">0{index + 1}</span>
                <span className="gallery-caption">
                  <strong>{image.title}</strong>
                  <small>{image.caption}</small>
                </span>
                <span className="gallery-open"><ExternalLink size={17} /></span>
              </button>
            </Reveal>
          ))}
        </div>

        <p className="gallery-note">
          Placeholder photography via Unsplash. Swap files and captions later without touching the layout.
        </p>
      </div>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} image viewer`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <button className="lightbox-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close image viewer">
              <X size={20} />
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((activeIndex - 1 + gallery.length) % gallery.length);
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <motion.figure
              key={active.src}
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={active.src} alt={active.caption} />
              <figcaption>
                <div><strong>{active.title}</strong><span>{active.caption}</span></div>
                <a href={active.source} target="_blank" rel="noreferrer">Photo source <ArrowUpRight size={15} /></a>
              </figcaption>
            </motion.figure>
            <button
              className="lightbox-nav lightbox-next"
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((activeIndex + 1) % gallery.length);
              }}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Resume() {
  return (
    <section className="section section-resume" id="resume">
      <div className="page-shell">
        <div className="resume-layout">
          <Reveal className="resume-copy">
            <div className="section-kicker"><span>07</span> Resume</div>
            <h2>The short version: I like owning the whole problem.</h2>
            <p>
              From low-level server behavior to the interface someone actually touches, I’m most useful where engineering depth and product judgment overlap.
            </p>
            <div className="resume-actions">
              <button className="primary-button" type="button" onClick={() => window.print()}>
                Print / save resume <Download size={18} />
              </button>
              <a className="ghost-button" href={profile.github} target="_blank" rel="noreferrer">
                Verify the work <GitFork size={18} />
              </a>
            </div>
            <small>Replace this printable first version with your final PDF whenever you’re ready.</small>
          </Reveal>

          <Reveal className="resume-document" delay={0.12}>
            <div className="resume-paper-shadow" aria-hidden="true" />
            <div className="resume-paper">
              <div className="resume-paper-head">
                <div>
                  <span>JAVIN</span>
                  <small>ENGINEER / BUILDER</small>
                </div>
                <FileText size={25} />
              </div>
              <div className="resume-rule" />
              <p className="resume-summary">Backend, full-stack, and applied AI work with a systems-first mindset.</p>
              <ul>
                {resumeHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="resume-skills">
                <span>GO</span><span>TYPESCRIPT</span><span>REACT</span><span>NODE</span><span>PYTHON</span><span>LINUX</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-aurora" aria-hidden="true" />
      <div className="page-shell footer-content">
        <Reveal>
          <p className="footer-kicker"><span /> Have an interesting problem?</p>
          <h2>Let&apos;s make something with a pulse.</h2>
          <p>Open to internships, open-source work, and collaborations where the engineering deserves real care.</p>
          <div className="footer-actions">
            <a className="footer-button" href={profile.github} target="_blank" rel="noreferrer">
              Start on GitHub <GitFork size={19} />
            </a>
            <a className="footer-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              Connect on LinkedIn <ArrowUpRight size={17} />
            </a>
          </div>
        </Reveal>
        <div className="footer-bottom">
          <a className="brand-mark" href="#home">J<span>.</span></a>
          <p>Designed to keep evolving — just like the work.</p>
          <span>© {new Date().getFullYear()} Javin</span>
        </div>
      </div>
    </footer>
  );
}

export function Portfolio() {
  const [theme, setTheme] = useState<Theme>("dark");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });

  useEffect(() => {
    const saved = window.localStorage.getItem("javin-theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = saved ?? preferred;
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("javin-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
  };

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <CodePulse />
        <Experience />
        <Gallery />
        <Resume />
      </main>
      <Footer />
    </>
  );
}
