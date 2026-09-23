import { AppHeader } from "@/components/app-header";
import { OrderTrackingScreen } from "@/features/order-tracking/components/order-tracking-screen";

export default async function OrderPage({ params }: PageProps<"/orders/[orderId]">) {
  const { orderId } = await params;

  return (
    <>
      <AppHeader title="Track your order" subtitle={`Order #${orderId}`} />
      <main className="flex flex-1 flex-col p-4">
        <OrderTrackingScreen orderId={orderId} />
      </main>
    </>
  );
}
