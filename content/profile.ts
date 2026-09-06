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
      text: ", though most of what I know came from rebuilding things that already work. A Redis-like database in Go. A crypto exchange with a real matching engine.",
    },
    {
      text: " I like the layer most people abstract away — wire protocols, event loops, memory, the exact moment a system decides to say no.",
    },
    { text: " Currently building ASR and LLM pipelines at " },
    { text: "Bajaj Housing Finance", href: "#experience" },
    { text: ", and open to " },
    { text: "new roles", href: "#contact" },
    { text: "." },
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
    name: "OnlyTrades",
    blurb:
      "A centralised crypto exchange across 10 REST endpoints, separating the Express/JWT/PostgreSQL API from a standalone TypeScript matching engine over Redis Streams. Price-time priority with partial fills, balance locking, settlement, cancellation and self-trade prevention — and order submission made replay-safe with 24-hour idempotency records, consumer-group recovery and exponential backoff.",
    year: "2026",
    stack: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "Redis Streams"],
    status: "shipped",
    repo: "https://github.com/javin1106/OnlyTrades",
    live: "https://onlytrades-delta.vercel.app",
    featured: true,
  },
  {
    name: "FlokiDB",
    blurb:
      "A Redis-like in-memory key-value server written from the socket up — hand-rolled RESP parsing and encoding, TTL expiry and a simple eviction policy, serving PING/SET/GET/DEL/TTL/EXPIRE over both a blocking TCP path and a Linux non-blocking epoll loop. Batched pipelining decodes several complete RESP frames per read and coalesces the replies into one write.",
    year: "2026",
    stack: ["Go", "RESP", "epoll", "TCP sockets"],
    status: "building",
    repo: "https://github.com/javin1106/FlokiDB",
    featured: true,
  },
  {
    name: "GossipKaro",
    blurb:
      "A real-time group chat platform over 17 REST APIs — invite-based groups, replies, edits, reactions, typing indicators and read receipts at sub-150 ms latency. Secured with JWT, Redis-backed email OTP, session revocation and shared rate limiting; scales horizontally through Redis Pub/Sub with MongoDB persistence.",
    year: "2026",
    stack: ["Node.js", "Express", "React", "Socket.IO", "MongoDB", "Redis"],
    status: "shipped",
    repo: "https://github.com/javin1106/GossipKaro",
    live: "https://gossip-karo.vercel.app",
    featured: true,
  },
  {
    name: "Ugrama",
    blurb:
      "A GenAI-powered EdTech platform that personalises learning content with RAG over a Gemini-backed pipeline. Third place at BitNBuild, GDSC CRCE.",
    year: "2026",
    stack: ["RAG", "Gemini API", "GenAI"],
    status: "shipped",
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
    role: "AI/ML Intern",
    org: "Bajaj Housing Finance",
    orgHref: "https://www.bajajhousingfinance.in/",
    period: "Jun 2026 — Present",
    meta: "Python · Whisper · Groq · Hugging Face",
    points: [
      "Developing a voice-to-form automation prototype that turns Hindi, English and Hinglish speech into structured business application data through an ASR and LLM pipeline.",
      "Building the transcription, preprocessing, normalisation, validation and confidence-scoring modules that let the system survive noisy real-world audio instead of silently filling fields wrong.",
      "Evaluating competing ASR and LLM approaches and integrating the result into a Streamlit demo for internal business-process automation.",
    ],
  },
  {
    role: "Research Intern",
    org: "XCEED, NIT Jalandhar",
    orgHref: "https://github.com/javin1106/AMS-with-TimeTable",
    period: "Mar 2026 — Present",
    meta: "Node.js · React · FastAPI · Nvidia H100",
    points: [
      "Designed role-aware attendance dashboards with ERP-backed department filters, scoped admin views and progress graphs for roll assignment, ground-truth acquisition and subject-embedding completion.",
      "Deployed and monitored the InsightFace inference service on an Nvidia H100, adding live GPU/VRAM utilisation, temperature, power, logs and service-status dashboards for production attendance inference.",
      "Extended the admin workflows with timetable-backed department assignment and faculty-facing classroom frame verification for access control and attendance review.",
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

/** "Currently" — keep this fresh. It's the section that proves the site is alive. */
export const now = {
  updated: "September 2026",
  items: [
    {
      label: "Building",
      title: "Voice-to-form automation at Bajaj Housing Finance",
      note: "Getting confidence scoring right so a bad transcription asks a question instead of guessing.",
    },
    {
      label: "Building",
      title: "Stream-safe pipelining in FlokiDB",
      note: "Per-connection input/output state, so partial reads stop corrupting command boundaries.",
      href: "https://github.com/javin1106/FlokiDB",
    },
    {
      label: "Reading",
      title: "Designing Data-Intensive Applications",
      note: "Kleppmann — mostly the replication and consensus chapters.",
      href: "https://dataintensive.net/",
    },
    {
      label: "Learning",
      title: "The Linux networking path",
      note: "From NIC interrupt to socket buffer — what epoll is actually watching.",
    },
    {
      label: "Next",
      title: "Reading vLLM's scheduler",
      note: "How KV-cache paging turns a memory problem into a throughput one.",
      href: "https://github.com/vllm-project/vllm",
    },
  ],
};

export const stack: Record<string, string[]> = {
  Languages: ["Go", "TypeScript", "Python", "C/C++", "Java", "JavaScript", "SQL"],
  Backend: ["Node.js", "Express", "FastAPI", "WebSockets", "Prisma", "REST"],
  "Systems & data": [
    "Linux",
    "epoll",
    "TCP / RESP",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
  ],
  Frontend: ["React", "Next.js", "Tailwind"],
  "ML & AI": ["PyTorch", "scikit-learn", "Whisper", "Hugging Face", "FAISS", "Streamlit"],
  Tools: ["Git", "Postman", "Docker"],
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
