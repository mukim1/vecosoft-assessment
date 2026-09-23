import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { DEMO_ORDER_IDS } from "@/mocks/orders";

const SCENARIOS = [
  { id: DEMO_ORDER_IDS.onTrack, title: "On its way", description: "Shipped and on schedule" },
  { id: DEMO_ORDER_IDS.delayed, title: "Delayed order", description: "Missed its ETA: new date, reason, next steps" },
  { id: DEMO_ORDER_IDS.delivered, title: "Delivered, not received", description: "Proof of delivery and “Didn't get it?”" },
  { id: DEMO_ORDER_IDS.trackingPending, title: "Tracking not available yet", description: "Confirmed, waiting for the courier" },
  { id: DEMO_ORDER_IDS.error, title: "Error state", description: "The tracking service fails to respond" },
  { id: DEMO_ORDER_IDS.notFound, title: "Empty state", description: "An order number that doesn't exist" },
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
