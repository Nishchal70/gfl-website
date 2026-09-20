"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  mergeContent,
  type PageKey,
  type SiteContent,
} from "@/lib/site-content";

type SiteContentContextValue = {
  content: SiteContent;
  /** Replace the stored override for one page after a successful save. */
  applySaved: (page: PageKey, data: unknown) => void;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data && typeof data.content === "object") {
          setStored(data.content);
        }
      })
      .catch(() => {
        // Network/DB hiccup: defaults remain in place.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applySaved = useCallback(
    (page: PageKey, data: unknown) => {
      setStored((prev) => ({ ...(prev ?? {}), [page]: data }));
    },
    []
  );

  const content = useMemo(() => mergeContent(stored), [stored]);

  return (
    <SiteContentContext.Provider value={{ content, applySaved }}>
      {children}
    </SiteContentContext.Provider>
  );
}

/** Returns the full editable site content (defaults merged with overrides). */
export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx.content;
}

/** Returns the callback used by editors to push a saved page into the live tree. */
export function useSiteContentUpdater() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error(
      "useSiteContentUpdater must be used within SiteContentProvider"
    );
  }
  return ctx.applySaved;
}
