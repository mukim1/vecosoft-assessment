import { Mail, MessageSquareWarning, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "../lib/support";
import { ReportIssueSheet } from "./report-issue-sheet";

export function SupportActions({ orderId }: { orderId: string }) {
  return (
    <section id="support" aria-labelledby="support-heading" className="scroll-mt-4 rounded-2xl border bg-card p-5">
      <h2 id="support-heading" className="font-semibold">
        Need help with this order?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Real people, 8am–10pm every day. Usually replies in minutes.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={`tel:${SUPPORT_PHONE}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          <Phone aria-hidden />
          Call us
        </a>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Help with order ${orderId}`)}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <Mail aria-hidden />
          Email us
        </a>
      </div>
      <ReportIssueSheet
        orderId={orderId}
        trigger={<Button variant="secondary" size="lg" className="mt-2 w-full" />}
        triggerLabel={
          <>
            <MessageSquareWarning aria-hidden />
            Report a delivery issue
          </>
        }
      />
    </section>
  );
}
