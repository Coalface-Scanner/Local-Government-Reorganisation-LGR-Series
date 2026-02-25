/*
  # Replace "The Dispatch" with "LGR Series Newsletter"

  Updates contact page subscribe link text and any footer content
  that may reference the old newsletter name.
*/

-- Contact page: subscribe link label
UPDATE page_content
SET content = 'Subscribe to the LGR Series Newsletter'
WHERE page_slug = 'contact' AND section_key = 'card_subscribe_link';
