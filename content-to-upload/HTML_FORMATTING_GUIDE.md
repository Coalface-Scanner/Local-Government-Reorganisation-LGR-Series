# HTML Formatting Guide for Articles

Yes! Article bodies support **full HTML formatting**. You can use any HTML tags in the `body` field.

## Supported Formatting:

### Text Formatting:
```html
<p>Regular paragraph</p>
<strong>Bold text</strong>
<em>Italic text</em>
<u>Underlined text</u>
<s>Strikethrough</s>
<span style="color: #ff0000;">Colored text</span>
<span style="background-color: #ffff00;">Highlighted text</span>
```

### Headings:
```html
<h1>Main Heading (H1)</h1>
<h2>Subheading (H2)</h2>
<h3>Section Heading (H3)</h3>
<h4>Subsection (H4)</h4>
<h5>Minor Heading (H5)</h5>
<h6>Smallest Heading (H6)</h6>
```

### Lists:
```html
<!-- Unordered (bullet) list -->
<ul>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</ul>

<!-- Ordered (numbered) list -->
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>
```

### Links:
```html
<a href="https://example.com">Link text</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Opens in new tab</a>
```

### Images:
```html
<img src="https://example.com/image.jpg" alt="Image description" />
<img src="https://example.com/image.jpg" alt="Description" width="500" height="300" />
```

### Blockquotes:
```html
<blockquote>
  <p>This is a quote or important highlight.</p>
</blockquote>
```

### Code:
```html
<!-- Inline code -->
<code>code snippet</code>

<!-- Code block -->
<pre><code>function example() {
  return "code block";
}</code></pre>
```

### Tables:
```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
  </tbody>
</table>
```

### Divs and Spans:
```html
<div style="background-color: #f0f0f0; padding: 20px;">
  <p>Content in a styled container</p>
</div>

<span style="font-size: 18px; font-weight: bold;">Styled text</span>
```

## Complete Example:

```json
{
  "title": "Fully Formatted Article",
  "slug": "formatted-article",
  "excerpt": "An example of rich HTML formatting",
  "body": "<h1>Article Title</h1><p>This is the introduction paragraph with <strong>important</strong> information.</p><h2>Main Section</h2><p>Here's some content with <em>emphasis</em> and a <a href=\"https://example.com\">link</a>.</p><ul><li>First point</li><li>Second point</li><li>Third point</li></ul><blockquote><p>This is an important quote or highlight.</p></blockquote><h3>Subsection</h3><p>More content here. You can add <span style=\"color: #0066cc;\">colored text</span> and <span style=\"background-color: #ffff00;\">highlighted text</span>.</p><p><img src=\"https://example.com/image.jpg\" alt=\"Example image\" /></p><pre><code>// Code example\nconst example = \"code\";</code></pre>",
  "status": "published",
  "published_date": "2024-01-15T00:00:00Z"
}
```

## Tips:

1. **Escape JSON properly**: In JSON files, you need to escape quotes:
   ```json
   "body": "<p>He said \"Hello\"</p>"
   ```

2. **Use proper HTML**: Make sure tags are closed properly

3. **Images**: Use full URLs (https://...) or Supabase storage URLs

4. **Styling**: You can use inline styles or rely on the site's CSS

5. **Copy from Word/Google Docs**: You can copy formatted text and paste it - most editors will convert it to HTML

## The Editor Also Supports:

When editing in the admin panel, you get a full WYSIWYG editor with:
- Headers (H1-H6)
- Bold, italic, underline, strikethrough
- Text colors and backgrounds
- Lists (ordered and unordered)
- Alignment (left, center, right, justify)
- Blockquotes
- Code blocks
- Links
- Images (with upload to Supabase storage)
- And more!

So yes, your articles can be **fully formatted** with rich HTML content! 🎨

