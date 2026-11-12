/**
 * Every word on this site lives in this file.
 * Edit here — never in the components.
 *
 * Projects, experience, education and skills below are taken from
 * Javin_Chutani_Software_Engg_Resume.pdf — keep the two in sync.
 */

export const profile = {
  name: "Javin Chutani",
  initials: "JC",
  /** Shown under the name, in mono caps. Keep it short. */
  role: "Backend & AI engineer",
  /** One-line summary used for SEO + OG cards. */
  tagline:
    "Backend & AI engineer. Data Science student at NIT Jalandhar, contributing to XCEED, NITJ.",
  /**
   * The hero paragraph. Segments with `href` render as inline underlined links.
   * Keep it to three or four sentences — this is the whole "about" section.
   */
  bio: [
    { text: "I’m a Data Science student at " },
    { text: "NIT Jalandhar", href: "https://www.nitj.ac.in/" },
    { text: ", currently contributing to " },
    { text: "XCEED", href: "https://xceed.nitj.ac.in/" },
    {
      text: ", where I work on the backend and ML inference for a face-recognition attendance system.",
    },
    {
      text: " Before that I was an AI/ML intern at Bajaj Housing Finance, building a speech-to-form pipeline.",
    },
    {
      text: " On my own I build things to understand how they work: a Redis-compatible server in Go, a crypto exchange with its own matching engine, and a coding agent written without frameworks.",
    },
  ],

  location: "Jalandhar, Punjab · IN",
  email: "javin.chutani@gmail.com",
  timezone: "IST · UTC+5:30",
  availability: "Open to work and internships",

  github: "javin1106",
  leetcode: "javinchutani",

  links: {
    github: "https://github.com/javin1106",
    linkedin: "https://www.linkedin.com/in/javin-chutani",
    twitter: "https://twitter.com/JavinChutani",
    leetcode: "https://leetcode.com/u/javinchutani/",
    email: "mailto:javin.chutani@gmail.com",
    /**
     * Your résumé on Google Drive. Paste the share link (Share → "Anyone with
     * the link"). The dock opens Drive's preview, which has its own download
     * button, so the file is always your real template.
     */
    resume: "https://drive.google.com/file/d/1IUu2i4947nxy6LhbboZZbt5pVIcX3Cyu/view",
    /**
     * Where "book a call" goes. Paste a scheduling link here (cal.com,
     * Calendly, or a Google Calendar booking page). Left empty, it opens a
     * pre-filled email instead.
     */
    booking: "",
  },

  /**
   * X / Twitter. `posts` are links to posts you want on the Contact page
   * (e.g. "https://x.com/JavinChutani/status/1234567890"). They render as
   * native cards with no API key; new posts don't appear automatically.
   */
  x: {
    handle: "JavinChutani",
    name: "Javin Chutani",
    bio: "Backend & AI engineer · Data Science at NIT Jalandhar · contributing to XCEED, NITJ.",
    posts: [] as string[],
  },

  /** The line under your name on the home page. Segments with `href` are links. */
  pitch: [
    { text: "I build backend systems and the AI products that run on them. Currently contributing to " },
    { text: "XCEED, NIT Jalandhar", href: "https://xceed.nitj.ac.in/" },
    { text: "." },
  ],

  /**
   * The onboarding cycles through your name in these scripts, Apple-"hello"
   * style, and lands back on the first one. Hindi and Punjabi are as you write
   * them (जैविन चुटानी); the rest follow the same sound, "Jai-vin".
   */
  scripts: [
    { text: "Javin", lang: "en" },
    { text: "जैविन", lang: "hi" },
    { text: "ਜੈਵਿਨ", lang: "pa" },
    { text: "جَیوِن", lang: "ur" },
    { text: "ジェビン", lang: "ja" },
    { text: "재빈", lang: "ko" },
    { text: "Джевин", lang: "ru" },
  ],

  /** What the onboarding terminal types before it tucks itself into the nav. */
  terminalIntro: [
    { cmd: "whoami", out: "javin chutani — backend & ai engineer" },
    { cmd: "./portfolio --serve", out: "listening on :443 · ready in 0.42s" },
  ],

};

