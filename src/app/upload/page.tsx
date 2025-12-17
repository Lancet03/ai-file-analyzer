"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { useRequestsStore } from "@/stores/requestsStore";

export default function UploadPage() {
  const create = useRequestsStore((s) => s.create);
  const uploads = useRequestsStore((s) => s.uploads);
  const clearUpload = useRequestsStore((s) => s.clearUpload);

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    setFile(accepted?.[0] ?? null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop,
  });

  const activeUploads = useMemo(
    () =>
      Object.values(uploads).sort((a, b) => (a.localId < b.localId ? 1 : -1)),
    [uploads]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Новый запрос</h1>
        <p className="text-sm text-muted-foreground">
          Загрузите файл и (опционально) добавьте описание. Запрос уйдёт в
          обработку на бэкенде.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={[
          "rounded-2xl border border-dashed p-10 text-center cursor-pointer select-none transition",
          "hover:bg-muted/40",
          isDragActive
            ? "bg-muted/60 border-muted-foreground/40"
            : "bg-background",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        <div className="text-sm font-medium">Перетащите файл сюда</div>
        <div className="text-xs text-muted-foreground mt-1">
          или нажмите, чтобы выбрать файл
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Описание (опционально)</Label>
        <Textarea
          id="desc"
          placeholder="Например: логи за сутки, инцидент #123"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[90px] rounded-xl"
        />
      </div>

      <div className="space-y-2">
        {file ? (
          <>
            <div className="text-sm">
              Выбран: <span className="font-medium">{file.name}</span>{" "}
              <span className="text-muted-foreground">
                ({Math.ceil(file.size / 1024)} KB)
              </span>
            </div>
            <Button
              className="rounded-full px-5"
              onClick={() => create(file, description)}
            >
              Отправить в ADSA
            </Button>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Файл не выбран.</div>
        )}
      </div>

      {activeUploads.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="text-sm font-medium">Текущие загрузки</div>

          {activeUploads.map((u) => (
            <div key={u.localId} className="rounded-2xl border p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="font-medium">{u.filename}</span>{" "}
                  <span className="text-muted-foreground">
                    ({Math.ceil(u.sizeBytes / 1024)} KB)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={u.state === "error" ? "destructive" : "secondary"}
                  >
                    {u.state}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => clearUpload(u.localId)}
                  >
                    Скрыть
                  </Button>
                </div>
              </div>

              <Progress value={u.progress} />

              {u.requestId ? (
                <div className="text-xs text-muted-foreground">
                  requestId: <span className="font-mono">{u.requestId}</span>
                </div>
              ) : null}

              {u.error ? (
                <div className="text-sm text-red-600">{u.error}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
