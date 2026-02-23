# Key Facts: Glossary and Internal Links

Key facts (and other content that uses the same enhancement) get **glossary links** and **internal site links** applied at render time. No changes to the stored fact content are required.

## How it works

1. **Glossary links**: Terms and synonyms from `src/lib/glossaryData.ts` are matched in the fact body. The **first occurrence** of each term (or synonym) is wrapped in a link to `/glossary/{slug}`.
2. **Internal links**: Phrases in `src/lib/internalLinks.ts` are matched in the fact body. The **first occurrence** of each phrase is wrapped in a link to the corresponding site page (e.g. `/first-100-days`, `/lessons`).

Enhancement runs in [FactDetail](src/pages/FactDetail.tsx): glossary first, then internal links, then HTML sanitisation.

## When adding new key facts

1. **New concepts**  
   If a fact uses a concept that is not yet in the glossary, add a new term in `src/lib/glossaryData.ts` (see [Glossary README](src/app/glossary/README.md)). Use the same wording or add a synonym so the enhancer can match it.

2. **Different wording**  
   If the fact uses different wording for an existing concept (e.g. "two-tier" instead of "Two-Tier System"), add that wording as a **synonym** on the existing term so it still links.

3. **New internal links**  
   If you want a phrase in fact content to link to a specific site page (e.g. a new section), add a `{ phrase, path }` entry to the `internalLinkMap` array in `src/lib/internalLinks.ts`. Use phrases that actually appear in the facts; longer phrases are matched before shorter ones.

## Files

| File | Purpose |
|------|--------|
| [src/lib/glossaryData.ts](src/lib/glossaryData.ts) | Glossary terms, definitions, synonyms. Add or edit terms here. |
| [src/lib/glossaryLinks.ts](src/lib/glossaryLinks.ts) | Logic that finds glossary mentions and wraps them in links. |
| [src/lib/internalLinks.ts](src/lib/internalLinks.ts) | Phrase → path map and logic for internal site links. Add new phrase/path pairs here. |
| [src/pages/FactDetail.tsx](src/pages/FactDetail.tsx) | Runs glossary and internal-link enhancement on fact content before display. |

## Other content

The same glossary enhancement is used on articles ([Article](src/pages/Article.tsx), [ArticleView](src/pages/ArticleView.tsx)), news ([News](src/pages/News.tsx)), and lessons ([Insights](src/pages/lessons/Insights.tsx)). Internal-link enhancement is currently applied only on fact detail pages; it can be extended to other pages if needed.