export type ProjectStatus = "shipped" | "building" | "archived";

/** Which hand-drawn animation sits beside a featured project. */
export type Glyph = "orderbook" | "keyspace" | "pubsub" | "agent" | "debris" | "mood" | "clusters";

export type Project = {
  name: string;
  /** One line, always visible. */
  summary: string;
  /** The full description — revealed when the row is expanded. */
  blurb: string;
  glyph?: Glyph;
  /** Small category labels on the card: what *kind* of work this is. */
  tags?: string[];
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
    name: "OnlyTrades",
    tags: ["Backend", "Systems"],
    summary: "A crypto exchange with its own matching engine.",
    glyph: "orderbook",
    blurb:
      "A centralised crypto exchange whose matching engine runs as a separate service, talking to the API over Redis Streams with correlation IDs. Price-time priority matching, partial fills, balance locking, settlement and self-trade prevention on every order path; rate limiting, 24-hour idempotency records and exponential backoff for safety; and a React trading terminal with candlesticks, market depth and order/fill history.",
    year: "2026",
    stack: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "Redis Streams", "React"],
    status: "shipped",
    repo: "https://github.com/javin1106/OnlyTrades",
    live: "https://onlytrades-delta.vercel.app",
    featured: true,
  },
  {
    name: "FlokiDB",
    tags: ["Low-level", "Systems"],
    summary: "A Redis-compatible key-value server, written in Go.",
    glyph: "keyspace",
    blurb:
      "A Redis-compatible in-memory key-value server: RESP parsing and encoding, TTL expiry, key eviction, and AOF persistence with recovery on restart. PING, SET, GET, DEL, TTL and EXPIRE run on a single-threaded, non-blocking Linux epoll event loop. In redis-benchmark on the same machine it reached 156K SET / 152K GET ops/sec (p50 under 0.17 ms), about 95% of Redis 8.0, and held 15,000 concurrent connections at 100K ops/sec with no crashes.",
    year: "2026",
    stack: ["Go", "Linux epoll", "TCP sockets", "RESP", "AOF"],
    status: "building",
    repo: "https://github.com/javin1106/FlokiDB",
    featured: true,
  },
  {
    name: "agent-core",
    tags: ["AI Agent", "LLMs"],
    summary: "A terminal coding agent, built without frameworks.",
    glyph: "agent",
    blurb:
      "A terminal coding agent built without an agent framework: a streaming tool-calling loop, a swappable LLM provider layer (OpenAI or Ollama), and four schema-validated tools, with shell commands behind a human approval step. Retries that resume interrupted replies, context compaction, cost tracking and prompt-injection defences. An eval harness over 15 coding tasks scores 93% across 3 runs at about 3 model calls per task, and was used to find a failure mode whose fix cut tokens 10× (49K → 4K).",
    year: "2026",
    stack: ["TypeScript", "Node.js", "OpenAI API", "Ollama", "Zod", "Vitest"],
    status: "building",
    repo: "https://github.com/javin1106/agent-core",
    featured: true,
  },
  {
    name: "Debris-preserving compression",
    tags: ["Research paper", "Computer Vision"],
    summary: "Shrinking a satellite-image model without losing marine debris.",
    glyph: "debris",
    blurb:
      "Compresses MariNeXt, a Sentinel-2 model that labels every sea pixel into 15 classes, by training ½, ¼ and ⅛-width students with knowledge distillation — including soft teacher labels on the unlabelled pixels — then INT8 quantisation. At half width it keeps debris F1 close to the teacher (60.4 vs 63.9 val) while being about 9× smaller and 2.5× faster on CPU. With Jashan Aneja, NIT Jalandhar.",
    year: "2026",
    stack: ["Python", "PyTorch", "Distillation", "INT8", "Sentinel-2"],
    status: "shipped",
    repo: "https://github.com/javin1106/debris-preserving-model-compression",
    featured: true,
  },
  {
    name: "GossipKaro",
    tags: ["Backend", "Real-time"],
    featured: true,
    summary: "A real-time group chat app.",
    glyph: "pubsub",
    blurb:
      "A real-time group chat platform over 17 REST APIs — invite-based groups, replies, edits, reactions, typing indicators and read receipts at sub-150 ms latency. Secured with JWT, Redis-backed email OTP, session revocation and shared rate limiting; scales horizontally through Redis Pub/Sub with MongoDB persistence.",
    year: "2026",
    stack: ["Node.js", "Express", "React", "Socket.IO", "MongoDB", "Redis"],
    status: "shipped",
    repo: "https://github.com/javin1106/GossipKaro",
    live: "https://gossip-karo.vercel.app",
  },
  {
    name: "Ugrama",
    summary: "GenAI EdTech platform with RAG over Gemini — 3rd at BitNBuild.",
    blurb:
      "A GenAI-powered EdTech platform that personalises learning content with RAG over a Gemini-backed pipeline. Third place at BitNBuild, GDSC CRCE.",
    year: "2026",
    stack: ["RAG", "Gemini API", "GenAI"],
    status: "shipped",
  },
  {
    name: "MindMirror",
    tags: ["Deep Learning", "NLP"],
    glyph: "mood",
    featured: true,
    summary: "An emotion-aware journaling companion.",
    blurb:
      "An emotion-aware journaling companion: a trained classifier reads the emotional content of an entry, retrieval pulls relevant guidance from a knowledge base, and an LLM writes a grounded reflection back.",
    year: "2026",
    stack: ["Python", "PyTorch", "FAISS", "Streamlit"],
    status: "shipped",
    repo: "https://github.com/javin1106/MindMirror",
    live: "https://mindmirror.streamlit.app/",
  },
  {
    name: "ResumeMatch AI",
    summary: "Scores a resume against a job description and rewrites the weak bullets.",
    blurb:
      "Scores a resume against a job description with sentence-transformer embeddings and cosine similarity, then uses an LLM to surface keyword gaps and rewrite the three weakest bullets.",
    year: "2026",
    stack: ["Python", "spaCy", "Sentence-Transformers", "Gemini"],
    status: "shipped",
    repo: "https://github.com/javin1106/resumematch-ai",
  },
  {
    name: "URL Shortener",
    summary: "Collision-safe short codes, redirects and click analytics.",
    blurb:
      "A backend-first link shortener — collision-safe short-code generation, redirect resolution and click analytics.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB"],
    status: "shipped",
    repo: "https://github.com/javin1106/URL-Shortener",
  },
  {
    name: "Splitwise Clone",
    summary: "Group expense splitting and the ledger problems behind it.",
    blurb:
      "Group expense splitting with balance settlement — built to work through the transactional and data-modelling problems behind shared ledgers.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB"],
    status: "shipped",
    repo: "https://github.com/javin1106/Splitwise-Clone",
  },
  {
    name: "ECommerce Backend",
    summary: "A modular commerce API — auth, carts, checkout, orders, jobs.",
    blurb:
      "A modular commerce API covering auth, catalogue, carts, checkout, orders and scheduled operational jobs.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB", "JWT"],
    status: "shipped",
    repo: "https://github.com/javin1106/ECommerce-Backend",
  },
  {
    name: "Mental Health in Tech",
    tags: ["Machine Learning"],
    glyph: "clusters",
    featured: true,
    summary: "Machine learning on a workplace mental-health survey.",
    blurb:
      "An applied ML study on a workplace mental-health survey — treatment-seeking classification, age regression and worker segmentation, wrapped in an interactive dashboard.",
    year: "2026",
    stack: ["Python", "scikit-learn", "Streamlit", "Docker"],
    status: "shipped",
    repo: "https://github.com/javin1106/Mental-Health-In-Tech",
  },
  // Airport (github.com/javin1106/Airport) is deliberately left out for now —
  // add it back here once it has a README and you're happy to show it.
];

