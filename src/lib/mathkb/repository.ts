import { getMathKbPool } from "@/lib/mathkb/db";
import type {
  MathKbField,
  MathKbNoteDetail,
  MathKbNoteListItem,
  MathKbSearchFilters,
  MathKbSearchResult,
  MathKbTag,
} from "@/lib/mathkb/types";

interface SearchRow {
  field: string;
  slug: string;
  summary: string;
  tags: MathKbTag[] | null;
  title: string;
  updated_at: Date | string;
}

interface DetailRow extends SearchRow {
  body_markdown: string;
  body_plain: string;
  created_at: Date | string;
  is_public: boolean;
}

interface FieldRow {
  field: string;
  note_count: string | number;
}

interface TagRow {
  name: string;
  note_count: string | number;
  slug: string;
}

function toIsoString(value: Date | string) {
  return new Date(value).toISOString();
}

function normalizeTags(tags: MathKbTag[] | null) {
  return tags ?? [];
}

/**
 * pgvector が受け付ける文字列リテラル形式 "[x, y, ...]" に変換する。
 * pg ライブラリは number[] を PostgreSQL 配列 "{x, y, ...}" として送るため、
 * 明示的に文字列化する必要がある。
 */
function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

function areEmbeddingsEnabled() {
  const value = process.env.MATHKB_ENABLE_EMBEDDINGS?.trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(value ?? "");
}

async function getOptionalEmbedding(text: string, type: "query" | "passage") {
  if (!areEmbeddingsEnabled()) {
    return null;
  }

  const { getEmbedding } = await import("./embedding");
  return getEmbedding(text, type);
}

function assertEmbeddingsEnabled(operation: string) {
  if (!areEmbeddingsEnabled()) {
    throw new Error(
      `${operation} requires embeddings, but MATHKB_ENABLE_EMBEDDINGS is disabled.`,
    );
  }
}

function mapSearchRow(row: SearchRow): MathKbNoteListItem {
  return {
    slug: row.slug,
    title: row.title,
    field: row.field,
    summary: row.summary,
    updatedAt: toIsoString(row.updated_at),
    tags: normalizeTags(row.tags),
  };
}

function mapDetailRow(row: DetailRow): MathKbNoteDetail {
  return {
    ...mapSearchRow(row),
    bodyMarkdown: row.body_markdown,
    bodyPlain: row.body_plain,
    createdAt: toIsoString(row.created_at),
    isPublic: row.is_public,
  };
}

export async function searchNotes(
  filters: MathKbSearchFilters,
): Promise<MathKbSearchResult> {
  const pool = getMathKbPool();
  const query = filters.query.trim() || null;
  const field = filters.field || null;
  const tag = filters.tag || null;
  const offset = (filters.page - 1) * filters.limit;

  const result = await pool.query<SearchRow & { total_count: number }>(
    `
      WITH filtered_notes AS (
        SELECT
          notes.id,
          notes.slug,
          notes.title,
          notes.field,
          notes.summary,
          notes.updated_at,
          CASE
            WHEN $1::text IS NULL THEN 0
            ELSE GREATEST(
              ts_rank_cd(notes.search_document, websearch_to_tsquery('simple', $1)),
              similarity(notes.title, $1),
              similarity(COALESCE(notes.summary, ''), $1),
              similarity(notes.body_plain, $1)
            )
          END AS rank
        FROM notes
        WHERE ($2::text IS NULL OR notes.field = $2)
          AND (
            $3::text IS NULL
            OR EXISTS (
              SELECT 1
              FROM note_tags
              INNER JOIN tags ON tags.id = note_tags.tag_id
              WHERE note_tags.note_id = notes.id
                AND tags.slug = $3
            )
          )
          AND (
            $1::text IS NULL
            OR notes.search_document @@ websearch_to_tsquery('simple', $1)
            OR notes.title ILIKE '%' || $1 || '%'
            OR COALESCE(notes.summary, '') ILIKE '%' || $1 || '%'
            OR notes.body_plain ILIKE '%' || $1 || '%'
          )
      ),
      paginated_notes AS (
        SELECT
          filtered_notes.slug,
          filtered_notes.title,
          filtered_notes.field,
          filtered_notes.summary,
          filtered_notes.updated_at,
          COALESCE(
            json_agg(
              json_build_object('name', tags.name, 'slug', tags.slug)
              ORDER BY tags.name
            ) FILTER (WHERE tags.id IS NOT NULL),
            '[]'::json
          ) AS tags
        FROM filtered_notes
        LEFT JOIN note_tags ON note_tags.note_id = filtered_notes.id
        LEFT JOIN tags ON tags.id = note_tags.tag_id
        GROUP BY
          filtered_notes.id,
          filtered_notes.slug,
          filtered_notes.title,
          filtered_notes.field,
          filtered_notes.summary,
          filtered_notes.updated_at,
          filtered_notes.rank
        ORDER BY filtered_notes.rank DESC, filtered_notes.updated_at DESC
        LIMIT $4 OFFSET $5
      )
      SELECT
        paginated_notes.*,
        (SELECT COUNT(*) FROM filtered_notes) AS total_count
      FROM paginated_notes
    `,
    [query, field, tag, filters.limit, offset],
  );

  const totalFilteredNotes = Number(result.rows[0]?.total_count ?? 0);
  const notes = result.rows.map(mapSearchRow);

  return { notes, totalFilteredNotes };
}

