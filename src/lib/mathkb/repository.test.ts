import { describe, expect, it, vi, beforeEach } from "vitest";
import { searchNotes, getNoteBySlug, listFields, listTags } from "./repository";

const mockQuery = vi.fn();

vi.mock("@/lib/mathkb/db", () => ({
  getMathKbPool: vi.fn(() => ({ query: mockQuery })),
}));

describe("repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchNotes", () => {
    it("returns mapped results with tags", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            slug: "test-note",
            title: "Test Note",
            field: "Algebra",
            summary: "A test summary",
            updated_at: "2024-01-01T00:00:00.000Z",
            tags: [{ name: "test-tag", slug: "test-tag" }],
            total_count: 1,
          },
        ],
      });

      const result = await searchNotes({
        query: "test",
        field: "",
        tag: "",
        limit: 10,
        page: 1,
      });

      expect(result.notes).toHaveLength(1);
      expect(result.totalFilteredNotes).toBe(1);
      expect(result.notes[0]).toMatchObject({
        slug: "test-note",
        title: "Test Note",
        field: "Algebra",
        summary: "A test summary",
        updatedAt: "2024-01-01T00:00:00.000Z",
        tags: [{ name: "test-tag", slug: "test-tag" }],
      });
    });

    it("returns empty array when no results", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await searchNotes({
        query: "nonexistent",
        field: "",
        tag: "",
        limit: 10,
        page: 1,
      });

      expect(result.notes).toHaveLength(0);
      expect(result.totalFilteredNotes).toBe(0);
    });
  });

  describe("getNoteBySlug", () => {
    it("returns note detail when found", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            slug: "test-note",
            title: "Test Note",
            field: "Algebra",
            summary: "Summary",
            body_markdown: "# Hello",
            body_plain: "Hello",
            is_public: true,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-02-01T00:00:00.000Z",
            tags: [],
          },
        ],
      });

      const result = await getNoteBySlug("test-note");

      expect(result).not.toBeNull();
      expect(result?.slug).toBe("test-note");
      expect(result?.bodyMarkdown).toBe("# Hello");
      expect(result?.isPublic).toBe(true);
    });

    it("returns null when not found", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await getNoteBySlug("missing");

      expect(result).toBeNull();
    });
  });

  describe("listFields", () => {
    it("returns fields with note counts", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { field: "Algebra", note_count: "5" },
          { field: "Geometry", note_count: "3" },
        ],
      });

      const result = await listFields();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: "Algebra", noteCount: 5 });
      expect(result[1]).toEqual({ name: "Geometry", noteCount: 3 });
    });
  });

  describe("listTags", () => {
    it("returns tags with note counts", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { name: "Group Theory", slug: "group-theory", note_count: "4" },
          { name: "Topology", slug: "topology", note_count: "2" },
        ],
      });

      const result = await listTags();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: "Group Theory", slug: "group-theory", noteCount: 4 });
    });
  });
});
