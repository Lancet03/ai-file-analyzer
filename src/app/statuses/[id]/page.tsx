"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

import { useRequestsStore } from "@/stores/requestsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/api/requests";

export default function RequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const byId = useRequestsStore((s) => s.byId);
  const fetchOne = useRequestsStore((s) => s.fetchOne);

  const r = byId[id];

  useEffect(() => {
    fetchOne(id);
    const t = window.setInterval(() => fetchOne(id), 3000);
    return () => window.clearInterval(t);
  }, [id, fetchOne]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Детали запроса</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="text-muted-foreground">ID:</span>{" "}
          <span className="font-mono">{id}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Файл:</span>{" "}
          <span className="font-medium">{r?.filename ?? "-"}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">content_type:</span>{" "}
          {r?.contentType ?? "-"}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">storage_key:</span>{" "}
          <span className="font-mono">{r?.storageKey ?? "-"}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Описание:</span>{" "}
          {r?.description ?? "-"}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Создан:</span>{" "}
          {r?.createdAt
            ? dayjs(r.createdAt).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Обновлён:</span>{" "}
          {r?.updatedAt
            ? dayjs(r.updatedAt).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>

        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">Статус:</span>
          {r?.status ? <RequestStatusBadge status={r.status} /> : "-"}
        </div>

        <div className="pt-2">
          <Button asChild variant="outline">
            <a href={getFileUrl(id)} target="_blank" rel="noreferrer">
              Скачать исходный файл
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
