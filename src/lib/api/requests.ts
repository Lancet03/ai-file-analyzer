import type {
  AnalyzerRequest,
  BackendListResponse,
  BackendRequest,
} from "@/lib/types";
import { normalizeList, normalizeRequest } from "@/lib/normalize";

/** GET /api/requests -> { items: [...] } */
export async function listRequests(
  signal?: AbortSignal
): Promise<AnalyzerRequest[]> {
  const res = await fetch("/api/requests", { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/requests failed: ${res.status}`);
  const data = (await res.json()) as BackendListResponse;
  return normalizeList(data);
}

/** GET /api/requests/{id} -> BackendRequest */
export async function getRequest(id: string): Promise<AnalyzerRequest> {
  console.log("encodeURIComponent(id)", encodeURIComponent(id));
  const res = await fetch(`/api/requests/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET /api/requests/${id} failed: ${res.status}`);
  const data = (await res.json()) as BackendRequest;
  console.log("data", data);
  return normalizeRequest(data);
}

/**
 * POST /api/requests
 * multipart/form-data:
 *  - file: File (обязательный)
 *  - description: string (опциональный)
 *
 * Прогресс upload — через XHR.
 * Бэкенд может вернуть либо BackendRequest, либо {id}.
 */
export function createRequestWithProgress(args: {
  file: File;
  description?: string | null;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}): Promise<AnalyzerRequest | { id: string }> {
  const { file, description, onProgress, signal } = args;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/requests", true);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable || !onProgress) return;
      const p = Math.round((evt.loaded / evt.total) * 100);
      onProgress(Math.max(0, Math.min(100, p)));
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`POST /api/requests failed: ${xhr.status}`));
        return;
      }
      try {
        const json = JSON.parse(xhr.responseText);
        // если бэк вернул объект запроса с content_type/storage_key/created_at — нормализуем
        if (
          json &&
          typeof json === "object" &&
          "content_type" in json &&
          "storage_key" in json
        ) {
          resolve(normalizeRequest(json as BackendRequest));
        } else {
          resolve(json as { id: string });
        }
      } catch {
        reject(new Error("Invalid JSON response from POST /api/requests"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    if (signal) {
      const onAbort = () => {
        xhr.abort();
        reject(new Error("Upload aborted"));
      };
      if (signal.aborted) return onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }

    const form = new FormData();
    form.append("file", file); // ключ строго "file"
    if (description && description.trim()) {
      form.append("description", description.trim()); // ключ строго "description"
    }

    xhr.send(form);
  });
}

/** GET /api/requests/{id}/file */
export function getFileUrl(id: string) {
  return `/api/requests/${encodeURIComponent(id)}/file`;
}
