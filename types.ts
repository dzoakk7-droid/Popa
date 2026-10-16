export const MEALS = [
  { id: "breakfast", label: "Завтрак" },
  { id: "lunch", label: "Обед" },
  { id: "dinner", label: "Ужин" },
  { id: "snack", label: "Перекус" },
] as const;

export type MealId = (typeof MEALS)[number]["id"];

export type Sex = "female" | "male";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very";
export type Goal = "lose" | "maintain" | "gain";
export type FoodSource = "photo" | "label" | "catalog" | "manual" | "repeat" | "quick";

export type Macros = {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type Profile = {
  onboarded: boolean;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  calorieTarget: number;
  proteinTarget: number;
  fatTarget: number;
  carbTarget: number;
  waterMl: number;
};

export type Food = {
  id: string;
  name: string;
  category: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  aliases?: string;
  portionName?: string;
  portionGrams?: number;
  custom?: boolean;
};

export type Entry = {
  id: string;
  date: string;
  meal: MealId;
  name: string;
  grams: number;
  per100: Macros;
  source: FoodSource;
  note?: string;
  foodId?: string;
  createdAt: number;
};

export type DayStatus = "empty" | "under" | "ok" | "over";
