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
        label="Community button label (disabled)"
        value={draft.communityButtonLabel}
        onChange={(v) => set("communityButtonLabel", v)}
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
      <EditorActions
        dirty={dirty}
        saving={saving}
        onSave={save}
        onReset={reset}
      />
    </div>
  );
}
