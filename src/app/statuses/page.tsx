"use client";

import Link from "next/link";
import dayjs from "dayjs";

import { useRequestsPolling } from "@/hooks/useRequestsPolling";
import { useRequestsStore } from "@/stores/requestsStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { getFileUrl } from "@/lib/api/requests";
import type { RequestStatus } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function statusProgress(s: RequestStatus): number {
  // бэк не даёт % анализа — показываем условно по статусу
  if (s === "PENDING") return 10;
  if (s === "SCHEDULED") return 35;
  if (s === "COMPLETED") return 100;
  if (s === "FAILED") return 100;
  return 0;
}

export default function StatusesPage() {
  useRequestsPolling(3000);

  const requests = useRequestsStore((s) => s.requests);
  const isSyncing = useRequestsStore((s) => s.isSyncing);
  const syncError = useRequestsStore((s) => s.syncError);
  const lastSyncAtISO = useRequestsStore((s) => s.lastSyncAtISO);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Статусы запросов
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSyncing ? "Синхронизация…" : "Ок"}
          {lastSyncAtISO
            ? ` · ${dayjs(lastSyncAtISO).format("YYYY-MM-DD HH:mm:ss")}`
            : ""}
        </p>
        {syncError ? (
          <div className="text-sm text-red-600">{syncError}</div>
        ) : null}
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Файл</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Обновлён</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Прогресс</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.filename}</TableCell>

                <TableCell>
                  {dayjs(r.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {dayjs(r.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="w-[180px]">
                  <Progress value={statusProgress(r.status)} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/statuses/${encodeURIComponent(r.id)}`}>
                      Детали
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={getFileUrl(r.id)} target="_blank" rel="noreferrer">
                      Файл
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  Запросов пока нет.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
