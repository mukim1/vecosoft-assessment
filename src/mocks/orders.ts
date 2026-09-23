import type { Order, OrderItem } from "@/features/order-tracking/types";

/**
 * Demo fixtures. Dates are relative to the hour the module loads, so every
 * scenario (late, delivered today, ...) looks right whenever the demo is opened.
 */

const HOUR = 60 * 60 * 1000;
const thisHour = Math.floor(Date.now() / HOUR) * HOUR;

function hoursFromNow(hours: number): string {
  return new Date(thisHour + hours * HOUR).toISOString();
}

const headphones: OrderItem = {
  id: "item-headphones",
  name: "Aurora Wireless Headphones",
  variant: "Midnight Blue",
  quantity: 1,
  unitPrice: 129,
  imageUrl: "/products/headphones.svg",
};

const sneakers: OrderItem = {
  id: "item-sneakers",
  name: "Stride Running Sneakers",
  variant: "Size 42 · Coral",
  quantity: 1,
  unitPrice: 89,
  imageUrl: "/products/sneakers.svg",
};

const mug: OrderItem = {
  id: "item-mug",
  name: "Ceramic Travel Mug",
  variant: "350 ml · Sage",
  quantity: 2,
  unitPrice: 18,
  imageUrl: "/products/mug.svg",
};

const address = { name: "Nadia Rahman", line1: "House 12, Road 5, Dhanmondi", city: "Dhaka 1205" };

export const DEMO_ORDER_IDS = {
  onTrack: "VS-1001",
  delayed: "VS-1002",
  delivered: "VS-1003",
  trackingPending: "VS-1004",
  error: "VS-ERROR",
  notFound: "VS-0000",
} as const;

export const orders: Record<string, Order> = {
  [DEMO_ORDER_IDS.onTrack]: {
    id: DEMO_ORDER_IDS.onTrack,
    placedAt: hoursFromNow(-30),
    status: "shipped",
    items: [headphones],
    currency: "USD",
    shippingFee: 0,
    shippingAddress: address,
    carrier: { name: "DHL Express", trackingNumber: "JD014600006281" },
    estimatedDelivery: { from: hoursFromNow(26), to: hoursFromNow(30) },
    events: [
      { status: "confirmed", at: hoursFromNow(-30), description: "Order confirmed" },
      { status: "processing", at: hoursFromNow(-28), description: "Packed at our warehouse", location: "Gazipur" },
      { status: "shipped", at: hoursFromNow(-6), description: "Picked up by DHL Express", location: "Gazipur hub" },
    ],
  },

  [DEMO_ORDER_IDS.delayed]: {
    id: DEMO_ORDER_IDS.delayed,
    placedAt: hoursFromNow(-80),
    status: "shipped",
    items: [sneakers, mug],
    currency: "USD",
    shippingFee: 5,
    shippingAddress: address,
    carrier: { name: "Pathao Courier", trackingNumber: "PC88213457" },
    estimatedDelivery: { from: hoursFromNow(20), to: hoursFromNow(26) },
    delay: {
      reason: "Heavy rain closed the Dhaka–Chattogram highway, so our carrier's trucks are running behind.",
      originalEstimate: { from: hoursFromNow(-10), to: hoursFromNow(-6) },
    },
    events: [
      { status: "confirmed", at: hoursFromNow(-80), description: "Order confirmed" },
      { status: "processing", at: hoursFromNow(-76), description: "Packed at our warehouse", location: "Chattogram" },
      { status: "shipped", at: hoursFromNow(-60), description: "Picked up by Pathao Courier", location: "Chattogram hub" },
      { status: "shipped", at: hoursFromNow(-12), description: "Held at sorting centre due to weather", location: "Cumilla" },
    ],
  },

  [DEMO_ORDER_IDS.delivered]: {
    id: DEMO_ORDER_IDS.delivered,
    placedAt: hoursFromNow(-72),
    status: "delivered",
    items: [mug],
    currency: "USD",
    shippingFee: 3,
    shippingAddress: address,
    carrier: { name: "RedX", trackingNumber: "RX55012987" },
    estimatedDelivery: { from: hoursFromNow(-6), to: hoursFromNow(-2) },
    deliveredAt: hoursFromNow(-3),
    deliveryProof: { location: "Left with the building's front desk", photoUrl: "/delivery-proof.svg" },
    events: [
      { status: "confirmed", at: hoursFromNow(-72), description: "Order confirmed" },
      { status: "processing", at: hoursFromNow(-70), description: "Packed at our warehouse", location: "Gazipur" },
      { status: "shipped", at: hoursFromNow(-48), description: "Picked up by RedX", location: "Gazipur hub" },
      { status: "out_for_delivery", at: hoursFromNow(-7), description: "Out for delivery with Rahim", location: "Dhanmondi" },
      { status: "delivered", at: hoursFromNow(-3), description: "Delivered — left with the front desk", location: "Dhanmondi" },
    ],
  },

  [DEMO_ORDER_IDS.trackingPending]: {
    id: DEMO_ORDER_IDS.trackingPending,
    placedAt: hoursFromNow(-2),
    status: "processing",
    items: [headphones, sneakers],
    currency: "USD",
    shippingFee: 0,
    shippingAddress: address,
    carrier: null,
    trackingExpectedAt: hoursFromNow(20),
    estimatedDelivery: { from: hoursFromNow(70), to: hoursFromNow(96) },
    events: [
      { status: "confirmed", at: hoursFromNow(-2), description: "Order confirmed" },
      { status: "processing", at: hoursFromNow(-1), description: "Being picked and packed", location: "Gazipur" },
    ],
  },
};
