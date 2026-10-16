import { toast } from "sonner";
import { useNutrition } from "./store";

export function toastUndo(message: string, ids: string[]) {
  if (!ids.length) return;
  toast(message, {
    action: {
      label: "Отменить",
      onClick: () => useNutrition.getState().removeEntries(ids),
    },
  });
}
