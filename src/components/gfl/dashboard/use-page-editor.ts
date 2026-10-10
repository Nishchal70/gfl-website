"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent, useSiteContentUpdater } from "@/components/gfl/site-content-context";
import { DEFAULT_CONTENT, type PageKey, type SiteContent } from "@/lib/site-content";

/**
 * Shared state/behavior for one page's content editor:
 * draft tracking, dirty check, save (auth PUT), reset to defaults.
 */
export function usePageEditor<K extends PageKey>(page: K) {
  const content = useSiteContent();
  const applySaved = useSiteContentUpdater();
  const value = content[page];
  const [draft, setDraft] = useState<SiteContent[K]>(value);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // The public /api/content fetch resolves after mount, so `value` can switch
  // from shipped defaults to the stored overrides while the dashboard is
  // already open. Until the staff member actually edits a field, the draft
  // must follow the incoming content — otherwise the editors would show
  // defaults over saved overrides and one "Save & publish" would wipe them.
  const editedRef = useRef(false);
  useEffect(() => {
    if (!editedRef.current) setDraft(value);
  }, [value]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(value),
    [draft, value]
  );

  const set = useCallback(
    <F extends keyof SiteContent[K]>(key: F, v: SiteContent[K][F]) => {
      editedRef.current = true;
      setDraft((d) => ({ ...d, [key]: v }) as SiteContent[K]);
    },
    []
  );

  const setDraftTracked = useCallback((next: SiteContent[K]) => {
    editedRef.current = true;
    setDraft(next);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, data: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Save failed",
          description: data.error ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }
      applySaved(page, data.data);
      toast({
        title: "Published!",
        description: "The change is live on the site.",
      });
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [draft, page, applySaved, toast]);

  const reset = useCallback(() => {
    setDraft(DEFAULT_CONTENT[page]);
  }, [page]);

  return { value, draft, setDraft: setDraftTracked, set, dirty, saving, save, reset };
}
