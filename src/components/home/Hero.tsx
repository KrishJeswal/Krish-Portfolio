import { Fragment, type RefObject } from "react";
import { roles } from "../../data/home";

const WORDS = ["KRISH", "JESWAL"] as const;

/**
 * The hero's own markup, kept separate because the cursor blob renders a
 * second copy of it. Rendering the component again — rather than cloning the
 * DOM — keeps the copy in sync with the deal animation for free.
 */
export function HeroContent({
  play,
  elRef,
}: {
  play: boolean;
  elRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className={`hero-stack${play ? " is-dealt" : ""}`} ref={elRef}>
      <h1 className="hero-name">
        {WORDS.map((word, i) => (
          <span className="hero-word" data-deal={i} key={word}>
            {word}
          </span>
        ))}
      </h1>
      <div className="hero-roles">
        {roles.map((role, i) => (
          <Fragment key={role}>
            {i > 0 && <span className="role-bar" aria-hidden="true" />}
            <span className="role">{role}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Hero({
  play,
  sectionRef,
  contentRef,
}: {
  play: boolean;
  /** The blob's hit area — the whole panel. */
  sectionRef: RefObject<HTMLElement | null>;
  /** What the blob draws a copy of — just the text block. */
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="panel panel--centred" id="hero" aria-label="Hero" ref={sectionRef}>
      <HeroContent play={play} elRef={contentRef} />
    </section>
  );
}
