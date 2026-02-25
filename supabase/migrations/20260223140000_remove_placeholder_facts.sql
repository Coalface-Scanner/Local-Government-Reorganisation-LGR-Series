-- Remove placeholder/example key facts so only real content is shown.
-- Safe patterns: titles or content that are clearly placeholder or lorem ipsum.

DELETE FROM facts
WHERE
  title ILIKE '%placeholder%'
  OR title ILIKE '%example fact%'
  OR title ILIKE 'Test fact%'
  OR title ILIKE 'Test %'
  OR content ILIKE 'Lorem ipsum%'
  OR trim(content) ILIKE 'Lorem ipsum%';
