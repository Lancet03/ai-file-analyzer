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
    startedAt: r.started_at,
    completedAt: r.completed_at,
    errorMessage: r.error_message,
    resultSummary: r.result_summary,
    findingsStorageKey: r.findings_storage_key,
    reportStorageKey: r.report_storage_key,
    analysisContextStorageKey: r.analysis_context_storage_key,
    llmResponseStorageKey: r.llm_response_storage_key,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function normalizeList(resp: BackendListResponse): AnalyzerRequest[] {
  return (resp.items ?? []).map(normalizeRequest);
}
