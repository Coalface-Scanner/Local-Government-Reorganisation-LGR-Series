/*
  # Update First 100 Days Article with Full Content

  1. Changes
    - Update the first 100 days article with complete text from source document
    - Includes all disciplines, frameworks, and recommendations from the full playbook
*/

UPDATE materials 
SET content = '<div class="article-content prose prose-slate max-w-none">
<p class="font-bold text-sm uppercase mb-2">PUBLISHED: 3 December</p>

<h1 class="text-4xl font-bold mb-6">The First 100 Days Playbook</h1>
<h2 class="text-2xl font-semibold mb-6">Turning reorganisation into real performance; Surrey''s blueprint for getting LGR right.</h2>

<h2 class="text-3xl font-bold mt-8 mb-4">Why the First 100 Days Matter</h2>

<p>East and West Surrey will hold their first elections in May 2026. Less than a year later — on 1 April 2027 — the two new unitary authorities will replace twelve existing councils. The period between the elections and Vesting Day will determine whether the new councils begin with clarity, legitimacy and operational stability, or inherit the avoidable delays seen elsewhere.</p>

<p>This summary draws on the early work of the LGR Governance Series, which has been gathering interviews, evidence and lessons from recent reorganisations, including Dorset, Somerset, Cumbria, Northumberland, Buckinghamshire and Northamptonshire, and will continue to guide Surrey throughout the transition.</p>

<p class="font-semibold">The full ''First 100 Days Playbook'' will be published later this week.</p>

<p class="font-semibold">You can register now to receive it on release.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">The Five Disciplines That Define a Successful Start</h2>

<h3 class="text-2xl font-bold mt-6 mb-3">1. Democratic Legitimacy & Cross-Party Stewardship</h3>

<p>New authorities only succeed when their political leadership builds legitimacy early, clearly explains how the new system works, and works cross-party in the interests of all communities. This will be particularly hard to achieve in the current environment.</p>

<p>As residents adjust to a new governance landscape, trust will be shaped less by structure and more by behaviour — transparency, fairness, and a shared narrative for what "good growth" means in the new Surrey.</p>

<p>Legitimacy is strengthened when councillors commit to:</p>

<ul class="list-disc pl-6 my-4">
<li>Setting an early, unified cross-party narrative about the purpose of reorganisation.</li>
<li>Demonstrating respect for due process, evidence and probity.</li>
<li>Offering consistent public messaging, even where political views differ.</li>
</ul>

<p class="font-semibold">This is the foundation for every other discipline. Without legitimacy, even strong systems struggle.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">2. Systems Convergence & Organisation-Wide Performance Visibility</h3>

<p>Reorganisation only works when the new authorities operate through a single, coherent set of systems. Surrey inherits not only twelve planning platforms, but multiple customer portals, workflow tools, document stores, finance systems, case management processes and data standards. If these are carried forward unchanged, East and West Surrey will spend their early years reconciling inconsistencies instead of delivering improvement.</p>

<p>Successful reorganisations stabilise quickly because they:</p>

<ul class="list-disc pl-6 my-4">
<li>Create one unified operational workflow for core services, not a patchwork of inherited processes.</li>
<li>Establish single sources of truth for data, documents and performance reporting.</li>
<li>Map and rationalise customer journeys so residents experience East or West Surrey, not twelve legacy councils.</li>
<li>Deploy early performance dashboards that give members and officers real-time visibility across priority services.</li>
<li>Treat digital and data decisions as governance decisions, not technical upgrades.</li>
</ul>

<p class="font-semibold">Systems convergence is not about technology. It is the foundation for consistent service delivery, transparent leadership, and early public confidence in the new authorities.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">3. Clear Accountability & Senior Leadership Discipline</h3>

<p>Reorganisation exposes gaps in accountability immediately. Without clarity, teams hesitate, decisions slow, and officers and members become risk-averse.</p>

<p>Effective new authorities establish:</p>

<ul class="list-disc pl-6 my-4">
<li>Defined reporting lines across development management, policy, enforcement and infrastructure.</li>
<li>A visible, empowered Service Lead for each function who provides strategic direction and leads cultural change, while giving their teams the authority and support to deliver the Council''s work effectively.</li>
<li>A structured transition governance model to prevent issues falling between teams.</li>
</ul>

<p class="font-semibold">Strong leadership discipline does not remove political disagreement, instead it ensures the system continues to function despite it.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">4. Governance Clarity to Reduce Planning Delays (Structures, Delegation & Pathways)</h3>

<p>Governance clarity is where early stability becomes operational reality. Councils succeed when they adopt clean, coherent decision-making arrangements from the outset and avoid replicating legacy complexity.</p>

<p>This requires:</p>

<ul class="list-disc pl-6 my-4">
<li>A single, authoritative Scheme of Delegation.</li>
<li>One published decision pathway that officers, members and applicants all understand.</li>
<li>A commitment to review interim committee structures within weeks, not years.</li>
</ul>

<p class="font-semibold">Governance clarity is not about tidiness, it is about preventing avoidable delay and protecting councillors'' and officers'' ability to make defensible decisions.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">5. The Housing Crisis and Delivery Realism</h3>

<p>Reorganisation does not remove planning pressures; it reshapes them. Legacy plans remain in force until replaced, although housing delivery will be assessed across the whole authority, not by former district.</p>

<p>This means:</p>

<ul class="list-disc pl-6 my-4">
<li>A deficit in one area affects planning decisions in another.</li>
<li>Communications with MPs, residents and developers must be clear and evidence-based.</li>
<li>Councillors must understand the consequences of the Five Year Housing Land Supply (5YHLS) from the start.</li>
</ul>

<p class="font-semibold">Early honesty prevents future conflict, and establishes credibility with government, developers and communities alike.</p>

<hr class="my-8">

<p>This is a summary of the full playbook. The complete version, including detailed action frameworks, risk registers, governance templates, and case study analysis, will be published later this week.</p>

<p class="font-semibold">Register now to receive the full First 100 Days Playbook on release, along with exclusive supporting materials and ongoing LGR analysis.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">About the LGR Governance Series</h2>

<p>The LGR Governance Series is a research and advisory programme led by COALFACE, focused on helping councils, officers, members and partners navigate local government reorganisation with evidence-based analysis and practical frameworks.</p>

<p>Drawing on interviews with leaders, case study analysis of recent reorganisations, and direct engagement with Surrey''s transition, the series provides actionable insights for those responsible for delivering reorganisation successfully.</p>

<p>Future publications will cover transition governance models, planning system integration, democratic engagement frameworks, and performance management in newly formed authorities.</p>
</div>'
WHERE slug = 'first-100-days-new-unitary-councils';