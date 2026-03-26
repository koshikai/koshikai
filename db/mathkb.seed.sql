INSERT INTO tags (slug, name)
VALUES
  ('functional-analysis', 'functional-analysis'),
  ('spectral-theory', 'spectral-theory'),
  ('draft', 'draft')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;

INSERT INTO notes (
  slug,
  title,
  field,
  summary,
  body_markdown,
  is_public
)
VALUES (
  'compact-self-adjoint-operators',
  'Compact Self-Adjoint Operators',
  'Functional Analysis',
  'コンパクト自己共役作用素の基本スペクトル性質を確認するための作業メモ。',
  E'# Compact Self-Adjoint Operators\n\n- 固有値は高々可算\n- 非零スペクトルの集積点は 0 のみ\n- ヒルベルト空間上で直交基底を与える\n\n## Memo\n\n証明の流れを分解し、有限次元近似との比較を先に書く。',
  FALSE
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  field = EXCLUDED.field,
  summary = EXCLUDED.summary,
  body_markdown = EXCLUDED.body_markdown,
  is_public = EXCLUDED.is_public;

INSERT INTO note_tags (note_id, tag_id)
SELECT notes.id, tags.id
FROM notes
CROSS JOIN tags
WHERE notes.slug = 'compact-self-adjoint-operators'
  AND tags.slug IN ('functional-analysis', 'spectral-theory')
ON CONFLICT DO NOTHING;
