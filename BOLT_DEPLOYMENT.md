# Deploying to Bolt.New

Yes! You can deploy to Bolt.New. Here's how:

## 🚀 Quick Deployment Steps

### Option 1: Deploy via Bolt.New Dashboard (Easiest)

1. **Build your project locally**:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder.

2. **Go to Bolt.New Dashboard**:
   - Log in to your Bolt.New account
   - Navigate to your project (or create a new one)

3. **Upload the `dist/` folder**:
   - Bolt.New should accept the built files from the `dist/` directory
   - Upload all contents of the `dist/` folder

4. **Set Environment Variables**:
   In Bolt.New project settings, add:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_SITE_PASSWORD=your_site_password
   ```

### Option 2: Connect GitHub Repository

If Bolt.New supports GitHub integration:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect in Bolt.New**:
   - Go to Bolt.New dashboard
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

### Option 3: Deploy via Bolt.New CLI (if available)

If Bolt.New has a CLI:

```bash
# Build first
npm run build

# Deploy (check Bolt.New docs for exact command)
bolt deploy --dir=dist
```

## ⚙️ Important Configuration

### Environment Variables

Make sure these are set in Bolt.New:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_PASSWORD` (optional)
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for scripts)

### SPA Routing

Ensure Bolt.New is configured to:
- Serve `index.html` for all routes (SPA routing)
- Your `public/_redirects` file should handle this, but verify Bolt.New supports it

## 📝 What to Upload

If uploading manually, upload the **entire contents** of the `dist/` folder:
- `index.html`
- `assets/` folder
- All other files from `dist/`

## ✅ After Deployment

1. **Test your site**:
   - Visit your Bolt.New URL
   - Test all pages
   - Verify admin interfaces work

2. **Update domain** (if using custom domain):
   - Configure `localgovernmentreorganisation.co.uk` in Bolt.New settings
   - Update DNS as instructed

3. **Upload content**:
   - Run `npm run upload-facts` from your local machine
   - Content will be stored in Supabase, so it will appear on your live site

## 🔧 Troubleshooting

### Routes Don't Work

- Ensure Bolt.New is configured for SPA routing
- All routes should serve `index.html`
- Check Bolt.New documentation for SPA configuration

### Environment Variables Not Working

- Variables must start with `VITE_` to be accessible in browser
- Rebuild/redeploy after adding variables
- Check variable names match exactly

### Build Issues

- Ensure Node.js 18+ is available in Bolt.New
- Check build logs in Bolt.New dashboard
- Verify all dependencies are in `package.json`

## 📚 Need Help?

Check Bolt.New documentation for:
- Build configuration
- Environment variable setup
- Custom domain configuration
- SPA routing setup

