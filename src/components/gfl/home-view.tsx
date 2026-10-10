"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, ShieldCheck, Swords } from "lucide-react";
import { SectionTitle } from "@/components/gfl/section-title";
import { RichText } from "@/components/gfl/rich-text";
import { Reveal } from "@/components/gfl/reveal";
import { useSiteContent } from "@/components/gfl/site-content-context";
import type { PageId } from "@/lib/pages";

const HeroArt = dynamic(() => import("@/components/gfl/hero-art"), {
  ssr: false,
});

const GLOBAL_CHAT_URL =
  "https://link.clashofclans.com/?action=OpenGlobalChat&chatId=Pfb0ca7b465354a2896bdf798cd9d72be";

const STAT_ICONS = [Users, ShieldCheck, Swords];

/**
 * Counts a numeric stat up from 0 the first time it scrolls into view.
 * Non-numeric values (or missing IntersectionObserver) render as-is.
 * Supports prefixes/suffixes and thousand separators ("135+", "2,500", "2019").
 */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!match || typeof IntersectionObserver === "undefined") return;
    const [, prefix, numRaw, suffix] = match;
    const target = Number(numRaw.replace(/,/g, ""));
    if (!Number.isFinite(target) || target <= 0) return;
    const useCommas = numRaw.includes(",");
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        const duration = 1300;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          const n = Math.round(target * eased);
          setDisplay(
            prefix +
              (useCommas ? n.toLocaleString("en-US") : String(n)) +
              suffix,
          );
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{display ?? value}</span>;
}

function Hero({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const home = useSiteContent().home;

  return (
    <section className="hero relative overflow-hidden">
      <div className="hero-art" aria-hidden="true">
        <HeroArt />
      </div>
      <div className="hero-copy-wrap max-w-6xl mx-auto px-5 pt-24 pb-32 relative">
        <div className="max-w-xl hero-copy">
          <p className="font-bold tracking-[0.25em] text-red-700 text-sm">
            {home.heroEyebrow}
          </p>
          <h1 className="display text-6xl md:text-8xl leading-[0.86] mt-5">
            <span className="text-zinc-950">{home.heroLine1}</span>
            <br />
            <span className="text-red-600">{home.heroLine2}</span>
            <br />
            <span className="text-zinc-950">{home.heroLine3}</span>
          </h1>
          <p className="hero-desc mt-8 max-w-lg text-lg md:text-xl leading-relaxed">
            {home.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("how-to-join")}
              className="gfl-btn px-7 py-4 rounded-xl font-bold min-h-11"
            >
              {home.primaryCta}
            </button>
            <button
              onClick={() => onNavigate("opponents")}
              className="inline-flex items-center gap-2 bg-white px-5 py-4 rounded-xl font-bold border border-stone-200/80 shadow-sm min-h-11 transition-all hover:bg-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <Swords
                className="h-5 w-5 shrink-0 text-red-600"
                aria-hidden="true"
              />
              {home.opponentCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const home = useSiteContent().home;
  return (
    <section className="max-w-5xl mx-auto px-5 -mt-12 relative z-10">
      <Reveal>
        <div className="gfl-card grid grid-cols-3 divide-x divide-stone-200">
          {home.stats.map((stat, i) => {
            const Icon = STAT_ICONS[i] ?? Users;
            return (
              <div key={`${stat.label}-${i}`} className="p-5 text-center">
                <Icon
                  className="h-7 w-7 mx-auto text-red-600"
                  aria-hidden="true"
                />
                <b className="display text-2xl text-red-600 block mt-1">
                  <StatValue value={stat.value} />
                </b>
                <div className="text-[10px] font-bold tracking-wide">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function About({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const home = useSiteContent().home;
  return (
    <section className="grid-bg py-24">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>{home.aboutTitle}</SectionTitle>
        <Reveal delay={90}>
          <RichText
            text={home.aboutBody}
            className="gfl-card p-7 md:p-11 text-lg leading-8 text-zinc-700"
          />
        </Reveal>
        <Reveal delay={170}>
          <div className="text-center mt-9">
            <button
              onClick={() => onNavigate("overview")}
              className="inline-flex items-center gap-2 gfl-btn px-8 py-4 rounded-xl font-bold"
            >
              {home.secondaryCta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChatSection() {
  const home = useSiteContent().home;
  return (
    <section className="grid-bg py-24">
      <div className="max-w-3xl mx-auto px-5">
        <SectionTitle>{home.chatTitle}</SectionTitle>
        <Reveal delay={90}>
          <div className="gfl-card p-6 md:p-9 text-center">
            <div className="media-zoom w-64 max-w-full mx-auto rounded-xl border border-stone-200">
              <Image
                src="/assets/gfl-global-chat-qr.jpeg"
                alt="Official GFL Global Chat QR code"
                width={256}
                height={256}
                className="w-full h-auto"
              />
            </div>
            <p className="mt-5 text-sm text-zinc-600">{home.chatDescription}</p>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <div className="text-center mt-8">
            <a
              href={GLOBAL_CHAT_URL}
              className="inline-block gfl-btn px-8 py-4 rounded-xl font-bold"
            >
              {home.chatButtonLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeView({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <Stats />
      <About onNavigate={onNavigate} />
      <ChatSection />
    </main>
  );
}
