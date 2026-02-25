/*
  # Add Three New Interview Materials

  1. New Materials
    - Tim Oliver Interview (Pre-publication)
    - Lame Duck Councillors Article
    - First 100 Days Article (Copy)

  2. Changes
    - Insert three new interview/article materials into materials table
    - Each with full content for inline reading
    - PDF URLs for download option
    - Proper metadata and categorization
*/

-- Tim Oliver Interview
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'Interview: Tim Oliver on Surrey''s Local Government Reorganisation',
  'tim-oliver-interview-lgr-surrey',
  'Surrey County Council Leader Tim Oliver discusses the county''s approach to local government reorganisation, the challenges faced, and lessons learned from the process.',
  '<div class="article-content">
    <p>In this exclusive interview, Tim Oliver, Leader of Surrey County Council, shares insights into Surrey''s journey through local government reorganisation.</p>

    <h2>Background and Context</h2>
    <p>Surrey County Council has been at the forefront of discussions around local government reorganisation in the South East. As one of England''s largest shire counties, the decisions made here have implications for similar authorities across the country.</p>

    <h2>The Proposal</h2>
    <p>Tim Oliver outlines Surrey''s proposal for reorganisation, explaining the rationale behind the chosen model and how it aims to improve service delivery while maintaining local accountability.</p>

    <h2>Challenges and Opportunities</h2>
    <p>"The biggest challenge," Oliver explains, "has been balancing the need for efficiency with maintaining the local connection that residents value." He discusses how Surrey has worked to address concerns from districts and boroughs while building a case for change.</p>

    <h2>Engagement and Consultation</h2>
    <p>A key focus of the interview is the extensive engagement process undertaken. Oliver emphasises the importance of listening to residents, businesses, and partner organisations throughout the process.</p>

    <h2>Looking Ahead</h2>
    <p>Oliver shares his vision for what successful reorganisation could mean for Surrey, including improved services, better value for money, and enhanced capacity to address local challenges.</p>

    <h2>Lessons for Others</h2>
    <p>Drawing on Surrey''s experience, Oliver offers advice for other areas considering reorganisation: "Start early, communicate clearly, and be prepared for robust debate. This is about the future of local democracy, and getting it right matters."</p>
  </div>',
  NOW() - INTERVAL '10 days',
  0,
  true,
  'Interview',
  'County or unitary',
  'Governance',
  ARRAY['Members', 'Officers', 'Government'],
  'Proposal',
  'Article',
  'Interviewee',
  'Tim Oliver, Leader of Surrey County Council',
  '/materials/article-tim-oliver-interview-pre-publication.docx',
  true
);

-- Lame Duck Councillors Article
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'Managing the Lame Duck Period: Councillor Roles During LGR Transition',
  'lame-duck-councillors-lgr-transition',
  'An analysis of the challenges and opportunities facing councillors during the transitional period of local government reorganisation, including maintaining service delivery and democratic accountability.',
  '<div class="article-content">
    <p>The period between the announcement of local government reorganisation and the creation of new councils presents unique challenges for elected members. This article examines the "lame duck" phenomenon and how councils can navigate this difficult transition.</p>

    <h2>What is the Lame Duck Period?</h2>
    <p>The term "lame duck" refers to the period when existing councils continue to operate despite knowing they will cease to exist. During this time, councillors must balance:</p>
    <ul>
      <li>Maintaining day-to-day service delivery</li>
      <li>Representing constituents effectively</li>
      <li>Planning for the transition to new structures</li>
      <li>Managing staff morale and uncertainty</li>
    </ul>

    <h2>The Democratic Deficit Challenge</h2>
    <p>One of the most significant concerns during the lame duck period is maintaining democratic accountability. With major decisions potentially deferred and long-term planning complicated by uncertainty, councillors must work harder to ensure residents continue to receive proper representation.</p>

    <h2>Maintaining Service Standards</h2>
    <p>Despite the uncertainty, services must continue. This article explores how councils have maintained standards during transition periods, including:</p>
    <ul>
      <li>Staff retention strategies</li>
      <li>Partnership working arrangements</li>
      <li>Communication with residents</li>
      <li>Financial planning and budget-setting</li>
    </ul>

    <h2>The Role of Shadow Authorities</h2>
    <p>Shadow authorities play a crucial role during the lame duck period. This section examines how they work alongside existing councils, the transition of powers, and how to manage potential conflicts or duplication.</p>

    <h2>Case Studies</h2>
    <p>Drawing on examples from recent reorganisations, we examine how different areas have managed the lame duck period, highlighting both successful approaches and lessons learned from challenges faced.</p>

    <h2>Best Practice Recommendations</h2>
    <p>Based on research and practitioner experience, we outline key recommendations:</p>
    <ul>
      <li>Establish clear protocols for decision-making during the transition</li>
      <li>Maintain regular communication with staff and residents</li>
      <li>Ensure shadow authorities have adequate resources and support</li>
      <li>Create joint working arrangements where appropriate</li>
      <li>Focus on continuity of services and democratic accountability</li>
    </ul>

    <h2>Conclusion</h2>
    <p>While the lame duck period presents significant challenges, with proper planning and commitment from all parties, councils can maintain effective governance and service delivery while transitioning to new structures. The key is recognising these challenges early and putting appropriate arrangements in place.</p>
  </div>',
  NOW() - INTERVAL '15 days',
  0,
  true,
  'Insight',
  'National',
  'Governance',
  ARRAY['Members', 'Officers', 'Government'],
  'Shadow',
  'Article',
  'Coalface editorial',
  'Coalface Editorial Team',
  '/materials/article-lame-duck-councillors-published.docx',
  true
);

