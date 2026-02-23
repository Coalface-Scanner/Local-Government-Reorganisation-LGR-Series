# Glossary System - How to Add Terms

This guide explains how to add new terms to the LGRI glossary system.

## Quick Start

1. Open `src/lib/glossaryData.ts`
2. Add your new term to the `glossaryTerms` array
3. Save the file
4. Your term will automatically appear at `/glossary` and be accessible at `/glossary/your-term-slug`

## Term Structure

Each glossary term follows this TypeScript interface:

```typescript
{
  term: string;                    // Required: Display name
  slug: string;                     // Required: URL-friendly identifier
  definition: string;               // Required: Can include HTML
  relatedTerms: string[];          // Required: Array of related term slugs
  category?: string;                // Optional: Groups terms
  synonyms?: string[];              // Optional: Alternative terms
  lastUpdated?: string;             // Optional: ISO date string (YYYY-MM-DD)
  relatedLink?: string;            // Optional: Link to related content
}
```

## Step-by-Step Guide

### Step 1: Open the Data File

Edit `src/lib/glossaryData.ts` and locate the `glossaryTerms` array.

### Step 2: Create Your Term Object

Add a new object to the array following this structure:

```typescript
{
  term: 'Your Term Name',
  slug: 'your-term-slug',
  definition: 'Your definition here. This can include <strong>HTML</strong> formatting.',
  relatedTerms: ['existing-term-slug-1', 'existing-term-slug-2'],
  category: 'Core Concepts',
  synonyms: ['Alternative Name'],
  lastUpdated: '2026-02-01',
  relatedLink: '/path/to/related/article'
}
```

### Step 3: Generate a Slug

**Slug Rules:**
- Use lowercase letters
- Replace spaces with hyphens
- Remove special characters
- Keep it concise and readable

**Examples:**
- "First 100 Days" → `first-100-days`
- "LGR Governance" → `lgr-governance`
- "Two-Tier System" → `two-tier-system`
- "Combined Authority" → `combined-authority`

### Step 4: Link Related Terms

Use the **slugs** of existing terms (not their display names) in the `relatedTerms` array:

```typescript
relatedTerms: ['unitary-authority', 'shadow-authority', 'vesting-day']
```

**Tip:** Check existing terms in `glossaryData.ts` to find the correct slugs.

### Step 5: Write the Definition

- Keep definitions concise (1-3 sentences recommended)
- Use plain language
- HTML formatting is supported:
  - `<strong>bold</strong>` for emphasis
  - `<em>italic</em>` for emphasis
  - `<a href="/link">links</a>` for internal/external links
  - Headings (`<h2>`, `<h3>`) will automatically generate a table of contents

**Example:**
```typescript
definition: 'A <strong>unitary authority</strong> combines the responsibilities of both county and district councils. This provides a <em>single point of accountability</em> for local services.'
```

## Complete Example

Here's a complete example of adding a new term:

```typescript
{
  term: 'Combined Authority',
  slug: 'combined-authority',
  definition: 'A type of local authority in England that brings together multiple local authorities to work together on strategic issues such as transport, economic development, and regeneration. Combined authorities are typically led by an elected mayor.',
  relatedTerms: ['devolution', 'local-government-reorganisation-lgr'],
  category: 'Core Concepts',
  synonyms: ['CA', 'Metro Mayor'],
  lastUpdated: '2026-02-01',
  relatedLink: '/topics/governance-and-reform'
}
```

## Available Categories

Use these categories to group related terms:

- `'Core Concepts'` - Fundamental LGR concepts
- `'Governance'` - Governance structures and processes
- `'Timeline'` - Time-related terms and phases
- `'Process'` - Procedural and operational terms

You can also create new categories as needed.

## Field Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `term` | `string` | The display name of the term (e.g., "Unitary Authority") |
| `slug` | `string` | URL-friendly identifier (e.g., "unitary-authority") |
| `definition` | `string` | The term's definition. HTML is supported. |
| `relatedTerms` | `string[]` | Array of slugs for related terms (can be empty `[]`) |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `category` | `string` | Groups terms together | `'Core Concepts'` |
| `synonyms` | `string[]` | Alternative names for the term | `['CA', 'Metro Mayor']` |
| `lastUpdated` | `string` | ISO date string | `'2026-02-01'` |
| `relatedLink` | `string` | Link to related content | `'/facts/what-is-lgr'` |

## Best Practices

1. **Keep definitions concise** - Aim for 1-3 sentences. Longer definitions can be broken into paragraphs with HTML.

2. **Link related terms** - Always add related terms to help users discover connected concepts. Use existing term slugs.

3. **Use categories** - Group related terms together for better organization.

4. **Update dates** - Set `lastUpdated` when you add or modify a term.

5. **Test your slug** - After adding, visit `/glossary/your-term-slug` to verify it works.

6. **Check for duplicates** - Ensure your slug doesn't already exist.

7. **HTML formatting** - Use HTML sparingly. Simple formatting like `<strong>` and links work well.

## After Adding a Term

1. **Save the file** - The term will be available immediately
2. **Check the index** - Visit `/glossary` to see your new term
3. **Test the page** - Visit `/glossary/your-term-slug` to view the term page
4. **Verify links** - Check that related terms link correctly
5. **Test search** - Search for your term to ensure it's findable

## Troubleshooting

### Term doesn't appear
- Check that the term object is properly formatted (commas, brackets)
- Verify the slug doesn't contain invalid characters
- Ensure the file saved correctly

### Related terms don't link
- Verify you're using slugs (not display names) in `relatedTerms`
- Check that the related term slugs exist in the glossary
- Ensure slugs match exactly (case-sensitive)

### Page shows 404
- Verify the slug matches the URL exactly
- Check for typos in the slug
- Ensure the slug follows the format rules (lowercase, hyphens)

### Search doesn't find term
- Check that the term and definition contain the search keywords
- Verify the term is saved in the `glossaryTerms` array
- Try refreshing the page

## File Location

All glossary terms are stored in:
```
src/lib/glossaryData.ts
```

The `glossaryTerms` array contains all terms. Add new terms to this array.

## Need Help?

If you encounter issues:
1. Check the TypeScript console for errors
2. Verify your term object matches the interface structure
3. Check existing terms for examples
4. Ensure all required fields are present
