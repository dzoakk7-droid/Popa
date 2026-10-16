import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Entry, Food, FoodSource, MealId, Profile } from "./types";

const memoryStorage = {
  getItem: (): string | null => null,
  setItem: () => {},
  removeItem: () => {},
};

function uid(): string {
  return crypto.randomUUID();
}

export const defaultProfile: Profile = {
  onboarded: false,
  sex: "female",
  age: 30,
  heightCm: 168,
  weightKg: 64,
  activity: "light",
  goal: "maintain",
  calorieTarget: 1900,
  proteinTarget: 100,
  fatTarget: 63,
  carbTarget: 220,
  waterMl: 2100,
};

export type NewEntry = Omit<Entry, "id" | "createdAt">;

export type Backup = {
  profile: Profile;
  entries: Entry[];
  waters: Record<string, number>;
  weights: { date: string; kg: number }[];
  customFoods: Food[];
  favoriteIds: string[];
};

type NutritionState = Backup & {
  finishOnboarding: (profile: Profile) => void;
  saveProfile: (profile: Profile) => void;
  addEntries: (rows: NewEntry[]) => string[];
  updateEntry: (id: string, patch: Partial<Pick<Entry, "name" | "grams" | "meal" | "per100" | "note">>) => void;
  removeEntries: (ids: string[]) => void;
  addWater: (date: string, delta: number) => void;
  logWeight: (date: string, kg: number) => void;
  toggleFavorite: (id: string) => void;
  addCustomFood: (food: Omit<Food, "id" | "custom" | "category"> & { category?: string }) => string;
  removeCustomFood: (id: string) => void;
  repeatMeal: (from: string, to: string, meal: MealId) => string[];
  repeatDay: (from: string, to: string) => string[];
  clearLogs: () => void;
  resetAll: () => void;
  importState: (data: Backup) => void;
};

const emptyLogs = {
  entries: [] as Entry[],
  waters: {} as Record<string, number>,
  weights: [] as { date: string; kg: number }[],
};

export const useNutrition = create<NutritionState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      customFoods: [],
      favoriteIds: [],
      ...emptyLogs,
      finishOnboarding: (profile) => set({ profile: { ...profile, onboarded: true } }),
      saveProfile: (profile) => set({ profile: { ...profile, onboarded: true } }),
      addEntries: (rows) => {
        const now = Date.now();
        const created = rows.map((row, index) => ({
          ...row,
          id: uid(),
          createdAt: now + index,
        }));
        set((s) => ({ entries: [...s.entries, ...created] }));
        return created.map((entry) => entry.id);
      },
      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
        })),
      removeEntries: (ids) => {
        const drop = new Set(ids);
        set((s) => ({ entries: s.entries.filter((entry) => !drop.has(entry.id)) }));
      },
      addWater: (date, delta) =>
        set((s) => ({
          waters: {
            ...s.waters,
            [date]: Math.min(8000, Math.max(0, Math.round((s.waters[date] ?? 0) + delta))),
          },
        })),
      logWeight: (date, kg) =>
        set((s) => ({
          weights: [...s.weights.filter((row) => row.date !== date), { date, kg }].sort((a, b) =>
            a.date.localeCompare(b.date),
          ),
          profile: { ...s.profile, weightKg: kg },
        })),
      toggleFavorite: (id) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(id)
            ? s.favoriteIds.filter((item) => item !== id)
            : [...s.favoriteIds, id],
        })),
      addCustomFood: (food) => {
        const id = `custom-${uid()}`;
        const row: Food = {
          ...food,
          id,
          name: food.name.trim(),
          category: food.category ?? "Своё",
          custom: true,
        };
        set((s) => ({ customFoods: [row, ...s.customFoods].slice(0, 200) }));
        return id;
      },
      removeCustomFood: (id) =>
        set((s) => ({
          customFoods: s.customFoods.filter((food) => food.id !== id),
          favoriteIds: s.favoriteIds.filter((item) => item !== id),
        })),
      repeatMeal: (from, to, meal) => {
        const source = get().entries.filter((entry) => entry.date === from && entry.meal === meal);
        return get().addEntries(source.map((entry) => cloneEntry(entry, to, meal)));
      },
      repeatDay: (from, to) => {
        const source = get().entries.filter((entry) => entry.date === from);
        return get().addEntries(source.map((entry) => cloneEntry(entry, to, entry.meal)));
      },
      clearLogs: () => set(emptyLogs),
      resetAll: () =>
        set({
          profile: defaultProfile,
          customFoods: [],
          favoriteIds: [],
          ...emptyLogs,
        }),
      importState: (data) =>
        set({
          profile: { ...data.profile, onboarded: true },
          entries: data.entries,
          waters: data.waters,
          weights: data.weights,
          customFoods: data.customFoods,
          favoriteIds: data.favoriteIds,
        }),
    }),
    {
      name: "portsiya-diary",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
    },
  ),
);

function cloneEntry(entry: Entry, date: string, meal: MealId): NewEntry {
  return {
    date,
    meal,
    name: entry.name,
    grams: entry.grams,
    per100: entry.per100,
    source: "repeat" satisfies FoodSource,
    note: entry.note,
    foodId: entry.foodId,
  };
}

export function snapshot(): Backup {
  const s = useNutrition.getState();
  return {
    profile: s.profile,
    entries: s.entries,
    waters: s.waters,
    weights: s.weights,
    customFoods: s.customFoods,
    favoriteIds: s.favoriteIds,
  };
}
