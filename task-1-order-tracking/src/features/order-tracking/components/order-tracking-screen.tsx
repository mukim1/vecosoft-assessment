"use client";

import { CloudOff, PackageSearch } from "lucide-react";
import Link from "next/link";
import { StateMessage } from "@/components/state-message";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrderTracking } from "../hooks/use-order-tracking";
import { deriveOrderView } from "../lib/derive-status";
import { SUPPORT_PHONE } from "../lib/support";
import { DelayBanner } from "./delay-banner";
import { DeliveredCard } from "./delivered-card";
import { OrderSummary } from "./order-summary";
import { OrderTrackingSkeleton } from "./order-tracking-skeleton";
import { StatusHero } from "./status-hero";
import { SupportActions } from "./support-actions";
import { TrackingPendingCard } from "./tracking-pending-card";
import { TrackingTimeline } from "./tracking-timeline";

export function OrderTrackingScreen({ orderId }: { orderId: string }) {
  const { data: order, isPending, isError, isRefetching, refetch } = useOrderTracking(orderId);

  if (isPending) return <OrderTrackingSkeleton />;

  if (isError) {
    return (
      <StateMessage
        icon={CloudOff}
        title="We can't load tracking right now"
        description="Your order is safe. This is a problem on our side, so please try again in a moment."
      >
        <Button size="lg" onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? "Trying again…" : "Try again"}
        </Button>
        <a href={`tel:${SUPPORT_PHONE}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Call support
        </a>
      </StateMessage>
    );
  }

  if (!order) {
    return (
      <StateMessage
        icon={PackageSearch}
        title="We couldn't find that order"
        description={`There's no order with the number ${orderId}. Check the number in your confirmation email.`}
      >
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          See your orders
        </Link>
      </StateMessage>
    );
  }

  const view = deriveOrderView(order, new Date());

  return (
    <div className="space-y-4">
      <StatusHero view={view} />
      {view.delay && <DelayBanner orderId={order.id} delay={view.delay} />}
      {view.scenario === "tracking-pending" && <TrackingPendingCard trackingExpected={view.trackingExpected} />}
      {view.scenario === "delivered" && order.deliveryProof && (
        <DeliveredCard orderId={order.id} proof={order.deliveryProof} />
      )}
      <TrackingTimeline steps={view.steps} tone={view.tone} />
      <OrderSummary order={order} />
      <SupportActions orderId={order.id} />
    </div>
  );
}
