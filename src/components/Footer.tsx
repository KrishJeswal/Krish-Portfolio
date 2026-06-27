import { useEffect, useState } from "react";
import { profile } from "../data/content";
import { ScrollSmoother } from "../lib/gsap";

export default function Footer() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const toTop = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(0, true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <button className="footer__giant" data-cursor onClick={toTop} aria-label="Back to top">
        Krish Jeswal
      </button>
      <div className="footer__row">
        <p className="tnum">local time {time} IST</p>
        <p>© {new Date().getFullYear()} Krish Jeswal — Bengaluru, IN</p>
        <ul className="footer__socials">
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer">
              Mail
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
