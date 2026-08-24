import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HvacPrecoolingCodePage, { metadata } from "./page";
import {
  buildCombinedSource,
  hvacCode,
  hvacCodeTotalLines,
} from "@/lib/hvac-code";

describe("hvac code bundle", () => {
  it("carries every file with non-empty source", () => {
    expect(hvacCode.files.length).toBeGreaterThan(0);
    for (const file of hvacCode.files) {
      expect(file.path).not.toBe("");
      expect(file.code.length).toBeGreaterThan(0);
      expect(file.lines).toBeGreaterThan(0);
      expect(file.description).not.toBe("");
    }
  });

  it("has no duplicate paths", () => {
    const paths = hvacCode.files.map((file) => file.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("totals the per-file line counts", () => {
    const expected = hvacCode.files.reduce((sum, file) => sum + file.lines, 0);
    expect(hvacCodeTotalLines).toBe(expected);
  });

  it("keeps every file's source inside the combined text", () => {
    const combined = buildCombinedSource(hvacCode);
    for (const file of hvacCode.files) {
      // 貼り付け先でファイルを復元できるよう、区切りにパスを入れている
      expect(combined).toContain(`===== ファイル: ${file.path} =====`);
      expect(combined).toContain(file.code.replace(/\n+$/, ""));
    }
  });
});

describe("HvacPrecoolingCodePage", () => {
  it("is excluded from search indexes", () => {
    // URL を知っている人だけが見る前提のページなので、
    // 検索避けが外れていないことをテストで固定する。
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("renders the heading and every file tab", () => {
    render(<HvacPrecoolingCodePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /オフィスビル空調の最適起動時刻/ }),
    ).toBeInTheDocument();

    const tablist = screen.getByRole("tablist", { name: "ファイル" });
    for (const file of hvacCode.files) {
      expect(within(tablist).getByRole("tab", { name: file.path })).toBeInTheDocument();
    }
  });

  it("shows the first file by default", () => {
    render(<HvacPrecoolingCodePage />);

    const first = hvacCode.files[0];
    const tab = screen.getByRole("tab", { name: first.path });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(first.description)).toBeInTheDocument();
  });

  it("offers a copy-everything action", () => {
    render(<HvacPrecoolingCodePage />);

    expect(
      screen.getByRole("button", { name: /全ファイルをコピー/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /このファイルをコピー/ }),
    ).toBeInTheDocument();
  });
});
