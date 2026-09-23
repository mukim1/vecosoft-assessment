"use client";

import { Bell, BellRing, Headset } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderView } from "../types";
import { CancelOrderSheet } from "./cancel-order-sheet";

interface DelayBannerProps {
  orderId: string;
  delay: NonNullable<OrderView["delay"]>;
}

export function DelayBanner({ orderId, delay }: DelayBannerProps) {
  const [notify, setNotify] = useState(false);

  function toggleNotify() {
    setNotify(!notify);
    toast.success(notify ? "Delivery updates turned off" : "We'll text you as soon as your order moves");
  }

  return (
    <section aria-labelledby="delay-heading" className="rounded-2xl border border-amber-200 bg-card p-5">
      <h2 id="delay-heading" className="font-semibold">
        What changed
      </h2>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Originally</dt>
          <dd className="text-muted-foreground line-through">{delay.originalEta}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Now expected</dt>
          <dd className="font-semibold">{delay.newEta}</dd>
        </div>
      </dl>

      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
        <span className="font-medium">Why: </span>
        {delay.reason}
      </p>

      <div className="mt-4 grid gap-2">
        <Button size="lg" onClick={toggleNotify} aria-pressed={notify}>
          {notify ? <BellRing aria-hidden /> : <Bell aria-hidden />}
          {notify ? "You'll get delivery updates" : "Notify me about updates"}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <a href="#support" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            <Headset aria-hidden />
            Contact us
          </a>
          <CancelOrderSheet orderId={orderId} />
        </div>
      </div>
    </section>
  );
}
