# Debugging White Screen Issue

A white screen usually means there's a JavaScript error preventing React from rendering.

## Quick Checks:

### 1. Check Browser Console
**Most Important!** Open your browser's developer console:
- **Chrome/Edge**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Firefox**: Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)
- **Safari**: Enable Developer menu first, then `Cmd+Option+C`

Look for **red error messages**. Common errors:
- "Missing Supabase environment variables" → `.env` file issue
- "Failed to fetch" → Database connection issue
- Any other red errors → Share the exact error message

### 2. Check Environment Variables

Make sure your `.env` file exists and has values:

```bash
# In your project root
cat .env
```

Should show:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

**If missing or empty:**
1. Create `.env` file in project root
2. Add your Supabase credentials
3. **Restart the dev server** (stop with Ctrl+C, then `npm run dev` again)

### 3. Check Dev Server is Running

Make sure you started the dev server:
```bash
npm run dev
```

Should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 4. Check Network Tab

In browser DevTools:
1. Go to **Network** tab
2. Refresh the page
3. Look for failed requests (red)
4. Check if `index.html` loads (should be 200)
5. Check if JavaScript files load

### 5. Common Issues & Fixes

#### Issue: "Missing Supabase environment variables"
**Fix:**
- Create `.env` file with your Supabase credentials
- Restart dev server

#### Issue: "Failed to fetch" or CORS errors
**Fix:**
- Check Supabase URL is correct
- Check Supabase project is active
- Verify RLS policies allow public access

#### Issue: No errors but white screen
**Fix:**
- Check if `index.html` has `<div id="root"></div>`
- Check if React is mounting (look for root element in Elements tab)
- Try hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

#### Issue: Error boundary showing
**Fix:**
- The error boundary should show an error message
- Check what the error says
- Share the error with me

### 6. Test Basic Connection

Try this in browser console (after page loads):
```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

### 7. Minimal Test

Create a test file to see if React works:

1. Temporarily replace `src/App.tsx` content with:
```tsx
export default function App() {
  return <div>Hello World - React is working!</div>;
}
```

2. If you see "Hello World", React works - the issue is in your app code
3. If still white screen, it's a React/build issue

## What to Share:

If you're still stuck, share:
1. **Browser console errors** (copy/paste the red error messages)
2. **Network tab** - any failed requests?
3. **Environment variables** - are they set? (don't share the actual values!)
4. **Dev server output** - any errors when starting?

## Quick Fixes to Try:

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`
   - Or clear cache in browser settings

3. **Check .env file:**
   ```bash
   ls -la .env
   cat .env  # Check it has values
   ```

4. **Rebuild:**
   ```bash
   npm run build
   npm run preview
   ```

Most likely cause: **Missing or incorrect environment variables**. Check your `.env` file first!

