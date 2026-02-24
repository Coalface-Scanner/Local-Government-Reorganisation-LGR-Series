-- Update footer disclaimer: COALFACE® and its partners
UPDATE footer_content
SET content = 'Content on this site is for general information only and is not a substitute for technical, planning, legal or professional advice. Coalface Engagement Ltd / COALFACE® and its partners accepts no liability for decisions made on the basis of this material. Please contact us for advice relating to specific sites, schemes or authorities.'
WHERE section = 'disclaimer';
