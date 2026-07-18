export type Project = {
  title: string;
  eyebrow: string;
  description: string;
  impact: string;
  stack: string[];
  href: string;
  accent: "coral" | "violet" | "aqua" | "amber";
  size: "wide" | "standard";
  mark: string;
};

export const profile = {
  name: "Javin",
  handle: "javin1106",
  role: "Backend engineer, full-stack maker & systems explorer.",
  intro:
    "I build dependable products from the protocol layer to the final pixel — with a soft spot for real-time systems, thoughtful interfaces, and ideas that are useful in the wild.",
  github: "https://github.com/javin1106",
  linkedin: "https://in.linkedin.com/in/javin-chutani",
  leetcode: null as string | null,
  location: "Jalandhar, India · building for everywhere",
  availability: "Open to 2028 internships & ambitious collaborations",
  scripts: ["Javin", "जाविन", "જાવિન", "جاوين", "ジャビン", "자빈"],
  portrait: "https://avatars.githubusercontent.com/u/108410532?v=4",
};

export const techGroups = [
  {
    name: "Systems & backend",
    note: "Where performance, protocols, and reliability meet.",
    items: ["Go", "Node.js", "Express", "REST APIs", "RESP", "Linux", "Epoll"],
    accent: "coral",
  },
  {
    name: "Product & frontend",
    note: "Interfaces that make complicated systems feel simple.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion", "Recharts"],
    accent: "violet",
  },
  {
    name: "Data & intelligence",
    note: "Practical ML and data flows with careful validation.",
    items: ["Python", "MongoDB", "Redis", "XGBoost", "Whisper", "Groq"],
    accent: "aqua",
  },
];

export const techRibbon = [
  "Go",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "MongoDB",
  "Redis",
  "Linux",
  "Next.js",
  "Tailwind",
  "Machine Learning",
  "Git",
];

export const projects: Project[] = [
  {
    title: "JavinKV",
    eyebrow: "Systems engineering",
    description:
      "A Redis-inspired in-memory database built from the wire protocol upward, including RESP parsing and a Linux-native asynchronous server path.",
    impact: "Protocol-first design · non-blocking I/O · TTL-ready core",
    stack: ["Go", "RESP", "Linux", "Epoll"],
    href: "https://github.com/javin1106/JavinKV",
    accent: "coral",
    size: "wide",
    mark: "KV",
  },
  {
    title: "OnlyTrades",
    eyebrow: "Real-time trading",
    description:
      "A centralized crypto exchange with separate API and matching-engine services, authenticated order flows, balance locking, settlement, depth, and fills.",
    impact: "Price-time matching · Redis Streams · PostgreSQL users",
    stack: ["TypeScript", "Node.js", "Redis", "PostgreSQL"],
    href: "https://github.com/javin1106/OnlyTrades",
    accent: "violet",
    size: "standard",
    mark: "CX",
  },
  {
    title: "GossipKaro",
    eyebrow: "Social product",
    description:
      "A responsive messaging experience with a clean client/server split, member discovery, and dependable MongoDB-backed identity flows.",
    impact: "Real-time UX · responsive chat · resilient data model",
    stack: ["React", "Node.js", "MongoDB", "Sockets"],
    href: "https://github.com/javin1106/GossipKaro",
    accent: "aqua",
    size: "standard",
    mark: "GK",
  },
  {
    title: "MindMirror",
    eyebrow: "Emotion-aware AI",
    description:
      "A reflective journaling companion combining emotion classification, semantic memory retrieval, generated reflections, and mood-responsive themes.",
    impact: "BiLSTM classifier · FAISS retrieval · confidence history",
    stack: ["Python", "Streamlit", "FAISS", "Groq"],
    href: "https://github.com/javin1106/MindMirror",
    accent: "amber",
    size: "wide",
    mark: "MM",
  },
  {
    title: "Mental Health in Tech",
    eyebrow: "Applied machine learning",
    description:
      "An ML and data-analysis project exploring treatment seeking, age regression, worker segmentation, and interactive survey insights.",
    impact: "Classification · regression · clustering · dashboard",
    stack: ["Python", "Scikit-learn", "Streamlit", "Docker"],
    href: "https://github.com/javin1106/Mental-Health-In-Tech",
    accent: "violet",
    size: "standard",
    mark: "MH",
  },
  {
    title: "ECommerce Backend",
    eyebrow: "Backend product",
    description:
      "A modular commerce backend covering authentication, products, carts, checkout, orders, and scheduled operational tasks.",
    impact: "JWT auth · checkout flow · scheduled jobs",
    stack: ["Node.js", "Express", "MongoDB", "JWT"],
    href: "https://github.com/javin1106/ECommerce-Backend",
    accent: "coral",
    size: "standard",
    mark: "EC",
  },
];

