import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrder, reportIssue } from "@/services/order-service";

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
  });
}

export function useReportIssue() {
  return useMutation({ mutationFn: reportIssue });
}
