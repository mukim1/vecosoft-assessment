import Image from "next/image";
import { formatMoney } from "../lib/format";
import type { Order } from "../types";
import { OrderDetailsSheet } from "./order-details-sheet";

export function OrderSummary({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, order.shippingFee);

  return (
    <section aria-labelledby="summary-heading" className="rounded-2xl border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h2 id="summary-heading" className="font-semibold">
          Your order
        </h2>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {formatMoney(total, order.currency)}
        </p>
      </div>

      <ul className="mt-3 space-y-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <Image
              src={item.imageUrl}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-lg border bg-muted"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.variant} · Qty {item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <OrderDetailsSheet order={order} total={total} />
    </section>
  );
}
