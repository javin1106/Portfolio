/**
 * Every word on this site lives in this file.
 * Edit here — never in the components.
 */

export const profile = {
  name: "Javin Chutani",
  initials: "JC",
  /** Shown under the name, in mono caps. Keep it short. */
  role: "Backend & systems engineer",
  /** One-line summary used for SEO + OG cards. */
  tagline:
    "Backend and systems engineer building databases, matching engines and infrastructure from the protocol up.",
  /**
   * The hero paragraph. Segments with `href` render as inline underlined links.
   * Keep it to three or four sentences — this is the whole "about" section.
   */
  bio: [
    { text: "I’m Javin — a Data Science undergrad at " },
    { text: "NIT Jalandhar", href: "https://www.nitj.ac.in/" },
    {
      text: ", though most of what I know came from rebuilding things that already work. A Redis-compatible database in Go. A crypto exchange with a real matching engine. An object-storage service for Git snapshots.",
    },
    {
      text: " I like the layer most people abstract away — wire protocols, event loops, memory, the exact moment a system decides to say no.",
    },
    { text: " Currently reading inference-engine source, and open to " },
    { text: "2027 internships", href: "#contact" },
    { text: "." },
  ],

  location: "Jalandhar, Punjab · IN",
  email: "javin.chutani@gmail.com",
  timezone: "IST · UTC+5:30",
  availability: "Open to 2027 internships",

  github: "javin1106",
  leetcode: "javinchutani",

  links: {
    github: "https://github.com/javin1106",
    linkedin: "https://www.linkedin.com/in/javin-chutani",
    twitter: "https://twitter.com/JavinChutani",
    leetcode: "https://leetcode.com/u/javinchutani/",
    email: "mailto:javin.chutani@gmail.com",
    resume: "/resume",
  },

  /**
   * Hero background. Drop your own file in /public and point `src` at it —
   * the scrim, grain and blur adapt automatically.
   */
  hero: {
    src: "https://images.unsplash.com/photo-1696489149180-bb53f8c38bdb?auto=format&fit=crop&w=2400&q=80",
    credit: "Unsplash",
    creditHref: "https://unsplash.com/photos/85xbiAbVb9k",
    /** CSS object-position for the image. */
    position: "50% 45%",
  },
};

export type ProjectStatus = "shipped" | "building" | "archived";

