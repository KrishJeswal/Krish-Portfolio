/**
 * Build-time prerender.
 *
 * Every page's content is static typed data, so each route can be rendered to
 * real HTML at build time and served as a plain file. This is what puts the
 * case-study prose in front of anything that does not execute JavaScript —
 * AI crawlers, link unfurlers, Bing — and it removes React from the critical
 * path for first paint. The client bundle still loads and hydrates on top.
 *
 * Output shape matters for Firebase Hosting: static files are matched before
 * rewrites, so writing dist/work/<slug>/index.html means that URL is served
 * directly rather than falling through the SPA rewrite to the shell.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// pathToFileURL, not a bare path: on Windows a dynamic import of an absolute
// path is parsed as a URL with scheme "c:" and rejected by the ESM loader.
const { render, metaForPath, ROUTES, SITE_URL } = await import(
  pathToFileURL(join(root, ".ssr-build", "entry-server.js")).href
);

const template = readFileSync(join(dist, "index.html"), "utf8");

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function headFor(meta) {
  return [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${escape(meta.canonical)}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="Krish Jeswal" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${escape(meta.canonical)}" />`,
    `<meta property="og:image" content="${escape(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(meta.image)}" />`,
    `<script type="application/ld+json">${meta.jsonLd.replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}

let count = 0;
for (const route of ROUTES) {
  const meta = metaForPath(route);
  const appHtml = render(route);

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, "@@HEAD@@")
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace("@@HEAD@@", headFor(meta))
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outDir = route === "/" ? dist : join(dist, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html, "utf8");

  const words = appHtml.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  console.log(`  prerendered ${route.padEnd(20)} ${String(words).padStart(5)} words`);
  count += 1;
}

const today = new Date().toISOString().slice(0, 10);

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) =>
    `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`
).join("\n")}
</urlset>
`,
  "utf8"
);

writeFileSync(
  join(dist, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
  "utf8"
);

console.log(`  wrote sitemap.xml and robots.txt`);
console.log(`\n  ${count} routes prerendered`);