export async function getNoteBySlug(slug: string) {
  const pool = getMathKbPool();
  const result = await pool.query<DetailRow>(
    `
      SELECT
        notes.slug,
        notes.title,
        notes.field,
        notes.summary,
        notes.body_markdown,
        notes.body_plain,
        notes.is_public,
        notes.created_at,
        notes.updated_at,
        COALESCE(
          json_agg(
            json_build_object('name', tags.name, 'slug', tags.slug)
            ORDER BY tags.name
          ) FILTER (WHERE tags.id IS NOT NULL),
          '[]'::json
        ) AS tags
      FROM notes
      LEFT JOIN note_tags ON note_tags.note_id = notes.id
      LEFT JOIN tags ON tags.id = note_tags.tag_id
      WHERE notes.slug = $1
      GROUP BY notes.id
      LIMIT 1
    `,
    [slug],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return mapDetailRow(row);
}

export async function listFields(): Promise<MathKbField[]> {
  const pool = getMathKbPool();
  const result = await pool.query<FieldRow>(
    `
      SELECT field, COUNT(*) AS note_count
      FROM notes
      GROUP BY field
      ORDER BY LOWER(field)
    `,
  );

  return result.rows.map((row) => ({
    name: row.field,
    noteCount: Number(row.note_count),
  }));
}

export async function listTags(): Promise<MathKbTag[]> {
  const pool = getMathKbPool();
  const result = await pool.query<TagRow>(
    `
      SELECT
        tags.name,
        tags.slug,
        COUNT(note_tags.note_id) AS note_count
      FROM tags
      LEFT JOIN note_tags ON note_tags.tag_id = tags.id
      GROUP BY tags.id
      ORDER BY LOWER(tags.name)
    `,
  );

  return result.rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    noteCount: Number(row.note_count),
  }));
}

export function generateSlug(text: string, prefix = ""): string {
  const cleaned = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (cleaned.length > 0) {
    return prefix ? `${prefix}-${cleaned}` : cleaned;
  }

  // Non-ASCII fallback using a simple numeric hash representation
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hashStr = Math.abs(hash).toString(36);
  return prefix ? `${prefix}-${hashStr}` : hashStr;
}

