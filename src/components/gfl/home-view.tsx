"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Users, ShieldCheck, Swords } from "lucide-react";
import { SectionTitle } from "@/components/gfl/section-title";
import { RichText } from "@/components/gfl/rich-text";
import { useSiteContent } from "@/components/gfl/site-content-context";
import type { PageId } from "@/lib/pages";

const HeroArt = dynamic(() => import("@/components/gfl/hero-art"), {
  ssr: false,
});

const GLOBAL_CHAT_URL =
  "https://link.clashofclans.com/?action=OpenGlobalChat&chatId=Pfb0ca7b465354a2896bdf798cd9d72be";

const STAT_ICONS = [Users, ShieldCheck, Swords];

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
              onClick={() => onNavigate("overview")}
              className="bg-white px-7 py-4 rounded-xl font-bold hover:bg-stone-100 transition-colors min-h-11"
            >
              {home.secondaryCta}
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
      <div className="gfl-card grid grid-cols-3 divide-x divide-stone-200">
        {home.stats.map((stat, i) => {
          const Icon = STAT_ICONS[i] ?? Users;
          return (
            <div key={`${stat.label}-${i}`} className="p-5 text-center">
              <Icon className="h-7 w-7 mx-auto text-red-600" aria-hidden="true" />
              <b className="display text-2xl text-red-600 block mt-1">
                {stat.value}
              </b>
              <div className="text-[10px] font-bold tracking-wide">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  const home = useSiteContent().home;
  return (
    <section className="grid-bg py-24">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>{home.aboutTitle}</SectionTitle>
        <RichText
          text={home.aboutBody}
          className="gfl-card p-7 md:p-11 text-lg leading-8 text-zinc-700"
        />
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
        <div className="gfl-card p-6 md:p-9 text-center">
          <Image
            src="/assets/gfl-global-chat-qr.jpeg"
            alt="Official GFL Global Chat QR code"
            width={256}
            height={256}
            className="w-64 max-w-full mx-auto rounded-xl border border-stone-200"
          />
          <p className="mt-5 text-sm text-zinc-600">{home.chatDescription}</p>
        </div>
        <div className="text-center mt-8">
          <a
            href={GLOBAL_CHAT_URL}
            className="inline-block gfl-btn px-8 py-4 rounded-xl font-bold"
          >
            {home.chatButtonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export function HomeView({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Stats />
      <About />
      <ChatSection />
    </>
  );
}
