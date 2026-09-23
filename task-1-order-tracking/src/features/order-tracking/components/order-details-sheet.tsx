"use client";

import { ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { formatDateTime, formatMoney } from "../lib/format";
import { BOTTOM_SHEET_CLASS } from "../lib/sheet";
import type { Order } from "../types";

interface OrderDetailsSheetProps {
  order: Order;
  total: number;
}

export function OrderDetailsSheet({ order, total }: OrderDetailsSheetProps) {
  const history = [...order.events].reverse();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="lg" className="mt-4 w-full" />}>
        <ReceiptText aria-hidden />
        View order details
      </SheetTrigger>
      <SheetContent side="bottom" className={BOTTOM_SHEET_CLASS}>
        <SheetHeader>
          <SheetTitle>Order {order.id}</SheetTitle>
          <SheetDescription>Placed {formatDateTime(order.placedAt)}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6 text-sm">
          <DetailGroup title="Items">
            {order.items.map((item) => (
              <Row key={item.id} label={`${item.name} × ${item.quantity}`}>
                {formatMoney(item.unitPrice * item.quantity, order.currency)}
              </Row>
            ))}
            <Row label="Shipping">
              {order.shippingFee === 0 ? "Free" : formatMoney(order.shippingFee, order.currency)}
            </Row>
            <Separator />
            <Row label="Total paid">
              <span className="font-semibold">{formatMoney(total, order.currency)}</span>
            </Row>
          </DetailGroup>

          <DetailGroup title="Delivering to">
            <p>{order.shippingAddress.name}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.line1}, {order.shippingAddress.city}
            </p>
          </DetailGroup>

          <DetailGroup title="Courier">
            {order.carrier ? (
              <Row label={order.carrier.name}>
                <span className="font-mono text-xs">{order.carrier.trackingNumber}</span>
              </Row>
            ) : (
              <p className="text-muted-foreground">Assigned once your parcel is packed</p>
            )}
          </DetailGroup>

          <DetailGroup title="Tracking history">
            <ol className="space-y-3">
              {history.map((event) => (
                <li key={event.at}>
                  <p className="font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.at)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </li>
              ))}
            </ol>
          </DetailGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
