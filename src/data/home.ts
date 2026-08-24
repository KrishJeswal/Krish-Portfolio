/** Home page content. Section order here drives the nav numerals and the scroll spy. */

export const profile = {
  name: "Krish Jeswal",
  email: "connectwithkjeswal@gmail.com",
  location: "Bengaluru, IN",
  github: "https://github.com/KrishJeswal",
  linkedin: "https://www.linkedin.com/in/krishjeswal/",
  resume: "/assets/krish-jeswal-resume.pdf",
} as const;

export const roles = [
  "Machine Learning Researcher",
  "Full-Stack Developer",
  "Embedded Systems Engineer",
] as const;

/**
 * `label` is what the nav roll reads out; `eyebrow` is the section's own
 * heading. Work is the one place they differ.
 */
export const sections = [
  { id: "hero", number: "01", label: "Home", eyebrow: "Hero" },
  { id: "about", number: "02", label: "About", eyebrow: "About" },
  { id: "work", number: "03", label: "Work", eyebrow: "Selected work" },
  { id: "skills", number: "04", label: "Skills", eyebrow: "Skills" },
  { id: "experience", number: "05", label: "Experience", eyebrow: "Experience" },
  { id: "contact", number: "06", label: "Contact", eyebrow: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/* ---------- about reel ---------- */

export type ReelPanel = {
  readonly number: string;
  readonly channel: string;
  readonly title: string;
  readonly lead: string;
  readonly body: string;
  readonly facts: readonly { readonly label: string; readonly value: string }[];
};

export const reelPanels: readonly ReelPanel[] = [
  {
    number: "01",
    channel: "Inference",
    title: "Machine Learning Researcher",
    lead: "PyTorch, scikit-learn, SHAP and RAG — models that learn the hard patterns, and the tooling to prove they actually hold up.",
    body: "Most of my work sits on the evaluation side: building the harnesses, ablations and interpretability passes that tell you whether a gain is real or an artefact of the split. Retrieval is the other half — chunking, reranking and grounding, tuned against questions the index was never meant to answer.",
    facts: [
      { label: "Focus", value: "Model eval & retrieval pipelines" },
      { label: "Stack", value: "PyTorch · SHAP · LangChain" },
      { label: "Domain", value: "Predictive ML & RAG" },
    ],
  },
  {
    number: "02",
    channel: "Systems",
    title: "Full-stack Developer",
    lead: "React, TypeScript, FastAPI and GCP — the surface users touch and the services behind it, shipped end to end into production.",
    body: "I like owning the whole path — schema, endpoint, state, the last 5% of interaction polish that decides whether a tool gets used twice. Typed contracts from database to component, deploys that are boring on purpose, and interfaces that hold their shape at 3am on someone else’s screen.",
    facts: [
      { label: "Focus", value: "Typed full-stack architecture" },
      { label: "Stack", value: "React · TypeScript · FastAPI" },
      { label: "Surface", value: "Web platform & APIs" },
    ],
  },
  {
    number: "03",
    channel: "Silicon",
    title: "Embedded Systems Engineer",
    lead: "FPGAs, STM32, Verilog and UART — the physical layer the rest of the stack quietly stands on.",
    body: "Four years of signals, timing diagrams and hardware that fails in ways no stack trace explains. It taught me to read a system from the bottom up, and it is why latency budgets and memory ceilings still feel like real constraints rather than numbers in a dashboard.",
    facts: [
      { label: "Focus", value: "Signals & timing" },
      { label: "Stack", value: "Verilog · STM32 · UART" },
      { label: "Degree", value: "ETE, 2028" },
    ],
  },
];

/* ---------- skills drawers ---------- */

export type Drawer = {
  readonly number: string;
  readonly title: string;
  readonly tiles: readonly string[];
};

export const drawers: readonly Drawer[] = [
  {
    number: "01",
    title: "Machine Learning",
    tiles: [
      "PyTorch",
      "scikit-learn",
      "XGBoost",
      "SHAP",
      "QLoRA",
      "RAG",
      "LangChain",
      "Hugging Face",
      "pandas",
      "NumPy",
      "ZenML",
      "Ollama",
    ],
  },
  {
    number: "02",
    title: "Full-Stack",
    tiles: [
      "React",
      "TypeScript",
      "Node.js",
      "Vite",
      "Hono",
      "Bun",
      "MCP",
      "Three.js",
      "MongoDB",
      "PostgreSQL",
      "Firebase",
      "OAuth",
    ],
  },
  {
    number: "03",
    title: "Embedded",
    tiles: [
      "STM32",
      "ESP32",
      "FPGA",
      "Verilog",
      "LoRa",
      "KiCAD",
      "Arduino",
      "UART",
      "RFID",
      "Assembly",
      "LTSpice",
      "Simulink",
    ],
  },
];

/* ---------- experience ledger ---------- */

export type LedgerRow = {
  readonly org: string;
  readonly role: string;
  readonly year: string;
  readonly range: string;
  readonly detail: string;
};

export const ledger: readonly LedgerRow[] = [
  {
    org: "IETE Student Forum",
    role: "Web Developer",
    year: "2025",
    range: "Nov 2025 — Present",
    detail:
      "I led the dev team that shipped the official Student Forum site — React, TypeScript, Tailwind, PostgreSQL, GitHub CI/CD, plus code review workflows across the chapter.",
  },
  {
    org: "Google Developer Groups",
    role: "Research Lead",
    year: "2025",
    range: "Jun 2025 — Present",
    detail:
      "19 Google Cloud Skill Badges through Study Jams. I mentored 15+ teams at the Vision 2047 Hackathon on ML pipelines and cloud deployment.",
  },
  {
    org: "R.V. College of Engineering",
    role: "Electronics & Telecom",
    year: "2024",
    range: "2024 — 2028",
    detail:
      "Undergraduate in Bengaluru. Where the embedded side of my work comes from — STM32, FPGA, LoRa, and the signal habits that carried into the research.",
  },
  {
    org: "Amity International School",
    role: "PCM + Computer Science",
    year: "2023",
    range: "2009 — 2023",
    detail: "Physics, Chemistry, Maths and Computer Science.",
  },
];

/* ---------- contact ---------- */

export const contactTabs = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Résumé", href: profile.resume },
] as const;

export const contactIntro =
  "I’m easiest to reach when something is only half figured out. Bring the tangled version, the idea you can’t explain yet, or a good excuse for coffee.";
