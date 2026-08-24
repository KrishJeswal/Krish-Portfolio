/**
 * Scrolling to a section.
 *
 * Never scrollIntoView: the home page's sections are sticky panels stacked on
 * each other, so the browser's idea of "into view" is the pinned position, not
 * the point in the document where that panel takes over. Compute the offset
 * from the document instead.
 */
export function scrollToElement(el: Element, offset = 0): void {
  const top = window.scrollY + el.getBoundingClientRect().top - offset;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

export function scrollToId(id: string, offset = 0): void {
  const el = document.getElementById(id);
  if (el) scrollToElement(el, offset);
}
