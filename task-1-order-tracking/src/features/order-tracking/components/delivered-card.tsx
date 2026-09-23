import { MapPin, SearchX } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { DeliveryProof } from "../types";
import { ReportIssueSheet } from "./report-issue-sheet";

interface DeliveredCardProps {
  orderId: string;
  proof: DeliveryProof;
}

export function DeliveredCard({ orderId, proof }: DeliveredCardProps) {
  return (
    <section aria-labelledby="proof-heading" className="rounded-2xl border bg-card p-5">
      <h2 id="proof-heading" className="font-semibold">
        Proof of delivery
      </h2>
      <Image
        src={proof.photoUrl}
        alt="Courier's photo of the parcel at the delivery spot"
        width={400}
        height={225}
        className="mt-3 h-auto w-full rounded-xl border"
      />
      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {proof.location}
      </p>
      <ReportIssueSheet
        orderId={orderId}
        deliveryProof={proof}
        trigger={<Button size="lg" variant="outline" className="mt-4 w-full" />}
        triggerLabel={
          <>
            <SearchX aria-hidden />
            Didn’t get it?
          </>
        }
      />
    </section>
  );
}