export type Project = {
  name: string;
  /** Short and factual. Two or three lines when rendered. */
  blurb: string;
  year: string;
  stack: string[];
  status: ProjectStatus;
  repo?: string;
  live?: string;
  /** Featured projects show first; the rest sit behind "show all". */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "FlokiDB",
    blurb:
      "A Redis-compatible in-memory key-value server written from the socket up — hand-rolled RESP parsing, a Linux epoll event loop, non-blocking I/O, and stream-safe command pipelining.",
    year: "2026",
    stack: ["Go", "RESP", "epoll", "TCP"],
    status: "building",
    repo: "https://github.com/javin1106/FlokiDB",
    featured: true,
  },
  {
    name: "OnlyTrades",
    blurb:
      "A centralised crypto exchange for paper trading, split into an API service and a standalone matching engine. Price-time priority matching, balance locking, settlement, order depth and fills — coordinated over Redis Streams.",
    year: "2026",
    stack: ["TypeScript", "Node.js", "Redis Streams", "PostgreSQL"],
    status: "shipped",
    repo: "https://github.com/javin1106/OnlyTrades",
    live: "https://onlytrades-delta.vercel.app",
    featured: true,
  },
  {
    name: "Airport",
    blurb:
      "A Go service that snapshots Git repositories into content-addressed source archives and stores them on S3-compatible object storage, behind a small HTTP API. Containerised with Compose.",
    year: "2026",
    stack: ["Go", "MinIO / S3", "Docker", "HTTP"],
    status: "building",
    repo: "https://github.com/javin1106/Airport",
    featured: true,
  },
  {
    name: "MindMirror",
    blurb:
      "An emotion-aware journaling companion: a trained classifier reads the emotional content of an entry, retrieval pulls relevant guidance from a knowledge base, and an LLM writes a grounded reflection back.",
    year: "2026",
    stack: ["Python", "PyTorch", "FAISS", "Streamlit"],
    status: "shipped",
    repo: "https://github.com/javin1106/MindMirror",
    live: "https://mindmirror.streamlit.app/",
    featured: true,
  },
  {
    name: "GossipKaro",
    blurb:
      "An end-to-end chat application with real-time delivery, member discovery and MongoDB-backed identity — a full client/server split rather than a toy socket demo.",
    year: "2026",
    stack: ["React", "Node.js", "Socket.IO", "MongoDB"],
    status: "shipped",
    repo: "https://github.com/javin1106/GossipKaro",
    live: "https://gossip-karo.vercel.app",
  },
  {
    name: "ResumeMatch AI",
    blurb:
      "Scores a resume against a job description with sentence-transformer embeddings and cosine similarity, then uses an LLM to surface keyword gaps and rewrite the three weakest bullets.",
    year: "2026",
    stack: ["Python", "spaCy", "Sentence-Transformers", "Gemini"],
    status: "shipped",
    repo: "https://github.com/javin1106/resumematch-ai",
  },
  {
    name: "URL Shortener",
    blurb:
      "A backend-first link shortener — collision-safe short-code generation, redirect resolution and click analytics.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB"],
    status: "shipped",
    repo: "https://github.com/javin1106/URL-Shortener",
  },
  {
    name: "Splitwise Clone",
    blurb:
      "Group expense splitting with balance settlement — built to work through the transactional and data-modelling problems behind shared ledgers.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB"],
    status: "shipped",
    repo: "https://github.com/javin1106/Splitwise-Clone",
  },
  {
    name: "ECommerce Backend",
    blurb:
      "A modular commerce API covering auth, catalogue, carts, checkout, orders and scheduled operational jobs.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB", "JWT"],
    status: "shipped",
    repo: "https://github.com/javin1106/ECommerce-Backend",
  },
  {
    name: "Mental Health in Tech",
    blurb:
      "An applied ML study on a workplace mental-health survey — treatment-seeking classification, age regression and worker segmentation, wrapped in an interactive dashboard.",
    year: "2026",
    stack: ["Python", "scikit-learn", "Streamlit", "Docker"],
    status: "shipped",
    repo: "https://github.com/javin1106/Mental-Health-In-Tech",
  },
];

export type Experience = {
  role: string;
  org: string;
  orgHref?: string;
  period: string;
  meta?: string;
  points: string[];
};

/**
 * NOTE: verify the titles and dates below — these were reconstructed from your
 * previous site and public repos. Everything else on the page is sourced.
 */
export const experience: Experience[] = [
  {
    role: "Open-source contributor",
    org: "vLLM · Ray · SGLang · Zulip · Ceph",
    orgHref: "https://github.com/javin1106?tab=repositories&type=fork",
    period: "2026 — present",
    meta: "Inference & distributed systems",
    points: [
      "Reading and working through LLM serving internals — paged attention, scheduler paths, and the memory behaviour that decides throughput.",
      "Digging into Ceph and Kubernetes source to understand how storage and orchestration actually fail in production.",
    ],
  },
  {
    role: "AI/ML engineering intern",
    org: "Voice-to-form automation",
    period: "2026",
    meta: "Prototype",
    points: [
      "Built a speech-led workflow turning Hinglish conversation into structured form data, with Whisper transcription and LLM-assisted extraction.",
      "Kept extraction conservative and confidence-aware, so bad transcriptions surfaced as questions instead of silent wrong answers.",
    ],
  },
  {
    role: "Full-stack contributor",
    org: "Attendance & Timetable Platform, NIT Jalandhar",
    orgHref: "https://github.com/javin1106/AMS-with-TimeTable",
    period: "2025 — 2026",
    meta: "Open source",
    points: [
      "Worked across the frontend, API and ML-service boundary on role-aware dashboards and department-scoped access rules.",
      "Added observability around the GPU scheduling service and tightened the attendance write path against duplicate and out-of-order writes.",
    ],
  },
];

