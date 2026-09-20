"use client";

import { useState } from "react";
import { usePageEditor } from "@/components/gfl/dashboard/use-page-editor";
import {
  EditorActions,
  TextAreaField,
  TextField,
} from "@/components/gfl/dashboard/editor-fields";
import { DEFAULT_CONTENT, type HomeContent } from "@/lib/site-content";

const STAT_ICONS_HINT = "Shown in order: clans, founded, wars.";

export function HomeEditor() {
  const { value, draft, set, dirty, saving, save, reset } =
    usePageEditor("home");

  const setStat = (index: number, patch: Partial<HomeContent["stats"][0]>) => {
    set(
      "stats",
      draft.stats.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Hero eyebrow text"
        value={draft.heroEyebrow}
        onChange={(v) => set("heroEyebrow", v)}
      />
      <div className="grid sm:grid-cols-3 gap-4">
        <TextField
          label="Hero line 1"
          value={draft.heroLine1}
          onChange={(v) => set("heroLine1", v)}
        />
        <TextField
          label="Hero line 2 (red)"
          value={draft.heroLine2}
          onChange={(v) => set("heroLine2", v)}
        />
        <TextField
          label="Hero line 3"
          value={draft.heroLine3}
          onChange={(v) => set("heroLine3", v)}
        />
      </div>
      <TextAreaField
        label="Hero description"
        value={draft.heroDescription}
        onChange={(v) => set("heroDescription", v)}
        rows={4}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Primary button"
          value={draft.primaryCta}
          onChange={(v) => set("primaryCta", v)}
        />
        <TextField
          label="Secondary button"
          value={draft.secondaryCta}
          onChange={(v) => set("secondaryCta", v)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold">Stats bar {STAT_ICONS_HINT}</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {draft.stats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 space-y-3">
              <TextField
                label={`Stat ${i + 1} value`}
                value={stat.value}
                onChange={(v) => setStat(i, { value: v })}
              />
              <TextField
                label="Label"
                value={stat.label}
                onChange={(v) => setStat(i, { label: v })}
              />
            </div>
          ))}
        </div>
      </div>

      <TextField
        label="About section title"
        value={draft.aboutTitle}
        onChange={(v) => set("aboutTitle", v)}
      />
      <TextAreaField
        label="About body"
        hint="Rich text: **bold**, __red underlined__, [link text](#base-layouts), blank line = new paragraph."
        value={draft.aboutBody}
        onChange={(v) => set("aboutBody", v)}
        rows={8}
      />
      <TextField
        label="Global chat section title"
        value={draft.chatTitle}
        onChange={(v) => set("chatTitle", v)}
      />
      <TextAreaField
        label="Global chat description"
        value={draft.chatDescription}
        onChange={(v) => set("chatDescription", v)}
        rows={2}
      />
      <TextField
        label="Global chat button label"
        value={draft.chatButtonLabel}
        onChange={(v) => set("chatButtonLabel", v)}
      />

      <EditorActions
        dirty={dirty}
        saving={saving}
        onSave={save}
        onReset={reset}
      />
    </div>
  );
}

export function OverviewEditor() {
  const { draft, set, dirty, saving, save, reset } = usePageEditor("overview");
  // Raw textarea state so blank lines typed mid-edit are preserved;
  // split(/(\n{2,})/) round-trips losslessly through join("\n\n").
  const [raw, setRaw] = useState(draft.paragraphs.join("\n\n"));

  const handleReset = () => {
    reset();
    setRaw(DEFAULT_CONTENT.overview.paragraphs.join("\n\n"));
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Page title"
        value={draft.title}
        onChange={(v) => set("title", v)}
      />
      <TextField
        label="Subtitle"
        value={draft.subtitle}
        onChange={(v) => set("subtitle", v)}
      />
      <TextAreaField
        label="Paragraphs"
        hint="Separate paragraphs with a blank line."
        value={raw}
        onChange={(v) => {
          setRaw(v);
          set("paragraphs", v.split(/\n{2,}/));
        }}
        rows={14}
      />
      <EditorActions
        dirty={dirty}
        saving={saving}
        onSave={save}
        onReset={handleReset}
      />
    </div>
  );
}
