import { useEffect, useState } from "react";
import { profile } from "../data/content";
import { ScrollSmoother } from "../lib/gsap";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <div
        className="footer__giant"
        data-cursor
        onClick={() => ScrollSmoother.get()?.scrollTo(0, true)}
        title="Back to top"
      >
        Krish Jeswal
      </div>
      <div className="footer__row">
        <p>local time {time} IST</p>
        <p>© {new Date().getFullYear()} Krish Jeswal — Bengaluru, IN</p>
        <ul className="footer__socials">
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </li>
          <li>
            <a href={profile.website} target="_blank" rel="noreferrer">Website</a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>Email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
