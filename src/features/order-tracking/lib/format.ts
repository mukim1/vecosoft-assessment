import type { TimeWindow } from "../types";

const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const hourFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric" });

/** "Thu, Sep 25, 2:30 PM" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${dayFormat.format(date)}, ${timeFormat.format(date)}`;
}

/** "Thu, Sep 25, 2 PM – 6 PM", or with both days when the window spans two days. */
export function formatWindow(window: TimeWindow): string {
  const from = new Date(window.from);
  const to = new Date(window.to);
  if (from.toDateString() === to.toDateString()) {
    return `${dayFormat.format(from)}, ${hourFormat.format(from)} – ${hourFormat.format(to)}`;
  }
  return `${dayFormat.format(from)} – ${dayFormat.format(to)}`;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
