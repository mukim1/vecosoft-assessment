"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BOTTOM_SHEET_CLASS } from "../lib/sheet";

export function CancelOrderSheet({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  function confirmCancel() {
    setOpen(false);
    toast.success(`Cancellation requested for order ${orderId}. Your refund will arrive in 3–5 business days.`);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="lg" />}>Cancel & refund</SheetTrigger>
      <SheetContent side="bottom" className={BOTTOM_SHEET_CLASS}>
        <SheetHeader>
          <SheetTitle>Cancel this order?</SheetTitle>
          <SheetDescription>
            We’ll stop the parcel with the courier and refund you in full to your original payment method within 3–5
            business days. You don’t need to return anything.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button size="lg" variant="destructive" onClick={confirmCancel}>
            Yes, cancel and refund
          </Button>
          <SheetClose render={<Button size="lg" variant="outline" />}>Keep my order</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
