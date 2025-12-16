"use client";

import { useEffect } from "react";
import { useRequestsStore } from "@/stores/requestsStore";

export function useRequestsPolling(intervalMs: number = 3000) {
  const syncList = useRequestsStore((s) => s.syncList);

  useEffect(() => {
    syncList();
    const t = window.setInterval(() => {
      syncList();
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [syncList, intervalMs]);
}
