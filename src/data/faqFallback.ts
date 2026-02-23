/**
 * Fallback Q&As used when a page has fewer than minItems page-specific FAQs.
 * Reused from QuestionsAndAnswers faqData for consistency. Plain text only for schema/display.
 */
export interface FAQFallbackItem {
  question: string;
  answer: string;
}

export const faqFallback: FAQFallbackItem[] = [
  {
    question: 'What is Local Government Reorganisation (LGR)?',
    answer: "LGR is a structural reform programme to simplify England's system by replacing two-tier local government (county and district) with unitary authorities. It is the fourth major wave of restructuring since 1965, announced in the December 2024 Devolution White Paper.",
  },
  {
    question: 'What are Unitary Authorities?',
    answer: 'A single local government organisation responsible for all services in an area. It combines functions split between county and district tiers (like education, social care, planning, and waste) into one body.',
  },
  {
    question: 'Why Does the Government Want to Reorganise?',
    answer: 'Strategic reasons include: streamlining services, improving financial sustainability by removing administrative duplication, and creating governance structures strong enough for devolution.',
  },
  {
    question: 'What is the Timeline for Implementation?',
    answer: 'Key milestones: Nov 2025 final proposal deadline; Spring/Summer 2026 government decisions; May 2027 first elections; April 2028 new councils operational. Surrey follows an accelerated timeline (operational April 2027).',
  },
  {
    question: 'Which Areas are Involved in LGR?',
    answer: '21 two-tier areas including Surrey (accelerated), Kent, Essex, Hertfordshire, Norfolk, Suffolk, Cambridgeshire, Lancashire, Cheshire, Cumbria, Hampshire, and Sussex.',
  },
  {
    question: 'How Much Could LGR Save?',
    answer: 'PwC and County Councils Network analyses estimate potential savings of £1.8bn to £2.9bn over five years if implemented at a large scale (500,000+ population).',
  },
  {
    question: 'What Do Different Models Look Like?',
    answer: 'Options include Single Unitary (one council per county), Two-Unitary splits (e.g. East and West Surrey), or Three+ Unitary models which maintain more local identity but increase costs.',
  },
  {
    question: 'What Happens to Parish Councils?',
    answer: 'Parish and town councils remain. They are an opportunity to maintain community-level governance, and many new unitaries may devolve hyperlocal functions to them.',
  },
];
