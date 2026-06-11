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
        ".contact__title .line-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact__title", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".contact__grid",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact__grid", start: "top 85%" },
        }
      );
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
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  return (
    <section className="section contact" id="contact" ref={rootRef}>
      <h2 className="contact__title">
        <span className="line-mask" style={{ display: "block", overflow: "hidden" }}>
          <span className="line-inner" style={{ display: "block" }}>
            Let's build
          </span>
        </span>
        <span className="line-mask" style={{ display: "block", overflow: "hidden" }}>
          <span className="line-inner outline" style={{ display: "block" }}>
            something loud
          </span>
        </span>
      </h2>
      <div className="contact__grid">
        <div className="contact__info">
          <p>
            Open to research collaborations, internship opportunities and conversations about
            Software Architecture, Machine Learning Systems or anything with embedded electronics involved.
          </p>
          <ul className="contact__channels">
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
          <div className="form__field">
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" type="text" name="name" required autoComplete="name" />
          </div>
          <div className="form__field">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" type="email" name="email" required autoComplete="email" />
          </div>
          <div className="form__field">
            <label htmlFor="cf-msg">Message</label>
            <textarea id="cf-msg" name="message" rows={4} required />
          </div>
          <button className="form__submit" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Transmitting…" : "Send signal"} <span aria-hidden="true">→</span>
          </button>
          {status === "ok" && (
            <p className="form__status ok">// message received. I'll get back to you soon.</p>
          )}
          {status === "err" && (
            <p className="form__status err">
              // transmission failed — mail me directly at {profile.email}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
