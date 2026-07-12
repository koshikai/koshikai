-- Remove the retired MathKB web UI role after its project grants are revoked.
-- This intentionally fails at DROP ROLE if the role still has dependencies
-- outside this project; inspect those dependencies before retrying.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mathkb_app') THEN
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      REVOKE SELECT ON TABLES FROM mathkb_app;
    REVOKE ALL PRIVILEGES ON notes, tags, note_tags FROM mathkb_app;
    REVOKE USAGE ON SCHEMA public FROM mathkb_app;
    EXECUTE 'DROP ROLE mathkb_app';
  END IF;
END
$$;
