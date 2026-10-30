import { useEffect, useRef, useState, type ReactElement } from "react";
import { contact, profile } from "../../data/home";

type CopyState = "idle" | "copied" | "manual";
const LABEL: Record<CopyState, string> = { idle: "Copy email", copied: "Copied", manual: "Press Ctrl+C" };

export default function RequestSlip(): ReactElement {
  const [state, setState] = useState<CopyState>("idle");
  const emailRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setState("copied");
    } catch {
      if (emailRef.current) window.getSelection()?.selectAllChildren(emailRef.current);
      setState("manual");
    }
  };

  return (
    <section id="contact" className="contact sheet light">
      <div className="wrap">
        <div>
          <span className="mono">Contact</span>
          <h2>
            {contact.heading[0]}
            <br />
            {contact.heading[1]}
          </h2>
          <p className="contact-lede">{contact.lede}</p>
        </div>
        <div className="slip paper">
          <div className="slip-title">
            <span>REQUEST SLIP</span>
            <span>No. 0001</span>
          </div>
          <div className="slip-row">
            <span className="l">Borrower</span>
            <span>{contact.slip.borrower}</span>
          </div>
          <div className="slip-row">
            <span className="l">Item</span>
            <span>{contact.slip.item}</span>
          </div>
          <div className="slip-row">
            <span className="l">Deliver to</span>
            <a className="email" href={`mailto:${profile.email}`} ref={emailRef}>
              {profile.email}
            </a>
          </div>
          <div className="slip-row">
            <span className="l">Also at</span>
            <span>
              {contact.links.map((l, i) => (
                <span key={l.label}>
                  {i > 0 && " · "}
                  <a href={l.href}>{l.label}</a>
                </span>
              ))}
            </span>
          </div>
          <div className="slip-actions">
            <button className="copy" type="button" onClick={copy}>
              {LABEL[state]}
            </button>
            <span className="sr-only" aria-live="polite">
              {state === "copied" ? "Email copied" : ""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
