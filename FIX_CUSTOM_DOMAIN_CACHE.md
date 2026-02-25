# Fixing Custom Domain Cache Issue

Your site is deployed to `https://localgovernmentreorganisation.netlify.app/` but the custom `.co.uk` domain is showing old content. This is a CDN caching issue.

## Quick Fix: Purge CDN Cache for Custom Domain

### Option 1: Via Netlify Dashboard (Easiest)

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings → Domain Management**
3. Find your custom domain (`.co.uk`)
4. Look for a **"Purge cache"** or **"Clear cache"** button
5. Click it to purge the CDN cache for that domain

### Option 2: Via Netlify API

Purge the CDN cache using the Netlify API:

```bash
curl -X POST \
  -H "Authorization: Bearer <your_netlify_token>" \
  -H "Content-Type: application/json" \
  -d '{"site_id": "<your_site_id>"}' \
  'https://api.netlify.com/api/v1/purge'
```

**To get your site ID:**
- Go to Site Settings → General
- Copy the "Site ID" (looks like: `3970e0fe-8564-4903-9a55-c5f8de49fb8b`)

**To get your Netlify token:**
- Go to User Settings → Applications → Personal access tokens
- Create a new token with "Purge cache" permissions

### Option 3: Purge Specific Domain

If you have multiple domains, you can target the specific `.co.uk` domain:

```bash
curl -X POST \
  -H "Authorization: Bearer <your_netlify_token>" \
  -H "Content-Type: application/json" \
  -d '{"site_slug": "localgovernmentreorganisation"}' \
  'https://api.netlify.com/api/v1/purge'
```

## Verify Domain Configuration

While you're at it, verify your custom domain is properly configured:

1. **Site Settings → Domain Management**
   - Check that your `.co.uk` domain is listed
   - Verify it shows as "Active" or "Verified"
   - Check DNS settings are correct

2. **DNS Settings**
   - Make sure DNS records point to Netlify
   - For apex domain: A record pointing to Netlify's IP
   - For www subdomain: CNAME pointing to your Netlify site

## After Purging Cache

1. **Wait 1-2 minutes** for the purge to propagate
2. **Hard refresh** your browser:
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`
3. **Test in incognito/private mode** to bypass browser cache
4. **Check different browsers** to confirm

## If Still Not Working

### Check Domain Assignment
1. Go to **Deploys** tab
2. Find the latest successful deploy
3. Check if it shows your custom domain in the "Published" section
4. If not, the domain might not be assigned to the latest deploy

### Force Domain Update
1. Go to **Site Settings → Domain Management**
2. Remove the custom domain (temporarily)
3. Wait 30 seconds
4. Re-add the custom domain
5. This forces Netlify to re-associate the domain with the latest deploy

### Check DNS Propagation
Use a DNS checker tool to verify DNS is pointing correctly:
- https://dnschecker.org/
- Enter your `.co.uk` domain
- Verify it resolves to Netlify's servers

## Browser Cache

If the CDN cache is cleared but you still see old content:

1. **Clear browser cache** completely
2. **Use incognito/private mode**
3. **Try a different browser**
4. **Check from a different network** (mobile data, different WiFi)

## Expected Result

After purging the cache, both domains should show the same content:
- ✅ `https://localgovernmentreorganisation.netlify.app/` (already working)
- ✅ `https://localgovernmentreorganisation.co.uk/` (should work after cache purge)
