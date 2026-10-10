"use client";

import { Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContentItem } from "@/lib/site-content";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      {children}
    </div>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  hint,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

/** Editable list of {title, body} entries (requirements, steps, items…). */
export function ListEditor({
  label,
  items,
  onChange,
  addLabel,
}: {
  label: string;
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
  addLabel: string;
}) {
  const update = (index: number, patch: Partial<ContentItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  return (
    <div className="space-y-3">
      <Label className="text-sm font-bold">{label}</Label>
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Input
              value={item.title}
              placeholder="Title"
              onChange={(e) => update(index, { title: e.target.value })}
              className="font-semibold"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Remove item ${index + 1}`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={item.body}
            placeholder="Description"
            rows={3}
            onChange={(e) => update(index, { body: e.target.value })}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { title: "", body: "" }])}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {addLabel}
      </Button>
    </div>
  );
}

export function EditorActions({
  dirty,
  saving,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky bottom-2 md:bottom-4 z-10 mt-8 rounded-2xl border border-stone-200 bg-white/95 backdrop-blur p-3 md:p-4 shadow-lg flex flex-wrap items-center gap-2 md:gap-3">
      <span className="text-xs md:text-sm text-zinc-500 flex-1 min-w-24">
        {saving
          ? "Saving…"
          : dirty
            ? "You have unsaved changes."
            : "All changes are live."}
      </span>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={saving}
        className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset to original
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="gfl-btn h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm rounded-xl font-bold"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-4 w-4" aria-hidden="true" />
        )}
        Save & publish
      </Button>
    </div>
  );
}
