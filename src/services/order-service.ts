import type { Order } from "@/features/order-tracking/types";
import { DEMO_ORDER_IDS, orders } from "@/mocks/orders";

/**
 * Fake API client. This is the only file to replace when a real backend exists;
 * the latency makes the loading and error states real rather than simulated in the UI.
 */

const MOCK_LATENCY_MS = 900;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves to null when no order has this ID. */
export async function getOrder(orderId: string): Promise<Order | null> {
  await wait(MOCK_LATENCY_MS);
  if (orderId === DEMO_ORDER_IDS.error) {
    throw new Error("The tracking service didn't respond.");
  }
  return orders[orderId] ?? null;
}

export type IssueType = "not-received" | "damaged" | "wrong-item" | "late" | "other";

export interface IssueReport {
  orderId: string;
  type: IssueType;
  details: string;
}

export async function reportIssue(report: IssueReport): Promise<{ reference: string }> {
  await wait(MOCK_LATENCY_MS);
  return { reference: `SUP-${report.orderId.replace("VS-", "")}-${Date.now().toString().slice(-4)}` };
}
