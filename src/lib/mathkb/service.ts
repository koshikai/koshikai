import { z } from "zod";
import { hasMathKbDatabaseConfig } from "@/lib/mathkb/db";
import { getNoteBySlug, listFields, listTags, searchNotes } from "@/lib/mathkb/repository";
import type {
  MathKbHomeState,
  MathKbNoteState,
  MathKbSearchFilters,
} from "@/lib/mathkb/types";

function clampPage(value: string | string[] | undefined, fallback: number) {
  const first = pickFirst(value);
  if (!first) {
    return fallback;
  }

  const parsed = Number(first);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.trunc(parsed);
}

function pickFirst(
  value: string | string[] | undefined,
  fallback = "",
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function clampLimit(value: string | string[] | undefined, fallback: number) {
  const first = pickFirst(value);
  if (!first) {
    return fallback;
  }

  const parsed = Number(first);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(50, Math.max(1, Math.trunc(parsed)));
}

function toSetupMessage(error: unknown) {
  if (!hasMathKbDatabaseConfig()) {
    return "MATHKB_DATABASE_URL が未設定です。内部KB用の PostgreSQL 接続文字列を設定してから起動してください。";
  }

  if (error instanceof Error) {
    return `数学KBを読み込めませんでした: ${error.message}`;
  }

  return "数学KBを読み込めませんでした。DB接続と schema 適用状況を確認してください。";
}

const rawParamSchema = z.union([z.string(), z.array(z.string())]).optional();

const rawSearchFiltersSchema = z.object({
  q: rawParamSchema,
  field: rawParamSchema,
  tag: rawParamSchema,
  limit: rawParamSchema,
  page: rawParamSchema,
  view: rawParamSchema,
});

export function parseMathKbFilters(
  rawSearchParams: Record<string, string | string[] | undefined>,
): MathKbSearchFilters {
  const parsed = rawSearchFiltersSchema.parse(rawSearchParams);
  const view = pickFirst(parsed.view);

  return {
    query: pickFirst(parsed.q).trim(),
    field: pickFirst(parsed.field).trim(),
    tag: pickFirst(parsed.tag).trim(),
    limit: clampLimit(parsed.limit, 24),
    page: clampPage(parsed.page, 1),
    view: view === "list" ? "list" : "card",
  };
}

export async function getMathKbHomeState(
  rawSearchParams: Record<string, string | string[] | undefined>,
): Promise<MathKbHomeState> {
  const filters = parseMathKbFilters(rawSearchParams);

  try {
    const [searchResult, fields, tags] = await Promise.all([
      searchNotes(filters),
      listFields(),
      listTags(),
    ]);

    return {
      status: "ready",
      data: {
        filters,
        fields,
        notes: searchResult.notes,
        tags,
        totalNotes: fields.reduce((sum, field) => sum + field.noteCount, 0),
        totalFilteredNotes: searchResult.totalFilteredNotes,
      },
    };
  } catch (error) {
    return {
      status: "setup",
      message: toSetupMessage(error),
    };
  }
}

export async function getMathKbNoteState(slug: string): Promise<MathKbNoteState> {
  try {
    const note = await getNoteBySlug(slug);

    if (!note) {
      return { status: "missing" };
    }

    return {
      status: "ready",
      note,
    };
  } catch (error) {
    return {
      status: "setup",
      message: toSetupMessage(error),
    };
  }
}
