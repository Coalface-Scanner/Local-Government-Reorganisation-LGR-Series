# How to Create JSON Files for Your Content

## Method 1: Using VS Code (Easiest)

### Step 1: Open the Folder
1. In VS Code, open the folder: `content-to-upload/articles/`
2. You should see the `example-article.json` file

### Step 2: Create a New File
1. Right-click in the folder (or click the "New File" icon)
2. Type: `my-article.json` (or any name you want)
3. Press Enter

### Step 3: Copy the Example
1. Open `example-article.json`
2. Select ALL the text (Cmd+A or Ctrl+A)
3. Copy it (Cmd+C or Ctrl+C)

### Step 4: Paste and Edit
1. Open your new `my-article.json` file
2. Paste the content (Cmd+V or Ctrl+V)
3. Edit the values:
   - Change `"title"` to your article title
   - Change `"slug"` to a URL-friendly version (lowercase, hyphens)
   - Change `"excerpt"` to your description
   - Change `"body"` to your article content (can use HTML)
   - Change other fields as needed

### Step 5: Save
1. Press Cmd+S (Mac) or Ctrl+S (Windows)
2. Done!

## Method 2: Using Any Text Editor

### Step 1: Open Text Editor
- Use TextEdit (Mac), Notepad (Windows), or any text editor

### Step 2: Copy This Template
Copy this entire block:

```json
{
  "title": "Your Article Title Here",
  "slug": "your-article-slug",
  "excerpt": "Short description of your article",
  "body": "<p>Your article content goes here. You can use HTML tags like <strong>bold</strong> and <em>italic</em>.</p>",
  "status": "published",
  "published_date": "2024-01-15T00:00:00Z",
  "featured": false,
  "author": "Your Name",
  "category": "Analysis",
  "region": "England"
}
```

### Step 3: Paste and Edit
1. Paste into your text editor
2. Replace the example values with your actual content
3. Make sure to keep the quotes around text values
4. Make sure commas are between items (but not after the last one)

### Step 4: Save
1. Go to File → Save As
2. Navigate to: `content-to-upload/articles/` folder
3. Name it: `my-article.json` (or any name ending in `.json`)
4. Make sure "File Format" is set to "Plain Text" or "All Files"
5. Click Save

## Method 3: Copy the Example File

### Step 1: Find the Example
1. Go to: `content-to-upload/articles/example-article.json`
2. Right-click on it
3. Choose "Duplicate" or "Copy"

### Step 2: Rename
1. Rename the copy to something like `my-article.json`
2. Open it and edit the content

## Important Rules for JSON Files:

1. **Always use double quotes** `"` not single quotes `'`
2. **Commas between items** - but NOT after the last item
3. **File must end in `.json`** - like `my-article.json`
4. **Save as plain text** - not Word doc or rich text

## Example - What NOT to Do:

❌ Wrong:
```json
{
  'title': 'My Article',  // Single quotes - WRONG!
  "slug": "my-article",
  "status": "published",  // Comma after last item - WRONG!
}
```

✅ Correct:
```json
{
  "title": "My Article",  // Double quotes - CORRECT!
  "slug": "my-article",
  "status": "published"   // No comma after last item - CORRECT!
}
```

## Quick Checklist:

- [ ] File name ends with `.json`
- [ ] All text uses double quotes `"`
- [ ] Commas between items (not after last one)
- [ ] File is saved in `content-to-upload/articles/` folder
- [ ] Content is valid (no typos in field names)

## Still Confused?

If you're still not sure, you can:
1. Just edit the `example-article.json` file directly
2. Change all the values to your content
3. Save it
4. The upload script will use it!

## Need Help?

If you have your content in a Word doc or other format, I can help you convert it to JSON format. Just let me know!

