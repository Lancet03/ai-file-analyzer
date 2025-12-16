"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
    <Card>
      <CardHeader>
        <CardTitle>Новый запрос на анализ</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div
          {...getRootProps()}
          className={[
            "border border-dashed rounded-lg p-8 text-center cursor-pointer select-none",
            isDragActive ? "bg-muted" : "bg-background",
          ].join(" ")}
        >
          <input {...getInputProps()} />
          <div className="text-sm text-muted-foreground">
            {isDragActive
              ? "Отпустите файл здесь…"
              : "Перетащите файл сюда или кликните для выбора"}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Описание (опционально)</Label>
          <Textarea
            id="desc"
            placeholder="Например: логи за сутки, инцидент #123, и т.д."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {file ? (
            <>
              <div className="text-sm">
                Выбран: <span className="font-medium">{file.name}</span> (
                {Math.ceil(file.size / 1024)} KB)
              </div>

              <Button onClick={() => create(file, description)}>
                Отправить
              </Button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Файл не выбран.</div>
          )}
        </div>

        {activeUploads.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium">Загрузки</div>

            {activeUploads.map((u) => (
              <div key={u.localId} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{u.filename}</span>{" "}
                    <span className="text-muted-foreground">
                      ({Math.ceil(u.sizeBytes / 1024)} KB)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        u.state === "error" ? "destructive" : "secondary"
                      }
                    >
                      {u.state}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearUpload(u.localId)}
                    >
                      Скрыть
                    </Button>
                  </div>
                </div>

                <Progress value={u.progress} />

                {u.requestId ? (
                  <div className="text-xs text-muted-foreground">
                    requestId: {u.requestId}
                  </div>
                ) : null}

                {u.error ? (
                  <div className="text-sm text-red-600">{u.error}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
