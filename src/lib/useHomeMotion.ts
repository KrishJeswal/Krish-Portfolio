import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

const onView = (trigger: gsap.DOMTarget, start = "top 78%"): ScrollTrigger.Vars => ({
  trigger,
  start,
  toggleActions: "play none none none",
});

const draw = (targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) =>
  gsap.to(targets, { strokeDashoffset: 0, ease: "power2.inOut", duration: 1, ...vars });

function cover() {
  gsap
    .timeline({ delay: 0.1 })
    .from(".ghost", { y: 120, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" })
    .from(".cat", { y: 220, rotationX: 24, duration: 1.3, ease: "expo.out" }, "<0.1")
    .from(".cat-name .ch", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.035 }, "-=0.7")
    .fromTo(
      ".cat-body .line",
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.45, ease: "steps(40)" },
      "-=0.3",
    )
    .from(
      ".cat-foot, .cat-head .mono, .cat-call",
      { opacity: 0, y: 6, stagger: 0.08, duration: 0.5 },
      "-=0.4",
    )
    .from(".hero-foot span", { opacity: 0, y: 8, stagger: 0.1, duration: 0.5 }, "-=0.2")
    .from(".bar", { opacity: 0, duration: 0.6 }, "-=0.6");

  gsap.to(".hero-foot", {
    opacity: 0,
    y: -24,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "25% top", scrub: true },
  });
  gsap.to(".hero-stage", {
    scale: 0.84,
    rotationX: 22,
    yPercent: 10,
    filter: "brightness(.45)",
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

function tilt(): () => void {
  const card = document.querySelector<HTMLElement>(".cat");
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!card || !hero) return () => {};
  const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3" });
  const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3" });
  const move = (e: PointerEvent) => {
    ry((e.clientX / innerWidth - 0.5) * 6);
    rx(-(e.clientY / innerHeight - 0.5) * 5);
  };
  hero.addEventListener("pointermove", move);
  return () => hero.removeEventListener("pointermove", move);
}

function preface() {
  gsap.fromTo(
    ".preface h2 .w",
    { opacity: 0.14 },
    {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: ".preface h2", start: "top 82%", end: "bottom 45%", scrub: true },
    },
  );
  gsap.from(".preface-cols p, .preface-side > *", {
    y: 24,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "expo.out",
    scrollTrigger: onView(".preface-cols", "top 85%"),
  });
}

function desktopFields() {
  const guides = gsap.utils.toArray<HTMLElement>(".guide");
  guides.forEach((g, i) =>
    gsap.set(g, {
      zIndex: guides.length - i,
      transformOrigin: "50% 100%",
      backgroundColor: i ? "#8f8d87" : "#dcdad3",
    }),
  );
  draw(guides[0].querySelectorAll(".draw"), {
    duration: 1.4,
    stagger: 0.01,
    scrollTrigger: onView(".fields", "top 55%"),
  });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".fields",
      start: "top top",
      end: () => `+=${innerHeight * 1.8}`,
      pin: true,
      scrub: 0.7,
    },
  });
  guides.forEach((g, i) => {
    if (i === guides.length - 1) return;
    tl.to({}, { duration: 0.35 })
      .to(g, { rotationX: 72, yPercent: 26, ease: "power2.in", duration: 1 })
      .to(guides[i + 1], { backgroundColor: "#dcdad3", ease: "none", duration: 0.6 }, "<0.3")
      .set(g, { autoAlpha: 0 })
      .add(draw(guides[i + 1].querySelectorAll(".draw"), { duration: 0.7, stagger: 0.006 }), "-=0.35");
  });
  tl.to({}, { duration: 0.35 });
  gsap.from(".fields-head > *", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "expo.out",
    scrollTrigger: onView(".fields", "top 60%"),
  });
  gsap.from(".guide .tab", {
    y: 20,
    opacity: 0,
    stagger: 0.12,
    duration: 0.6,
    scrollTrigger: onView(".fields", "top 50%"),
  });
}

