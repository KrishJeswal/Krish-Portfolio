import { useEffect, useRef, useState } from "react";
import { contactIntro, contactTabs, profile } from "../../data/home";
import SectionEyebrow from "./SectionEyebrow";

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Select it",
};

export default function Contact() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), 1400);
  };

  return (
    <section className="panel panel--centred" id="contact" aria-label="Contact">
      <SectionEyebrow id="contact" />
      <div className="contact">
        <div className="contact-folder">
          <div className="tab-row">
            {contactTabs.map((tab) => (
              <a className="tab" key={tab.label} href={tab.href} target="_blank" rel="noopener">
                <span style={{ minWidth: 0 }}>{tab.label}</span>
              </a>
            ))}
          </div>

          <div className="contact-card">
            <p className="contact-intro">{contactIntro}</p>
            <div className={`email-chip${state === "copied" ? " is-flashing" : ""}`}>
              <a className="email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button type="button" className="copy-btn" onClick={copy}>
                <span className={`copy-label${state === "copied" ? " is-copied" : ""}`}>
                  {LABELS[state]}
                </span>
                <span className="sr-only" role="status" aria-live="polite">
                  {state === "copied" ? "Email address copied" : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
        <span className="contact-place">{profile.location}</span>
      </div>
    </section>
  );
}
