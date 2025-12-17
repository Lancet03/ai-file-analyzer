export type RequestStatus = "PENDING" | "SCHEDULED" | "FAILED" | "COMPLETED";

export type BackendRequest = {
  id: string;
  filename: string;
  content_type: string;
  storage_key: string;
  status: RequestStatus;
  description: string | null;
  created_at: string; // "2025-12-17T19:43:26.010701"
  updated_at: string;
};

export type BackendListResponse = {
  items: BackendRequest[];
};

export type AnalyzerRequest = {
  id: string;
  filename: string;
  contentType: string;
  storageKey: string;
  status: RequestStatus;
  description: string | null;
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
