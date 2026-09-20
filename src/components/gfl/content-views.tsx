"use client";

import { LayoutTemplate } from "lucide-react";
import { SectionTitle } from "@/components/gfl/section-title";
import { RichText } from "@/components/gfl/rich-text";
import { useSiteContent } from "@/components/gfl/site-content-context";

const ENTRY_URL = "https://band.us/@gflentry";

export function OverviewView() {
  const overview = useSiteContent().overview;
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle sub={overview.subtitle}>{overview.title}</SectionTitle>
        <div className="gfl-card p-7 md:p-12 space-y-6 text-lg leading-8 text-zinc-700">
          {overview.paragraphs.map((paragraph, i) => (
            <RichText key={i} text={paragraph} />
          ))}
        </div>
      </div>
    </main>
  );
}

export function HowToJoinView() {
  const c = useSiteContent()["how-to-join"];
  return (
    <main className="grid-bg py-20">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>{c.title}</SectionTitle>
        <div className="gfl-card p-7 md:p-10 text-lg leading-8 text-zinc-700">
          <RichText text={c.intro} />

          <div className="grid md:grid-cols-2 gap-5 my-9">
            <div className="border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-red-700">
                {c.entryCardTitle}
              </h3>
              <RichText
                text={c.entryCardBody}
                className="mt-3 text-lg leading-8"
              />
              <a
                href={ENTRY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block gfl-btn px-5 py-3 rounded-xl font-bold mt-5"
              >
                {c.entryButtonLabel}
              </a>
            </div>
            <div className="border border-stone-200 rounded-2xl p-6">
              <h3 className="font-bold text-xl">{c.communityCardTitle}</h3>
              <RichText
                text={c.communityCardBody}
                className="mt-3 text-lg leading-8"
              />
              <button
                disabled
                className="mt-5 px-5 py-3 rounded-xl font-bold border border-stone-200 text-stone-400 cursor-not-allowed"
              >
                {c.communityButtonLabel}
              </button>
            </div>
          </div>

          <h3 className="display text-3xl uppercase">{c.requirementsTitle}</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {c.requirements.map((item) => (
              <div className="bg-stone-50 rounded-xl p-5" key={item.title}>
                <b>{item.title}</b>
                <RichText text={item.body} className="text-base mt-1" />
              </div>
            ))}
          </div>

          <h3 className="display text-3xl uppercase mt-10">
            {c.transitionTitle}
          </h3>
          <div className="space-y-5 mt-5">
            {c.steps.map((item) => (
              <div key={item.title}>
                <b className="text-red-700">{item.title}</b>
                <RichText text={item.body} />
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-red-50 border border-red-100">
            <b className="text-red-800">{c.securityTitle}</b>
            <RichText
              text={c.securityBody}
              className="mt-2 text-lg leading-8"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export function BattleStyleView() {
  const c = useSiteContent()["battle-style"];
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle>{c.title}</SectionTitle>
        <article className="gfl-card p-7 md:p-12 text-lg leading-8 text-zinc-700">
          <RichText text={c.intro} />
          {c.mechanics.map((item) => (
            <section className="mt-8" key={item.title}>
              <h3 className="font-bold text-xl text-red-700">{item.title}</h3>
              <RichText text={item.body} />
            </section>
          ))}
          <div className="mt-8 bg-stone-50 p-6 rounded-2xl">
            <h3 className="font-bold">{c.pointsTitle}</h3>
            <RichText text={c.pointsBody} />
            <h3 className="font-bold mt-4">{c.winnerTitle}</h3>
            <RichText text={c.winnerBody} />
            <h3 className="font-bold mt-4">{c.executionTitle}</h3>
            <RichText text={c.executionWinner} />
            <RichText text={c.executionLoser} className="mt-1" />
          </div>
        </article>
      </div>
    </main>
  );
}

export function AssistanceView() {
  const assistance = useSiteContent().assistance;
  return (
    <section className="grid-bg py-20">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>{assistance.title}</SectionTitle>
        <div className="grid md:grid-cols-2 gap-5">
          {assistance.items.map((item) => (
            <div className="gfl-card p-6" key={item.title}>
              <h3 className="font-bold text-xl text-red-700">{item.title}</h3>
              <RichText
                text={item.body}
                className="mt-3 leading-7 text-zinc-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BaseLayoutsView() {
  const c = useSiteContent()["base-layouts"];
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle sub={c.subtitle}>{c.title}</SectionTitle>
        <div className="gfl-card p-10 md:p-14 text-center border-2 border-dashed border-stone-300">
          <LayoutTemplate
            className="h-12 w-12 mx-auto text-red-300"
            aria-hidden="true"
          />
          <p className="mt-4 font-bold text-red-700 text-lg">
            {c.placeholderTitle}
          </p>
          <RichText
            text={c.placeholderBody}
            className="mt-2 text-sm text-zinc-600 max-w-md mx-auto"
          />
        </div>
      </div>
    </main>
  );
}
