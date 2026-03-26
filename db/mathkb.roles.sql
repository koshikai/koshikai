-- Run this after creating the mathkb database and connecting to it.
-- Replace the placeholder passwords before applying.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mathkb_app') THEN
    CREATE ROLE mathkb_app LOGIN PASSWORD 'change-me';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mcp_reader') THEN
    CREATE ROLE mcp_reader LOGIN PASSWORD 'change-me';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mathkb_nocodb') THEN
    CREATE ROLE mathkb_nocodb LOGIN PASSWORD 'change-me';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO mathkb_app, mcp_reader, mathkb_nocodb;

GRANT SELECT ON notes, tags, note_tags TO mathkb_app;
GRANT SELECT ON notes, tags, note_tags TO mcp_reader;

GRANT SELECT, INSERT, UPDATE, DELETE ON notes, tags, note_tags TO mathkb_nocodb;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mathkb_nocodb;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO mathkb_app, mcp_reader;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO mathkb_nocodb;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO mathkb_nocodb;
