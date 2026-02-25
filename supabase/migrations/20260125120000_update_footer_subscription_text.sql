/*
  # Update Footer Subscription CTA Text
  
  Updates the subscription CTA text in the footer to the new version.
*/

UPDATE footer_content
SET 
  content = 'The LGR Series is constantly updated with new information added frequently.',
  link_text = 'Subscribe to stay updated with new materials',
  updated_at = now()
WHERE section = 'subscription_cta';
