import type { AnalyzerRequest } from "./types";

export function normalizeRequest(raw: any): AnalyzerRequest {
  const created =
    raw?.createdAtISO ??
    raw?.created_at ??
    raw?.createdAt ??
    raw?.created_at_iso ??
    undefined;

  return {
    ...raw,
    id: String(raw?.id ?? ""),
    filename: raw?.filename ?? raw?.fileName ?? raw?.originalName,
    description: raw?.description ?? null,
    status: raw?.status,
    message: raw?.message ?? raw?.error ?? null,
    createdAtISO: typeof created === "string" ? created : undefined,
    sizeBytes: raw?.sizeBytes ?? raw?.size_bytes ?? raw?.size ?? null,
    contentType: raw?.contentType ?? raw?.content_type ?? null,
    analysisProgress: raw?.analysisProgress ?? raw?.analysis_progress ?? null,
  };
}

export function normalizeRequestList(raw: any): AnalyzerRequest[] {
  const arr = Array.isArray(raw) ? raw : raw?.items ?? raw?.data ?? [];
  return Array.isArray(arr) ? arr.map(normalizeRequest) : [];
}
