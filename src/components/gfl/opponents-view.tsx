"use client";

import Image from "next/image";
import { RichText } from "@/components/gfl/rich-text";
import { Reveal } from "@/components/gfl/reveal";
import { useSiteContent } from "@/components/gfl/site-content-context";

/**
 * "A Letter to Opponents" — a friendly page a war opponent lands on after
 * clicking the hero button. Explains the farm-war deal and offers contact
 * channels (WhatsApp / Telegram / Discord / BAND).
 */
export function OpponentsView() {
  const c = useSiteContent().opponents;

  const contacts = [
    {
      label: c.whatsappLabel,
      url: c.whatsappUrl,
      src: "/icons/whatsapp.png",
      fill: false,
      tint: "bg-green-50 border-green-100",
      shadow: "shadow-[0_10px_22px_rgba(37,211,102,0.35)]",
    },
    {
      label: c.discordLabel,
      url: c.discordUrl,
      src: "/icons/discord.png",
      fill: false,
      tint: "bg-indigo-50 border-indigo-100",
      shadow: "shadow-[0_10px_22px_rgba(88,101,242,0.35)]",
    },
    {
      label: c.telegramLabel,
      url: c.telegramUrl,
      src: "/icons/telegram.png",
      fill: false,
      tint: "bg-sky-50 border-sky-100",
      shadow: "shadow-[0_10px_22px_rgba(34,158,217,0.35)]",
    },
    {
      label: c.bandLabel,
      url: c.bandUrl,
      src: "/icons/band.jpg",
      fill: true,
      tint: "bg-emerald-50 border-emerald-100",
      shadow: "shadow-[0_10px_22px_rgba(3,199,90,0.35)]",
    },
  ];

  return (
    <main className="grid-bg py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-5">
        <Reveal className="text-center mb-10">
          <p className="font-bold tracking-[0.25em] text-red-700 text-sm uppercase">
            {c.eyebrow}
          </p>
          <h1 className="display text-4xl md:text-5xl uppercase mt-4">
            {c.title}
          </h1>
          <div className="red-line" aria-hidden="true" />
        </Reveal>

        <Reveal delay={90}>
          <article className="gfl-card p-7 md:p-11 text-lg leading-8 text-zinc-700">
            <p className="font-bold text-xl text-zinc-900">{c.greeting}</p>
            <RichText text={c.body} className="mt-4" />

            <h2 className="display text-2xl md:text-3xl uppercase text-red-700 mt-10">
              {c.tryTitle}
            </h2>
            <RichText text={c.tryBody} className="mt-3" />
            <p className="mt-4 font-semibold text-zinc-800">
              {c.contactIntro}
            </p>
          </article>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {contacts.map((ct, i) => (
            <Reveal key={ct.label} delay={i * 70} className="h-full">
              <a
                href={ct.url}
                target="_blank"
                rel="noreferrer"
                className="h-full flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-stone-300"
              >
                <span
                  className={`h-14 w-14 rounded-2xl grid place-items-center overflow-hidden border ${ct.tint} ${ct.shadow}`}
                >
                  <Image
                    src={ct.src}
                    alt=""
                    width={40}
                    height={40}
                    className={`h-10 w-10 ${ct.fill ? "object-cover rounded-[10px]" : "object-contain"}`}
                  />
                </span>
                <span className="text-sm font-bold text-zinc-800">
                  {ct.label}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-10 rounded-2xl bg-red-50 border border-red-100 p-7 text-center">
            <p className="text-lg font-semibold text-red-900">{c.thanks}</p>
            <p className="brand-font text-2xl text-red-600 mt-2">
              {c.signature}
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
