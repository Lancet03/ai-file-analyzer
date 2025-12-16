import type { AnalyzerRequest } from "@/lib/types";
import { normalizeRequest, normalizeRequestList } from "@/lib/normalize";

export async function listRequests(
  signal?: AbortSignal
): Promise<AnalyzerRequest[]> {
  const res = await fetch("/api/requests", { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/requests failed: ${res.status}`);
  return normalizeRequestList(await res.json());
}

export async function getRequest(
  id: string,
  signal?: AbortSignal
): Promise<AnalyzerRequest> {
  const res = await fetch(`/api/requests/${encodeURIComponent(id)}`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET /api/requests/${id} failed: ${res.status}`);
  return normalizeRequest(await res.json());
}

/**
 * Upload с прогрессом (XHR) -> POST /api/requests (multipart: file + description)
 * Возвращает либо {id}, либо объект запроса (зависит от вашего бэка).
 */
export function createRequestWithProgress(args: {
  file: File;
  description?: string;
  onProgress: (p: number) => void;
  signal?: AbortSignal;
}): Promise<any> {
  const { file, description, onProgress, signal } = args;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/requests", true);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const p = Math.round((evt.loaded / evt.total) * 100);
      onProgress(Math.max(0, Math.min(100, p)));
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`POST /api/requests failed: ${xhr.status}`));
        return;
      }
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        // если бэк вернул не JSON
        resolve({ ok: true });
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
    form.append("file", file);
    if (description && description.trim())
      form.append("description", description.trim());
    xhr.send(form);
  });
}
