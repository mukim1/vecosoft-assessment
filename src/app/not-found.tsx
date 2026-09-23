import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { StateMessage } from "@/components/state-message";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <StateMessage icon={MapPinOff} title="Page not found" description="This page doesn't exist or has moved.">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          Back to your orders
        </Link>
      </StateMessage>
    </main>
  );
}
