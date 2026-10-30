import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaForPath } from "./seo";

function setTag(selector: string, attr: string, value: string): void {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Keeps title, description and canonical in step with client-side navigation. */
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
