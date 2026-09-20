"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Users, ShieldCheck, Swords } from "lucide-react";
import { SectionTitle } from "@/components/gfl/section-title";
import type { PageId } from "@/lib/pages";

const HeroArt = dynamic(() => import("@/components/gfl/hero-art"), {
  ssr: false,
});

const GLOBAL_CHAT_URL =
  "https://link.clashofclans.com/?action=OpenGlobalChat&chatId=Pfb0ca7b465354a2896bdf798cd9d72be";

function Hero({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <section className="hero relative overflow-hidden">
      <div className="hero-art" aria-hidden="true">
        <HeroArt />
      </div>
      <div className="max-w-6xl mx-auto px-5 pt-24 pb-32 relative">
        <div className="max-w-xl hero-copy">
          <p className="font-bold tracking-[0.25em] text-red-700 text-sm">
            COOPERATIVE CLAN WAR COMMUNITY
          </p>
          <h1 className="display text-6xl md:text-8xl leading-[0.86] mt-5">
            <span className="text-zinc-950">GLOBAL</span>
            <br />
            <span className="text-red-600">FARMING</span>
            <br />
            <span className="text-zinc-950">LEAGUE</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg md:text-xl leading-relaxed">
            Unlock the ultimate Clash of Clans progression strategy. Join 135+
            active clans participating in synchronized farming wars and enjoy
            stress-free growth with guaranteed massive loot payouts every 48
            hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("how-to-join")}
              className="gfl-btn px-7 py-4 rounded-xl font-bold min-h-11"
            >
              Join GFL Today
            </button>
            <button
              onClick={() => onNavigate("overview")}
              className="bg-white px-7 py-4 rounded-xl font-bold hover:bg-stone-100 transition-colors min-h-11"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { icon: Users, value: "135+", label: "ACTIVE CLANS" },
    { icon: ShieldCheck, value: "2019", label: "FOUNDED" },
    { icon: Swords, value: "1200+", label: "WARS COMPLETED" },
  ];
  return (
    <section className="max-w-5xl mx-auto px-5 -mt-12 relative z-10">
      <div className="gfl-card grid grid-cols-3 divide-x divide-stone-200">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="p-5 text-center">
            <Icon className="h-7 w-7 mx-auto text-red-600" aria-hidden="true" />
            <b className="display text-2xl text-red-600 block mt-1">{value}</b>
            <div className="text-[10px] font-bold tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="grid-bg py-24">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>About Us</SectionTitle>
        <div className="gfl-card p-7 md:p-11 text-lg leading-8 text-zinc-700">
          Founded in 2019, the <b>Global Farming League (GFL)</b> is a
          cooperative community of <b>135+ clans</b> dedicated to stress-free
          progression. We coordinate synchronized matchmaking using the{" "}
          <b>Western Sahara location</b> so our clans consistently match
          against each other. Inside our wars, members use standardized,
          easy-to-clear <span className="text-red-700 underline font-bold">base layouts</span>{" "}
          to ensure both sides achieve maximum star counts. This system
          guarantees that players earn massive war loot while clans rapidly
          level up their XP with minimal effort. Beyond matchmaking, our
          dedicated staff team on BAND provides expert war support, mismatch
          analysis, and blacklist protection. GFL is the ultimate home for
          clans looking to maximize their rewards without the pressure of
          competitive gaming.
        </div>
      </div>
    </section>
  );
}

function ChatSection() {
  return (
    <section className="grid-bg py-24">
      <div className="max-w-3xl mx-auto px-5">
        <SectionTitle>Join the Global Chat of GFL</SectionTitle>
        <div className="gfl-card p-6 md:p-9 text-center">
          <Image
            src="/assets/gfl-global-chat-qr.jpeg"
            alt="Official GFL Global Chat QR code"
            width={256}
            height={256}
            className="w-64 max-w-full mx-auto rounded-xl border border-stone-200"
          />
          <p className="mt-5 text-sm text-zinc-600">
            Scan the official QR code or use the button below to join the GFL
            Global Chat.
          </p>
        </div>
        <div className="text-center mt-8">
          <a
            href={GLOBAL_CHAT_URL}
            className="inline-block gfl-btn px-8 py-4 rounded-xl font-bold"
          >
            Join GFL Global Chat
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
