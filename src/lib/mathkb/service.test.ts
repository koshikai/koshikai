import { describe, expect, it } from "vitest";
import { parseMathKbFilters } from "./service";

describe("parseMathKbFilters", () => {
  it("returns defaults when given an empty object", () => {
    const result = parseMathKbFilters({});

    expect(result.query).toBe("");
    expect(result.field).toBe("");
    expect(result.tag).toBe("");
    expect(result.limit).toBe(24);
    expect(result.view).toBe("card");
  });

  it("trims whitespace from query, field and tag", () => {
    const result = parseMathKbFilters({
      q: "  Riemann hypothesis  ",
      field: "  Number Theory  ",
      tag: "  prime  ",
    });

    expect(result.query).toBe("Riemann hypothesis");
    expect(result.field).toBe("Number Theory");
    expect(result.tag).toBe("prime");
  });

  it("takes the first element when a value is an array", () => {
    const result = parseMathKbFilters({
      q: ["first", "second"],
      limit: ["10", "99"],
    });

    expect(result.query).toBe("first");
    expect(result.limit).toBe(10);
  });

  it("clamps limit to the range [1, 50]", () => {
    expect(parseMathKbFilters({ limit: "0" }).limit).toBe(1);
    expect(parseMathKbFilters({ limit: "-5" }).limit).toBe(1);
    expect(parseMathKbFilters({ limit: "1" }).limit).toBe(1);
    expect(parseMathKbFilters({ limit: "50" }).limit).toBe(50);
    expect(parseMathKbFilters({ limit: "100" }).limit).toBe(50);
    expect(parseMathKbFilters({ limit: "not-a-number" }).limit).toBe(24);
  });

  it("normalizes view to 'list' only when explicitly set", () => {
    expect(parseMathKbFilters({ view: "list" }).view).toBe("list");
    expect(parseMathKbFilters({ view: "card" }).view).toBe("card");
    expect(parseMathKbFilters({ view: "unknown" }).view).toBe("card");
    expect(parseMathKbFilters({}).view).toBe("card");
  });
});
