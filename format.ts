import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";
import { fromISODate } from "./dates";

const intFmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const oneFmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export function fmtInt(n: number): string {
  return intFmt.format(Math.round(n));
}

export function fmt1(n: number): string {
  return oneFmt.format(Math.round(n * 10) / 10);
}

export function fmtKcalCompact(n: number): string {
  const v = Math.round(n);
  if (v >= 1000) {
    const scaled = v / 1000;
    const text = (Math.round(scaled * 10) / 10).toFixed(1).replace(".", ",").replace(",0", "");
    return `${text}к`;
  }
  return String(v);
}

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(Math.trunc(n)) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function dayHeading(iso: string): string {
  const d = fromISODate(iso);
  if (isToday(d)) return "Сегодня";
  if (isYesterday(d)) return "Вчера";
  if (isTomorrow(d)) return "Завтра";
  return format(d, "d MMMM", { locale: ru });
}

export function weekdayName(iso: string): string {
  return cap(format(fromISODate(iso), "EEEE", { locale: ru }));
}

export function monthTitle(d: Date): string {
  return cap(format(d, "LLLL yyyy", { locale: ru }));
}

export function shortWeekday(iso: string): string {
  return cap(format(fromISODate(iso), "EEEEEE", { locale: ru }));
}

export function shortDay(iso: string): string {
  return format(fromISODate(iso), "d.MM", { locale: ru });
}
