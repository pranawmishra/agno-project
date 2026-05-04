export function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function formatTime(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function makeUserId(): string {
  if (typeof window === "undefined") return "guest";
  const KEY = "agno.user_id";
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const id =
    "READER-" +
    Math.random().toString(36).slice(2, 8).toUpperCase() +
    "-" +
    Date.now().toString(36).toUpperCase().slice(-4);
  localStorage.setItem(KEY, id);
  return id;
}
