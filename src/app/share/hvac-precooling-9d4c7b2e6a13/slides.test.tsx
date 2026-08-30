import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HvacPrecoolingCodePage from "./page";
import {
  buildCombinedNotes,
  hvacSlideCount,
  hvacSlides,
  hvacSlidesPptxHref,
} from "@/lib/hvac-slides";

describe("hvac slide deck", () => {
  it("carries every slide with non-empty svg and title", () => {
    expect(hvacSlides.slides.length).toBeGreaterThan(0);
    for (const slide of hvacSlides.slides) {
      expect(slide.id).not.toBe("");
      expect(slide.title).not.toBe("");
      expect(slide.svg).toContain("<svg");
      expect(slide.width).toBeGreaterThan(0);
      expect(slide.height).toBeGreaterThan(0);
    }
  });

  it("numbers slides consecutively from one", () => {
    hvacSlides.slides.forEach((slide, index) => {
      expect(slide.index).toBe(index + 1);
    });
    expect(hvacSlideCount).toBe(hvacSlides.slides.length);
  });

  it("has no duplicate ids", () => {
    const ids = hvacSlides.slides.map((slide) => slide.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("embeds no executable content", () => {
    // インラインで埋め込むので、実行可能な要素が混ざっていないことを
    // 表示側でも固定する。エクスポート側でも同じ検査をしている。
    for (const slide of hvacSlides.slides) {
      expect(slide.svg).not.toMatch(/<\s*script/i);
      expect(slide.svg).not.toMatch(/<\s*foreignObject/i);
      expect(slide.svg).not.toMatch(/\son[a-z]+\s*=/i);
      expect(slide.svg).not.toMatch(/javascript:/i);
    }
  });

  it("references no external file", () => {
    // 自己完結していないと、公開先で画像が欠ける。
    for (const slide of hvacSlides.slides) {
      const hrefs = slide.svg.match(/href="([^"]*)"/g) ?? [];
      for (const href of hrefs) {
        expect(href.startsWith('href="data:')).toBe(true);
      }
    }
  });

  it("keeps every slide's notes inside the combined notes", () => {
    if (!hvacSlides.hasNotes) return;
    const combined = buildCombinedNotes(hvacSlides);
    for (const slide of hvacSlides.slides) {
      if (!slide.notes) continue;
      expect(combined).toContain(`## ${slide.index}. ${slide.title}`);
      expect(combined).toContain(slide.notes);
    }
  });

  it("points the pptx href at the public slides directory", () => {
    const href = hvacSlidesPptxHref(hvacSlides);
    if (hvacSlides.pptxFile) {
      expect(href).toBe(`/slides/${hvacSlides.pptxFile}`);
    } else {
      expect(href).toBeNull();
    }
  });
});

describe("SlideViewer on the share page", () => {
  it("renders the deck section with every slide in the list", () => {
    render(<HvacPrecoolingCodePage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /成果発表資料/ }),
    ).toBeInTheDocument();

    const list = screen.getByRole("navigation", { name: "スライド一覧" });
    for (const slide of hvacSlides.slides) {
      expect(within(list).getByRole("button", { name: new RegExp(slide.title.slice(0, 8)) }))
        .toBeInTheDocument();
    }
  });

  it("shows the first slide and disables the back button", () => {
    render(<HvacPrecoolingCodePage />);

    const first = hvacSlides.slides[0];
    expect(
      screen.getByRole("img", { name: `スライド ${first.index}: ${first.title}` }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /前へ/ })).toBeDisabled();
  });

  it("moves to the next slide", () => {
    render(<HvacPrecoolingCodePage />);

    fireEvent.click(screen.getByRole("button", { name: /次へ/ }));

    const second = hvacSlides.slides[1];
    expect(
      screen.getByRole("img", { name: `スライド ${second.index}: ${second.title}` }),
    ).toBeInTheDocument();
  });

  it("toggles the speaker notes for the current slide", () => {
    if (!hvacSlides.hasNotes) return;
    render(<HvacPrecoolingCodePage />);

    fireEvent.click(screen.getByRole("button", { name: /発表者ノートを見る/ }));

    const first = hvacSlides.slides[0];
    expect(
      screen.getByText(new RegExp(`発表者ノート — ${first.index}\\.`)),
    ).toBeInTheDocument();
  });

  it("offers the pptx download when the file is published", () => {
    render(<HvacPrecoolingCodePage />);

    const href = hvacSlidesPptxHref(hvacSlides);
    if (!href) return;
    const link = screen.getByRole("link", { name: /PPTX をダウンロード/ });
    expect(link).toHaveAttribute("href", href);
  });
});
