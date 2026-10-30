import type { ArtKind } from "../components/ink/shapes";
import type { ProjectSlug } from "./projects";

export const profile = {
  name: "Krish Jeswal",
  email: "connectwithkjeswal@gmail.com",
  location: "Bengaluru · India",
  github: "https://github.com/KrishJeswal",
  linkedin: "https://www.linkedin.com/in/krishjeswal/",
  resume: "/assets/krish-jeswal-resume.pdf",
} as const;

export const roles = [
  "Machine Learning Researcher",
  "Full-Stack Developer",
  "Embedded Systems Engineer",
] as const;

export const disciplines = ["Machine learning", "Full-stack", "Embedded systems"] as const;

export const homeSections = [
  { id: "top", label: "Cover" },
  { id: "preface", label: "Preface" },
  { id: "fields", label: "Fields" },
  { id: "work", label: "Projects" },
  { id: "index", label: "Index" },
  { id: "experience", label: "Shelf" },
  { id: "contact", label: "Contact" },
] as const;

export const cover = {
  lines: [
    "Hi, I'm Krish. I build ML models and the software around them.",
    "Undergrad at RVCE.",
    "When nothing's compiling, I'm probably drinking coffee and halfway through a novel.",
  ],
  footLeft: "Portfolio · 2026",
  footRight: "Scroll to open the drawer ↓",
} as const;

export const preface = {
  heading:
    "I build machine-learning systems, the software that ships them, and now and then the hardware underneath.",
  paragraphs: [
    "I'm an Electronics & Telecommunication undergrad at RVCE, Bengaluru. Most of my ML work sits on the evaluation side: harnesses, ablations and interpretability passes that tell me whether a gain is real or an artefact of the split.",
    "On the web I own the whole path, from schema to the last bit of interaction polish. The degree is why I read systems bottom-up. The fiction habit is why this site is laid out like a library.",
  ],
} as const;

type Field = {
  readonly code: string;
  readonly name: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly chips: readonly string[];
  readonly filed: string;
  readonly art: ArtKind;
};

export const fields: readonly Field[] = [
  {
    code: "ML",
    name: "Machine learning",
    eyebrow: "Field one",
    title: "Models, and proof that they hold up.",
    body: "Predictive ML and retrieval. Feature selection, calibration, chunking and reranking, measured against held-out data.",
    chips: ["PyTorch", "scikit-learn", "XGBoost", "SHAP", "RAG", "QLoRA"],
    filed: "CipherTrace · LoreRecall",
    art: "net",
  },
  {
    code: "SW",
    name: "Software",
    eyebrow: "Field two",
    title: "Typed, end to end.",
    body: "Web platforms, APIs and agent tooling. Contracts flow from the database to the component, so the compiler catches what review would miss.",
    chips: ["TypeScript", "React", "Bun", "Hono", "MCP", "PostgreSQL"],
    filed: "GlyphMark · Pathfindr",
    art: "web",
  },
  {
    code: "EMB",
    name: "Embedded systems",
    eyebrow: "Field three",
    title: "Signals, timing, silicon.",
    body: "Microcontrollers, FPGAs and radio links. Reading a system from the clock edge up is the habit I carry into everything else.",
    chips: ["STM32", "ESP32", "Verilog", "FPGA", "LoRa", "KiCad"],
    filed: "New cards on the way",
    art: "chip",
  },
];

export const moreWork = {
  eyebrow: "On order",
  title: "More on GitHub.",
  body: "New work lands there before it gets a card here.",
  link: "github.com/KrishJeswal →",
} as const;

export type Skill = { readonly name: string; readonly usedIn: readonly ProjectSlug[] };

type SkillGroup = { readonly name: string; readonly skills: readonly Skill[] };

const s = (name: string, ...usedIn: ProjectSlug[]): Skill => ({ name, usedIn });