function desktopDrawer() {
  const stage = document.querySelector<HTMLElement>(".stage");
  const drawer = document.querySelector<HTMLElement>(".drawer");
  const cards = gsap.utils.toArray<HTMLElement>(".pcard");
  if (!stage || !drawer || !cards.length) return;

  const geo = () => {
    const sH = stage.clientHeight;
    const sW = stage.clientWidth;
    const dH = drawer.offsetHeight;
    const h = (i: number) => cards[i].offsetHeight;
    return {
      sW,
      cW: cards[0].offsetWidth,
      cH: h(0),
      inY: (i: number) => h(i) - dH - 30 + i * 13,
      upY: (i: number) => Math.max(18, (sH - dH - h(i)) / 2) - (sH - h(i)),
    };
  };

  cards.forEach((card, i) => gsap.set(card, { zIndex: 15 - i, y: () => geo().inY(i), rotate: 0 }));
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".work",
      start: "top top",
      end: () => `+=${innerHeight * cards.length * 1.15}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });
  gsap.from(".work-head > *", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: onView(".work", "top 60%"),
  });
  gsap.from(".drawer", { y: 120, duration: 1, ease: "expo.out", scrollTrigger: onView(".work", "top 40%") });

  const tilts = [-7, 5, -3, 8];
  cards.forEach((card, i) => {
    tl.set(card, { zIndex: 30 + i })
      .to(card, { y: () => geo().upY(i), ease: "power2.out", duration: 1 }, i ? "<0.45" : "+=0.1")
      .to(card.querySelectorAll(".draw"), { strokeDashoffset: 0, stagger: 0.01, duration: 0.6 }, "<0.35");
    if (i === cards.length - 1) return;
    tl.to({}, { duration: 0.55 }).to(card, {
      x: () => -(geo().sW / 2) + geo().cW * 0.2 + 46 + i * 6,
      y: () => geo().upY(i) + geo().cH * 0.12 + i * 14,
      scale: 0.4,
      rotate: tilts[i % tilts.length],
      ease: "power2.inOut",
      duration: 1,
    });
  });
  tl.to({}, { duration: 0.5 });
}

function mobileFieldsAndDrawer(): () => void {
  gsap.utils.toArray<HTMLElement>(".guide").forEach((card) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: onView(card, "top 90%"),
    });
    draw(card.querySelectorAll(".draw"), {
      stagger: 0.008,
      duration: 1.1,
      scrollTrigger: onView(card, "top 75%"),
    });
  });

  const stage = document.querySelector<HTMLElement>(".stage");
  const cards = gsap.utils.toArray<HTMLElement>(".pcard");
  if (!stage || !cards.length) return () => {};
  const fit = () => {
    stage.style.height = `${Math.max(...cards.map((c) => c.offsetHeight)) + 30}px`;
  };
  fit();
  cards.forEach((c, i) => gsap.set(c, { zIndex: i + 1, y: i ? () => stage.offsetHeight + 20 : 0 }));
  draw(cards[0].querySelectorAll(".draw"), {
    stagger: 0.01,
    duration: 1.2,
    scrollTrigger: onView(cards[0], "top 70%"),
  });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".work",
      start: "top top",
      end: () => `+=${innerHeight * (cards.length - 1) * 0.9}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefreshInit: fit,
    },
  });
  cards.forEach((card, i) => {
    if (!i) return;
    tl.to(card, { y: 0, ease: "power2.out", duration: 1 }, "+=0.2")
      .to(cards[i - 1], { scale: 0.92, y: -12, filter: "brightness(.5)", ease: "none", duration: 1 }, "<")
      .to(card.querySelectorAll(".draw"), { strokeDashoffset: 0, stagger: 0.01, duration: 0.6 }, "<0.4");
  });
  tl.to({}, { duration: 0.2 });
  return () => {
    stage.style.height = "";
  };
}

function index() {
  gsap.from(".index-head > *", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: onView(".index", "top 70%"),
  });
  gsap.from(".key", {
    y: 10,
    opacity: 0,
    stagger: 0.05,
    duration: 0.4,
    scrollTrigger: onView(".keys", "top 88%"),
  });
  gsap.utils.toArray<HTMLElement>(".idx-group").forEach((g) =>
    gsap.from(g.querySelectorAll(".idx-cat, .idx-e"), {
      opacity: 0,
      y: 10,
      stagger: 0.03,
      duration: 0.45,
      ease: "power2.out",
      scrollTrigger: onView(g, "top 92%"),
    }),
  );
}

function shelf() {
  gsap.from(".exp-head > *", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: onView(".exp", "top 70%"),
  });
  const books = gsap.utils.toArray<HTMLElement>(".book").reverse();
  const details = gsap.utils.toArray<HTMLElement>(".detail").reverse();
  const tilts = [-9, 7, -5, 6];
  const tl = gsap.timeline({ scrollTrigger: onView(".shelf", "top 72%") });
  tl.from(".shelf-base", { scaleX: 0, transformOrigin: "left", duration: 0.35 });
  books.forEach((book, i) => {
    tl.from(
      book,
      { y: -320 - i * 30, rotate: tilts[i % tilts.length], opacity: 0, duration: 0.42, ease: "power3.in" },
      i ? ">-0.08" : ">",
    )
      .to(book, { y: -5, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out" })
      .from(details[i], { x: 30, opacity: 0, duration: 0.4, ease: "expo.out" }, "<");
  });
}

function contact() {
  gsap
    .timeline({ scrollTrigger: onView(".contact", "top 60%") })
    .from(".contact h2", { yPercent: 30, opacity: 0, duration: 1, ease: "expo.out" })
    .from(".contact-lede, .contact .mono", { y: 20, opacity: 0, duration: 0.7 }, "-=0.6")
    .from(".slip", { y: 120, rotate: 10, opacity: 0, duration: 1, ease: "expo.out" }, 0.2)
    .from(".slip-row", { opacity: 0, x: -14, stagger: 0.08, duration: 0.4 }, "-=0.5");
}

export function useHomeMotion(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let untilt = () => {};
    const ctx = gsap.context(() => {
      cover();
      untilt = tilt();
      preface();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        desktopFields();
        desktopDrawer();
      });
      mm.add("(max-width: 900px)", mobileFieldsAndDrawer);
      index();
      shelf();
      contact();
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      untilt();
      ctx.revert();
    };
  }, []);
}
