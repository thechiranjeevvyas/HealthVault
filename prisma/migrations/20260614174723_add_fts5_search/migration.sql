-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS SearchIndex USING fts5(
  entity_type,      -- 'member' | 'event' | 'document'
  entity_id,        -- the actual DB row id
  member_id,        -- for filtering by member
  title,            -- primary searchable text
  body,             -- secondary searchable text (notes, ocr, etc.)
  tags              -- space-separated tags
);