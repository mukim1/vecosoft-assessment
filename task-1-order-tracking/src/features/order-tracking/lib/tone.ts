import { CircleCheck, Package, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Tone } from "../types";

/** Colours and icon per tone. Colour is always paired with an icon and text, never used alone. */
export const TONE_STYLES: Record<Tone, { surface: string; accent: string; icon: LucideIcon }> = {
  info: { surface: "bg-sky-50 border-sky-200 text-sky-950", accent: "bg-sky-600 text-white", icon: Package },
  warning: {
    surface: "bg-amber-50 border-amber-200 text-amber-950",
    accent: "bg-amber-500 text-amber-950",
    icon: TriangleAlert,
  },
  success: {
    surface: "bg-emerald-50 border-emerald-200 text-emerald-950",
    accent: "bg-emerald-600 text-white",
    icon: CircleCheck,
  },
};
