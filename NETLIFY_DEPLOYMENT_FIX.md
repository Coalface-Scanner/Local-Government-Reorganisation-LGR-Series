# Fixing Netlify Deployment Issues

If Netlify is deploying an old version of your site, follow these steps:

## Step 1: Push Your Latest Commit

First, make sure your latest commit is pushed to GitHub:

```bash
git push origin main
```

## Step 2: Verify Netlify Settings

In your Netlify dashboard, check:

1. **Site Settings > Build & Deploy**
   - **Branch to deploy**: Should be `main` (or your production branch)
   - **Build command**: Should be `npm run build`
   - **Publish directory**: Should be `dist`

2. **Deploy Settings**
   - Make sure "Deploy only the production branch" is set correctly
   - Check that the branch matches your GitHub branch name

## Step 3: Clear Build Cache

Netlify might be using cached build files. To clear the cache:

1. Go to **Site Settings > Build & Deploy > Build settings**
2. Click **"Clear cache and deploy site"** button
3. Or trigger a new deploy with "Clear cache" option checked

## Step 4: Manual Redeploy

1. Go to **Deploys** tab in Netlify dashboard
2. Click **"Trigger deploy"** → **"Deploy site"**
3. This will rebuild from the latest commit

## Step 5: Check Build Logs

1. Go to **Deploys** tab
2. Click on the latest deploy
3. Check the build logs for errors
4. Look for:
   - Build command execution
   - Any error messages
   - Which commit is being built

## Step 6: Verify Environment Variables

Make sure all required environment variables are set in Netlify:

1. Go to **Site Settings > Environment variables**
2. Verify these are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_PASSWORD` (if used)
   - `VITE_ADMIN_PASSWORD` (if used)

## Step 7: Check Branch Protection

If you're using branch protection:
- Make sure Netlify is connected to the correct branch
- Check if there are any branch restrictions

## Step 8: Force Rebuild

If nothing else works:

1. In Netlify dashboard, go to **Deploys**
2. Find the commit you want to deploy
3. Click the **"..."** menu next to it
4. Select **"Redeploy"** or **"Trigger deploy"**

## Quick Fix Checklist

- [ ] Latest commit pushed to GitHub (`git push origin main`)
- [ ] Netlify branch setting matches your GitHub branch
- [ ] Build command is `npm run build`
- [ ] Publish directory is `dist`
- [ ] Cleared build cache
- [ ] Triggered manual redeploy
- [ ] Checked build logs for errors
- [ ] Verified environment variables are set

## Common Issues

### Issue: Netlify building from wrong branch
**Solution**: Check Site Settings > Build & Deploy > Branch to deploy

### Issue: Build cache is stale
**Solution**: Clear cache and redeploy

### Issue: Environment variables missing
**Solution**: Add them in Site Settings > Environment variables

### Issue: Build command failing
**Solution**: Check build logs, ensure `npm install` runs before `npm run build`

### Issue: Old files in dist directory
**Solution**: Clear cache and rebuild

## Testing After Fix

After redeploying:
1. Wait for build to complete (check Netlify dashboard)
2. Visit your site URL
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear browser cache
4. Check browser DevTools > Network tab to verify new files are loading
