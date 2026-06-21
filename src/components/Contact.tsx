import { useRef, useState, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { profile, FORMSPREE_ID } from "../data/content";

type Status = "idle" | "sending" | "ok" | "err";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".contact__title .ln > span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact__title", start: "top 88%", once: true },
        }
      );
      gsap.from(".contact__grid", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact__grid", start: "top 88%", once: true },
      });
    },
    { scope: rootRef }
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ID, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else setStatus("err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <section className="sec contact" id="contact" ref={rootRef}>
      <h2 className="contact__title">
        <span className="ln">
          <span>Open a</span>
        </span>
        <span className="ln">
          <span className="stroke">channel</span>
        </span>
      </h2>

      <div className="contact__grid">
        <div>
          <p className="contact__lead">
            Open to research collaborations, internships, and conversations about ML systems, software
            architecture, or anything with silicon underneath.
          </p>
          <ul className="channels">
            <li>
              <a href={`mailto:${profile.email}`} data-cursor>
                <span>email</span>
                {profile.email}
              </a>
            </li>
            <li>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} data-cursor>
                <span>phone</span>
                {profile.phone}
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" data-cursor>
                <span>github</span>
                github.com/KrishJeswal
              </a>
            </li>
            <li>
              <a href={profile.website} target="_blank" rel="noreferrer" data-cursor>
                <span>site</span>
                krish-jeswal.web.app
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field-row">
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" type="text" name="name" required autoComplete="name" placeholder="Who's transmitting?" />
          </div>
          <div className="field-row">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" type="email" name="email" required autoComplete="email" placeholder="you@domain.com" />
          </div>
          <div className="field-row">
            <label htmlFor="cf-msg">Message</label>
            <textarea id="cf-msg" name="message" rows={4} required placeholder="The signal…" />
          </div>
          <button className="submit" type="submit" disabled={status === "sending"} data-cursor>
            {status === "sending" ? "Transmitting…" : "Transmit"} <span aria-hidden="true">→</span>
          </button>
          {status === "ok" && (
            <p className="form-status ok" role="status">
              Signal received — I’ll respond shortly.
            </p>
          )}
          {status === "err" && (
            <p className="form-status err" role="alert">
              Transmission failed — reach me directly at {profile.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
