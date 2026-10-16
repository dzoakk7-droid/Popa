import { create } from "zustand";
import { mealByHour, todayISO } from "./dates";
import type { MealId } from "./types";

type UiState = {
  contextDate: string;
  addOpen: boolean;
  addDate: string;
  addMeal: MealId;
  setContextDate: (date: string) => void;
  openAdd: (date?: string, meal?: MealId) => void;
  closeAdd: () => void;
};

export const useUi = create<UiState>((set, get) => ({
  contextDate: todayISO(),
  addOpen: false,
  addDate: todayISO(),
  addMeal: "breakfast",
  setContextDate: (date) => set({ contextDate: date }),
  openAdd: (date, meal) =>
    set({
      addOpen: true,
      addDate: date ?? get().contextDate,
      addMeal: meal ?? mealByHour(),
    }),
  closeAdd: () => set({ addOpen: false }),
}));
