import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE_STYLES } from "../lib/tone";
import type { OrderView } from "../types";

export function StatusHero({ view }: { view: OrderView }) {
  const tone = TONE_STYLES[view.tone];
  const Icon = tone.icon;

  return (
    <section aria-labelledby="status-headline" className={cn("rounded-2xl border p-5", tone.surface)}>
      <div className="flex items-start gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tone.accent)}>
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 id="status-headline" className="text-xl leading-tight font-semibold">
            {view.headline}
          </h2>
          <p className="text-sm opacity-80">{view.message}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
        <CalendarClock className="size-5 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-medium opacity-70">{view.etaLabel}</p>
          <p className="font-semibold">{view.etaValue}</p>
        </div>
      </div>
    </section>
  );
}
