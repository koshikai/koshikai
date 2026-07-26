"use client";

import { useMemo, useState } from "react";
import {
  BENCHMARK_METRICS,
  LLM_BENCHMARK_SCORES,
  type BenchmarkMetric,
  type BenchmarkScore,
} from "@/lib/benchmarks-data";

type ViewMode = "chart" | "table";
type SortDirection = "asc" | "desc";
/** テーブルのソート対象: モデル属性 or 指標 ID */
type SortKey = "modelName" | "developer" | "releaseDate" | string;

function formatValue(
  score: BenchmarkScore | null | undefined,
  metric: BenchmarkMetric,
): string {
  if (!score) return "N/A";
  return metric.unit === "%"
    ? `${score.value.toFixed(1)}%`
    : `${score.value} ${metric.unit}`;
}

/** バー幅は指標ごとの最大値で正規化し、0-100 にクランプする */
function barWidthPercent(
  score: BenchmarkScore | null | undefined,
  metric: BenchmarkMetric,
): number {
  if (!score || Number.isNaN(score.value)) return 0;
  const ratio = (score.value / metric.scaleMax) * 100;
  return Math.min(100, Math.max(0, ratio));
}

function SourceLink({ score }: { score: BenchmarkScore }) {
  return (
    <a
      href={score.source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-accent"
    >
      {score.source.label}
    </a>
  );
}

/** 値の再現条件を1行で表す（テーブルの title 属性などに使う） */
function provenanceText(score: BenchmarkScore): string {
  return `${score.configuration} / 出典: ${score.source.label} / 確認: ${score.measuredAt}`;
}

export function BenchmarkView() {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [selectedMetricId, setSelectedMetricId] = useState<string>(
    BENCHMARK_METRICS[0].id,
  );
  const [sortKey, setSortKey] = useState<SortKey>("modelName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const selectedMetric =
    BENCHMARK_METRICS.find((m) => m.id === selectedMetricId) ||
    BENCHMARK_METRICS[0];

  // 公表値のあるモデルのみをスコア順に並べる
  const ranked = useMemo(
    () =>
      LLM_BENCHMARK_SCORES.filter((model) => model.scores[selectedMetric.id])
        .sort(
          (a, b) =>
            (b.scores[selectedMetric.id]?.value ?? 0) -
            (a.scores[selectedMetric.id]?.value ?? 0),
        ),
    [selectedMetric.id],
  );

  // 公表値が確認できないモデル（N/A）は順位表に混ぜず、別枠で明示する
  const missing = useMemo(
    () =>
      LLM_BENCHMARK_SCORES.filter((model) => !model.scores[selectedMetric.id]),
    [selectedMetric.id],
  );

  const tableRows = useMemo(() => {
    const rows = [...LLM_BENCHMARK_SCORES];
    const factor = sortDirection === "asc" ? 1 : -1;

    return rows.sort((a, b) => {
      if (sortKey === "modelName" || sortKey === "developer") {
        return a[sortKey].localeCompare(b[sortKey]) * factor;
      }
      if (sortKey === "releaseDate") {
        // 発表日未確認 (null) は常に末尾
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return a.releaseDate.localeCompare(b.releaseDate) * factor;
      }
      // 指標列: 公表値なし (N/A) は常に末尾へ寄せる
      const scoreA = a.scores[sortKey];
      const scoreB = b.scores[sortKey];
      if (!scoreA) return 1;
      if (!scoreB) return -1;
      return (scoreA.value - scoreB.value) * factor;
    });
  }, [sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(
      key === "modelName" || key === "developer" || key === "releaseDate"
        ? "asc"
        : "desc",
    );
  };

  const ariaSortFor = (key: SortKey): "ascending" | "descending" | "none" => {
    if (sortKey !== key) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDirection === "asc" ? "▲" : "▼") : "";

  return (
    <div className="space-y-8">
      {/* コントロールパネル: ビュー切替 & 指標選択 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-1 rounded-sm border border-border p-1 bg-subtle/30 shrink-0">
          <button
            type="button"
            aria-pressed={viewMode === "chart"}
            onClick={() => setViewMode("chart")}
            className={`px-3 py-1.5 font-mono text-xs font-medium rounded-sm transition-colors ${
              viewMode === "chart"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            グラフ表示 (Chart)
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "table"}
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 font-mono text-xs font-medium rounded-sm transition-colors ${
              viewMode === "table"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            データ表 (Table)
          </button>
        </div>

        {viewMode === "chart" && (
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-muted mr-1 text-[11px] uppercase tracking-wider hidden md:inline">
              指標選択:
            </span>
            {BENCHMARK_METRICS.map((metric) => (
              <button
                key={metric.id}
                type="button"
                aria-pressed={selectedMetricId === metric.id}
                onClick={() => setSelectedMetricId(metric.id)}
                className={`px-2.5 py-1 rounded-sm border transition-colors ${
                  selectedMetricId === metric.id
                    ? "border-accent text-accent font-semibold bg-accent/5"
                    : "border-border text-muted hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {metric.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* グラフ表示モード */}
      {viewMode === "chart" && (
        <div className="space-y-8">
          <div className="border border-border p-6 rounded-sm bg-background">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-4 mb-6">
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground flex flex-wrap items-center gap-2">
                  <span>{selectedMetric.name}</span>
                  <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted">
                    {selectedMetric.category}
                  </span>
                </h2>
                <p className="mt-1 text-xs leading-[1.8] text-muted">
                  {selectedMetric.description}
                </p>
                <p className="mt-1 font-mono text-[11px] leading-[1.7] text-muted">
                  出典方針: {selectedMetric.sourcePolicy}
                </p>
              </div>
              <span className="font-mono text-xs text-muted shrink-0">
                単位: {selectedMetric.unit}
              </span>
            </div>

            <div className="space-y-4">
              {ranked.map((model, index) => {
                const score = model.scores[selectedMetric.id]!;

                return (
                  <div key={model.modelId} className="group space-y-1.5">
                    <div className="flex items-start justify-between gap-3 font-mono text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 shrink-0 text-[11px] text-muted text-right font-mono">
                          #{index + 1}
                        </span>
                        <span className="font-sans font-medium text-foreground group-hover:text-accent transition-colors">
                          {model.modelName}
                        </span>
                        <span className="text-[10px] text-muted font-mono hidden sm:inline truncate">
                          ({model.developer})
                        </span>
                      </div>
                      <span className="font-semibold text-foreground font-mono shrink-0">
                        {formatValue(score, selectedMetric)}
                      </span>
                    </div>

                    <div className="h-3.5 w-full bg-subtle/40 rounded-sm overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-foreground/80 group-hover:bg-accent transition-all duration-300 ease-out"
                        style={{
                          width: `${barWidthPercent(score, selectedMetric)}%`,
                        }}
                      />
                    </div>

                    <p className="pl-7 font-mono text-[10px] leading-relaxed text-muted">
                      条件: {score.configuration} / 出典:{" "}
                      <SourceLink score={score} /> / 確認: {score.measuredAt}
                    </p>
                  </div>
                );
              })}
            </div>

            {missing.length > 0 && (
              <p className="mt-6 border-t border-border pt-4 font-mono text-[11px] leading-[1.8] text-muted">
                この指標の公表値が確認できないモデル（N/A）:{" "}
                {missing.map((m) => m.modelName).join(" / ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* データテーブル表示モード */}
      {viewMode === "table" && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <caption className="sr-only">
              モデル別ベンチマークスコア一覧（列見出しのボタンで並べ替え可能。N/A
              は公表値が確認できないことを示す）
            </caption>
            <thead className="border-b border-border bg-subtle/50 text-foreground">
              <tr>
                {(
                  [
                    ["modelName", "モデル名"],
                    ["developer", "開発元"],
                    ["releaseDate", "発表日"],
                  ] as const
                ).map(([key, label]) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={ariaSortFor(key)}
                    className="px-4 py-3 font-medium"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(key)}
                      className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      {label}
                      <span aria-hidden="true" className="text-[9px]">
                        {sortIndicator(key)}
                      </span>
                    </button>
                  </th>
                ))}
                {BENCHMARK_METRICS.map((metric) => (
                  <th
                    key={metric.id}
                    scope="col"
                    aria-sort={ariaSortFor(metric.id)}
                    className="px-4 py-3 font-medium text-right"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(metric.id)}
                      title={metric.sourcePolicy}
                      className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      {metric.name}
                      <span aria-hidden="true" className="text-[9px]">
                        {sortIndicator(metric.id)}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableRows.map((model) => (
                <tr
                  key={model.modelId}
                  className="hover:bg-subtle/30 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-4 py-3.5 text-left font-sans font-medium text-foreground"
                  >
                    {model.modelName}
                  </th>
                  <td className="px-4 py-3.5 text-muted">{model.developer}</td>
                  <td className="px-4 py-3.5 text-muted">
                    {model.releaseDate ?? "未確認"}
                  </td>
                  {BENCHMARK_METRICS.map((metric) => {
                    const score = model.scores[metric.id];
                    return (
                      <td
                        key={metric.id}
                        title={score ? provenanceText(score) : undefined}
                        className={`px-4 py-3.5 text-right font-medium ${
                          score ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {formatValue(score, metric)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 指標の定義と出典 */}
      <section className="mt-16 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          評価指標の定義と出典
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BENCHMARK_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="border border-border p-4 rounded-sm bg-background"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-foreground">
                  {metric.name}
                </span>
                <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted shrink-0">
                  {metric.category}
                </span>
              </div>
              <p className="mt-3 text-xs leading-[1.8] text-muted">
                {metric.description}
              </p>
              <p className="mt-2 font-mono text-[10px] leading-[1.7] text-muted">
                出典方針: {metric.sourcePolicy}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
