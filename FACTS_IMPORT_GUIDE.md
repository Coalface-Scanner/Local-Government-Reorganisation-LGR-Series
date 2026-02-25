# How to Import Key Facts

This guide explains how to import your existing key facts from the old site to the new one.

## Quick Start

1. **Create JSON files** with your facts data
2. **Place them** in `content-to-upload/facts/` folder
3. **Run the upload script**: `npm run upload-facts`

## Facts Table Structure

Each fact needs:
- `title` (required) - The fact title/heading
- `content` (required) - The fact description/content
- `category` (optional) - Category for grouping (e.g., "Financial", "Governance", "Services")
- `order_index` (optional, default: 0) - Display order (lower numbers appear first)

## JSON File Format

### Single Fact Format

Create a file like `my-fact.json`:

```json
{
  "title": "Financial Savings Achieved",
  "content": "Local government reorganisation has delivered cumulative savings of over £50 million across recent reorganisations.",
  "category": "Financial",
  "order_index": 1
}
```

### Multiple Facts Format

You can also put multiple facts in one file as an array:

```json
[
  {
    "title": "First Fact",
    "content": "Content of first fact...",
    "category": "Governance",
    "order_index": 1
  },
  {
    "title": "Second Fact",
    "content": "Content of second fact...",
    "category": "Financial",
    "order_index": 2
  }
]
```

## Step-by-Step Instructions

### Step 1: Create the Facts Folder

The script will create `content-to-upload/facts/` automatically if it doesn't exist, or you can create it manually.

### Step 2: Create JSON Files

1. Look at the example files:
   - `content-to-upload/facts/example-fact.json` - Single fact
   - `content-to-upload/facts/example-multiple-facts.json` - Multiple facts

2. Create your own JSON files:
   - Name them anything (e.g., `financial-facts.json`, `governance-facts.json`)
   - Use the format shown above
   - You can have multiple files - the script will process all `.json` files in the folder

### Step 3: Run the Upload Script

```bash
npm run upload-facts
```

The script will:
- ✅ Read all JSON files from `content-to-upload/facts/`
- ✅ Upload each fact to Supabase
- ✅ Skip duplicates (if a fact with the same title already exists)
- ✅ Show progress and results

### Step 4: Verify

1. Go to `/admin/login` → Facts Editor
2. Check that your facts appear in the list
3. Visit `/facts` page to see them displayed

## Example: Migrating from Old Site

If you have facts from your old site, you can:

### Option 1: Manual Entry via Admin
1. Go to `/admin/login` → Facts Editor
2. Click "Add Fact"
3. Enter each fact manually

### Option 2: Export to JSON and Import
1. Export your old facts data (if you have database access)
2. Convert to JSON format matching the structure above
3. Save as `.json` files in `content-to-upload/facts/`
4. Run `npm run upload-facts`

### Option 3: Direct SQL Import (Advanced)

If you have SQL export from your old database, you can:

1. Convert the data to INSERT statements matching the `facts` table structure
2. Run the SQL directly in Supabase SQL Editor

Example SQL:
```sql
INSERT INTO facts (title, content, category, order_index)
VALUES 
  ('Fact Title 1', 'Fact content here...', 'Financial', 1),
  ('Fact Title 2', 'Fact content here...', 'Governance', 2);
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file has `VITE_SUPABASE_URL` and either `VITE_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
- Run the script from the project root directory

### Error: "RLS policy violation" or "new row violates row-level security policy"
- **Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
- The service role key bypasses RLS policies, which is needed for import scripts
- **How to get it**:
  1. Go to your Supabase Dashboard
  2. Navigate to Settings → API
  3. Find the "service_role" key (keep this secret!)
  4. Add it to your `.env` file: `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here`
- The script will automatically use the service role key if available, otherwise it falls back to the anon key

### Facts not showing on /facts page
- Check that facts have `order_index` set (they'll be sorted by this)
- Verify facts were uploaded successfully (check admin interface)
- Make sure the Facts page is fetching from the `facts` table correctly

## Tips

- **Order matters**: Set `order_index` to control display order (1, 2, 3, etc.)
- **Categories**: Use consistent category names for grouping (e.g., "Financial", "Governance", "Services")
- **Content formatting**: The content field supports HTML if you need formatting
- **Multiple files**: You can split facts across multiple JSON files for easier management

## Need Help?

If you have your old facts data in a different format (CSV, Excel, etc.), let me know and I can help you convert it to the JSON format needed for import.

