export const profile = {
  name: "Krish Jeswal",
  role: "Machine-Learning Researcher · Full-Stack Engineer",
  tagline: "Electronics & Telecommunication, RVCE Bengaluru",
  email: "connectwithkjeswal@gmail.com",
  phone: "+91 87502 08208",
  website: "https://krish-jeswal.web.app",
  github: "https://github.com/KrishJeswal",
  linkedin: "https://www.linkedin.com/in/krishjeswal/",
  location: "Bengaluru, India",
  coords: "12.97°N 77.59°E",
  // ML-first positioning. Every fact below is real; only the framing is tuned.
  summary:
    "I pull signal out of noise. My research recovers a secret AES key from the faint power a chip leaks — an ML side-channel attack submitted to IEEE — and the same instinct runs the production systems I ship: RAG pipelines on GCP, ML services that survive contact with real data. Underneath it all sits the electronics I trained on: FPGAs, embedded silicon, the physical layer.",
};

// The three layers, in the order Krish works in them: research first,
// systems second, silicon third. This is a real ranked hierarchy, so the
// numbers carry meaning rather than decorate.
export type Layer = { id: string; channel: string; title: string; body: string };

export const layers: Layer[] = [
  {
    id: "01",
    channel: "INFERENCE",
    title: "Machine Learning Researcher",
    body: "PyTorch, scikit-learn, SHAP and RAG — models that learn the hard patterns, and the tooling to prove they actually hold up.",
  },
  {
    id: "02",
    channel: "SYSTEMS",
    title: "Full-stack Developer",
    body: "React, TypeScript, FastAPI and GCP — the surface users touch and the services behind it, shipped end to end into production.",
  },
  {
    id: "03",
    channel: "SILICON",
    title: "Electronics and Telecom Undergrad",
    body: "FPGAs, STM32, Verilog and UART — the physical layer the rest of the stack quietly stands on.",
  },
];

export type Project = {
  capture: string;
  domain: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  featured: boolean;
  // a minimal figure of the project's actual method:
  // leak = SHAP leakage localization, retrieve = vector k-NN,
  // map = column→schema mapping, pipeline = CI/CD stages
  figure: "leak" | "retrieve" | "map" | "pipeline";
  link?: string;
};

export const projects: Project[] = [
  {
    capture: "CH·01",
    domain: "ML · SIDE-CHANNEL",
    title: "CipherTrace",
    subtitle: "Recovering an AES-128 key from power leakage",
    description:
      "A profiling attack on the ASCAD dataset (50k traces) across 72 classifier configurations — 6 models × 3 point-of-interest strategies. Identity labels collapse Guessing Entropy to 0.46 against 12.03 for Hamming Weight, overturning a standard SCA assumption, with SHAP localizing exactly where the chip leaks. Submitted to IEEE Access.",
    metric: "0.46",
    metricLabel: "guessing entropy · identity labels",
    tags: ["PyTorch", "scikit-learn", "SHAP", "ASCAD", "MLP + PCA"],
    featured: true,
    figure: "leak",
  },
  {
    capture: "CH·02",
    domain: "ML · RAG",
    title: "Code Noir",
    subtitle: "Commit history rewritten as genre fiction",
    description:
      "A retrieval pipeline that turns a repo's git history into noir and sci-fi fiction for developer explainability. BGE-large embeddings in Qdrant retrieve under 100ms, Gemini is orchestrated through LangChain, and FastAPI runs on GCP Cloud Run behind a React/TypeScript front end with Firebase auth.",
    metric: "<100ms",
    metricLabel: "vector retrieval latency",
    tags: ["RAG", "Qdrant", "LangChain", "Gemini", "Cloud Run", "FastAPI"],
    featured: false,
    figure: "retrieve",
  },
  {
    capture: "CH·03",
    domain: "ML · DOCUMENT AI",
    title: "Intelligent Excel Parser",
    subtitle: "LLM ingestion for messy enterprise .xlsx",
    description:
      "A FastAPI + Gemini service that kills manual column remapping — 94% mapping accuracy across 300+ header variants, with a SequenceMatcher fallback when the model is unsure. Pydantic v2 validates every schema and surfaces per-cell confidence on an interactive dashboard, cutting data-cleaning overhead by roughly 80%.",
    metric: "94%",
    metricLabel: "mapping accuracy · 300+ variants",
    tags: ["FastAPI", "Gemini", "Pydantic v2", "openpyxl"],
    featured: false,
    figure: "map",
  },
  {
    capture: "CH·04",
    domain: "LEAD · FULL-STACK",
    title: "IETE Student Forum",
    subtitle: "Official chapter site, led end to end",
    description:
      "Led the development team that architected and shipped the official IETE Student Forum site. Defined the full stack, set up CI/CD through GitHub Actions, and drove delivery from system design to production — with code-review workflows that the chapter now runs by default.",
    metric: "CI/CD",
    metricLabel: "github actions → production",
    tags: ["React", "TypeScript", "Tailwind", "PostgreSQL"],
    featured: false,
    figure: "pipeline",
  },
];

