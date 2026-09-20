export type PageId =
  | "home"
  | "overview"
  | "how-to-join"
  | "battle-style"
  | "assistance"
  | "base-layouts"
  | "staff";

export const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "overview", label: "Overview" },
  { id: "how-to-join", label: "How to Join" },
  { id: "battle-style", label: "Battle Style" },
  { id: "assistance", label: "Assistance" },
  { id: "base-layouts", label: "Base Layouts" },
  { id: "staff", label: "Staff Login" },
];

/** Views rendered inside the single `/` route (hash-synced for deep links). */
export const PAGE_IDS = NAV_ITEMS.map((i) => i.id);

export function isPageId(value: string): value is PageId {
  return (PAGE_IDS as string[]).includes(value);
}
