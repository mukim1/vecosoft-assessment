import type { LucideIcon } from "lucide-react";

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/** Centred icon + message + actions, shared by the empty, error and not-found screens. */
export function StateMessage({ icon: Icon, title, description, children }: StateMessageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon className="size-7 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex w-full max-w-xs flex-col gap-2">{children}</div>}
    </div>
  );
}
