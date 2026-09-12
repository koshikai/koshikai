import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplitHeading } from "./SplitHeading";

/** IntersectionObserver を差し替え、進入・非進入をテストから発火できるようにする */
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

describe("SplitHeading", () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => vi.unstubAllGlobals());

  // 読み上げは分割前のテキストで 1 回だけ。文字ごとの span は読ませない。
  it("exposes the whole text as the heading's accessible name", () => {
    render(<SplitHeading as="h2" text="作って、公開する" />);

    expect(screen.getByRole("heading", { name: "作って、公開する" })).toBeInTheDocument();
  });

  it("splits the text into one animated span per character", () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" />);

    expect(container.querySelectorAll(".sh")).toHaveLength(8);
    expect(container.querySelectorAll(".sh-skew")).toHaveLength(0);
  });

  it("adds the skew variant only when asked", () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" skew />);

    expect(container.querySelectorAll(".sh-skew")).toHaveLength(8);
  });

  // chunks を渡すと、そのまとまりが改行の境界になる。語の途中で折れない。
  it("groups characters into the given chunks", () => {
    const { container } = render(
      <SplitHeading as="h2" text="確かめる" chunks={["確か", "める"]} />,
    );

    const groups = [...container.querySelectorAll(".sh-chunk")];
    expect(groups.map((group) => group.textContent)).toEqual(["確か", "める"]);
    expect(container.querySelectorAll(".sh")).toHaveLength(4);
  });

  it("keeps the per-character stagger running across chunks", () => {
    const { container } = render(
      <SplitHeading as="h2" text="ab" chunks={["a", "b"]} delayStart={40} delayStep={26} />,
    );
    const chars = [...container.querySelectorAll<HTMLElement>(".sh")];

    expect(chars[1].style.getPropertyValue("--ci")).toBe("66ms");
  });

  it("staggers each character by delayStep", () => {
    const { container } = render(
      <SplitHeading as="h2" text="ab" delayStart={40} delayStep={26} />,
    );
    const chars = [...container.querySelectorAll<HTMLElement>(".sh")];

    expect(chars[0].style.getPropertyValue("--ci")).toBe("40ms");
    expect(chars[1].style.getPropertyValue("--ci")).toBe("66ms");
  });

  it("keeps the decorative copy out of the accessibility tree", () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" />);

    expect(container.querySelector('[aria-hidden="true"] .sh')).toBeInTheDocument();
    expect(container.querySelector(".sr-only")).toHaveTextContent("koshikai");
  });

  // .rev が付いて初めて文字が隠れる。JS が動かない環境では付かないので
  // 中身は表示されたままになる。
  it("arms the reveal after mount", async () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" />);
    const heading = container.querySelector(".split-heading")!;

    expect(heading).not.toHaveClass("rev");
    await waitFor(() => expect(heading).toHaveClass("rev"));
  });

  it("plays once the heading scrolls into view", async () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" />);
    const heading = container.querySelector(".split-heading")!;
    await waitFor(() => expect(heading).toHaveClass("rev"));

    act(() => observers[0].emit(true));

    await waitFor(() => expect(heading).toHaveClass("in"));
  });

  it("stays hidden until it enters the viewport", async () => {
    const { container } = render(<SplitHeading as="h2" text="koshikai" />);
    const heading = container.querySelector(".split-heading")!;
    await waitFor(() => expect(heading).toHaveClass("rev"));

    act(() => observers[0].emit(false));

    expect(heading).not.toHaveClass("in");
  });
});
