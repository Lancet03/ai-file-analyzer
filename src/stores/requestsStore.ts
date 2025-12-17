"use client";

import { create } from "zustand";
import type { AnalyzerRequest, UploadTask } from "@/lib/types";
import {
  createRequestWithProgress,
  getRequest,
  listRequests,
} from "@/lib/api/requests";

function makeLocalId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type State = {
  requests: AnalyzerRequest[];
  byId: Record<string, AnalyzerRequest>;

  isSyncing: boolean;
  syncError?: string;
  lastSyncAtISO?: string;

  uploads: Record<string, UploadTask>;

  syncList: () => Promise<void>;
  fetchOne: (id: string) => Promise<void>;
  create: (file: File, description?: string) => Promise<void>;
  clearUpload: (localId: string) => void;
};

export const useRequestsStore = create<State>((set, get) => ({
  requests: [],
  byId: {},
  isSyncing: false,
  uploads: {},

  syncList: async () => {
    set({ isSyncing: true, syncError: undefined });
    try {
      const items = await listRequests();
      const byId: Record<string, AnalyzerRequest> = {};
      for (const r of items) byId[r.id] = r;

      set({
        requests: items,
        byId: { ...get().byId, ...byId },
        isSyncing: false,
        lastSyncAtISO: new Date().toISOString(),
      });
    } catch (e) {
      set({
        isSyncing: false,
        syncError: e instanceof Error ? e.message : "Sync error",
      });
    }
  },

  fetchOne: async (id: string) => {
    try {
      const r = await getRequest(id);
      set((s) => ({ byId: { ...s.byId, [id]: r } }));
    } catch {
      // опционально логирование
    }
  },

  create: async (file: File, description?: string) => {
    const localId = makeLocalId();

    set((s) => ({
      uploads: {
        ...s.uploads,
        [localId]: {
          localId,
          filename: file.name,
          sizeBytes: file.size,
          description,
          progress: 0,
          state: "uploading",
        },
      },
    }));

    try {
      const resp = await createRequestWithProgress({
        file,
        description,
        onProgress: (p) => {
          set((s) => ({
            uploads: {
              ...s.uploads,
              [localId]: {
                ...s.uploads[localId],
                progress: p,
                state: "uploading",
              },
            },
          }));
        },
      });

      // resp может быть AnalyzerRequest или {id}
      const requestId = "id" in resp ? resp.id : undefined;

      set((s) => ({
        uploads: {
          ...s.uploads,
          [localId]: {
            ...s.uploads[localId],
            progress: 100,
            state: "done",
            requestId,
          },
        },
        byId:
          typeof resp === "object" && "storageKey" in resp
            ? { ...s.byId, [resp.id]: resp }
            : s.byId,
      }));

      await get().syncList();

      // если бэк вернул только {id}, подтянем детали
      if (requestId && !(typeof resp === "object" && "storageKey" in resp)) {
        await get().fetchOne(requestId);
      }
    } catch (e) {
      set((s) => ({
        uploads: {
          ...s.uploads,
          [localId]: {
            ...s.uploads[localId],
            state: "error",
            error: e instanceof Error ? e.message : "Upload error",
          },
        },
      }));
    }
  },

  clearUpload: (localId: string) => {
    set((s) => {
      const next = { ...s.uploads };
      delete next[localId];
      return { uploads: next };
    });
  },
}));
