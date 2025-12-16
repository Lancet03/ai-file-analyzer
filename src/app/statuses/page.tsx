"use client";

import Link from "next/link";
import dayjs from "dayjs";

import { useRequestsPolling } from "@/hooks/useRequestsPolling";
import { useRequestsStore } from "@/stores/requestsStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StatusesPage() {
  useRequestsPolling(3000);

  const requests = useRequestsStore((s) => s.requests);
  const isSyncing = useRequestsStore((s) => s.isSyncing);
  const syncError = useRequestsStore((s) => s.syncError);
  const lastSyncAtISO = useRequestsStore((s) => s.lastSyncAtISO);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Статусы запросов</CardTitle>
        <div className="text-sm text-muted-foreground">
          {isSyncing ? "Синхронизация…" : "Ок"}
          {lastSyncAtISO
            ? ` · ${dayjs(lastSyncAtISO).format("YYYY-MM-DD HH:mm:ss")}`
            : ""}
        </div>
        {syncError ? (
          <div className="text-sm text-red-600">{syncError}</div>
        ) : null}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Файл</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Прогресс</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-medium">
                  {r.filename ?? "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {(r.description ?? "").toString() || "-"}
                </TableCell>
                <TableCell>
                  {r.createdAtISO
                    ? dayjs(r.createdAtISO).format("YYYY-MM-DD HH:mm:ss")
                    : "-"}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="w-[180px]">
                  <Progress
                    value={r.status === "done" ? 100 : r.analysisProgress ?? 0}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/statuses/${encodeURIComponent(r.id)}`}>
                      Детали
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`/api/requests/${encodeURIComponent(r.id)}/file`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Файл
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Запросов пока нет.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
