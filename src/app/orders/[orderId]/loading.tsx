import { AppHeader } from "@/components/app-header";
import { OrderTrackingSkeleton } from "@/features/order-tracking/components/order-tracking-skeleton";

export default function Loading() {
  return (
    <>
      <AppHeader title="Track your order" />
      <main className="flex-1 p-4">
        <OrderTrackingSkeleton />
      </main>
    </>
  );
}
