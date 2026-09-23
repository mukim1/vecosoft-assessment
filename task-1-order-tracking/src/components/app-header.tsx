import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/90 px-2 py-2 backdrop-blur sm:rounded-t-3xl">
      <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))} aria-label="Back to orders">
        <ArrowLeft aria-hidden />
      </Link>
      <div>
        <h1 className="text-base leading-tight font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
}
