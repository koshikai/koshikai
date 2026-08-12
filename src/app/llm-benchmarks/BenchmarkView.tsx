"use client";

import { useMemo, useState } from "react";
import {
  BENCHMARK_METRICS,
  LLM_BENCHMARK_SCORES,
  type BenchmarkMetric,
  type BenchmarkScore,
  type ModelBenchmarkScore,
} from "@/lib/benchmarks-data";

type ViewMode = "chart" | "scatter" | "table";
type SortDirection = "asc" | "desc";
/** テーブルのソート対象: モデル属性 or 指標 ID */
type SortKey = "modelName" | "developer" | "releaseDate" | "pricing" | string;

function formatValue(
  score: BenchmarkScore | null | undefined,
  metric: BenchmarkMetric,
): string {
  if (!score) return "N/A";
  return metric.unit === "%"
    ? `${score.value.toFixed(1)}%`
    : `${score.value} ${metric.unit}`;
}

/**
 * 描画レンジ。0 起点ではなく実測値の範囲を使う。
 *
 * 0-scaleMax で正規化すると差が潰れて読めなくなる（例: GPQA Diamond は
 * 全モデルが 91.0-94.1% に収まり、全長の 3% しか違わない）。代わりに実測の
 * min-max に余白を足した範囲へ引き伸ばす。ただし 0 起点をやめた以上、
 * 基準レンジを併記しないと差を過大に見せることになるので、UI 側で必ず
 * min / max を明示すること。
 */
interface MetricDomain {
  min: number;
  max: number;
}

/** 与えたモデル群の実測値からレンジを決める。値が無い場合は 0-scaleMax に退避 */
function metricDomain(
  models: ModelBenchmarkScore[],
  metric: BenchmarkMetric,
): MetricDomain {
  const values = models
    .map((model) => model.scores[metric.id]?.value)
    .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));

  if (values.length === 0) return { min: 0, max: metric.scaleMax };

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const spread = dataMax - dataMin;
  // 全モデルが同値だとレンジが潰れるため、値を中央に置ける幅を作る
  const pad = spread > 0 ? spread * 0.18 : Math.max(Math.abs(dataMax) * 0.05, 1);

  return { min: Math.max(0, dataMin - pad), max: dataMax + pad };
}

/** バー幅はレンジ内の相対位置。0-100 にクランプする */
function barWidthPercent(
  score: BenchmarkScore | null | undefined,
  domain: MetricDomain,
): number {
  if (!score || Number.isNaN(score.value)) return 0;
  const span = domain.max - domain.min;
  if (span <= 0) return 0;
  const ratio = ((score.value - domain.min) / span) * 100;
  return Math.min(100, Math.max(0, ratio));
}

/**
 * 軸端・目盛りの数値表示。% は小数1桁、それ以外（Elo 等）は整数に丸める。
 * 単位は軸ラベル側に出すので、ここでは付けない（軸の文字幅を詰めるため）。
 */
