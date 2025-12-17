"use client";

import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">PENDING</Badge>;
    case "SCHEDULED":
      return <Badge>SCHEDULED</Badge>;
    case "COMPLETED":
      return <Badge className="bg-green-600 text-white">COMPLETED</Badge>;
    case "FAILED":
      return <Badge className="bg-red-600 text-white">FAILED</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
