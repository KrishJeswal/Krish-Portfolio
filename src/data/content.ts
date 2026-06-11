export const profile = {
  name: "Krish Jeswal",
  role: "Full-Stack Developer & ML Scientist",
  tagline: "Electronics & Telecom Undergrad",
  email: "connectwithkjeswal@gmail.com",
  phone: "+91 87502 08208",
  website: "https://krish-jeswal.web.app",
  github: "https://github.com/KrishJeswal",
  location: "Bengaluru, India",
  summary:
    "Undergrad researcher and full-stack engineer targeting IEEE ISCAS 2026 for ML side-channel attack work on masked AES-128. I build and ship production AI systems — currently a RAG pipeline on GCP Cloud Run using Qdrant, LangChain and the Gemini API. My stack spans PyTorch, FastAPI, React/TypeScript and embedded systems.",
};

export type Project = {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  size: "lg" | "md";
  motif: "trace" | "noir" | "grid" | "net";
};

export const projects: Project[] = [
  {
    index: "01",
    title: "CipherTrace",
    subtitle: "ML side-channel attack on masked AES-128",
    description:
      "Profiling attack on the ASCAD dataset (50k traces) evaluating 72 classifier configurations across 6 models × 3 POI strategies. Showed Identity labels collapse Guessing Entropy to 0.46 vs 12.03 for Hamming Weight — overturning a standard SCA assumption — with SHAP-based leakage localization. Submitted to IEEE Access.",
    metric: "GE 0.46",
    metricLabel: "guessing entropy @ identity labels",
    tags: ["PyTorch", "scikit-learn", "SHAP", "ASCAD", "MLP + PCA"],
    size: "lg",
    motif: "trace",
  },
  {
    index: "02",
    title: "Code Noir",
    subtitle: "Commit history → genre fiction, via RAG",
    description:
      "A RAG pipeline that rewrites GitHub commit history as noir and sci-fi fiction for developer explainability. BGE-large embeddings in Qdrant retrieving at sub-100ms, Gemini orchestrated through LangChain, FastAPI on GCP Cloud Run with Docker, React/TypeScript frontend and Firebase auth.",
    metric: "<100ms",
    metricLabel: "vector retrieval latency",
    tags: ["RAG", "Qdrant", "LangChain", "Gemini", "Cloud Run", "FastAPI"],
    size: "md",
    motif: "noir",
  },
  {
    index: "03",
    title: "Intelligent Excel Parser",
    subtitle: "LLM-powered enterprise .xlsx ingestion",
    description:
      "FastAPI + Gemini service that kills manual column remapping — 94% mapping accuracy across 300+ header variants with a SequenceMatcher fallback. Pydantic v2 schema validation, per-cell confidence scores on an interactive dashboard, cutting data-cleaning overhead by ~80%.",
    metric: "94%",
    metricLabel: "mapping accuracy, 300+ variants",
    tags: ["FastAPI", "Gemini", "Pydantic v2", "openpyxl"],
    size: "md",
    motif: "grid",
  },
  {
    index: "04",
    title: "IETE Student Forum",
    subtitle: "Official chapter website — led end to end",
    description:
      "Led the development team architecting and shipping the official IETE Student Forum site. Defined the full stack, established CI/CD via GitHub Actions, and drove delivery from system design to production — with code review workflows adopted across the chapter.",
    metric: "CI/CD",
    metricLabel: "github actions → production",
    tags: ["React", "TypeScript", "Tailwind", "PostgreSQL"],
    size: "lg",
    motif: "net",
  },
];

export const stack: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["Python", "C", "JavaScript", "TypeScript", "SQL", "Assembly", "Verilog"],
  },
  {
    category: "AI / ML",
    items: ["PyTorch", "scikit-learn", "RAG", "LangChain", "Hugging Face", "XGBoost", "Gemini API", "SHAP"],
  },
  {
    category: "Web & Backend",
    items: ["React", "Tailwind CSS", "Vite", "Three.js", "Node.js", "Express", "FastAPI", "Flask", "Docker"],
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
  { period: "Jun 2025 — Present",
    title: "Research & Projects",
    org: "Google Developer Groups",
    body: "Designed two end-to-end GCP projects (Vertex AI fine-tuning, Cloud Run deployment) for Google Cloud Study Jams. Mentored 15+ teams at Vision 2047 Hackathon on ML pipeline architecture, and hosted a DevSprint on open source and cybersecurity fundamentals.",
    tag: "experience",
  },
  {
    period: "Nov 2025 — Present",
    title: "Development Lead",
    org: "IETE Student Forum",
    body: "Leading the dev team behind the official chapter website — full-stack definition, CI/CD via GitHub Actions, and code review culture adopted across the chapter.",
    tag: "experience",
  },
  {
    period: "2024 — 2028",
    title: "B.E. Electronics & Telecommunication",
    org: "R.V. College of Engineering, Bengaluru",
    body: "Undergraduate engineering across signals, silicon and software — from Verilog and FPGA labs to production cloud systems.",
    tag: "education",
  },
  {
    period: "2021 — 2023",
    title: "Higher Secondary",
    org: "Amity International School, Ghaziabad",
    body: "Physics, Chemistry, Maths and Computer Science — where the obsession with making machines do things began.",
    tag: "education",
  }
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export const FORMSPREE_ID = "https://formspree.io/f/xwvwddyv";
