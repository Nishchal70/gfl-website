"use client";

import { useState } from "react";
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

  const go = (p: PageId) => {
    onNavigate(p);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-6xl mx-auto h-20 px-5 flex items-center justify-between">
        <button
          aria-label="GFL Home"
          onClick={() => go("home")}
          className="flex items-center gap-2"
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
                  ? "text-red-700 bg-red-50"
                  : "hover:bg-stone-100")
              }
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg border border-stone-200"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden px-5 pb-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={
                "text-left px-4 py-3 rounded-lg transition-colors " +
                (page === item.id
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "hover:bg-red-50")
              }
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
