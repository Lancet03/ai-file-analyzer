export type RequestStatus =
  | "PENDING"
  | "SCHEDULED"
  | "PROCESSING"
  | "FAILED"
  | "COMPLETED";

export type BackendRequest = {
  id: string;
  filename: string;
  content_type: string;
  storage_key: string;
  status: RequestStatus;
  description: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  error_message?: string | null;
  result_summary?: string | null;
  findings_storage_key?: string | null;
  report_storage_key?: string | null;
  analysis_context_storage_key?: string | null;
  llm_response_storage_key?: string | null;
  created_at: string; // "2025-12-17T19:43:26.010701"
  updated_at: string;
};

export type BackendListResponse = {
  items: BackendRequest[];
};

export type AnalysisFinding = {
  id: string;
  title: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  evidence: string;
  risk: string;
  recommendation: string;
  related_rule_ids: string[];
};

export type AnalysisResult = {
  request_id: string;
  status: RequestStatus;
  error_message: string | null;
  result_summary: string | null;
  findings_storage_key: string | null;
  report_storage_key: string | null;
  analysis_context_storage_key: string | null;
  llm_response_storage_key: string | null;
  findings: AnalysisFinding[] | null;
};

export type AnalyzerRequest = {
  id: string;
  filename: string;
  contentType: string;
  storageKey: string;
  status: RequestStatus;
  description: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  resultSummary?: string | null;
  findingsStorageKey?: string | null;
  reportStorageKey?: string | null;
  analysisContextStorageKey?: string | null;
  llmResponseStorageKey?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UploadTask = {
  localId: string;
  filename: string;
  sizeBytes: number;
  description?: string;
  progress: number; // 0..100 upload progress
  state: "uploading" | "done" | "error";
  error?: string;
  requestId?: string;
};
