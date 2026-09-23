/** Raw order data, shaped like a typical order API response. */

export type OrderStatus = "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered";

export interface TimeWindow {
  /** ISO date-time strings. */
  from: string;
  to: string;
}

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface TrackingEvent {
  status: OrderStatus;
  at: string;
  description: string;
  location?: string;
}

export interface Carrier {
  name: string;
  trackingNumber: string;
}

export interface Delay {
  reason: string;
  /** The delivery window promised before the delay. */
  originalEstimate: TimeWindow;
}

export interface DeliveryProof {
  location: string;
  photoUrl: string;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  currency: string;
  shippingFee: number;
  shippingAddress: { name: string; line1: string; city: string };
  /** null until the carrier scans the parcel for the first time. */
  carrier: Carrier | null;
  estimatedDelivery: TimeWindow;
  /** When a tracking number is expected, for orders not yet handed to a carrier. */
  trackingExpectedAt?: string;
  delay?: Delay;
  deliveredAt?: string;
  deliveryProof?: DeliveryProof;
  events: TrackingEvent[];
}

/** Derived, display-ready data. Components render this and never re-derive business rules. */

export type Scenario = "on-track" | "delayed" | "delivered" | "tracking-pending";

export type Tone = "info" | "warning" | "success";

export type StepState = "complete" | "current" | "upcoming";

export interface TimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  state: StepState;
  /** Formatted time the step happened, when it has. */
  time?: string;
}

export interface OrderView {
  scenario: Scenario;
  tone: Tone;
  headline: string;
  message: string;
  etaLabel: string;
  etaValue: string;
  steps: TimelineStep[];
  delay?: { reason: string; originalEta: string; newEta: string };
  /** Formatted time a tracking number is expected, while the order has no carrier yet. */
  trackingExpected?: string;
}