// Stack ordered ML-first, mirroring the layer hierarchy. Electronics last —
// the substrate, not the headline.
export const stack: { category: string; items: string[] }[] = [
  {
    category: "AI / ML",
    items: ["PyTorch", "scikit-learn", "RAG", "LangChain", "Hugging Face", "XGBoost", "Gemini API", "SHAP"],
  },
  {
    category: "Web & Backend",
    items: ["React", "TypeScript", "FastAPI", "Node.js", "Express", "Flask", "Tailwind CSS", "Vite", "Three.js", "Docker"],
  },
  {
    category: "Data & Cloud",
    items: ["NumPy", "Pandas", "OpenCV", "Streamlit", "Vertex AI", "GCP"],
  },
  {
    category: "Databases & Tools",
    items: ["PostgreSQL", "MongoDB", "Qdrant", "Supabase", "Firebase", "Git", "CI/CD"],
  },
  {
    category: "Languages",
    items: ["Python", "C", "JavaScript", "TypeScript", "SQL", "Assembly", "Verilog"],
  },
  {
    category: "Electronics",
    items: ["Arduino", "STM32", "ESP32", "FPGA", "UART", "LTSpice", "KiCAD", "CAN Bus"],
  },
];

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  body: string;
  tag: string;
};

export const timeline: TimelineEntry[] = [
  {
    period: "Jun 2025 — Present",
    title: "Research & Projects",
    org: "Google Developer Groups",
    body: "Built two end-to-end GCP projects (Vertex AI fine-tuning, Cloud Run deployment) for Google Cloud Study Jams. Mentored 15+ teams at the Vision 2047 hackathon on ML pipeline architecture, and ran a DevSprint on open source and cybersecurity fundamentals.",
    tag: "experience",
  },
  {
    period: "Nov 2025 — Present",
    title: "Development Lead",
    org: "IETE Student Forum",
    body: "Leading the dev team behind the official chapter site — full-stack definition, CI/CD through GitHub Actions, and a code-review culture the chapter adopted across its work.",
    tag: "experience",
  },
  {
    period: "2024 — 2028",
    title: "B.E. Electronics & Telecommunication",
    org: "R.V. College of Engineering, Bengaluru",
    body: "Engineering across signals, silicon and software — from Verilog and FPGA labs to production cloud systems.",
    tag: "education",
  },
  {
    period: "2021 — 2023",
    title: "Higher Secondary",
    org: "Amity International School, Ghaziabad",
    body: "Physics, Chemistry, Maths and Computer Science — where making machines do things stopped being a hobby.",
    tag: "education",
  },
];

export const navLinks = [
  { label: "Thesis", href: "#thesis" },
  { label: "Captures", href: "#captures" },
  { label: "Stack", href: "#stack" },
  { label: "Log", href: "#log" },
  { label: "Contact", href: "#contact" },
];

export const FORMSPREE_ID = "https://formspree.io/f/xwvwddyv";
