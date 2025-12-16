"use client";

import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/types";

export function RequestStatusBadge({ status }: { status?: RequestStatus }) {
  const s = (status ?? "unknown").toString();

  if (s === "queued") return <Badge variant="secondary">queued</Badge>;
  if (s === "processing") return <Badge>processing</Badge>;
  if (s === "done")
    return <Badge className="bg-green-600 text-white">done</Badge>;
  if (s === "error")
    return <Badge className="bg-red-600 text-white">error</Badge>;

  return <Badge variant="outline">{s}</Badge>;
}
