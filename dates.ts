export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addISODays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function mealByHour(hour = new Date().getHours()): "breakfast" | "lunch" | "dinner" | "snack" {
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 21) return "dinner";
  return "snack";
}

export function loggingStreak(dates: Iterable<string>, today = todayISO()): number {
  const set = dates instanceof Set ? dates : new Set(dates);
  let cursor = set.has(today) ? today : addISODays(today, -1);
  if (!set.has(cursor)) return 0;
  let count = 0;
  while (set.has(cursor) && count < 4000) {
    count += 1;
    cursor = addISODays(cursor, -1);
  }
  return count;
}
