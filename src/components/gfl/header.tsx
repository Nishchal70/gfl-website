"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, type PageId } from "@/lib/pages";

export function Header({
  page,
  onNavigate,
}: {
  page: PageId;
  onNavigate: (page: PageId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (p: PageId) => {
    onNavigate(p);
    setOpen(false);
  };

  return (
    <header
      className={
        "sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-shadow duration-300 " +
        (scrolled ? "shadow-md" : "shadow-sm")
      }
    >
      <div className="max-w-6xl mx-auto h-20 px-5 flex items-center justify-between">
        <button
          aria-label="GFL Home"
          onClick={() => go("home")}
          className="header-brand flex items-center gap-2"
        >
          <Image
            src="/assets/gfl-logo.png"
            alt="GFL logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
          <span className="brand-font text-3xl text-red-600">GFL</span>
        </button>

        <nav className="hidden md:flex gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={
                "px-3 py-2 text-sm font-semibold rounded-lg transition-colors " +
                (page === item.id
                  ? "text-red-700 bg-red-50 shadow-[inset_0_0_0_1px_rgba(229,22,13,0.14)]"
                  : "text-zinc-700 hover:bg-red-50 hover:text-red-700")
              }
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg border border-stone-200 transition-colors hover:bg-red-50 active:scale-95"
          aria-expanded={open}
          aria-controls="gfl-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="gfl-mobile-menu"
        className={"mobile-menu" + (open ? " mobile-menu-open" : "")}
        inert={!open}
      >
        <div>
          <nav
            className="md:hidden px-5 pb-4 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{ "--i": i } as React.CSSProperties}
                className={
                  "menu-item text-left px-4 py-3 rounded-lg transition-colors " +
                  (page === item.id
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-zinc-700 hover:bg-red-50 hover:text-red-700")
                }
                aria-current={page === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Thin red reading-progress bar along the header's bottom edge */}
      <div className="scroll-progress" aria-hidden="true">
        <div
          className="scroll-progress-bar"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  );
}
