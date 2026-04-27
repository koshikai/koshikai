import { describe, expect, it } from "vitest";
import { parseMathKbFilters } from "./service";

describe("parseMathKbFilters", () => {
  it("returns defaults for empty params", () => {
    const result = parseMathKbFilters({});
    expect(result.query).toBe("");
    expect(result.field).toBe("");
    expect(result.tag).toBe("");
    expect(result.limit).toBe(24);
    expect(result.view).toBe("card");
  });

  it("parses basic query params", () => {
    const result = parseMathKbFilters({
      q: "theorem",
      field: "algebra",
      tag: "group-theory",
      limit: "10",
      view: "list",
    });
    expect(result.query).toBe("theorem");
    expect(result.field).toBe("algebra");
    expect(result.tag).toBe("group-theory");
    expect(result.limit).toBe(10);
    expect(result.view).toBe("list");
  });

  it("trims whitespace from string values", () => {
    const result = parseMathKbFilters({
      q: "  search term  ",
      field: "  geometry  ",
    });
    expect(result.query).toBe("search term");
    expect(result.field).toBe("geometry");
  });

  it("handles array values by picking the first element", () => {
    const result = parseMathKbFilters({
      q: ["first", "second"],
      limit: ["5", "10"],
    });
    expect(result.query).toBe("first");
    expect(result.limit).toBe(5);
  });

  it("clamps limit to minimum 1", () => {
    const result = parseMathKbFilters({ limit: "0" });
    expect(result.limit).toBe(1);
  });

  it("clamps limit to maximum 50", () => {
    const result = parseMathKbFilters({ limit: "100" });
    expect(result.limit).toBe(50);
  });

  it("falls back to default limit for non-numeric values", () => {
    const result = parseMathKbFilters({ limit: "abc" });
    expect(result.limit).toBe(24);
  });

  it("falls back to default limit for infinite values", () => {
    const result = parseMathKbFilters({ limit: "Infinity" });
    expect(result.limit).toBe(24);
  });

  it("defaults view to card for unexpected values", () => {
    const result = parseMathKbFilters({ view: "grid" });
    expect(result.view).toBe("card");
  });

  it("truncates float limit values", () => {
    const result = parseMathKbFilters({ limit: "12.7" });
    expect(result.limit).toBe(12);
  });
});
