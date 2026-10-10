export type PageId =
  | "home"
  | "overview"
  | "how-to-join"
  | "battle-style"
  | "assistance"
  | "base-layouts"
  | "staff"
  | "opponents";

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
// "opponents" is intentionally not in the nav bar — it is linked from the
// hero button but stays deep-linkable (#opponents).
export const PAGE_IDS: PageId[] = [
  ...NAV_ITEMS.map((i) => i.id),
  "opponents",
];

export function isPageId(value: string): value is PageId {
  return (PAGE_IDS as string[]).includes(value);
}
