"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { IssueType } from "@/services/order-service";
import { useReportIssue } from "../hooks/use-order-tracking";
import { BOTTOM_SHEET_CLASS } from "../lib/sheet";
import type { DeliveryProof } from "../types";

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: "not-received", label: "Marked delivered but I didn't get it" },
  { value: "damaged", label: "Parcel arrived damaged" },
  { value: "wrong-item", label: "Wrong or missing item" },
  { value: "late", label: "It's taking too long" },
  { value: "other", label: "Something else" },
];

const MISSING_PARCEL_CHECKS = [
  "I asked my neighbours and building staff",
  "I checked safe places (porch, mailbox, front desk)",
  "I compared the spot in the delivery photo",
];

type Step = "checklist" | "form" | "done";

interface ReportIssueSheetProps {
  orderId: string;
  trigger: React.ReactElement;
  triggerLabel: React.ReactNode;
  /** Shows the "Didn't get it?" checklist first, for delivered orders. */
  deliveryProof?: DeliveryProof;
}

export function ReportIssueSheet({ orderId, trigger, triggerLabel, deliveryProof }: ReportIssueSheetProps) {
  const firstStep: Step = deliveryProof ? "checklist" : "form";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(firstStep);
  const [checked, setChecked] = useState<string[]>([]);
  const [issueType, setIssueType] = useState<IssueType>(deliveryProof ? "not-received" : "late");
  const [details, setDetails] = useState("");
  const report = useReportIssue();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep(firstStep);
      setChecked([]);
      setDetails("");
      report.reset();
    }
  }

  function toggleCheck(item: string, isChecked: boolean) {
    setChecked(isChecked ? [...checked, item] : checked.filter((c) => c !== item));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    report.mutate({ orderId, type: issueType, details }, { onSuccess: () => setStep("done") });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={trigger}>{triggerLabel}</SheetTrigger>
      <SheetContent side="bottom" className={BOTTOM_SHEET_CLASS}>
        {step === "checklist" && deliveryProof && (
          <>
            <SheetHeader>
              <SheetTitle>Didn’t get your parcel?</SheetTitle>
              <SheetDescription>Most “missing” parcels turn up nearby. A few quick checks first:</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <figure className="overflow-hidden rounded-xl border">
                <Image
                  src={deliveryProof.photoUrl}
                  alt="Courier's photo of the parcel at the delivery spot"
                  width={400}
                  height={225}
                  className="h-auto w-full"
                />
                <figcaption className="p-3 text-xs text-muted-foreground">{deliveryProof.location}</figcaption>
              </figure>
              <fieldset className="space-y-3">
                <legend className="sr-only">Checks before reporting</legend>
                {MISSING_PARCEL_CHECKS.map((item) => (
                  <Label key={item} className="flex items-center gap-3 rounded-lg border p-3 font-normal">
                    <Checkbox
                      checked={checked.includes(item)}
                      onCheckedChange={(isChecked) => toggleCheck(item, isChecked)}
                    />
                    {item}
                  </Label>
                ))}
              </fieldset>
            </div>
            <SheetFooter>
              <Button size="lg" onClick={() => setStep("form")}>
                I still can’t find it
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {checked.length} of {MISSING_PARCEL_CHECKS.length} checked
              </p>
            </SheetFooter>
          </>
        )}

        {step === "form" && (
          <form onSubmit={submit} className="flex flex-1 flex-col">
            <SheetHeader>
              <SheetTitle>Report a delivery issue</SheetTitle>
              <SheetDescription>Order {orderId}. Our team replies within 2 hours, 8am–10pm.</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <RadioGroup
                aria-label="What went wrong?"
                value={issueType}
                onValueChange={(value) => setIssueType(value as IssueType)}
              >
                {ISSUE_TYPES.map((type) => (
                  <Label key={type.value} className="flex items-center gap-3 rounded-lg border p-3 font-normal">
                    <RadioGroupItem value={type.value} />
                    {type.label}
                  </Label>
                ))}
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="issue-details">Anything else we should know? (optional)</Label>
                <Textarea
                  id="issue-details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="E.g. the photo shows a different door"
                />
              </div>
              {report.isError && (
                <p role="alert" className="text-sm text-destructive">
                  We couldn’t send your report. Please try again.
                </p>
              )}
            </div>
            <SheetFooter>
              <Button type="submit" size="lg" disabled={report.isPending}>
                {report.isPending && <Loader2 className="animate-spin" aria-hidden />}
                {report.isPending ? "Sending…" : "Send report"}
              </Button>
            </SheetFooter>
          </form>
        )}

        {step === "done" && (
          <div role="status" className="flex flex-col items-center gap-3 px-6 pt-10 pb-8 text-center">
            <CircleCheck className="size-12 text-emerald-600" aria-hidden />
            <SheetTitle className="text-lg font-semibold">We’re on it</SheetTitle>
            <SheetDescription>
              Your reference is <span className="font-semibold text-foreground">{report.data?.reference}</span>. We’ll
              contact the courier and update you within 2 hours.
            </SheetDescription>
            <Button size="lg" className="mt-2 w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
