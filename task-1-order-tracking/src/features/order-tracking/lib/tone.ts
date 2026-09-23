import { CircleCheck, Clock, TriangleAlert, Truck, type LucideIcon } from "lucide-react";
import type { Scenario, Tone } from "../types";

/** Colours per tone. Colour is always paired with an icon and text, never used alone. */
export const TONE_STYLES: Record<Tone, { surface: string; accent: string }> = {
  info: { surface: "bg-sky-50 border-sky-200 text-sky-950", accent: "bg-sky-600 text-white" },
  warning: { surface: "bg-amber-50 border-amber-200 text-amber-950", accent: "bg-amber-500 text-amber-950" },
  success: { surface: "bg-emerald-50 border-emerald-200 text-emerald-950", accent: "bg-emerald-600 text-white" },
};

/** One icon per scenario, reused in the order list, the status hero and the current timeline step. */
export const SCENARIO_ICONS: Record<Scenario, LucideIcon> = {
  "on-track": Truck,
  delayed: TriangleAlert,
  delivered: CircleCheck,
  "tracking-pending": Clock,
};
