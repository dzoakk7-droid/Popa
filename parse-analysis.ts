import type { Macros } from "./types";

export type ParsedItem = {
  name: string;
  grams: number;
  per100: Macros;
  note?: string;
};

export type ParsedAnalysis =
  | { ok: true; items: ParsedItem[]; summary: string }
  | { ok: false; error: string };

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function pick(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    if (key in obj) {
      const n = num(obj[key]);
      if (n !== null) return n;
    }
  }
  return null;
}

export function parseAnalysis(raw: string): ParsedAnalysis {
  let text = raw.trim();
  if (!text) return { ok: false, error: "Пустой ответ распознавания." };
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return { ok: false, error: "Не удалось прочитать ответ." };

  let data: unknown;
  try {
    data = JSON.parse(text.slice(start, end + 1));
  } catch {
    return { ok: false, error: "Не удалось прочитать ответ." };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, error: "Не удалось прочитать ответ." };
  }

  const root = data as Record<string, unknown>;
  const summary = typeof root.summary === "string" ? root.summary.trim().slice(0, 240) : "";
  const list = Array.isArray(root.items) ? root.items : [];
  const items: ParsedItem[] = [];

  for (const row of list) {
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const record = row as Record<string, unknown>;
    const nameRaw = typeof record.name === "string" ? record.name.trim().replace(/\s+/g, " ") : "";
    if (!nameRaw) continue;

    let grams = pick(record, ["grams", "weight", "weightGrams", "portionGrams"]);
    if (grams === null || grams <= 0) grams = 100;
    grams = clamp(Math.round(grams), 1, 1500);

    let kcal100 = pick(record, ["kcalPer100", "caloriesPer100", "kcal_per_100"]);
    let protein100 = pick(record, ["proteinPer100", "proteinsPer100", "protein_per_100"]);
    let fat100 = pick(record, ["fatPer100", "fatsPer100", "fat_per_100"]);
    let carbs100 = pick(record, ["carbsPer100", "carbohydratesPer100", "carbs_per_100"]);

    const kcalPortion = pick(record, ["kcal", "calories", "energy"]);
    const proteinPortion = pick(record, ["protein", "proteins"]);
    const fatPortion = pick(record, ["fat", "fats"]);
    const carbsPortion = pick(record, ["carbs", "carbohydrates"]);

    if (kcal100 === null && kcalPortion !== null) kcal100 = (kcalPortion / grams) * 100;
    if (protein100 === null && proteinPortion !== null) protein100 = (proteinPortion / grams) * 100;
    if (fat100 === null && fatPortion !== null) fat100 = (fatPortion / grams) * 100;
    if (carbs100 === null && carbsPortion !== null) carbs100 = (carbsPortion / grams) * 100;

    protein100 = clamp(protein100 ?? 0, 0, 100);
    fat100 = clamp(fat100 ?? 0, 0, 100);
    carbs100 = clamp(carbs100 ?? 0, 0, 100);
    const fromMacros = protein100 * 4 + fat100 * 9 + carbs100 * 4;
    if (kcal100 === null) {
      if (fromMacros <= 0) continue;
      kcal100 = fromMacros;
    }
    kcal100 = clamp(kcal100, 0, 950);
    if (fromMacros > kcal100 * 1.35 && fromMacros <= 950) kcal100 = fromMacros;

    const note = typeof record.note === "string" ? record.note.trim().slice(0, 80) : "";
    items.push({
      name: nameRaw.slice(0, 80),
      grams,
      per100: {
        kcal: Math.round(kcal100),
        protein: Math.round(protein100 * 10) / 10,
        fat: Math.round(fat100 * 10) / 10,
        carbs: Math.round(carbs100 * 10) / 10,
      },
      note: note || undefined,
    });
    if (items.length >= 6) break;
  }

  return { ok: true, items, summary };
}
