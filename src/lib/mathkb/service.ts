import { hasMathKbDatabaseConfig } from "@/lib/mathkb/db";
import { getNoteBySlug, listFields, listTags, searchNotes } from "@/lib/mathkb/repository";
import type {
  MathKbHomeState,
  MathKbNoteState,
  MathKbSearchFilters,
} from "@/lib/mathkb/types";

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

export function parseMathKbFilters(
  rawSearchParams: Record<string, string | string[] | undefined>,
): MathKbSearchFilters {
  const view = pickFirst(rawSearchParams.view);
  return {
    query: pickFirst(rawSearchParams.q).trim(),
    field: pickFirst(rawSearchParams.field).trim(),
    tag: pickFirst(rawSearchParams.tag).trim(),
    limit: clampLimit(rawSearchParams.limit, 24),
    view: view === "list" ? "list" : "card",
  };
}

export async function getMathKbHomeState(
  rawSearchParams: Record<string, string | string[] | undefined>,
): Promise<MathKbHomeState> {
  const filters = parseMathKbFilters(rawSearchParams);

  try {
    const [notes, fields, tags] = await Promise.all([
      searchNotes(filters),
      listFields(),
      listTags(),
    ]);

    return {
      status: "ready",
      data: {
        filters,
        fields,
        notes,
        tags,
        totalNotes: fields.reduce((sum, field) => sum + field.noteCount, 0),
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
