/*
  # Seed Initial Page Content
  
  Populates CMS tables with existing hardcoded content to ensure no content loss.
*/

-- Seed footer content
INSERT INTO footer_content (section, content, link_text, link_url, order_index)
VALUES
  ('sponsorship', 'The LGR Series is an Insight Project by COALFACE™', 'COALFACE', 'https://coalfaceengagement.co.uk', 1),
  ('subscription_cta', 'The LGR Series is constantly updated with new information added frequently.', 'Subscribe to stay updated with new materials', '/subscribe', 2),
  ('disclaimer', 'Content on this site is for general information only and is not a substitute for technical, planning, legal or professional advice. Coalface Engagement Ltd / COALFACE® and its partners accepts no liability for decisions made on the basis of this material. Please contact us for advice relating to specific sites, schemes or authorities.', NULL, NULL, 3),
  ('tagline', 'Planning consultation and engagement shaped by political behaviour, governance conditions and planning system realities.', NULL, NULL, 4)
ON CONFLICT (section) DO UPDATE SET
  content = EXCLUDED.content,
  link_text = EXCLUDED.link_text,
  link_url = EXCLUDED.link_url,
  order_index = EXCLUDED.order_index;

-- Seed contact page content
INSERT INTO page_content (page_slug, section_key, title, content, order_index)
VALUES
  ('contact', 'hero_label', NULL, 'GET IN TOUCH', 1),
  ('contact', 'hero_title', 'Contact', 'the Series', 2),
  ('contact', 'hero_description', NULL, 'Have questions about the research, want to contribute insights, or need to discuss specific reorganisation challenges? We''re here to help.', 3),
  ('contact', 'form_title', NULL, 'Send Us a Message', 4),
  ('contact', 'form_description', NULL, 'Fill out the form below and we''ll get back to you', 5),
  ('contact', 'card_editorial_title', NULL, 'Editorial Team', 6),
  ('contact', 'card_editorial_description', NULL, 'For editorial inquiries, research questions, or to contribute case studies:', 7),
  ('contact', 'card_editorial_email', NULL, 'editor@localgovernmentreorganisation.com', 8),
  ('contact', 'card_subscribe_title', NULL, 'Subscribe', 9),
  ('contact', 'card_subscribe_description', NULL, 'Receive new insights as they''re published, plus access to case material and the 100 Day Playbook:', 10),
  ('contact', 'card_subscribe_link', NULL, 'Subscribe to The Dispatch', 11)
