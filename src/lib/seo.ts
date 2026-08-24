import { projects, isProjectSlug, projectBySlug } from "../data/projects";
import { profile, roles } from "../data/home";

export const SITE_URL = "https://krish-jeswal.web.app";
export const OG_IMAGE = `${SITE_URL}/og.png`;

export type PageMeta = {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly ogType: "website" | "article";
  /** Absolute URL. Case studies show their own screenshot; home shows the card. */
  readonly image: string;
  /** JSON-LD, already stringified. */
  readonly jsonLd: string;
};

const HOME_DESCRIPTION =
  "Krish Jeswal — machine-learning researcher, full-stack developer and embedded systems engineer. ML side-channel cryptanalysis on ASCAD, agentic retrieval systems, a multi-surface MCP toolchain, and graph-based indoor navigation.";

/**
 * The first two paragraphs of a case study's Capture section are its hook and
 * its summary, which is exactly what a search result or a link preview wants.
 * Taking them from the same data the page renders means the description can
 * never drift from the article.
 */
function describeProject(slug: string): string {
  if (!isProjectSlug(slug)) return HOME_DESCRIPTION;
  const project = projectBySlug(slug);
  const prose = project.sections.capture
    .filter((b) => b.kind === "lead" || b.kind === "body")
    .map((b) => (b.kind === "lead" || b.kind === "body" ? b.text : ""))
    .join(" ")
    // strip the inline markup the case-study renderer understands
    .replace(/[`*]/g, "");
  return prose.length > 300 ? `${prose.slice(0, 297).trimEnd()}…` : prose;
}

function homeJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    image: OG_IMAGE,
    email: `mailto:${profile.email}`,
    jobTitle: [...roles],
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [
      "Machine Learning",
      "Side-Channel Analysis",
      "Retrieval-Augmented Generation",
      "TypeScript",
      "Embedded Systems",
    ],
  });
}

function projectJsonLd(slug: string): string {
  const project = projectBySlug(slug as never);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${project.name} — ${project.subtitle}`,
    description: describeProject(slug),
    image: `${SITE_URL}${project.image}`,
    url: `${SITE_URL}/work/${project.slug}`,
    author: { "@type": "Person", name: profile.name, url: SITE_URL },
    datePublished: project.year,
    about: project.domain,
    isPartOf: { "@type": "WebSite", name: `${profile.name} — Portfolio`, url: SITE_URL },
  });
}

export function metaForPath(pathname: string): PageMeta {
  const slug = pathname.replace(/^\/work\//, "").replace(/\/$/, "");

  if (pathname.startsWith("/work/") && isProjectSlug(slug)) {
    const project = projectBySlug(slug);
    return {
      path: `/work/${project.slug}`,
      title: `${project.name} — ${profile.name}`,
      description: describeProject(slug),
      canonical: `${SITE_URL}/work/${project.slug}`,
      ogType: "article",
      image: `${SITE_URL}${project.image}`,
      jsonLd: projectJsonLd(slug),
    };
  }

  return {
    path: "/",
    title: `${profile.name} — ML Researcher, Full-Stack & Embedded Engineer`,
    description: HOME_DESCRIPTION,
    canonical: SITE_URL,
    ogType: "website",
    image: OG_IMAGE,
    jsonLd: homeJsonLd(),
  };
}

/** Every route the prerenderer and the sitemap need to cover. */
export const ROUTES: readonly string[] = [
  "/",
  ...projects.map((p) => `/work/${p.slug}`),
];
