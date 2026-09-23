"use client";

import { TriangleAlert } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";

/** Catches unexpected rendering errors; expected API failures are handled inside the screen. */
export default function OrderError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <>
      <AppHeader title="Track your order" />
      <main className="flex flex-1 flex-col">
        <StateMessage
          icon={TriangleAlert}
          title="Something went wrong"
          description="We couldn't show this page. Your order isn't affected."
        >
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
        </StateMessage>
      </main>
    </>
  );
}