export type Experience = {
  role: string;
  org: string;
  orgHref?: string;
  period: string;
  meta?: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Research Intern",
    org: "XCEED, NIT Jalandhar",
    orgHref: "https://xceed.nitj.ac.in/",
    period: "Mar 2026 — Present",
    meta: "Node.js · React · Express · FastAPI · MongoDB · Nvidia H100",
    points: [
      "Developed backend features and admin workflows for the attendance system: timetable conflict resolution, role-scoped report deletion, multi-department access control and faculty email notifications.",
      "Deployed and monitored the InsightFace ML inference service on an Nvidia H100 GPU, adding a live GPU/VRAM metrics dashboard for production inference.",
      "Hardened the ML service integration by moving attendance report writes to a server-side ML completion flow, protecting endpoints with service-authenticated secrets, and adding regression coverage for authenticated writes.",
    ],
  },
  {
    role: "AI/ML Intern",
    org: "Bajaj Housing Finance",
    orgHref: "https://www.bajajhousingfinance.in/",
    period: "Jun 2026 — Aug 2026",
    meta: "Python · Streamlit · Faster-Whisper · Groq API · Hugging Face",
    points: [
      "Built voice-to-form automation using ASR and LLM pipelines to turn natural speech into structured business application data.",
      "Implemented transcription preprocessing, normalisation and confidence-scoring modules to handle noisy real-world audio.",
      "Evaluated ASR and LLM approaches and integrated the result into a Streamlit internal demo for business-process automation.",
    ],
  },
];

