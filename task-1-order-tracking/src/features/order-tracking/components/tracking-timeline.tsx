import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SCENARIO_ICONS, TONE_STYLES } from "../lib/tone";
import type { Scenario, TimelineStep, Tone } from "../types";

interface TrackingTimelineProps {
  steps: TimelineStep[];
  tone: Tone;
  scenario: Scenario;
}

export function TrackingTimeline({ steps, tone, scenario }: TrackingTimelineProps) {
  return (
    <section aria-labelledby="timeline-heading" className="rounded-2xl border bg-card p-5">
      <h2 id="timeline-heading" className="mb-4 font-semibold">
        Delivery progress
      </h2>
      <ol>
        {steps.map((step, index) => (
          <li
            key={step.status}
            aria-current={step.state === "current" ? "step" : undefined}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-0.5 -translate-x-1/2",
                  step.state === "complete" ? "bg-foreground" : "bg-border",
                )}
              />
            )}
            <StepMarker step={step} tone={tone} scenario={scenario} />
            <div className="min-w-0 pt-0.5">
              <p className={cn("text-sm font-medium", step.state === "upcoming" && "text-muted-foreground")}>
                {step.title}
                <span className="sr-only">
                  {step.state === "complete" ? " (done)" : step.state === "current" ? " (current step)" : " (not yet)"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{step.time ?? step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepMarker({ step, tone, scenario }: Omit<TrackingTimelineProps, "steps"> & { step: TimelineStep }) {
  if (step.state === "complete") {
    return (
      <span className="z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
        <Check className="size-4" aria-hidden />
      </span>
    );
  }

  if (step.state === "current") {
    const Icon = SCENARIO_ICONS[scenario];
    return (
      <span
        className={cn(
          "z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
          TONE_STYLES[tone].accent,
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
    );
  }

  return <span className="z-10 size-7 shrink-0 rounded-full border-2 border-dashed border-border bg-background" />;
}
