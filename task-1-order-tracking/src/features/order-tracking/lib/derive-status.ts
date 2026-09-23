import type { Order, OrderStatus, OrderView, Scenario, TimelineStep } from "../types";
import { formatDateTime, formatWindow } from "./format";

/**
 * The single place that turns raw order data into what the screen shows:
 * which scenario applies, its tone, the plain-language copy and the timeline.
 * Pure (no I/O, `now` is passed in), so every scenario is easy to reason about.
 */
export function deriveOrderView(order: Order, now: Date): OrderView {
  const scenario = getScenario(order, now);
  const steps = buildSteps(order);
  const eta = formatWindow(order.estimatedDelivery);

  switch (scenario) {
    case "delivered":
      return {
        scenario,
        tone: "success",
        headline: "Your order was delivered",
        message: order.deliveryProof
          ? `${order.deliveryProof.location}. Can't find it? We'll help you track it down.`
          : "Can't find it? We'll help you track it down.",
        etaLabel: "Delivered",
        etaValue: order.deliveredAt ? formatDateTime(order.deliveredAt) : eta,
        steps,
      };

    case "tracking-pending":
      return {
        scenario,
        tone: "info",
        headline: "We're preparing your order",
        message:
          "Everything is on track. Live tracking starts as soon as the courier scans your parcel. We'll let you know when it does.",
        etaLabel: "Estimated delivery",
        etaValue: eta,
        steps,
        trackingExpected: order.trackingExpectedAt ? formatDateTime(order.trackingExpectedAt) : undefined,
      };

    case "delayed":
      return {
        scenario,
        tone: "warning",
        headline: "Your order is running late",
        message: "Sorry, it won't arrive when we first said. Here's the new estimate and what you can do.",
        etaLabel: "New estimated delivery",
        etaValue: order.delay ? eta : "We're confirming a new date",
        steps,
        delay: {
          reason: order.delay?.reason ?? "The courier missed the delivery window and hasn't told us why yet.",
          originalEta: formatWindow(order.delay?.originalEstimate ?? order.estimatedDelivery),
          newEta: order.delay ? eta : "To be confirmed",
        },
      };

    case "on-track":
      return {
        scenario,
        tone: "info",
        headline: order.status === "out_for_delivery" ? "Arriving today" : "Your order is on its way",
        message: `${order.carrier?.name ?? "The courier"} has your parcel and it's on schedule.`,
        etaLabel: "Estimated delivery",
        etaValue: eta,
        steps,
      };
  }
}

function getScenario(order: Order, now: Date): Scenario {
  if (order.status === "delivered") return "delivered";
  if (order.carrier === null) return "tracking-pending";
  if (order.delay || new Date(order.estimatedDelivery.to) < now) return "delayed";
  return "on-track";
}

const STEP_COPY: Record<OrderStatus, { title: string; description: string }> = {
  confirmed: { title: "Order confirmed", description: "We've received your order" },
  processing: { title: "Preparing", description: "Picking and packing your items" },
  shipped: { title: "On the way", description: "With the courier, heading to you" },
  out_for_delivery: { title: "Out for delivery", description: "With a driver, arriving today" },
  delivered: { title: "Delivered", description: "Your parcel has arrived" },
};

const STEP_ORDER: OrderStatus[] = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

function buildSteps(order: Order): TimelineStep[] {
  const currentIndex = STEP_ORDER.indexOf(order.status);

  return STEP_ORDER.map((status, index) => {
    const firstEvent = order.events.find((event) => event.status === status);
    return {
      status,
      ...STEP_COPY[status],
      state: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
      time: firstEvent ? formatDateTime(firstEvent.at) : undefined,
    };
  });
}
