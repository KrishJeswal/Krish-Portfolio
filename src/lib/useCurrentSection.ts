import { useEffect, useState } from "react";

/*
  The observed band is 5% of the viewport, 40% from the top. Only the section
  crossing that line intersects it, so tall sections never report together.
*/
export function useCurrentSection(ids: readonly string[], key = ""): string {
  const [current, setCurrent] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, key]);

  return current;
}
