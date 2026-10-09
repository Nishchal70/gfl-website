"use client";

import Image from "next/image";
import { NAV_ITEMS, type PageId } from "@/lib/pages";

export function Footer({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const year = new Date().getFullYear();

  return (
    <footer className="gfl-footer bg-stone-950 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="footer-brand flex items-center gap-2">
            <Image
              src="/assets/gfl-logo.png"
              alt="GFL logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <span className="brand-font text-2xl text-red-500">GFL</span>
          </div>
          <p className="text-sm text-stone-400 mt-3">
            Global Farming League · Cooperative Clash of Clans farming wars
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 content-start"
          aria-label="Footer navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="text-sm text-stone-400 hover:text-red-400 transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-5 mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between gap-2 text-xs text-stone-500">
        <p>© {year} Global Farming League. All rights reserved.</p>
        <p>Fan-made community site · Not affiliated with Supercell.</p>
      </div>
    </footer>
  );
}
