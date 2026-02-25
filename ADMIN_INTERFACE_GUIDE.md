# Admin Interface Guide

## Overview

Your website has **two admin interfaces** for managing content:

### 1. Main CMS Admin Dashboard (`/admin/login`)
- **Full-featured dashboard** for managing all website content
- **Login:** Uses email/password (Supabase Auth)
- **Access:** Go to your website URL + `/admin/login`
- **Features:**
  - Articles (NEW - now in main dashboard!)
  - Home Page content
  - News
  - Site Updates
  - FAQs
  - Materials
  - Facts
  - Lessons
  - Reasons
  - Interviews

### 2. Article Editor (`/admin/articles/login`)
- **Simplified interface** just for articles
- **Login:** Uses password only (simpler for staff)
- **Access:** Go to your website URL + `/admin/articles/login`
- **Features:**
  - Create new articles
  - Edit existing articles
  - Delete articles
  - Rich text editor with full formatting

## How to Access

### Option 1: Main Dashboard (Recommended)
1. Go to: `https://your-website.com/admin/login`
2. Enter your email and password
3. Click "Articles" in the left menu
4. Start creating/editing articles!

### Option 2: Article Editor Only
1. Go to: `https://your-website.com/admin/articles/login`
2. Enter the admin password
3. Start creating/editing articles!

## Creating a New Article

### Step-by-Step:

1. **Click "New Article"** button (top right)

2. **Enter Title**
   - The article title
   - Slug is auto-generated (you can edit it)
   - Example: "Understanding Local Government Reorganisation"

3. **Enter Excerpt** (optional)
   - Short summary that appears in listings
   - 1-2 sentences is perfect

4. **Write Your Article**
   - Use the rich text editor toolbar:
     - **Bold**, *Italic*, <u>Underline</u>
     - Headings (H1, H2, H3, etc.)
     - Bullet and numbered lists
     - Links
     - Images (click image icon to upload)
     - Colors and text formatting
     - Blockquotes
     - Code blocks

5. **Set Status**
   - **Draft**: Hidden from public, you can keep working on it
   - **Published**: Visible to everyone on the website

6. **Add Optional Details** (sidebar):
   - **Featured Image**: URL to the main image
   - **Author**: Who wrote the article
   - **Category**: e.g., "Analysis", "News", "Opinion"
   - **Region**: e.g., "England", "Surrey", "London"
   - **Publication Date**: When it should be published
   - **Feature Article**: Check to highlight it

7. **Save**
   - **Save Draft**: Saves but keeps it hidden
   - **Publish**: Makes it live on the website

## Editing an Article

1. Find the article in the list
2. Click the **Edit** icon (pencil)
3. Make your changes
4. Click **Save Draft** or **Publish**

## Preview Mode

- Click **Preview** button to see how it will look on the website
- Click **Edit** to go back to editing

## Tips for Non-Technical Users

### ✅ DO:
- Use the toolbar buttons for formatting (don't worry about HTML)
- Save drafts frequently while writing
- Use Preview to check how it looks
- Add an excerpt - it helps people find your article
- Use clear, descriptive titles

### ❌ DON'T:
- Don't worry about the "slug" - it's auto-generated
- Don't delete articles unless you're sure
- Don't publish until you're ready (use Draft mode)

## Rich Text Editor Features

The editor toolbar includes:

1. **Text Formatting**
   - Bold, Italic, Underline, Strikethrough
   - Text color and background color
   - Font sizes

2. **Structure**
   - Headings (H1-H6)
   - Bullet lists
   - Numbered lists
   - Indentation

3. **Content**
   - Links (highlight text, click link icon)
   - Images (click image icon, upload from computer)
   - Blockquotes
   - Code blocks

4. **Alignment**
   - Left, Center, Right, Justify

## Common Questions

**Q: How do I add an image?**
A: Click the image icon in the toolbar, then select a file from your computer. It will upload automatically.

**Q: What's the difference between Draft and Published?**
A: Draft = hidden, only you can see it. Published = visible to everyone on the website.

**Q: What is a "slug"?**
A: The URL-friendly version of your title. Auto-generated, but you can edit it. Example: "Understanding LGR" becomes "understanding-lgr"

**Q: Can I edit an article after publishing?**
A: Yes! Just click Edit, make changes, and click Publish again.

**Q: How do I delete an article?**
A: Click the trash icon, then confirm. **Warning:** This cannot be undone!

**Q: What should I put in "Category" and "Region"?**
A: These are optional but help organize articles. Use whatever makes sense for your content.

## Need Help?

If you're stuck:
1. Try the Preview button to see how it looks
2. Save as Draft if you're not ready to publish
3. Contact your website administrator

## Security

- Both interfaces are password-protected
- Only authorized staff can access them
- All changes are logged for security

---

**Last Updated:** January 2025
**Version:** 2.0 (Enhanced with Articles in Main Dashboard)

