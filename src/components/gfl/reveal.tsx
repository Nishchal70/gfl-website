"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper: children fade/slide in the first time they enter
 * the viewport (IntersectionObserver). Falls back to always-visible when
 * the observer API is unavailable; reduced-motion users get no motion via
 * the global prefers-reduced-motion rule (transition durations ~0).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Ancient browser fallback: reveal without motion, asynchronously.
      const id = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        "reveal" + (shown ? " reveal-in" : "") + (className ? ` ${className}` : "")
      }
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
