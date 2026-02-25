-- Add secondary_questions column to topic_pages
ALTER TABLE topic_pages
ADD COLUMN IF NOT EXISTS secondary_questions jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN topic_pages.secondary_questions IS 'Array of secondary questions for the theme, displayed below the primary key question.';

-- Update Democratic Legitimacy
UPDATE topic_pages
SET
  description = 'Local Government Reorganisation changes more than administrative boundaries. It alters who is represented, how visible decision makers are, and how much confidence communities place in the outcomes councils deliver.

As councils grow larger, wards cover wider areas and executive power becomes more concentrated, the relationship between elector and institution is stretched. Electoral systems designed for smaller authorities are now operating at a different scale, with consequences for representation, accountability and trust.

This theme examines how democratic legitimacy is built or weakened in reorganised councils. It considers the impact of scale, voting systems, ward design and participation on public confidence, and asks whether new authorities are entering their first elections with democratic foundations that are fit for the responsibilities they now carry.',
  key_question = 'How does Local Government Reorganisation affect democratic representation, public trust and the perceived authority of council decisions at a larger scale?',
  secondary_questions = '[
    "Are existing electoral systems, ward structures and councillor numbers still appropriate for the size and responsibilities of new unitary councils?",
    "Does scale dilute the relationship between communities and decision makers, and if so, how can legitimacy be rebuilt in practice rather than assumed?",
    "What risks arise when new councils begin life with weak mandates or low public confidence, particularly in politically sensitive areas such as planning and growth?"
  ]'::jsonb,
  updated_at = now()
WHERE theme_slug = 'democratic-legitimacy';

-- Update Governance and Reform
UPDATE topic_pages
SET
  description = 'Reorganisation promises simpler structures, clearer accountability and better performance. In practice, it often exposes how fragile governance arrangements can be during transition.

New councils must merge political cultures, officer hierarchies, committee systems and delegations while continuing to take legally robust decisions under intense financial and political pressure. Where governance discipline is weak, reform creates delay and risk rather than improvement.

This theme focuses on how governance actually functions inside reorganised councils. It looks at decision pathways, schemes of delegation, Member officer dynamics and organisational controls, and sets out what governance discipline is required if reform is to translate into faster, clearer and more defensible outcomes.',
  key_question = 'What governance discipline is required for Local Government Reorganisation to improve decision making rather than slow it down?',
  secondary_questions = '[
    "Which governance failures most commonly undermine reorganised councils in their early years, and why do they persist?",
    "How do committee structures, schemes of delegation and internal accountability shape planning performance and organisational confidence?",
    "What practical governance choices separate councils that stabilise quickly from those that remain locked in transition for years?"
  ]'::jsonb,
  updated_at = now()
WHERE theme_slug = 'governance-and-reform';

-- Update Statecraft and System Design
UPDATE topic_pages
SET
  description = 'Formal structures alone do not determine whether a council functions well. Outcomes are shaped by judgment, sequencing and how political authority is exercised in practice.

Reorganisation places significant demands on political leadership. New administrations must set direction, manage uncertainty, align officers and Members, and make contested decisions in full public view, often before new systems have settled.

This theme examines the craft of governing reorganised councils. It explores how institutional design, operational systems and political leadership interact, and why some councils establish confidence and control early while others drift. The focus is not on theory, but on the practical choices that determine whether new authorities govern with clarity or become trapped in complexity.',
  key_question = 'How do political judgment, institutional design and operational systems combine to determine whether new councils govern effectively?',
  secondary_questions = '[
    "Why do councils with similar structures produce very different outcomes after reorganisation?",
    "What leadership behaviours and sequencing decisions matter most in the first electoral cycle of a new authority?",
    "How do design choices around executive power, scrutiny, digital systems and performance management influence a council''s ability to act with clarity and control?"
  ]'::jsonb,
  updated_at = now()
WHERE theme_slug = 'statecraft-and-system-design';
