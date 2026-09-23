"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // One client per browser session; created in state so it survives re-renders.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // The mock API fails deterministically, so retrying would only delay the error state.
        defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme="light" position="top-center" />
    </QueryClientProvider>
  );
}