export const education = [
  {
    school: "NIT Jalandhar",
    full: "Dr. B. R. Ambedkar National Institute of Technology",
    href: "https://www.nitj.ac.in/",
    degree: "B.Tech, Data Science & Engineering — CGPA 7.96",
    period: "2024 — Present",
  },
];

/** Shown on /resume. Not currently rendered on the home page. */
export const achievements = [
  {
    title: "BitNBuild, GDSC CRCE — 3rd place",
    note: "For Ugrama, a GenAI EdTech platform using RAG and Gemini to personalise learning content.",
  },
  {
    // Your PDF says 350+; the live API currently reports 415, so this is rounded
    // down to stay true as the count keeps moving. Worth updating the PDF too.
    title: "400+ problems solved on LeetCode",
    note: "Across data structures, algorithms and SQL.",
  },
  {
    title: "Intra-College Debate League — 1st place",
    note: "NIT Jalandhar.",
  },
];

/**
 * Every tool you work with. On the home page these scroll past in three rows,
 * one row per group, alternating direction. Add or remove freely.
 */
export const stack: Record<string, string[]> = {
  "Languages & backend": [
    "Python", "TypeScript", "JavaScript", "Go", "C/C++", "SQL",
    "Node.js", "Express", "FastAPI", "WebSockets", "Socket.IO", "REST", "Prisma", "Zod",
  ],
  "Data & infrastructure": [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Redis Streams", "Linux", "epoll",
    "TCP sockets", "Docker", "Git", "Postman", "Vitest", "Nvidia H100",
  ],
  "AI & product": [
    "PyTorch", "scikit-learn", "Hugging Face", "Whisper", "Faster-Whisper", "OpenAI API",
    "Groq", "Gemini", "Ollama", "RAG", "FAISS", "Streamlit", "React", "Next.js", "Tailwind",
  ],
};

/**
 * What you do when you're not at a keyboard. Shown at the top of the
 * Gallery ("Off the clock") page. Keep each line plain and true; `href` is
 * optional.
 */
export const hobbies: { title: string; note?: string; href?: string }[] = [
  { title: "Photography", note: "The photos below are mine." },
  { title: "Football", note: "I prefer being on the right side of the pitch. More of an all-rounder ;)" },
  { title: "Guitar", note: "A bedroom guitarist haha. Fender Squier Stratocaster btw" },
];

/**
 * GitHub repos that are pinned on your profile but belong somewhere other than
 * Selected work (AMS-with-TimeTable is the XCEED internship, shown under
 * Experience). Selected work = your pinned repos minus these.
 */
export const workExclude = ["AMS-with-TimeTable"];