export const skillIndex: readonly SkillGroup[] = [
  {
    name: "Programming languages",
    skills: [
      s("Python", "ciphertrace", "lorerecall"),
      s("TypeScript", "glyphmark"),
      s("JavaScript", "pathfindr"),
      s("SQL"),
      s("C"),
      s("HTML/CSS", "pathfindr"),
      s("Bash"),
      s("Verilog"),
      s("Assembly"),
      s("GLSL"),
    ],
  },
  {
    name: "AI/ML & LLM engineering",
    skills: [
      s("PyTorch", "lorerecall"),
      s("scikit-learn", "ciphertrace"),
      s("Hugging Face", "lorerecall"),
      s("RAG", "lorerecall"),
      s("LangChain", "lorerecall"),
      s("QLoRA", "lorerecall"),
      s("XGBoost", "ciphertrace"),
      s("SHAP", "ciphertrace"),
      s("Ollama", "lorerecall"),
    ],
  },
  {
    name: "Data, retrieval & storage",
    skills: [
      s("NumPy", "ciphertrace"),
      s("pandas"),
      s("PostgreSQL"),
      s("MongoDB", "lorerecall"),
      s("Pydantic v2"),
      s("ZenML", "lorerecall"),
      s("matplotlib/seaborn"),
    ],
  },
  {
    name: "Full-stack development",
    skills: [
      s("React", "pathfindr"),
      s("Node.js"),
      s("REST API"),
      s("MCP", "glyphmark"),
      s("Hono", "glyphmark"),
      s("OAuth", "glyphmark"),
      s("Vite", "pathfindr"),
      s("Three.js/WebGL"),
      s("GSAP"),
      s("Streamlit", "ciphertrace"),
    ],
  },
  {
    name: "Tools & infrastructure",
    skills: [
      s("Git"),
      s("Docker"),
      s("uv"),
      s("pytest"),
      s("Jupyter"),
      s("Ruff/oxlint"),
      s("Bun", "glyphmark"),
      s("Firebase", "pathfindr"),
      s("Opik", "lorerecall"),
      s("Comet ML"),
    ],
  },
  {
    name: "Embedded systems & electronics",
    skills: [
      s("STM32"),
      s("ESP32"),
      s("FPGA"),
      s("Arduino"),
      s("UART"),
      s("ADC"),
      s("LoRa"),
      s("RFID"),
      s("KiCad"),
      s("LTspice"),
      s("Simulink"),
    ],
  },
];

type Volume = {
  readonly volume: number;
  readonly title: string;
  readonly years: string;
  readonly role: string;
  readonly detail: string;
  readonly tone: "pale" | "kraft" | "dark" | "stone";
  readonly width: number;
};

export const shelf: readonly Volume[] = [
  {
    volume: 4,
    title: "GDG on Campus RVCE",
    years: "2026 –",
    role: "Research head",
    detail:
      "Earned 19 Google Cloud skill badges and mentored 15+ teams at the Vision 2047 hackathon on ML pipelines and cloud deployment.",
    tone: "pale",
    width: 95,
  },
  {
    volume: 3,
    title: "IETE Student Forum",
    years: "2025 –",
    role: "Web developer",
    detail: "Led the team that shipped the forum's official site, and set up code review across the chapter.",
    tone: "kraft",
    width: 97,
  },
  {
    volume: 2,
    title: "R.V. College of Engineering",
    years: "2024 – 28",
    role: "B.E. Electronics & Telecom",
    detail: "Bengaluru. Where the embedded work started.",
    tone: "dark",
    width: 92,
  },
  {
    volume: 1,
    title: "Amity International School",
    years: "– 2023",
    role: "PCM + Computer Science",
    detail: "Elementary to high school.",
    tone: "stone",
    width: 99,
  },
];

export const contact = {
  heading: ["Say", "hello."],
  lede: "Got an idea, a question, or a book I should read next? Send it over. I'll reply over coffee.",
  slip: {
    borrower: "You",
    item: "An idea, a question, or a good book",
  },
  links: [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Résumé", href: profile.resume },
  ],
} as const;
