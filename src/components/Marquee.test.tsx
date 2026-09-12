import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marquee } from "./Marquee";

describe("Marquee", () => {
  // 継ぎ目なくループさせるには、同じ内容を 2 セット並べて -50% で折り返す
  it("duplicates the items so the loop has no seam", () => {
    const { container } = render(<Marquee items={["Next.js", "Prisma"]} />);
    const spans = [...container.querySelectorAll(".marquee-track > span")];

    expect(spans.map((span) => span.textContent)).toEqual([
      "Next.js",
      "Prisma",
      "Next.js",
      "Prisma",
    ]);
  });

  it("hides the duplicated half from screen readers", () => {
    const { container } = render(<Marquee items={["Next.js", "Prisma"]} />);
    const spans = [...container.querySelectorAll(".marquee-track > span")];

    expect(spans[0]).not.toHaveAttribute("aria-hidden");
    expect(spans[1]).not.toHaveAttribute("aria-hidden");
    expect(spans[2]).toHaveAttribute("aria-hidden", "true");
    expect(spans[3]).toHaveAttribute("aria-hidden", "true");
  });

  it("drifts in reverse when requested", () => {
    const { container } = render(<Marquee items={["作る"]} reverse />);

    expect(container.querySelector(".marquee-track")).toHaveClass("rev");
  });

  it("sets the loop duration as a custom property", () => {
    const { container } = render(<Marquee items={["作る"]} duration={46} />);

    expect(container.querySelector<HTMLElement>(".marquee-track")!.style.getPropertyValue("--m-d")).toBe(
      "46s",
    );
  });

  it("renders nothing without items", () => {
    const { container } = render(<Marquee items={[]} />);

    expect(container.querySelector(".marquee")).toBeNull();
  });
});
