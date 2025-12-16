export type RequestStatus = "queued" | "processing" | "done" | "error" | string;

export type AnalyzerRequest = {
  id: string;
  filename?: string;
  description?: string | null;

  status?: RequestStatus;
  message?: string | null;

  createdAtISO?: string; // нормализованное ISO
  sizeBytes?: number | null;
  contentType?: string | null;

  // если ваш бэк отдаёт прогресс анализа — поддержим:
  analysisProgress?: number | null;

  // на случай дополнительных полей
  [k: string]: unknown;
};

export type UploadTask = {
  localId: string;
  filename: string;
  sizeBytes: number;
  description?: string;
  progress: number; // upload progress 0..100
  state: "uploading" | "done" | "error";
  error?: string;
  requestId?: string;
};
