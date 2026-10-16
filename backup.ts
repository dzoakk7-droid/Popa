import { ISO_DATE } from "./dates";
import type { Backup } from "./store";
import type { Activity, Entry, Food, FoodSource, Goal, MealId, Profile, Sex } from "./types";

const MEAL_IDS = new Set<MealId>(["breakfast", "lunch", "dinner", "snack"]);
const SEX = new Set<Sex>(["female", "male"]);
const GOALS = new Set<Goal>(["lose", "maintain", "gain"]);
const ACTIVITIES = new Set<Activity>(["sedentary", "light", "moderate", "active", "very"]);
const SOURCES = new Set<FoodSource>(["photo", "label", "catalog", "manual", "repeat", "quick"]);

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function num(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function profileOf(value: unknown): Profile | null {
  const row = record(value);
  if (!row) return null;
  const sex = row.sex;
  const goal = row.goal;
  const activity = row.activity;
  if (typeof sex !== "string" || !SEX.has(sex as Sex)) return null;
  if (typeof goal !== "string" || !GOALS.has(goal as Goal)) return null;
  if (typeof activity !== "string" || !ACTIVITIES.has(activity as Activity)) return null;
  const age = num(row.age, 18, 80);
  const heightCm = num(row.heightCm, 140, 220);
  const weightKg = num(row.weightKg, 40, 250);
  const calorieTarget = num(row.calorieTarget, 1000, 6000);
  const proteinTarget = num(row.proteinTarget, 20, 400);
  const fatTarget = num(row.fatTarget, 15, 300);
  const carbTarget = num(row.carbTarget, 0, 800);
  const waterMl = num(row.waterMl, 1000, 5000);
  if (
    age === null ||
    heightCm === null ||
    weightKg === null ||
    calorieTarget === null ||
    proteinTarget === null ||
    fatTarget === null ||
    carbTarget === null ||
    waterMl === null
  ) {
    return null;
  }
  return {
    onboarded: true,
    sex: sex as Sex,
    goal: goal as Goal,
    activity: activity as Activity,
    age,
    heightCm,
    weightKg,
    calorieTarget,
    proteinTarget,
    fatTarget,
    carbTarget,
    waterMl,
  };
}

function entryOf(value: unknown): Entry | null {
  const row = record(value);
  if (!row) return null;
  if (typeof row.id !== "string" || typeof row.date !== "string" || !ISO_DATE.test(row.date)) return null;
  if (typeof row.meal !== "string" || !MEAL_IDS.has(row.meal as MealId)) return null;
  if (typeof row.name !== "string" || !row.name.trim()) return null;
  const grams = num(row.grams, 1, 5000);
  const createdAt = num(row.createdAt, 0, 9e15);
  const per = record(row.per100);
  if (!per || grams === null || createdAt === null) return null;
  const kcal = num(per.kcal, 0, 2000);
  const protein = num(per.protein, 0, 200);
  const fat = num(per.fat, 0, 200);
  const carbs = num(per.carbs, 0, 200);
  if (kcal === null || protein === null || fat === null || carbs === null) return null;
  const source = typeof row.source === "string" && SOURCES.has(row.source as FoodSource) ? (row.source as FoodSource) : "manual";
  return {
    id: row.id,
    date: row.date,
    meal: row.meal as MealId,
    name: row.name.trim().slice(0, 80),
    grams,
    per100: { kcal, protein, fat, carbs },
    source,
    note: typeof row.note === "string" ? row.note.slice(0, 80) : undefined,
    foodId: typeof row.foodId === "string" ? row.foodId : undefined,
    createdAt,
  };
}

function foodOf(value: unknown): Food | null {
  const row = record(value);
  if (!row || typeof row.id !== "string" || typeof row.name !== "string" || !row.name.trim()) return null;
  const kcal = num(row.kcal, 0, 950);
  const protein = num(row.protein, 0, 100);
  const fat = num(row.fat, 0, 100);
  const carbs = num(row.carbs, 0, 100);
  if (kcal === null || protein === null || fat === null || carbs === null) return null;
  return {
    id: row.id,
    name: row.name.trim().slice(0, 80),
    category: typeof row.category === "string" ? row.category.slice(0, 40) : "Своё",
    kcal,
    protein,
    fat,
    carbs,
    custom: true,
    portionName: typeof row.portionName === "string" ? row.portionName : undefined,
    portionGrams: num(row.portionGrams, 1, 2000) ?? undefined,
  };
}

export function parseBackup(raw: unknown): Backup | null {
  const row = record(raw);
  if (!row) return null;
  const profile = profileOf(row.profile);
  if (!profile || !Array.isArray(row.entries)) return null;
  const entries = row.entries.map(entryOf).filter((item): item is Entry => item !== null).slice(0, 8000);
  const waters: Record<string, number> = {};
  const waterRow = record(row.waters);
  if (waterRow) {
    for (const [date, value] of Object.entries(waterRow)) {
      const ml = num(value, 0, 8000);
      if (ISO_DATE.test(date) && ml !== null) waters[date] = ml;
    }
  }
  const weights: Backup["weights"] = [];
  if (Array.isArray(row.weights)) {
    for (const item of row.weights) {
      const w = record(item);
      if (!w || typeof w.date !== "string" || !ISO_DATE.test(w.date)) continue;
      const kg = num(w.kg, 40, 250);
      if (kg !== null) weights.push({ date: w.date, kg });
    }
  }
  const customFoods = Array.isArray(row.customFoods)
    ? row.customFoods.map(foodOf).filter((item): item is Food => item !== null).slice(0, 200)
    : [];
  const favoriteIds = Array.isArray(row.favoriteIds)
    ? row.favoriteIds.filter((id): id is string => typeof id === "string").slice(0, 400)
    : [];
  return {
    profile,
    entries,
    waters,
    weights: weights.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2000),
    customFoods,
    favoriteIds,
  };
}
