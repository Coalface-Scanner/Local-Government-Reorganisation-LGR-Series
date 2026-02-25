# Deploy to Netlify - Quick Guide

Since your Bolt.New project has the old version, let's deploy this updated version to Netlify instead.

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub (if not already)

```bash
# Add all changes
git add .

# Commit
git commit -m "feat: Complete SEO/GEO optimization and Facts & Data redesign"

# Push to GitHub
git push origin main
```

### Step 2: Connect to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. **Sign in** (or create account)
3. **Add new site** → **Import an existing project**
4. **Connect to GitHub** and select your repository
5. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click **Deploy site**

### Step 3: Add Environment Variables

After deployment starts, go to:
**Site settings** → **Environment variables** → **Add variable**

Add these:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SITE_PASSWORD=your_site_password
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: After adding environment variables, go to **Deploys** tab and click **Trigger deploy** → **Clear cache and deploy site** to rebuild with the new variables.

### Step 4: Set Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter: `localgovernmentreorganisation.co.uk`
4. Follow DNS configuration instructions

## ✅ That's It!

Netlify will:
- Auto-deploy when you push to GitHub
- Handle SPA routing automatically (your `_redirects` file)
- Provide HTTPS automatically
- Give you a free subdomain (e.g., `your-site.netlify.app`)

## 🔄 Future Updates

Just push to GitHub and Netlify auto-deploys:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

