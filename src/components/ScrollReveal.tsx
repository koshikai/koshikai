"use client";

import { useEffect } from "react";

/**
 * Globally observes elements with the `.reveal` class and toggles
 * the `is-visible` class when they enter the viewport.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Unobserve once revealed for performance
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

