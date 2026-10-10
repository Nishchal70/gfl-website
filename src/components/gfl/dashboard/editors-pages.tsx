"use client";

import { usePageEditor } from "@/components/gfl/dashboard/use-page-editor";
import {
  EditorActions,
  ListEditor,
  TextAreaField,
  TextField,
} from "@/components/gfl/dashboard/editor-fields";

export function HowToJoinEditor() {
  const { draft, set, dirty, saving, save, reset } =
    usePageEditor("how-to-join");

  return (
    <div className="space-y-5">
      <TextField
        label="Page title"
        value={draft.title}
        onChange={(v) => set("title", v)}
      />
      <TextAreaField
        label="Intro"
        value={draft.intro}
        onChange={(v) => set("intro", v)}
        rows={3}
      />

      <TextField
        label="Entry BAND card title"
        value={draft.entryCardTitle}
        onChange={(v) => set("entryCardTitle", v)}
      />
      <TextAreaField
        label="Entry BAND card body"
        value={draft.entryCardBody}
        onChange={(v) => set("entryCardBody", v)}
        rows={3}
      />
      <TextField
        label="Entry BAND button label"
        value={draft.entryButtonLabel}
        onChange={(v) => set("entryButtonLabel", v)}
      />
      <TextField
        label="Entry BAND button link URL"
        value={draft.entryButtonUrl}
        onChange={(v) => set("entryButtonUrl", v)}
      />

      <TextField
        label="Community card title"
        value={draft.communityCardTitle}
        onChange={(v) => set("communityCardTitle", v)}
      />
      <TextAreaField
        label="Community card body"
        value={draft.communityCardBody}
        onChange={(v) => set("communityCardBody", v)}
        rows={3}
      />
      <TextField
        label="Community BAND button label"
        value={draft.communityButtonLabel}
        onChange={(v) => set("communityButtonLabel", v)}
      />
      <TextField
        label="Community BAND button link URL"
        value={draft.communityButtonUrl}
        onChange={(v) => set("communityButtonUrl", v)}
      />

      <TextField
        label="Requirements section title"
        value={draft.requirementsTitle}
        onChange={(v) => set("requirementsTitle", v)}
      />
      <ListEditor
        label="Requirements"
        items={draft.requirements}
        onChange={(items) => set("requirements", items)}
        addLabel="Add requirement"
      />

      <TextField
        label="Transition section title"
        value={draft.transitionTitle}
        onChange={(v) => set("transitionTitle", v)}
      />
      <ListEditor
        label="Transition steps"
        items={draft.steps}
        onChange={(steps) => set("steps", steps)}
        addLabel="Add step"
      />

      <TextField
        label="Security box title"
        value={draft.securityTitle}
        onChange={(v) => set("securityTitle", v)}
      />
      <TextAreaField
        label="Security box body"
        hint="Rich text: **bold** supported."
        value={draft.securityBody}
        onChange={(v) => set("securityBody", v)}
        rows={4}
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

export function BattleStyleEditor() {
  const { draft, set, dirty, saving, save, reset } =
    usePageEditor("battle-style");

  return (
    <div className="space-y-5">
      <TextField
        label="Page title"
        value={draft.title}
        onChange={(v) => set("title", v)}
      />
      <TextAreaField
        label="Intro"
        value={draft.intro}
        onChange={(v) => set("intro", v)}
        rows={3}
      />
      <ListEditor
        label="Battle mechanics"
        items={draft.mechanics}
        onChange={(items) => set("mechanics", items)}
        addLabel="Add mechanic"
      />
      <TextField
        label="Points box title"
        value={draft.pointsTitle}
        onChange={(v) => set("pointsTitle", v)}
      />
      <TextAreaField
        label="Points lines"
        hint="One entry per line."
        value={draft.pointsBody}
        onChange={(v) => set("pointsBody", v)}
        rows={3}
      />
      <TextField
        label="Winner determination title"
        value={draft.winnerTitle}
        onChange={(v) => set("winnerTitle", v)}
      />
      <TextAreaField
        label="Winner determination body"
        value={draft.winnerBody}
        onChange={(v) => set("winnerBody", v)}
        rows={4}
      />
      <TextField
        label="War execution title"
        value={draft.executionTitle}
        onChange={(v) => set("executionTitle", v)}
      />
      <TextAreaField
        label="Winning clan line"
        hint="Rich text: **bold** supported."
        value={draft.executionWinner}
        onChange={(v) => set("executionWinner", v)}
        rows={2}
      />
      <TextAreaField
        label="Losing clan line"
        hint="Rich text: **bold** supported."
        value={draft.executionLoser}
        onChange={(v) => set("executionLoser", v)}
        rows={2}
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

export function AssistanceEditor() {
  const { draft, set, dirty, saving, save, reset } =
    usePageEditor("assistance");

  return (
    <div className="space-y-5">
      <TextField
        label="Page title"
        value={draft.title}
        onChange={(v) => set("title", v)}
      />
      <ListEditor
        label="Assistance cards"
        items={draft.items}
        onChange={(items) => set("items", items)}
        addLabel="Add assistance card"
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

export function BaseLayoutsEditor() {
  const { draft, set, dirty, saving, save, reset } =
    usePageEditor("base-layouts");

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
      <TextField
        label="Placeholder card title"
        value={draft.placeholderTitle}
        onChange={(v) => set("placeholderTitle", v)}
      />
      <TextAreaField
        label="Placeholder card body"
        value={draft.placeholderBody}
        onChange={(v) => set("placeholderBody", v)}
        rows={3}
      />
      <TextField
        label="Media (GIF/image URL, empty = hidden)"
        hint="File under /assets or a full URL, e.g. /assets/base-layouts-preview.gif"
        value={draft.mediaSrc}
        onChange={(v) => set("mediaSrc", v)}
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

export function OpponentsEditor() {
  const { draft, set, dirty, saving, save, reset } =
    usePageEditor("opponents");

  return (
    <div className="space-y-5">
      <TextField
        label="Eyebrow (small red text above the title)"
        value={draft.eyebrow}
        onChange={(v) => set("eyebrow", v)}
      />
      <TextField
        label="Big title"
        value={draft.title}
        onChange={(v) => set("title", v)}
      />
      <TextAreaField
        label="Greeting line"
        value={draft.greeting}
        onChange={(v) => set("greeting", v)}
        rows={2}
      />
      <TextAreaField
        label="Letter body"
        hint="Blank line = new paragraph. **bold** works."
        value={draft.body}
        onChange={(v) => set("body", v)}
        rows={10}
      />
      <TextField
        label={'"Why not try GFL?" heading'}
        value={draft.tryTitle}
        onChange={(v) => set("tryTitle", v)}
      />
      <TextAreaField
        label={'"Why not try GFL?" body'}
        value={draft.tryBody}
        onChange={(v) => set("tryBody", v)}
        rows={5}
      />
      <TextAreaField
        label="Contact intro line (above the buttons)"
        value={draft.contactIntro}
        onChange={(v) => set("contactIntro", v)}
        rows={2}
      />

      <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 space-y-4">
        <p className="text-sm font-bold">Contact buttons</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="WhatsApp label"
            value={draft.whatsappLabel}
            onChange={(v) => set("whatsappLabel", v)}
          />
          <TextField
            label="WhatsApp link URL"
            value={draft.whatsappUrl}
            onChange={(v) => set("whatsappUrl", v)}
          />
          <TextField
            label="Telegram label"
            value={draft.telegramLabel}
            onChange={(v) => set("telegramLabel", v)}
          />
          <TextField
            label="Telegram link URL"
            value={draft.telegramUrl}
            onChange={(v) => set("telegramUrl", v)}
          />
          <TextField
            label="Discord label"
            value={draft.discordLabel}
            onChange={(v) => set("discordLabel", v)}
          />
          <TextField
            label="Discord link URL"
            value={draft.discordUrl}
            onChange={(v) => set("discordUrl", v)}
          />
          <TextField
            label="BAND label"
            value={draft.bandLabel}
            onChange={(v) => set("bandLabel", v)}
          />
          <TextField
            label="BAND link URL"
            value={draft.bandUrl}
            onChange={(v) => set("bandUrl", v)}
          />
        </div>
      </div>

      <TextAreaField
        label="Thank-you line"
        value={draft.thanks}
        onChange={(v) => set("thanks", v)}
        rows={2}
      />
      <TextField
        label="Signature"
        value={draft.signature}
        onChange={(v) => set("signature", v)}
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