export const experience = [
  {
    year: "Now",
    role: "Independent systems & product builder",
    organization: "JavinKV · trading systems · real-time products",
    summary:
      "Building end-to-end systems where backend correctness and product feel are treated as one problem, not two separate hand-offs.",
    highlights: [
      "Designed protocol and event-driven server paths",
      "Connected engines, APIs, and responsive interfaces",
      "Turned reliability work into visible product behavior",
    ],
    color: "coral",
  },
  {
    year: "2026",
    role: "AI/ML engineering intern",
    organization: "Voice-to-form automation prototype",
    summary:
      "Developed a speech-led workflow that converts Hinglish conversations into structured form data with conservative extraction and confidence-aware validation.",
    highlights: [
      "Whisper-based speech transcription",
      "LLM-assisted structured extraction",
      "Validation-first Streamlit experience",
    ],
    color: "violet",
  },
  {
    year: "2025",
    role: "Open-source full-stack contributor",
    organization: "Attendance & timetable platform",
    summary:
      "Worked across frontend, backend, and ML-facing boundaries to improve access rules, operational visibility, and department-aware workflows.",
    highlights: [
      "Role-aware dashboard insights",
      "GPU service observability",
      "Safer attendance write paths",
    ],
    color: "aqua",
  },
];

export const gallery = [
  {
    title: "Build spaces",
    caption: "Where quiet focus becomes shipped work.",
    src: "https://images.unsplash.com/photo-1746440160680-2c50206e568a?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/89blqIkdCgA",
    className: "gallery-wide",
  },
  {
    title: "Color studies",
    caption: "Collecting palettes from the world outside the screen.",
    src: "https://images.unsplash.com/photo-1762294395026-9ac05824a31a?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/fDcTr5ooEig",
    className: "gallery-tall",
  },
  {
    title: "Coastlines",
    caption: "A good reminder to zoom out.",
    src: "https://images.unsplash.com/photo-1767045572136-868c9407818b?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/OCvXQfLHHx0",
    className: "gallery-standard",
  },
  {
    title: "After dark",
    caption: "Systems thinking under a wider sky.",
    src: "https://images.unsplash.com/photo-1696489149180-bb53f8c38bdb?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/85xbiAbVb9k",
    className: "gallery-wide gallery-night",
  },
  {
    title: "Sharp geometry",
    caption: "Structure can still be playful.",
    src: "https://images.unsplash.com/photo-1754236742249-39549f5bba32?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/TkfDdYjD890",
    className: "gallery-tall",
  },
  {
    title: "Neighbourhood color",
    caption: "Small differences make a system memorable.",
    src: "https://images.unsplash.com/photo-1747383432280-93b270b1ab01?auto=format&fit=crop&w=1800&q=85",
    source: "https://unsplash.com/photos/tCm6-KCp8Ac",
    className: "gallery-standard",
  },
];

export const resumeHighlights = [
  "Backend and systems work spanning protocols, event loops, APIs, and data stores",
  "Full-stack product delivery with React, TypeScript, Node.js, and MongoDB",
  "Applied AI/ML prototypes using Python, Whisper, LLM extraction, and validation",
  "Open-source contributions focused on access control, observability, and reliable UX",
];