ON CONFLICT (page_slug, section_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index;

-- Seed subscribe page content
INSERT INTO page_content (page_slug, section_key, title, content, order_index)
VALUES
  ('subscribe', 'hero_label', NULL, 'STAY INFORMED', 1),
  ('subscribe', 'hero_title', 'Subscribe', 'for Updates', 2),
  ('subscribe', 'hero_description', NULL, 'Receive each article as it''s released, plus access to extended notes, case material, and the 100 Day Playbook', 3),
  ('subscribe', 'card_new_articles_title', NULL, 'New Articles', 4),
  ('subscribe', 'card_new_articles_description', NULL, 'Get notified when new insights and analysis are published', 5),
  ('subscribe', 'card_extended_notes_title', NULL, 'Extended Notes', 6),
  ('subscribe', 'card_extended_notes_description', NULL, 'Access detailed case studies and supplementary material', 7),
  ('subscribe', 'card_playbook_title', NULL, '100 Day Playbook', 8),
  ('subscribe', 'card_playbook_description', NULL, 'Download the comprehensive playbook for unitary transition', 9)
ON CONFLICT (page_slug, section_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index;

-- Seed topic pages
INSERT INTO topic_pages (theme_slug, display_name, description, key_question, related_themes)
VALUES
  ('governance-and-reform', 'Governance and Reform', 'Analysis of how local government reorganisation reshapes decision making, accountability and planning performance, and what governance discipline is required to make reform work in practice.', 'What governance discipline is required to make local government reorganisation work in practice?', '["democratic-legitimacy", "statecraft-and-system-design"]'::jsonb),
  ('democratic-legitimacy', 'Democratic Legitimacy', 'Exploring how scale, electoral systems and institutional design affect representation, public trust and the authority of decision making in newly formed councils.', 'How do scale, electoral systems and institutional design affect representation and public trust?', '["governance-and-reform", "statecraft-and-system-design"]'::jsonb),
  ('statecraft-and-system-design', 'Statecraft and System Design', 'Examining how political judgment, institutional design and operational systems combine to determine whether new councils function with clarity, confidence and control.', 'How do political judgment, institutional design and operational systems combine to determine council effectiveness?', '["governance-and-reform", "democratic-legitimacy"]'::jsonb)
ON CONFLICT (theme_slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  key_question = EXCLUDED.key_question,
  related_themes = EXCLUDED.related_themes;

-- Seed about pages (editor page)
INSERT INTO about_pages (page_slug, title, content)
VALUES
  ('editor', 'Editor''s Letter', '<h2>Editor''s Letter</h2>
<p class="mb-6 italic">
  Personal thoughts and reflections as we begin to launch the LGR Series, exploring the intricacies of the most far reaching restructuring of English local government in a generation.
</p>
<p class="mb-6">
  <span class="font-semibold">Local Government Reorganisation: Decisions, Power and Place</span> examines a programme that will reshape not only how planning authorities operate, but how the wider local government system functions around them. Driven by the Government''s ambition to deliver 1.5 million new homes, reorganisation will influence governance, capacity, accountability and delivery across the whole development cycle.
</p>
<p class="mb-6">
  These reforms cut across governance, finance, digital systems, service integration and political leadership. They will affect how place shaping priorities are set, how statutory services interact, and how capacity is deployed across planning, regeneration, infrastructure and democratic oversight. In practice, LGR will help determine how quickly, consistently and transparently councils can make decisions, and how confidently partners can invest behind them.
</p>
<p class="mb-6">
  There is substantial potential here. Done well, reorganisation could create clearer lines of accountability, more coherent decision pathways, stronger governance controls, and more resilient operating models. It could also create the conditions for faster, more predictable planning, by improving consistency, reducing duplication, and strengthening the capability available to plan making and decision taking.
</p>
<p class="mb-6">
  Our intent in publishing this Series is firmly supportive. We want to help authorities, developers and practitioners understand the issues early, so they can capitalise on the opportunity rather than be hindered by it. We will focus on what is practical, what is measurable, and what can be acted on within real world political and organisational constraints.
</p>
<p class="mb-6">
  Recent history shows, however, how easily the opposite can occur. Dorset and Northumberland provide instructive case studies where governance disruption, legacy systems, political instability and uneven organisational capacity contributed to slower decisions, reduced transparency and increased risk across the development ecosystem. Those experiences offer lessons on what happens when reorganisation collides with fragile governance arrangements, or insufficient preparation.
</p>
<p class="mb-6">
  To keep the analysis grounded, the Series uses Surrey as a primary test case, examining how reorganisation may reconfigure planning committees, officer delegations, governance controls, digital infrastructure and political accountability. From this, we draw out what planners, developers, officers, councillors and programme leaders need to understand now, before formal transition decisions set the direction of travel.
</p>
<p class="mb-6">
  Across the Series we return to a core question. Will LGR create a simpler, faster and more effective environment for planning and delivery, or will new structures, inherited systems and political flux introduce fresh complexity?
</p>
<p class="mb-8">
  Our objective is to equip the sector to make the former a reality. Thank you to everyone who has already contributed, and to those who will take part as the Series develops. I hope you find it useful, insightful and pragmatic, and I welcome suggestions for topics, case studies and contributors.
</p>')
ON CONFLICT (page_slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

-- Seed about pages (methodology page)
INSERT INTO about_pages (page_slug, title, content)
VALUES
  ('methodology', 'Research Methodology', '<h2>Research Approach</h2>
<p class="mb-6">
  The LGR Series is built on COALFACE''s Council Scanner™ methodology, which provides systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour across England.
</p>
<h3 class="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">Core Data Sources</h3>
<ul class="list-disc pl-6 space-y-2 mb-6">
  <li>Planning committee meeting records and voting patterns</li>
  <li>Officer delegation schemes and decision-making authority</li>
  <li>Council constitutional documents and governance frameworks</li>
  <li>Strategic planning policies and local plan timelines</li>
  <li>Political composition and electoral cycle analysis</li>
  <li>Performance data on application processing and outcomes</li>
</ul>
<h3 class="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">Analytical Framework</h3>
<p class="mb-4">
  Our analysis examines how governance structures, political conditions, and institutional capacity interact to shape planning outcomes. We focus on:
</p>
<ul class="list-disc pl-6 space-y-2 mb-6">
  <li>Decision-making consistency and transparency</li>
  <li>Governance stability and political risk factors</li>
  <li>Officer capacity and delegation patterns</li>
  <li>Committee behaviour and member engagement</li>
  <li>Digital infrastructure and system integration</li>
</ul>
<h3 class="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">Quality Standards</h3>
<p class="mb-6">
  All analysis is grounded in publicly available data, cross-referenced across multiple sources, and validated against official records. We prioritise empirical evidence over anecdote, and clearly distinguish between observation, analysis, and interpretation.
</p>
<div class="bg-teal-50 border-l-4 border-teal-700 p-6 mt-8">
  <h4 class="font-display font-bold text-academic-charcoal mb-2">Transparency and Reproducibility</h4>
  <p class="text-academic-neutral-700">
    We are committed to transparency in our research methods. All data sources are cited, and our analytical frameworks are clearly explained to enable others to understand and build upon our work.
  </p>
</div>')
ON CONFLICT (page_slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

-- Seed about pages (contribute page)
INSERT INTO about_pages (page_slug, title, content)
VALUES
  ('contribute', 'How to Contribute', '<h2>Get Involved</h2>
<p class="mb-6">
  The LGR Series welcomes contributions from practitioners, local authority officers, elected members, developers, and other stakeholders involved in local government reorganisation and planning.
</p>')
ON CONFLICT (page_slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

-- Seed about pages (coalface page)
INSERT INTO about_pages (page_slug, title, content)
VALUES
  ('coalface', 'About COALFACE', '<h2>About COALFACE</h2>
<p class="mb-6">
  The LGR Series is produced by COALFACE, a research and engagement practice specialising in planning governance, political behaviour, and institutional analysis. COALFACE works with developers, local authorities, and sector bodies to strengthen understanding of how governance conditions shape development outcomes.
</p>
<p class="mb-6">
  Coalface Engagement Ltd provides consultancy services under the COALFACE brand, including Council Scanner™, COALFACE Insights, and COALFACE Engagement.
</p>
<h3 class="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">Our Services</h3>
<ul class="list-disc pl-6 space-y-2 mb-6">
  <li><strong>Council Scanner™:</strong> Systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour</li>
  <li><strong>COALFACE Insights:</strong> Research-driven analysis on local government, planning, and place-making</li>
  <li><strong>COALFACE Engagement:</strong> Planning consultation and engagement shaped by political behaviour and governance conditions</li>
</ul>
<h3 class="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">Our Approach</h3>
<p class="mb-4">
  COALFACE combines data from the COALFACE Council Scanner™ with evidence from real reorganisations to support better decision-making. Our work focuses on:
</p>
<ul class="list-disc pl-6 space-y-2 mb-6">
  <li>Understanding how governance structures affect planning outcomes</li>
  <li>Analysing political behaviour and its impact on decision-making</li>
  <li>Examining institutional capacity and organisational effectiveness</li>
  <li>Supporting evidence-based approaches to local government reform</li>
</ul>
<div class="bg-teal-50 border-l-4 border-teal-700 p-6 mt-8">
  <h4 class="font-display font-bold text-academic-charcoal mb-2">Learn More</h4>
  <p class="text-academic-neutral-700 mb-4">
    For more information about COALFACE''s services and research, visit:
  </p>
  <p class="text-academic-base font-display font-semibold">
    <a href="https://www.coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" class="text-teal-700 hover:text-teal-800 transition-colors">
      www.coalfaceengagement.co.uk
    </a>
  </p>
</div>')
ON CONFLICT (page_slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;
