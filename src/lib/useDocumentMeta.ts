import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaForPath } from "./seo";

function setTag(selector: string, attr: string, value: string): void {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Keeps the document's metadata in step with the route during client-side
 * navigation. Crawlers never need this — they read the prerendered HTML for
 * whichever URL they fetched — but without it the tab title and canonical
 * would keep whatever the first-loaded page baked in.
 *
 * Reads from the same metaForPath the prerender uses, so the two cannot drift.
 */
export function useDocumentMeta(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    document.title = meta.title;
    setTag('meta[name="description"]', "content", meta.description);
    setTag('link[rel="canonical"]', "href", meta.canonical);
    setTag('meta[property="og:title"]', "content", meta.title);
    setTag('meta[property="og:description"]', "content", meta.description);
    setTag('meta[property="og:url"]', "content", meta.canonical);
    setTag('meta[property="og:image"]', "content", meta.image);
  }, [pathname]);
}