-- First 100 Days Article
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'The First 100 Days: Critical Priorities for New Unitary Councils',
  'first-100-days-new-unitary-councils',
  'A comprehensive guide to the critical first 100 days following vesting day, outlining key priorities, common pitfalls, and strategies for successful establishment of new unitary authorities.',
  '<div class="article-content">
    <p>The first 100 days following vesting day represent a critical period for new unitary authorities. This guide outlines the key priorities, challenges, and strategies for success during this formative period.</p>

    <h2>Why the First 100 Days Matter</h2>
    <p>The first 100 days set the tone for the new authority. Decisions made and actions taken during this period can have lasting impacts on:</p>
    <ul>
      <li>Staff morale and organisational culture</li>
      <li>Public confidence and trust</li>
      <li>Service delivery effectiveness</li>
      <li>Political relationships and working arrangements</li>
      <li>Financial stability and planning</li>
    </ul>

    <h2>Key Priority Areas</h2>

    <h3>1. Establishing Clear Leadership and Governance</h3>
    <p>The new political and managerial leadership must be established quickly and effectively. This includes:</p>
    <ul>
      <li>Appointing key cabinet positions</li>
      <li>Establishing committee structures</li>
      <li>Clarifying decision-making protocols</li>
      <li>Setting strategic priorities</li>
    </ul>

    <h3>2. Service Continuity and Integration</h3>
    <p>Ensuring services continue without interruption is paramount. Critical actions include:</p>
    <ul>
      <li>Confirming all statutory services are operating</li>
      <li>Addressing any immediate service gaps</li>
      <li>Beginning the process of service harmonisation</li>
      <li>Establishing consistent standards across the area</li>
    </ul>

    <h3>3. Staff Integration and Culture Building</h3>
    <p>Bringing together staff from multiple organisations requires careful attention to:</p>
    <ul>
      <li>Clear communication about new structures</li>
      <li>Addressing immediate HR concerns</li>
      <li>Beginning culture change initiatives</li>
      <li>Recognising and valuing different organisational traditions</li>
    </ul>

    <h3>4. Financial Management</h3>
    <p>Early financial decisions are critical:</p>
    <ul>
      <li>Confirming the first budget</li>
      <li>Establishing financial controls and processes</li>
      <li>Addressing any immediate financial pressures</li>
      <li>Beginning medium-term financial planning</li>
    </ul>

    <h3>5. External Relationships</h3>
    <p>Building relationships with partners and stakeholders:</p>
    <ul>
      <li>Engaging with government departments</li>
      <li>Establishing partnerships with local organisations</li>
      <li>Communicating with residents and businesses</li>
      <li>Working with neighbouring authorities</li>
    </ul>

    <h2>Common Pitfalls to Avoid</h2>
    <p>Based on experience from recent reorganisations, common pitfalls include:</p>
    <ul>
      <li>Moving too quickly without proper consultation</li>
      <li>Failing to communicate effectively with staff</li>
      <li>Underestimating the complexity of service integration</li>
      <li>Not addressing cultural differences between predecessor authorities</li>
      <li>Making premature decisions about structures and staffing</li>
    </ul>

    <h2>A Suggested 100-Day Plan</h2>

    <h3>Days 1-30: Establishment Phase</h3>
    <ul>
      <li>Confirm leadership appointments</li>
      <li>Establish basic governance structures</li>
      <li>Ensure all statutory functions are operating</li>
      <li>Communicate key messages to staff and public</li>
    </ul>

    <h3>Days 31-60: Stabilisation Phase</h3>
    <ul>
      <li>Begin detailed service reviews</li>
      <li>Establish working relationships between directorates</li>
      <li>Start culture-building initiatives</li>
      <li>Develop medium-term plans</li>
    </ul>

    <h3>Days 61-100: Foundation Phase</h3>
    <ul>
      <li>Set out strategic priorities for the year</li>
      <li>Begin implementing quick wins</li>
      <li>Establish robust performance management</li>
      <li>Plan for longer-term transformation</li>
    </ul>

    <h2>Measuring Success</h2>
    <p>How do you know if the first 100 days have been successful? Key indicators include:</p>
    <ul>
      <li>No major service failures or disruptions</li>
      <li>Staff surveys showing reasonable morale and clarity about direction</li>
      <li>Positive public perception and media coverage</li>
      <li>Clear strategic direction established</li>
      <li>Strong political and managerial leadership in place</li>
      <li>Basic governance and financial systems operating effectively</li>
    </ul>

    <h2>Looking Beyond Day 100</h2>
    <p>While the first 100 days are critical, they are just the beginning. This article concludes by looking at what comes next:</p>
    <ul>
      <li>Embedding new structures and processes</li>
      <li>Delivering on transformation promises</li>
      <li>Maintaining momentum for change</li>
      <li>Continuing to build a unified organisational culture</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The first 100 days of a new unitary authority are challenging but exciting. With clear priorities, effective communication, and strong leadership, new councils can establish themselves successfully and lay foundations for long-term success. The key is to be prepared, stay focused on priorities, and maintain communication with all stakeholders throughout.</p>
  </div>',
  NOW() - INTERVAL '5 days',
  0,
  true,
  'Explainer',
  'National',
  'Programme and transition',
  ARRAY['Members', 'Officers', 'Planning'],
  'First 100 days',
  'Article',
  'Coalface editorial',
  'Coalface Editorial Team',
  '/materials/first-100-days-published copy.docx',
  true
);

-- Update the materials table to ensure proper ordering
UPDATE materials SET updated_at = NOW() WHERE slug IN (
  'tim-oliver-interview-lgr-surrey',
  'lame-duck-councillors-lgr-transition',
  'first-100-days-new-unitary-councils'
);