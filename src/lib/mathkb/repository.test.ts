import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  searchNotes,
  getNoteBySlug,
  listFields,
  listTags,
  generateSlug,
  createNote,
  updateNote,
  semanticSearchNotes,
} from "./repository";

vi.mock("./embedding", () => ({
  getEmbedding: vi.fn(async () => new Array(384).fill(0.1)),
}));

const mockQuery = vi.fn();
const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

vi.mock("@/lib/mathkb/db", () => ({
  getMathKbPool: vi.fn(() => ({
    query: mockQuery,
    connect: vi.fn(() => mockClient),
  })),
}));

describe("repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
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

  describe("generateSlug", () => {
    it("converts mixed case and spaces to lower case and hyphens", () => {
      expect(generateSlug("Boolean Network Control")).toBe("boolean-network-control");
      expect(generateSlug("  Space Test  ")).toBe("space-test");
      expect(generateSlug("special!@#characters")).toBe("special-characters");
    });

    it("falls back to numeric representation for non-ASCII text", () => {
      const slug = generateSlug("日本語のテスト");
      expect(slug).toMatch(/^[a-z0-9]+$/);
      expect(slug.length).toBeGreaterThan(0);
    });
  });

  describe("createNote", () => {
    it("inserts note and tags in a transaction successfully", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "1" }] }) // INSERT INTO notes
        .mockResolvedValueOnce({ rows: [{ id: "10" }] }) // INSERT INTO tags
        .mockResolvedValueOnce({ rows: [] }) // INSERT INTO note_tags
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await createNote({
        title: "New Attractor Note",
        field: "Control Theory",
        bodyMarkdown: "# Content",
        tags: ["Boolean"],
      });

      expect(result).toEqual({ success: true, slug: "new-attractor-note" });
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO notes"), expect.any(Array));
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO tags"), expect.any(Array));
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it("rolls back transaction on error", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error("Database write failure")); // INSERT INTO notes

      await expect(
        createNote({
          title: "Failed Note",
          field: "Theory",
          bodyMarkdown: "# Bad",
        })
      ).rejects.toThrow("Database write failure");

      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateNote", () => {
    it("updates note properties and resets tags in a transaction", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "1" }] }) // SELECT id check
        .mockResolvedValueOnce({ rows: [{ title: "Old", summary: "Old", body_markdown: "Old" }] }) // SELECT title, summary, body_markdown (for embedding)
        .mockResolvedValueOnce({ rows: [] }) // UPDATE notes
        .mockResolvedValueOnce({ rows: [] }) // DELETE note_tags
        .mockResolvedValueOnce({ rows: [{ id: "20" }] }) // INSERT tags
        .mockResolvedValueOnce({ rows: [] }) // INSERT note_tags
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await updateNote("existing-note", {
        title: "Updated Title",
        tags: ["NewTag"],
      });

      expect(result).toEqual({ success: true });
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("SELECT id FROM notes"), ["existing-note"]);
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE notes"), expect.any(Array));
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM note_tags"), ["1"]);
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it("throws error if note to update is not found", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }); // SELECT id check (empty)

      await expect(
        updateNote("missing-note", { title: "New Title" })
      ).rejects.toThrow("Note with slug 'missing-note' not found.");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  describe("semanticSearchNotes", () => {
    it("returns similar notes ordered by embedding distance", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            slug: "attractor-note",
            title: "Attractor Note",
            field: "Control Theory",
            summary: "summary",
            updated_at: "2024-01-01T00:00:00.000Z",
            tags: [],
          },
        ],
      });

      const result = await semanticSearchNotes("attractor dynamics", 2);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Attractor Note");
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY notes.embedding <=> $1"),
        [expect.any(Array), 2]
      );
    });
  });
});
