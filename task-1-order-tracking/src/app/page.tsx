import { ChevronRight, CloudOff, PackageSearch, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SCENARIO_ICONS, TONE_STYLES } from "@/features/order-tracking/lib/tone";
import { cn } from "@/lib/utils";
import { DEMO_ORDER_IDS } from "@/mocks/orders";

const NEUTRAL_TILE = "bg-muted border-border text-muted-foreground";

const SCENARIOS: { id: string; title: string; description: string; icon: LucideIcon; tile: string }[] = [
  {
    id: DEMO_ORDER_IDS.onTrack,
    title: "On its way",
    description: "Shipped and on schedule",
    icon: SCENARIO_ICONS["on-track"],
    tile: TONE_STYLES.info.surface,
  },
  {
    id: DEMO_ORDER_IDS.delayed,
    title: "Delayed order",
    description: "Missed its ETA: new date, reason, next steps",
    icon: SCENARIO_ICONS.delayed,
    tile: TONE_STYLES.warning.surface,
  },
  {
    id: DEMO_ORDER_IDS.delivered,
    title: "Delivered, not received",
    description: "Proof of delivery and “Didn't get it?”",
    icon: SCENARIO_ICONS.delivered,
    tile: TONE_STYLES.success.surface,
  },
  {
    id: DEMO_ORDER_IDS.trackingPending,
    title: "Tracking not available yet",
    description: "Confirmed, waiting for the courier",
    icon: SCENARIO_ICONS["tracking-pending"],
    tile: TONE_STYLES.info.surface,
  },
  {
    id: DEMO_ORDER_IDS.error,
    title: "Error state",
    description: "The tracking service fails to respond",
    icon: CloudOff,
    tile: NEUTRAL_TILE,
  },
  {
    id: DEMO_ORDER_IDS.notFound,
    title: "Empty state",
    description: "An order number that doesn't exist",
    icon: PackageSearch,
    tile: NEUTRAL_TILE,
  },
];

export default function Home() {
  return (
    <main className="flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold">Your orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Demo: each order opens the tracking screen in a different scenario.
      </p>

      <ul className="mt-6 space-y-2">
        {SCENARIOS.map((scenario) => (
          <li key={scenario.id}>
            <Link
              href={`/orders/${scenario.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border", scenario.tile)}>
                <scenario.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{scenario.title}</p>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">#{scenario.id}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
