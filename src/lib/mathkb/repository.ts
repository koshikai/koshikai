import { getMathKbPool } from "@/lib/mathkb/db";
import type {
  MathKbField,
  MathKbNoteDetail,
  MathKbNoteListItem,
  MathKbSearchFilters,
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
): Promise<MathKbNoteListItem[]> {
  const pool = getMathKbPool();
  const query = filters.query.trim() || null;
  const field = filters.field || null;
  const tag = filters.tag || null;

  const result = await pool.query<SearchRow>(
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
            -- TODO: Consider replacing ILIKE with pg_trgm % operator for
            -- index-backed similarity search once ranking behavior is verified.
            OR notes.title ILIKE '%' || $1 || '%'
            OR COALESCE(notes.summary, '') ILIKE '%' || $1 || '%'
            OR notes.body_plain ILIKE '%' || $1 || '%'
          )
      )
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
      LIMIT $4
    `,
    [query, field, tag, filters.limit],
  );

  return result.rows.map(mapSearchRow);
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
