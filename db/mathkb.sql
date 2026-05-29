CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION markdown_to_plain_text(markdown_input TEXT)
RETURNS TEXT AS $$
DECLARE
  value TEXT;
BEGIN
  value := COALESCE(markdown_input, '');
  value := regexp_replace(value, '```[\s\S]*?```', ' ', 'g');
  value := regexp_replace(value, '`([^`]*)`', '\1', 'g');
  value := regexp_replace(value, '!\[[^\]]*\]\([^)]+\)', ' ', 'g');
  value := regexp_replace(value, '\[([^\]]+)\]\([^)]+\)', '\1', 'g');
  value := regexp_replace(value, '(^|\n)\s{0,3}#{1,6}\s*', E'\\1', 'g');
  value := regexp_replace(value, '(^|\n)\s*>\s*', E'\\1', 'g');
  value := regexp_replace(value, '(^|\n)\s*([-*+]|\d+\.)\s+', E'\\1', 'g');
  value := regexp_replace(value, '[_*~#>-]+', ' ', 'g');
  value := regexp_replace(value, '\r', ' ', 'g');
  value := regexp_replace(value, '\n+', E'\n', 'g');
  value := regexp_replace(value, '\s+', ' ', 'g');
  RETURN btrim(value);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION set_row_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION prepare_note_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.body_markdown = COALESCE(NEW.body_markdown, '');
  NEW.summary = COALESCE(NEW.summary, '');
  NEW.body_plain = markdown_to_plain_text(NEW.body_markdown);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS notes (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title TEXT NOT NULL,
  field TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL,
  body_plain TEXT NOT NULL DEFAULT '',
  embedding vector(384),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  search_document TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(summary, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(body_plain, '')), 'C')
  ) STORED
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (note_id, tag_id)
);

CREATE INDEX IF NOT EXISTS notes_embedding_hnsw_idx
  ON notes USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS notes_search_document_idx
  ON notes USING GIN (search_document);

CREATE INDEX IF NOT EXISTS notes_title_trgm_idx
  ON notes USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS notes_summary_trgm_idx
  ON notes USING GIN (summary gin_trgm_ops);

CREATE INDEX IF NOT EXISTS notes_body_plain_trgm_idx
  ON notes USING GIN (body_plain gin_trgm_ops);

CREATE INDEX IF NOT EXISTS notes_field_idx
  ON notes (field);

CREATE INDEX IF NOT EXISTS note_tags_tag_id_idx
  ON note_tags (tag_id);

DROP TRIGGER IF EXISTS set_notes_updated_at ON notes;
DROP TRIGGER IF EXISTS prepare_notes_for_search ON notes;

CREATE TRIGGER prepare_notes_for_search
BEFORE INSERT OR UPDATE OF body_markdown, summary ON notes
FOR EACH ROW
EXECUTE FUNCTION prepare_note_content();

CREATE TRIGGER set_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION set_row_updated_at();