function formatScaleValue(value: number, metric: BenchmarkMetric): string {
  return metric.unit === "%" ? value.toFixed(1) : `${Math.round(value)}`;
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

/** モデルのイメージカラーのドット（凡例・行頭に使う） */
function ColorDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

/** 値の再現条件を1行で表す（テーブルの title 属性などに使う） */
function provenanceText(score: BenchmarkScore): string {
  return `${score.configuration} / 出典: ${score.source.label} / 確認: ${score.measuredAt}`;
}

/** プロット領域の余白（%）。軸ラベルと重ならないためのマージン */
const PLOT = { left: 7, right: 4, top: 5, bottom: 16 };

/** 横軸コスト（対数）・縦軸スコアの散布図。スコアとコストが両方分かるモデルのみプロットする */
function ScatterChart({
  models,
  metric,
}: {
  models: ModelBenchmarkScore[];
  metric: BenchmarkMetric;
}) {
  const plotted = models.filter(
    (m) => m.scores[metric.id] && m.pricing,
  );

  const missing = models.filter(
    (m) => !(m.scores[metric.id] && m.pricing),
  );

  if (plotted.length === 0) {
    return (
      <p className="font-mono text-xs text-muted">
        スコアとコストが両方確認できるモデルがいません。
      </p>
    );
  }

  const costs = plotted.map((m) => m.pricing!.value);
  const logMin = Math.log10(Math.min(...costs));
  const logMax = Math.log10(Math.max(...costs));
  const pad = (logMax - logMin) * 0.08 || 0.2;
  const lMin = logMin - pad;
  const lMax = logMax + pad;

  const xPct = (cost: number) =>
    ((Math.log10(cost) - lMin) / (lMax - lMin)) *
      (100 - PLOT.left - PLOT.right) +
    PLOT.left;

  // 縦軸もプロット対象の実測レンジに合わせる（0 起点だと点が上端に固まる）
  const domain = metricDomain(plotted, metric);
  const ySpan = domain.max - domain.min || 1;

  const yPct = (score: number) =>
    PLOT.top +
    (1 - (score - domain.min) / ySpan) * (100 - PLOT.top - PLOT.bottom);

  // 対数軸の目盛り: 10 のべき乗と 3×10 のべき乗の系列から範囲内を拾う
  const xTicks: number[] = [];
  for (let e = -3; e <= 2; e++) {
    for (const m of [1, 3]) {
      const tick = m * 10 ** e;
      if (tick >= Math.pow(10, lMin) && tick <= Math.pow(10, lMax)) {
        xTicks.push(tick);
      }
    }
  }

  const formatTick = (v: number) =>
    v >= 1 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(
    (r) => domain.min + r * ySpan,
  );

  return (
    <div>
      <div className="relative h-[440px] w-full font-mono text-[10px] text-muted">
        {/* プロット枠 */}
        <div
          className="absolute border-l border-b border-border"
          style={{
            left: `${PLOT.left}%`,
            right: `${PLOT.right}%`,
            top: `${PLOT.top}%`,
            bottom: `${PLOT.bottom}%`,
          }}
          aria-hidden="true"
        />

        {/* 横軸（コスト）グリッド */}
        {xTicks.map((tick) => (
          <div
            key={tick}
            className="absolute border-l border-border/30"
            style={{
              left: `${xPct(tick)}%`,
              top: `${PLOT.top}%`,
              bottom: `${PLOT.bottom}%`,
            }}
            aria-hidden="true"
          >
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ top: "100%", marginTop: 4 }}
            >
              {formatTick(tick)}
            </span>
          </div>
        ))}

        {/* 縦軸（スコア）グリッド */}
        {yTicks.map((tick) => (
          <div
            key={tick}
            className="absolute border-t border-border/30"
            style={{
              left: `${PLOT.left}%`,
              right: `${PLOT.right}%`,
              top: `${yPct(tick)}%`,
            }}
            aria-hidden="true"
          >
            <span
              className="absolute -translate-y-1/2 text-right"
              style={{ right: "100%", marginRight: 8 }}
            >
              {formatScaleValue(tick, metric)}
            </span>
          </div>
        ))}

        {/* プロットポイント */}
        {plotted.map((model) => {
          const score = model.scores[metric.id]!;
          const x = xPct(model.pricing!.value);
          const y = yPct(score.value);

          return (
            <div
              key={model.modelId}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="h-3 w-3 rounded-full border border-background shadow-sm transition-transform group-hover:scale-125 hover:scale-125"
                style={{ backgroundColor: model.color }}
                title={`${model.modelName} — ${metric.name}: ${formatValue(
                  score,
                  metric,
                )}（${provenanceText(score)}） / コスト: $${model.pricing!.value.toFixed(
                  2,
                )}（${provenanceText(model.pricing!)}）`}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background/90 px-1 font-sans text-[10px] text-foreground/80">
                {model.modelName}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-right font-mono text-[10px] leading-relaxed text-muted">
        横軸: コスト/タスク (USD, 対数スケール) / 縦軸: {metric.name}（
        {formatScaleValue(domain.min, metric)}–
        {formatScaleValue(domain.max, metric)} {metric.unit}／0 起点ではありません）
      </p>

      {missing.length > 0 && (
        <p className="mt-4 border-t border-border pt-3 font-mono text-[11px] leading-[1.8] text-muted">
          スコアかコストが確認できないためプロットしていないモデル:{" "}
          {missing.map((m) => m.modelName).join(" / ")}
        </p>
      )}
    </div>
  );
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

  // バー長の基準レンジ。表示中のモデルの実測値から決める
  const chartDomain = useMemo(
    () => metricDomain(ranked, selectedMetric),
    [ranked, selectedMetric],
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
      if (sortKey === "pricing") {
        // コスト未計測 (null) は常に末尾
        const priceA = a.pricing;
        const priceB = b.pricing;
        if (!priceA) return 1;
        if (!priceB) return -1;
        return (priceA.value - priceB.value) * factor;
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
      key === "modelName" ||
        key === "developer" ||
        key === "releaseDate" ||
        key === "pricing"
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
            aria-pressed={viewMode === "scatter"}
            onClick={() => setViewMode("scatter")}
            className={`px-3 py-1.5 font-mono text-xs font-medium rounded-sm transition-colors ${
              viewMode === "scatter"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            散布図 (Scatter)
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

        {viewMode !== "table" && (
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
                        <ColorDot color={model.color} />
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
                        className="h-full transition-all duration-300 ease-out group-hover:brightness-110"
                        style={{
                          width: `${barWidthPercent(score, chartDomain)}%`,
                          backgroundColor: model.color,
                        }}
                      />
                    </div>

                    <p className="pl-7 font-mono text-[10px] leading-relaxed text-muted">
                      条件: {score.configuration} / 出典:{" "}
                      <SourceLink score={score} /> / 確認: {score.measuredAt}
                    </p>

                    {model.pricing && (
                      <p className="pl-7 font-mono text-[10px] leading-relaxed text-muted">
                        コスト/タスク: ${model.pricing.value.toFixed(2)} USD /{" "}
                        出典: <SourceLink score={model.pricing} /> / 確認:{" "}
                        {model.pricing.measuredAt}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 0 起点をやめた以上、基準レンジを併記しないと差を過大に見せてしまう */}
            {ranked.length > 0 && (
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-2 font-mono text-[10px] text-muted">
                <span>{formatScaleValue(chartDomain.min, selectedMetric)}</span>
                <span className="text-center leading-relaxed">
                  バー長は実測レンジ基準（0 起点ではありません）
                </span>
                <span>{formatScaleValue(chartDomain.max, selectedMetric)}</span>
              </div>
            )}

            {missing.length > 0 && (
              <p className="mt-6 border-t border-border pt-4 font-mono text-[11px] leading-[1.8] text-muted">
                この指標の公表値が確認できないモデル（N/A）:{" "}
                {missing.map((m) => m.modelName).join(" / ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 散布図表示モード: 横軸コスト / 縦軸スコア */}
      {viewMode === "scatter" && (
        <div className="border border-border p-6 rounded-sm bg-background">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground flex flex-wrap items-center gap-2">
                <span>コスト vs {selectedMetric.name}</span>
                <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted">
                  {selectedMetric.category}
                </span>
              </h2>
              <p className="mt-1 text-xs leading-[1.8] text-muted">
                横軸は Artificial Analysis の Cost per Task（USD・対数軸）です。左上（安くて
                スコアが高い）ほどコストパフォーマンスに優れます。
              </p>
            </div>
          </div>

          <ScatterChart models={LLM_BENCHMARK_SCORES} metric={selectedMetric} />
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
                    ["pricing", "コスト/タスク (USD)"],
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
                    <span className="inline-flex items-center gap-2">
                      <ColorDot color={model.color} />
                      {model.modelName}
                    </span>
                  </th>
                  <td className="px-4 py-3.5 text-muted">{model.developer}</td>
                  <td className="px-4 py-3.5 text-muted">
                    {model.releaseDate ?? "未確認"}
                  </td>
                  <td
                    title={
                      model.pricing
                        ? provenanceText(model.pricing)
                        : undefined
                    }
                    className={`px-4 py-3.5 text-right font-medium ${
                      model.pricing ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {model.pricing ? `$${model.pricing.value.toFixed(2)}` : "N/A"}
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
