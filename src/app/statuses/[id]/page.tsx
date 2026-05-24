"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

import { useRequestsStore } from "@/stores/requestsStore";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";
import {
  getAnalysisResult,
  getFileUrl,
  getReportUrl,
} from "@/lib/api/requests";
import type { AnalysisFinding, AnalysisResult } from "@/lib/types";

const severityClassName: Record<AnalysisFinding["severity"], string> = {
  INFO: "border-blue-200 bg-blue-50 text-blue-700",
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
  HIGH: "border-red-200 bg-red-50 text-red-700",
  CRITICAL: "border-red-300 bg-red-100 text-red-800",
};

function FindingCard({ finding }: { finding: AnalysisFinding }) {
  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-mono text-xs text-muted-foreground">
            {finding.id}
          </div>
          <h3 className="text-base font-semibold leading-6">{finding.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
              severityClassName[finding.severity]
            }`}
          >
            {finding.severity}
          </span>
          <span className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground">
            {Math.round(finding.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Evidence
          </div>
          <p className="text-sm leading-6">{finding.evidence}</p>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Risk</div>
          <p className="text-sm leading-6">{finding.risk}</p>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Recommendation
          </div>
          <p className="text-sm leading-6">{finding.recommendation}</p>
        </div>
      </div>

      {finding.related_rule_ids.length ? (
        <div className="flex flex-wrap gap-2">
          {finding.related_rule_ids.map((ruleId) => (
            <span
              key={ruleId}
              className="rounded-md bg-muted px-2 py-1 font-mono text-xs"
            >
              {ruleId}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function RequestDetailsPage() {
  const params = useParams<{ id: string }>();

  const id = params.id;
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [isResultLoading, setIsResultLoading] = useState(false);

  const byId = useRequestsStore((s) => s.byId);
  const fetchOne = useRequestsStore((s) => s.fetchOne);
  const remove = useRequestsStore((s) => s.remove);

  const r = byId[id];

  useEffect(() => {
    fetchOne(id);
    const t = window.setInterval(() => fetchOne(id), 3000);
    return () => window.clearInterval(t);
  }, [id, fetchOne]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadResult() {
      await Promise.resolve();

      if (controller.signal.aborted) return;

      if (r?.status !== "COMPLETED") {
        setResult(null);
        setResultError(null);
        setIsResultLoading(false);
        return;
      }

      setIsResultLoading(true);
      setResultError(null);

      try {
        const data = await getAnalysisResult(id, controller.signal);
        if (!controller.signal.aborted) {
          setResult(data);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setResult(null);
          setResultError(
            e instanceof Error ? e.message : "Ошибка загрузки результата"
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsResultLoading(false);
      }
    }

    loadResult();

    return () => controller.abort();
  }, [id, r?.status, r?.updatedAt]);

  const reportStorageKey = result?.report_storage_key ?? r?.reportStorageKey;
  const isFailed = r?.status === "FAILED";
  const hasSourceFile = Boolean(r?.storageKey);
  const hasReport = r?.status === "COMPLETED" && Boolean(reportStorageKey);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Детали запроса
        </h1>
      </div>

      <div className="space-y-3">
        <div className="text-md">
          <span className="text-muted-foreground">ID:</span>{" "}
          <span className="font-mono">{id}</span>
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">Файл:</span>{" "}
          <span className="font-medium">{r?.filename ?? "-"}</span>
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">content_type:</span>{" "}
          {r?.contentType ?? "-"}
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">storage_key:</span>{" "}
          <span className="font-mono">{r?.storageKey ?? "-"}</span>
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">Описание:</span>{" "}
          {r?.description ?? "-"}
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">Создан:</span>{" "}
          {r?.createdAt
            ? dayjs(r.createdAt).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>

        <div className="text-md">
          <span className="text-muted-foreground">Обновлён:</span>{" "}
          {r?.updatedAt
            ? dayjs(r.updatedAt).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>

        <div className="text-md flex items-center gap-2">
          <span className="text-muted-foreground">Статус:</span>
          {r?.status ? <RequestStatusBadge status={r.status} /> : "-"}
        </div>

        <div className="flex gap-2">
          {hasSourceFile ? (
            <Button size="lg" className="text-lg" asChild>
              <a href={getFileUrl(id)} target="_blank" rel="noreferrer">
                Скачать исходный файл
              </a>
            </Button>
          ) : null}

          {hasReport ? (
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href={getReportUrl(id, reportStorageKey)} download>
                Скачать результат
              </a>
            </Button>
          ) : null}

          <Button
            size="lg"
            variant="destructive"
            onClick={async () => {
              if (!confirm(`Удалить запрос ${id}?`)) return;
              try {
                await remove(id);
                // после удаления логично вернуть пользователя в список
                window.location.href = "/statuses";
              } catch (e) {
                alert(e instanceof Error ? e.message : "Ошибка удаления");
              }
            }}
          >
            Удалить
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Результат анализа
        </h2>

        <div className="rounded-md border p-5">
          {!r ? (
            <div className="text-sm text-muted-foreground">
              Загружаю данные запроса…
            </div>
          ) : isFailed ? (
            <div className="space-y-3">
              <div className="text-sm text-red-600">
                Анализ завершился с ошибкой.
              </div>
              {r.errorMessage ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {r.errorMessage}
                </div>
              ) : null}
              <div className="text-sm text-muted-foreground">
                Результат отсутствует.
              </div>
            </div>
          ) : r.status !== "COMPLETED" ? (
            <div className="text-sm text-muted-foreground">
              Результат появится после завершения анализа.
            </div>
          ) : isResultLoading ? (
            <div className="text-sm text-muted-foreground">
              Загружаю результат…
            </div>
          ) : resultError ? (
            <div className="text-sm text-red-600">{resultError}</div>
          ) : result ? (
            <div className="space-y-5">
              {result.error_message ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {result.error_message}
                </div>
              ) : null}

              {result.result_summary ? (
                <div className="space-y-2 rounded-md bg-muted p-4">
                  <h3 className="font-semibold">Краткая сводка</h3>
                  <p className="text-sm leading-6">{result.result_summary}</p>
                </div>
              ) : null}

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">request_id:</span>{" "}
                  <span className="font-mono">{result.request_id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">report:</span>{" "}
                  <span className="font-mono">
                    {result.report_storage_key ?? "-"}
                  </span>
                </div>
              </div>

              {result.findings?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">Находки</h3>
                    <span className="text-sm text-muted-foreground">
                      {result.findings.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {result.findings.map((finding) => (
                      <FindingCard key={finding.id} finding={finding} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Находок нет.
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Результат пуст.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
