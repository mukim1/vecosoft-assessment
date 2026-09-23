import { Clock, PackageCheck } from "lucide-react";

export function TrackingPendingCard({ trackingExpected }: { trackingExpected?: string }) {
  return (
    <section aria-labelledby="pending-heading" className="rounded-2xl border bg-card p-5">
      <h2 id="pending-heading" className="font-semibold">
        Why there’s no tracking yet
      </h2>
      <ul className="mt-3 space-y-3 text-sm">
        <li className="flex gap-3">
          <PackageCheck className="size-5 shrink-0 text-emerald-600" aria-hidden />
          <span>Your payment went through and our warehouse is packing your items.</span>
        </li>
        <li className="flex gap-3">
          <Clock className="size-5 shrink-0 text-sky-600" aria-hidden />
          <span>
            {trackingExpected ? (
              <>
                Tracking number expected by <span className="font-semibold">{trackingExpected}</span>.
              </>
            ) : (
              "You'll get a tracking number as soon as the courier collects it."
            )}
          </span>
        </li>
      </ul>
    </section>
  );
}