export const education = [
  {
    school: "NIT Jalandhar",
    full: "Dr. B. R. Ambedkar National Institute of Technology",
    href: "https://www.nitj.ac.in/",
    degree: "B.Tech, Data Science & Engineering",
    period: "2024 — 2028",
  },
];

/** "Currently" — keep this fresh. It's the section that proves the site is alive. */
export const now = {
  updated: "September 2026",
  items: [
    {
      label: "Reading",
      title: "vLLM — paged attention & the scheduler",
      note: "How KV-cache paging turns a memory problem into a throughput one.",
      href: "https://github.com/vllm-project/vllm",
    },
    {
      label: "Reading",
      title: "Designing Data-Intensive Applications",
      note: "Kleppmann. Third pass, mostly the replication and consensus chapters.",
      href: "https://dataintensive.net/",
    },
    {
      label: "Building",
      title: "Stream-safe pipelining in FlokiDB",
      note: "Per-connection input/output state, so partial reads stop corrupting command boundaries.",
      href: "https://github.com/javin1106/FlokiDB",
    },
    {
      label: "Learning",
      title: "The Linux networking path",
      note: "From NIC interrupt to socket buffer — what epoll is actually watching.",
    },
    {
      label: "Next",
      title: "Contributing upstream to SGLang",
      note: "Starting with the serving benchmarks before touching scheduler code.",
      href: "https://github.com/sgl-project/sglang",
    },
  ],
};

export const stack: Record<string, string[]> = {
  Languages: ["Go", "TypeScript", "Python", "C++", "SQL"],
  Systems: ["Linux", "epoll", "TCP / RESP", "Redis", "PostgreSQL", "MongoDB", "Docker"],
  Web: ["Node.js", "Express", "React", "Next.js", "Tailwind"],
  "ML & data": ["PyTorch", "scikit-learn", "FAISS", "spaCy", "Streamlit"],
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  /** Aspect ratio (w / h) — reserves space before the image loads. */
  ratio: number;
  href?: string;
};

/**
 * Swap these for your own photographs: drop files in /public/gallery
 * and change `src` to "/gallery/your-file.jpg", then set `ratio` to that
 * image's width / height so the collage reserves the right space.
 */
export const gallery: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1696489149180-bb53f8c38bdb?auto=format&fit=crop&w=1600&q=80",
    alt: "Night sky over a dark ridgeline",
    caption: "After dark",
    ratio: 600 / 902,
    href: "https://unsplash.com/photos/85xbiAbVb9k",
  },
  {
    src: "https://images.unsplash.com/photo-1762294395026-9ac05824a31a?auto=format&fit=crop&w=1600&q=80",
    alt: "A study in colour",
    caption: "Colour studies",
    ratio: 3 / 2,
    href: "https://unsplash.com/photos/fDcTr5ooEig",
  },
  {
    src: "https://images.unsplash.com/photo-1746440160680-2c50206e568a?auto=format&fit=crop&w=1600&q=80",
    alt: "A quiet desk and workspace",
    caption: "Where the work happens",
    ratio: 3 / 4,
    href: "https://unsplash.com/photos/89blqIkdCgA",
  },
  {
    src: "https://images.unsplash.com/photo-1754236742249-39549f5bba32?auto=format&fit=crop&w=1600&q=80",
    alt: "Sharp architectural geometry",
    caption: "Structure, still playful",
    ratio: 1,
    href: "https://unsplash.com/photos/TkfDdYjD890",
  },
  {
    src: "https://images.unsplash.com/photo-1767045572136-868c9407818b?auto=format&fit=crop&w=1600&q=80",
    alt: "A wide coastline",
    caption: "A reminder to zoom out",
    ratio: 3 / 2,
    href: "https://unsplash.com/photos/OCvXQfLHHx0",
  },
  {
    src: "https://images.unsplash.com/photo-1747383432280-93b270b1ab01?auto=format&fit=crop&w=1600&q=80",
    alt: "Colourful neighbourhood facades",
    caption: "Small differences, memorable systems",
    ratio: 3 / 2,
    href: "https://unsplash.com/photos/tCm6-KCp8Ac",
  },
];

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Stats", href: "/#stats" },
  { label: "Gallery", href: "/gallery" },
  { label: "Résumé", href: "/resume" },
];
