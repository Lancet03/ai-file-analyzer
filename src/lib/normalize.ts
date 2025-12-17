import type {
  AnalyzerRequest,
  BackendListResponse,
  BackendRequest,
} from "@/lib/types";

export function normalizeRequest(r: BackendRequest): AnalyzerRequest {
  return {
    id: r.id,
    filename: r.filename,
    contentType: r.content_type,
    storageKey: r.storage_key,
    status: r.status,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function normalizeList(resp: BackendListResponse): AnalyzerRequest[] {
  return (resp.items ?? []).map(normalizeRequest);
}
