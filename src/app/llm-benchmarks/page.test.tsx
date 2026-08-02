import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LlmBenchmarksPage from "./page";
import {
  BENCHMARK_DATASET_VERIFIED_AT,
  BENCHMARK_METRICS,
  LLM_BENCHMARK_SCORES,
} from "@/lib/benchmarks-data";

const allScores = LLM_BENCHMARK_SCORES.flatMap((model) =>
  BENCHMARK_METRICS.map((metric) => model.scores[metric.id]).filter(
    (score) => score !== null && score !== undefined,
  ),
);

const allPricing = LLM_BENCHMARK_SCORES.map((model) => model.pricing).filter(
  (pricing): pricing is NonNullable<typeof pricing> => pricing !== null,
);

describe("LLM Benchmarks Data", () => {
  it("defines metrics and models", () => {
    expect(BENCHMARK_METRICS.length).toBeGreaterThan(0);
    expect(LLM_BENCHMARK_SCORES.length).toBeGreaterThan(0);
  });

  it("declares every metric key on every model (null = 未公表)", () => {
    for (const model of LLM_BENCHMARK_SCORES) {
      for (const metric of BENCHMARK_METRICS) {
        expect(model.scores).toHaveProperty(metric.id);
      }
    }
  });

  // 掲載値は必ず出典・条件・確認日を伴う、という中核の不変条件
  it("attaches a source, configuration and measurement date to every published score", () => {
    expect(allScores.length).toBeGreaterThan(0);
    for (const score of allScores) {
      expect(score!.source.label.trim().length).toBeGreaterThan(0);
      expect(score!.source.url).toMatch(/^https:\/\//);
      expect(score!.configuration.trim().length).toBeGreaterThan(0);
      expect(score!.measuredAt).toMatch(/^\d{4}-\d{2}$/);
      expect(score!.verification).toBe("verified");
    }
  });

  it("keeps every value within its metric scale", () => {
    for (const model of LLM_BENCHMARK_SCORES) {
      for (const metric of BENCHMARK_METRICS) {
        const score = model.scores[metric.id];
        if (!score) continue;
        expect(score.value).toBeGreaterThanOrEqual(0);
        expect(score.value).toBeLessThanOrEqual(metric.scaleMax);
      }
    }
  });

  it("requires a source whenever a release date is claimed", () => {
    for (const model of LLM_BENCHMARK_SCORES) {
      if (model.releaseDate === null) {
        expect(model.releaseDateSource).toBeNull();
      } else {
        expect(model.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(model.releaseDateSource).not.toBeNull();
      }
    }
  });

  // 価格（Cost per Task）もスコアと同じ不変条件を満たす
  it("attaches a source, configuration and measurement date to every pricing entry", () => {
    expect(allPricing.length).toBeGreaterThan(0);
    expect(allPricing.length).toBe(LLM_BENCHMARK_SCORES.length);
    for (const pricing of allPricing) {
      expect(pricing!.source.label.trim().length).toBeGreaterThan(0);
      expect(pricing!.source.url).toMatch(/^https:\/\//);
      expect(pricing!.configuration.trim().length).toBeGreaterThan(0);
      expect(pricing!.measuredAt).toMatch(/^\d{4}-\d{2}$/);
      expect(pricing!.verification).toBe("verified");
      expect(pricing!.value).toBeGreaterThan(0);
    }
  });

  it("fixes a single source policy per metric", () => {
    for (const metric of BENCHMARK_METRICS) {
      expect(metric.sourcePolicy.trim().length).toBeGreaterThan(0);
    }
  });

  // HLE と GDPval-AA v2 は AA の同一ハーネス計測に列を固定する（index と同じ方針）
  it("keeps AA-measured metrics on a single Artificial Analysis source", () => {
    for (const metricId of ["hle", "gdpval_aa_v2"] as const) {
      const scores = LLM_BENCHMARK_SCORES.flatMap((model) =>
        model.scores[metricId] !== null ? [model.scores[metricId]!] : [],
      );
      expect(scores.length).toBeGreaterThan(0);
      for (const score of scores) {
        expect(score.source.url).toMatch(
          /^https:\/\/artificialanalysis\.ai\/evaluations\//,
        );
        expect(score.measuredAt).toBe(BENCHMARK_DATASET_VERIFIED_AT);
      }
    }
  });

  // モデルには 6 桁 hex のイメージカラーを 1 色ずつ割り当てる（散布図で点を識別するため）
  it("assigns a unique brand color to every model", () => {
    const colors = LLM_BENCHMARK_SCORES.map((model) => model.color);
    for (const color of colors) {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
    expect(new Set(colors).size).toBe(colors.length);
  });
});

describe("LlmBenchmarksPage Component & Interactive View", () => {
  it("renders the heading and switches between chart and table views", () => {
    render(<LlmBenchmarksPage />);

    expect(
      screen.getByRole("heading", { name: "最新 LLM ベンチマーク測定比較" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Claude Opus 5").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText("データ表 (Table)"));
    expect(screen.getByText("発表日")).toBeInTheDocument();
  });

  it("exposes the pressed state of view and metric toggles", () => {
    render(<LlmBenchmarksPage />);

    const chartButton = screen.getByRole("button", { name: "グラフ表示 (Chart)" });
    const tableButton = screen.getByRole("button", { name: "データ表 (Table)" });

    expect(chartButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(tableButton);
    expect(tableButton).toHaveAttribute("aria-pressed", "true");
    expect(chartButton).toHaveAttribute("aria-pressed", "false");
  });

  it("renders a scatter view of cost vs score", () => {
    render(<LlmBenchmarksPage />);
    fireEvent.click(screen.getByRole("button", { name: "散布図 (Scatter)" }));

    expect(
      screen.getByRole("heading", {
        name: /コスト vs AA Intelligence Index v4\.1/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/横軸: コスト\/タスク/)).toBeInTheDocument();
  });

  it("lists models not plotted in the scatter view when data is missing", () => {
    render(<LlmBenchmarksPage />);
    fireEvent.click(screen.getByRole("button", { name: "散布図 (Scatter)" }));
    fireEvent.click(screen.getByRole("button", { name: "SWE-bench Pro" }));

    expect(
      screen.getByText(/スコアかコストが確認できないためプロットしていないモデル/),
    ).toBeInTheDocument();
  });

  it("explains how to read the data instead of presenting bare numbers", () => {
    render(<LlmBenchmarksPage />);
    expect(
      screen.getByRole("heading", { name: "データの読み方" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/N\/A は「未公表」を意味します/)).toBeInTheDocument();
  });

  it("links the source of each charted score", () => {
    render(<LlmBenchmarksPage />);
    const links = screen.getAllByRole("link", {
      name: /Artificial Analysis — Models leaderboard/,
    });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lists models without a published score for the selected metric", () => {
    render(<LlmBenchmarksPage />);

    // SWE-bench Pro は未公表モデルが存在する
    fireEvent.click(screen.getByRole("button", { name: "SWE-bench Pro" }));
    expect(
      screen.getByText(/この指標の公表値が確認できないモデル/),
    ).toBeInTheDocument();
  });

  it("shows the cost per task in the chart view", () => {
    render(<LlmBenchmarksPage />);
    expect(screen.getAllByText(/コスト\/タスク:/).length).toBeGreaterThan(0);
    expect(screen.getByText(/\$0\.03 USD/)).toBeInTheDocument();
  });

  it("sorts the table by cost per task, cheapest first", () => {
    render(<LlmBenchmarksPage />);
    fireEvent.click(screen.getByText("データ表 (Table)"));
    fireEvent.click(
      screen.getByRole("button", { name: /コスト\/タスク \(USD\)/ }),
    );

    const rows = screen.getAllByRole("row").slice(1);
    const topRow = within(rows[0]).getAllByRole("rowheader")[0];

    const cheapest = [...LLM_BENCHMARK_SCORES].sort(
      (a, b) =>
        (a.pricing?.value ?? Infinity) - (b.pricing?.value ?? Infinity),
    )[0];

    expect(topRow).toHaveTextContent(cheapest.modelName);
  });

  it("sorts the table by a metric column, pushing N/A rows to the end", () => {
    render(<LlmBenchmarksPage />);
    fireEvent.click(screen.getByText("データ表 (Table)"));
    fireEvent.click(screen.getByRole("button", { name: /SWE-bench Pro/ }));

    const rows = screen.getAllByRole("row").slice(1);
    const topRow = within(rows[0]).getAllByRole("rowheader")[0];
    const lastRow = within(rows[rows.length - 1]);

    const best = LLM_BENCHMARK_SCORES.filter((m) => m.scores.swe_bench_pro).sort(
      (a, b) =>
        (b.scores.swe_bench_pro?.value ?? 0) -
        (a.scores.swe_bench_pro?.value ?? 0),
    )[0];

    expect(topRow).toHaveTextContent(best.modelName);
    expect(lastRow.getAllByText("N/A").length).toBeGreaterThan(0);
  });
});
