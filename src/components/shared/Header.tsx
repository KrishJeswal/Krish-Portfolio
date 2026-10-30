import { useEffect, useRef, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { prefersReducedMotion, scrollToId, scrollToTop } from "../../lib/motion";

export type NavItem = { readonly id: string; readonly label: string; readonly number?: string };

export default function Header({
  items,
  current,
  home,
}: {
  items: readonly NavItem[];
  current: string;
  home: "top" | "route";
}): ReactElement {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const label = items.find((i) => i.id === current)?.label ?? items[0].label;

  useEffect(() => {
    if (!valueRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      valueRef.current,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
    );
  }, [label]);

  useEffect(() => {
    if (!open) return;
    if (menuRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power3.out" },
      );
    }
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="bar">
      {home === "route" ? (
        <Link className="chip bar-name" to="/">
          Krish Jeswal
        </Link>
      ) : (
        <a
          className="chip bar-name"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId(items[0].id);
          }}
        >
          Krish Jeswal
        </a>
      )}
      <div className="nav" ref={navRef}>
        <button
          ref={buttonRef}
          className="chip nav-btn"
          type="button"
          aria-expanded={open}
          aria-controls="navmenu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-l">Now reading</span>
          <span className="nav-v" ref={valueRef}>
            {label}
          </span>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <ul id="navmenu" className="nav-menu paper" ref={menuRef} hidden={!open}>
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === current ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  if (i === 0) scrollToTop();
                  else scrollToId(item.id);
                }}
              >
                {item.number !== undefined && <b>{item.number}</b>}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
