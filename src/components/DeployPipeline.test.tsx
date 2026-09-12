import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pipelineSteps } from "@/lib/engineering";
import { DeployPipeline } from "./DeployPipeline";

/** 進入・非進入をテストから発火できるよう IntersectionObserver を差し替える */
let observers: FakeObserver[] = [];

class FakeObserver {
  callback: IntersectionObserverCallback;
  elements: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(element: Element) {
    this.elements.push(element);
  }

  unobserve() {}

  disconnect() {}

  emit(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: this.elements[0] } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("DeployPipeline", () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => vi.unstubAllGlobals());

  it("shows the whole deploy path as an ordered list", () => {
    render(<DeployPipeline />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(pipelineSteps.length);
    expect(screen.getByText("git push")).toBeInTheDocument();
    expect(screen.getByText("/healthz")).toBeInTheDocument();
  });

  // 到達点だけは最初から塗っておき、そこへ向かうことを示す
  it("marks only the final step as the goal", () => {
    const { container } = render(<DeployPipeline />);

    const dots = [...container.querySelectorAll(".pipeline-dot")];
    expect(dots).toHaveLength(pipelineSteps.length);
    expect(container.querySelectorAll(".pipeline-dot-goal")).toHaveLength(1);
    expect(dots[dots.length - 1]).toHaveClass("pipeline-dot-goal");
    // 到達点の先にラインは引かない
    expect(container.querySelectorAll(".pipeline-line")).toHaveLength(pipelineSteps.length - 1);
  });

  it("staggers the steps from top to bottom", () => {
    const { container } = render(<DeployPipeline />);

    const steps = [...container.querySelectorAll<HTMLElement>(".pipeline-step")];
    const delays = steps.map((step) => step.style.getPropertyValue("--pi"));
    expect(delays[0]).toBe("150ms");
    expect(delays[1]).toBe("320ms");
    // 遅延は単調増加（上から順に点く）
    const numbers = delays.map((value) => Number.parseInt(value, 10));
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
  });

  // .rev が付いて初めて点灯前の状態（丸が未点灯・ラインが畳まれた状態）になる
  it("arms itself after mount", async () => {
    const { container } = render(<DeployPipeline />);
    const figure = container.querySelector(".pipeline")!;

    expect(figure).not.toHaveClass("rev");
    await waitFor(() => expect(figure).toHaveClass("rev"));
  });

  it("lights up once the figure scrolls into view", async () => {
    const { container } = render(<DeployPipeline />);
    const figure = container.querySelector(".pipeline")!;
    await waitFor(() => expect(figure).toHaveClass("rev"));

    act(() => observers[0].emit(true));

    await waitFor(() => expect(figure).toHaveClass("in"));
  });

  it("stays dark until it enters the viewport", async () => {
    const { container } = render(<DeployPipeline />);
    const figure = container.querySelector(".pipeline")!;
    await waitFor(() => expect(figure).toHaveClass("rev"));

    act(() => observers[0].emit(false));

    expect(figure).not.toHaveClass("in");
  });
});
