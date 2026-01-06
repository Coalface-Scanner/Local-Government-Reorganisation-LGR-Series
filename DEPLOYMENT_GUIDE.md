# Deployment Guide

## 🚀 How to Deploy Your Website

Based on your setup, you appear to be using **Netlify** (indicated by `_redirects` file and `netlify-deploy.zip`).

### Option 1: Netlify (Recommended - Auto-Deploy from Git)

#### If you haven't connected your repo yet:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: Complete SEO/GEO optimization and Facts & Data redesign"
   git push origin main  # or your branch name
   ```

2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 or 20 (set in Environment variables if needed)

4. **Add Environment Variables**:
   In Netlify Dashboard → Site settings → Environment variables, add:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_SITE_PASSWORD=your_site_password
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **Deploy**:
   - Netlify will automatically deploy when you push to your main branch
   - Or click "Deploy site" to deploy immediately

6. **Custom Domain** (if using `localgovernmentreorganisation.co.uk`):
   - Go to Site settings → Domain management
   - Add custom domain: `localgovernmentreorganisation.co.uk`
   - Follow DNS configuration instructions

#### If your repo is already connected:

1. **Push your changes**:
   ```bash
   git add .
   git commit -m "feat: Complete SEO/GEO optimization and Facts & Data redesign"
   git push origin main
   ```

2. **Netlify will auto-deploy** - check the Deploys tab

---

### Option 2: Manual Deployment (Any Hosting Platform)

#### Step 1: Build Your Site

```bash
# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with all your production files.

#### Step 2: Test Locally (Optional)

```bash
npm run preview
```

Visit `http://localhost:4173` to test the build.

#### Step 3: Deploy the `dist/` Folder

**For Netlify (Manual)**:
1. Go to Netlify Dashboard
2. Drag and drop the `dist/` folder
3. Or use Netlify CLI: `netlify deploy --prod --dir=dist`

**For Vercel**:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Or connect GitHub repo in Vercel dashboard

**For Other Hosting**:
- Upload the contents of the `dist/` folder to your web server
- Ensure your server supports SPA routing (redirects all routes to `index.html`)

---

### Option 3: Netlify CLI (Command Line)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize** (first time only):
   ```bash
   netlify init
   ```

4. **Deploy**:
   ```bash
   # Build first
   npm run build
   
   # Deploy to production
   netlify deploy --prod --dir=dist
   ```

---

## ⚙️ Important Configuration

### Environment Variables

Make sure these are set in your hosting platform:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_SITE_PASSWORD` - Site password (optional)
- `SUPABASE_SERVICE_ROLE_KEY` - For import scripts (optional, server-side only)

**Note**: Variables starting with `VITE_` are exposed to the browser. Never put secrets there.

### SPA Routing

Your `public/_redirects` file should handle SPA routing:

```
/*    /index.html   200
```

This ensures all routes work correctly in a Single Page Application.

---

## ✅ Post-Deployment Checklist

After deploying:

1. **Test Your Site**:
   - [ ] Home page loads
   - [ ] All navigation links work
   - [ ] Facts & Data page shows 6 cards
   - [ ] Admin interfaces accessible
   - [ ] Articles load correctly

2. **SEO Verification**:
   - [ ] Submit sitemap to Google Search Console
   - [ ] Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [ ] Verify meta tags in page source

3. **Content Upload**:
   - [ ] Upload facts: `npm run upload-facts` (from your local machine)
   - [ ] Verify facts appear on site

4. **Monitor**:
   - [ ] Check Netlify/your hosting dashboard for errors
   - [ ] Monitor Google Search Console for indexing
   - [ ] Test on mobile devices

---

## 🔧 Troubleshooting

### Build Fails

- Check Node version (should be 18+)
- Ensure all dependencies are installed
- Check for TypeScript errors: `npm run typecheck`

### Site Shows White Screen

- Check browser console for errors
- Verify environment variables are set
- Check Supabase connection

### Routes Don't Work

- Ensure `_redirects` file is in `public/` folder
- Verify hosting platform supports SPA routing
- Check that all routes redirect to `index.html`

### Environment Variables Not Working

- Variables must start with `VITE_` to be accessible in browser
- Rebuild after adding new variables
- Check variable names match exactly (case-sensitive)

---

## 📝 Quick Reference

**Build command**: `npm run build`  
**Output directory**: `dist/`  
**Node version**: 18 or 20  
**Framework**: Vite + React

**Your domain**: `localgovernmentreorganisation.co.uk`

