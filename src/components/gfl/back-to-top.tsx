"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

/**
 * Floating back-to-top button: appears after the visitor scrolls past the
 * hero, smooth-scrolls back to the top. Hidden (and untabbable) while idle.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={"back-to-top" + (show ? " back-to-top-in" : "")}
    >
      <ChevronUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
