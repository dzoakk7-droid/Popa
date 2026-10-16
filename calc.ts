import type { Activity, DayStatus, Entry, Goal, Macros, Profile, Sex } from "./types";

export function scale(per: Macros, grams: number): Macros {
  const k = grams / 100;
  return {
    kcal: per.kcal * k,
    protein: per.protein * k,
    fat: per.fat * k,
    carbs: per.carbs * k,
  };
}

export function sumMacros(list: Macros[]): Macros {
  const acc: Macros = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  for (const m of list) {
    acc.kcal += m.kcal;
    acc.protein += m.protein;
    acc.fat += m.fat;
    acc.carbs += m.carbs;
  }
  return acc;
}

export function entryMacros(entry: Entry): Macros {
  return scale(entry.per100, entry.grams);
}

export function sumEntries(entries: Entry[]): Macros {
  return sumMacros(entries.map(entryMacros));
}

const ACTIVITY: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export function bmr(input: { sex: Sex; weightKg: number; heightCm: number; age: number }): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return input.sex === "male" ? base + 5 : base - 161;
}

export function planTargets(input: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
}): Pick<Profile, "calorieTarget" | "proteinTarget" | "fatTarget" | "carbTarget" | "waterMl"> {
  const tdee = bmr(input) * ACTIVITY[input.activity];
  let kcal = tdee;
  if (input.goal === "lose") kcal = tdee - Math.max(300, tdee * 0.15);
  if (input.goal === "gain") kcal = tdee + Math.max(250, tdee * 0.12);
  const floor = input.sex === "male" ? 1500 : 1200;
  kcal = Math.max(floor, Math.round(kcal / 10) * 10);

  const protein = Math.round((input.goal === "maintain" ? 1.6 : 1.8) * input.weightKg);
  let fat = Math.round((input.goal === "gain" ? 1 : input.goal === "lose" ? 0.8 : 0.9) * input.weightKg);
  const minCarbKcal = 50 * 4;
  if (kcal - protein * 4 - fat * 9 < minCarbKcal) {
    fat = Math.max(35, Math.round((kcal - protein * 4 - minCarbKcal) / 9));
  }
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const waterMl = Math.min(4000, Math.max(1500, Math.round((input.weightKg * 33) / 50) * 50));

  return {
    calorieTarget: kcal,
    proteinTarget: protein,
    fatTarget: fat,
    carbTarget: carbs,
    waterMl,
  };
}

export function dayStatus(kcal: number, target: number): DayStatus {
  if (kcal <= 0) return "empty";
  const ratio = kcal / Math.max(target, 1);
  if (ratio < 0.85) return "under";
  if (ratio <= 1.1) return "ok";
  return "over";
}

export function norm(value: string): string {
  return value.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}