export async function createNote(note: {
  title: string;
  field: string;
  summary?: string;
  bodyMarkdown: string;
  isPublic?: boolean;
  tags?: string[];
}) {
  const pool = getMathKbPool();
  const client = await pool.connect();
  const slug = generateSlug(note.title);

  try {
    await client.query("BEGIN");

    const isPublic = note.isPublic ?? false;
    const summary = note.summary ?? "";

    const vectorText = `${note.title}\n${summary}\n${note.bodyMarkdown}`;
    const embedding = await getOptionalEmbedding(vectorText, "passage");
    const noteResult = embedding
      ? await client.query<{ id: string }>(
          `
            INSERT INTO notes (slug, title, field, summary, body_markdown, is_public, embedding)
            VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
            RETURNING id
          `,
          [slug, note.title, note.field, summary, note.bodyMarkdown, isPublic, toVectorLiteral(embedding)],
        )
      : await client.query<{ id: string }>(
          `
            INSERT INTO notes (slug, title, field, summary, body_markdown, is_public)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `,
          [slug, note.title, note.field, summary, note.bodyMarkdown, isPublic],
        );

    const noteId = noteResult.rows[0].id;

    if (note.tags && note.tags.length > 0) {
      for (const tagName of note.tags) {
        const trimmedTagName = tagName.trim();
        if (!trimmedTagName) continue;

        const tagSlug = generateSlug(trimmedTagName);

        const tagResult = await client.query<{ id: string }>(
          `
            INSERT INTO tags (slug, name)
            VALUES ($1, $2)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
          `,
          [tagSlug, trimmedTagName],
        );

        const tagId = tagResult.rows[0].id;

        await client.query(
          `
            INSERT INTO note_tags (note_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `,
          [noteId, tagId],
        );
      }
    }

    await client.query("COMMIT");
    return { success: true, slug };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateNote(
  slug: string,
  note: {
    title?: string;
    field?: string;
    summary?: string;
    bodyMarkdown?: string;
    isPublic?: boolean;
    tags?: string[];
  },
) {
  const pool = getMathKbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkResult = await client.query<{ id: string }>(
      "SELECT id FROM notes WHERE slug = $1 LIMIT 1",
      [slug],
    );

    if (checkResult.rows.length === 0) {
      throw new Error(`Note with slug '${slug}' not found.`);
    }

    const noteId = checkResult.rows[0].id;

    const updates: string[] = [];
    const values: unknown[] = [];
    let counter = 1;

    // Check if we need to recompute embedding
    let shouldRecomputeEmbedding = false;
    let currentTitle = "";
    let currentSummary = "";
    let currentBodyMarkdown = "";

    if (note.title !== undefined || note.summary !== undefined || note.bodyMarkdown !== undefined) {
      shouldRecomputeEmbedding = true;
      const currentNote = await client.query<{ title: string; summary: string; body_markdown: string }>(
        "SELECT title, summary, body_markdown FROM notes WHERE id = $1",
        [noteId],
      );
      if (currentNote.rows.length > 0) {
        currentTitle = currentNote.rows[0].title;
        currentSummary = currentNote.rows[0].summary;
        currentBodyMarkdown = currentNote.rows[0].body_markdown;
      }
    }

    if (note.title !== undefined) {
      updates.push(`title = $${counter++}`);
      values.push(note.title);
      currentTitle = note.title;
    }
    if (note.field !== undefined) {
      updates.push(`field = $${counter++}`);
      values.push(note.field);
    }
    if (note.summary !== undefined) {
      updates.push(`summary = $${counter++}`);
      values.push(note.summary);
      currentSummary = note.summary;
    }
    if (note.bodyMarkdown !== undefined) {
      updates.push(`body_markdown = $${counter++}`);
      values.push(note.bodyMarkdown);
      currentBodyMarkdown = note.bodyMarkdown;
    }
    if (note.isPublic !== undefined) {
      updates.push(`is_public = $${counter++}`);
      values.push(note.isPublic);
    }

    if (shouldRecomputeEmbedding) {
      const vectorText = `${currentTitle}\n${currentSummary}\n${currentBodyMarkdown}`;
      const embedding = await getOptionalEmbedding(vectorText, "passage");

      if (embedding) {
        updates.push(`embedding = $${counter++}::vector`);
        values.push(toVectorLiteral(embedding));
      } else {
        updates.push("embedding = NULL");
      }
    }

    if (updates.length > 0) {
      values.push(slug);
      const updateQuery = `
        UPDATE notes
        SET ${updates.join(", ")}
        WHERE slug = $${counter}
      `;
      await client.query(updateQuery, values);
    }

    if (note.tags !== undefined) {
      await client.query("DELETE FROM note_tags WHERE note_id = $1", [noteId]);

      for (const tagName of note.tags) {
        const trimmedTagName = tagName.trim();
        if (!trimmedTagName) continue;

        const tagSlug = generateSlug(trimmedTagName);

        const tagResult = await client.query<{ id: string }>(
          `
            INSERT INTO tags (slug, name)
            VALUES ($1, $2)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
          `,
          [tagSlug, trimmedTagName],
        );

        const tagId = tagResult.rows[0].id;

        await client.query(
          `
            INSERT INTO note_tags (note_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `,
          [noteId, tagId],
        );
      }
    }

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function semanticSearchNotes(query: string, limit = 5): Promise<MathKbNoteListItem[]> {
  assertEmbeddingsEnabled("semanticSearchNotes");
  const pool = getMathKbPool();
  const embedding = await getOptionalEmbedding(query, "query");

  if (!embedding) {
    throw new Error("semanticSearchNotes requires embeddings.");
  }

  const result = await pool.query<SearchRow>(
    `
      SELECT
        notes.slug,
        notes.title,
        notes.field,
        notes.summary,
        notes.updated_at,
        COALESCE(
          json_agg(
            json_build_object('name', tags.name, 'slug', tags.slug)
            ORDER BY tags.name
          ) FILTER (WHERE tags.id IS NOT NULL),
          '[]'::json
        ) AS tags
      FROM notes
      LEFT JOIN note_tags ON note_tags.note_id = notes.id
      LEFT JOIN tags ON tags.id = note_tags.tag_id
      WHERE notes.embedding IS NOT NULL
      GROUP BY notes.id
      ORDER BY notes.embedding <=> $1::vector ASC
      LIMIT $2
    `,
    [toVectorLiteral(embedding), limit],
  );

  return result.rows.map(mapSearchRow);
}

export async function deleteNote(slug: string) {
  const pool = getMathKbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkResult = await client.query<{ id: string }>(
      "SELECT id FROM notes WHERE slug = $1 LIMIT 1",
      [slug],
    );

    if (checkResult.rows.length === 0) {
      throw new Error(`Note with slug '${slug}' not found.`);
    }

    const noteId = checkResult.rows[0].id;

    await client.query("DELETE FROM note_tags WHERE note_id = $1", [noteId]);
    await client.query("DELETE FROM notes WHERE id = $1", [noteId]);

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
