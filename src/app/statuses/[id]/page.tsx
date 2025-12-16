"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

import { useRequestsStore } from "@/stores/requestsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";

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
          <span className="text-muted-foreground">Описание:</span>{" "}
          {r?.description ?? "-"}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Создан:</span>{" "}
          {r?.createdAtISO
            ? dayjs(r.createdAtISO).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">Статус:</span>
          <RequestStatusBadge status={r?.status} />
        </div>
        {r?.message ? (
          <div className="text-sm text-muted-foreground">
            Сообщение: {String(r.message)}
          </div>
        ) : null}

        <div className="pt-2">
          <Button asChild variant="outline">
            <a
              href={`/api/requests/${encodeURIComponent(id)}/file`}
              target="_blank"
              rel="noreferrer"
            >
              Скачать исходный файл
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
