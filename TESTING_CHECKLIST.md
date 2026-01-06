# Testing Checklist

This checklist should be completed to verify the website is fit for purpose. Test in both development and production environments.

## Prerequisites

- [ ] All environment variables are set correctly
- [ ] Database migrations have been applied
- [ ] Supabase connection is working
- [ ] Build completes successfully (`npm run build`)

## Route Testing

### Basic Routes
- [ ] `/` - Home page loads correctly
- [ ] `/library` - Search/library page loads
- [ ] `/materials` - Materials page loads
- [ ] `/facts` - Facts page loads
- [ ] `/lessons` - Lessons page loads
- [ ] `/reasons` - Reasons page loads
- [ ] `/about` - About page loads (redirects to reasons)
- [ ] `/interviews` - Interviews page loads
- [ ] `/surrey` - Surrey page loads
- [ ] `/100days` - Hundred Days page loads
- [ ] `/contact` - Contact page loads
- [ ] `/councils` - Councils page with map loads
- [ ] `/subscribe` - Subscribe page loads
- [ ] `/unsubscribe` - Unsubscribe page loads
- [ ] `/news` - News page loads
- [ ] `/insights` - Insights page loads

### Dynamic Routes
- [ ] `/article/:slug` - Article pages load from materials table
- [ ] `/insights/:slug` - Insight articles load from articles table
- [ ] Invalid slugs show 404/not found page

### Admin Routes
- [ ] `/admin/login` - Admin login page loads
- [ ] `/admin/dashboard` - Dashboard loads (requires auth)
- [ ] `/admin/articles/login` - Article editor login loads
- [ ] `/admin/articles` - Article editor loads (requires auth)

### Redirects (Netlify)
- [ ] `/insights-article/*` redirects to `/insights/:splat`
- [ ] All other routes fallback to `index.html` (SPA routing)

## Authentication Testing

### Supabase Auth (Main CMS)
- [ ] Can log in with valid admin credentials at `/admin/login`
- [ ] Invalid credentials show error message
- [ ] After login, can access `/admin/dashboard`
- [ ] Can log out successfully
- [ ] Session persists on page refresh
- [ ] Non-admin users cannot access admin pages

### Session-Based Auth (Article Editor)
- [ ] Can log in with `VITE_ADMIN_PASSWORD` at `/admin/articles/login`
- [ ] Invalid password shows error message
- [ ] After login, can access `/admin/articles`
- [ ] Can log out successfully
- [ ] Session persists on page refresh
- [ ] If `VITE_ADMIN_PASSWORD` not set, any password works (development mode)

### Site Password Protection
- [ ] If `VITE_SITE_PASSWORD` is set, site requires password
- [ ] Correct password grants access
- [ ] Incorrect password shows error
- [ ] Session persists after authentication
- [ ] If `VITE_SITE_PASSWORD` not set, site is accessible without password

## Database & Supabase Verification

### Connection
- [ ] Supabase connection works (check browser console for errors)
- [ ] All tables are accessible
- [ ] RLS policies are active

### Migrations
- [ ] All 24 migrations in `supabase/migrations` have been applied
- [ ] No migration errors in Supabase dashboard
- [ ] Database schema matches expected structure

### RLS Policies
- [ ] Public users can only read published content
- [ ] Authenticated users can read all content
- [ ] Only admin users can modify content
- [ ] Non-admin users cannot insert/update/delete

### Storage
- [ ] `article-images` bucket exists
- [ ] Images can be uploaded
- [ ] Images are accessible publicly

## Functional Testing

### Home Page
- [ ] Page loads without errors
- [ ] Site updates display correctly
- [ ] Navigation works
- [ ] Subscription form submits successfully
- [ ] FAQ section displays FAQs for home page
- [ ] All links work correctly

### Article Pages
- [ ] Articles load from correct table (`materials` for `/article/:slug`, `articles` for `/insights/:slug`)
- [ ] Article content displays correctly
- [ ] Rich content renders properly
- [ ] Images display correctly
- [ ] Share buttons work
- [ ] Meta tags are correct
- [ ] Read count increments (check database)
- [ ] Navigation back works

### Search & Filtering
- [ ] Search input works
- [ ] Search returns results from all content types
- [ ] Filters (type, region, category, author) work
- [ ] Results display correctly
- [ ] Clicking result navigates to correct page
- [ ] Empty search shows appropriate message
- [ ] Error handling works (test with network offline)

### Admin CMS
- [ ] Can create new articles
- [ ] Can edit existing articles
- [ ] Can delete articles
- [ ] Can upload images
- [ ] Rich text editor works
- [ ] Changes save successfully
- [ ] Preview mode works
- [ ] Slug generation works
- [ ] Duplicate slug detection works

### Other Pages
- [ ] Councils page: Map loads and displays councils
- [ ] Materials page: Lists materials correctly
- [ ] Facts page: Displays facts
- [ ] Lessons page: Displays lessons
- [ ] Reasons page: Displays reasons
- [ ] Interviews page: Displays interviews
- [ ] Contact page: Form works (if implemented)
- [ ] Subscribe: Form submits successfully
- [ ] Unsubscribe: Process works correctly

## Error Handling

### Network Errors
- [ ] Offline state handled gracefully
- [ ] API errors show user-friendly messages
- [ ] Loading states display correctly
- [ ] Error boundary catches unhandled errors

### Missing Data
- [ ] Missing articles show 404/not found
- [ ] Empty lists show appropriate empty states
- [ ] Missing images handled gracefully

## Browser & Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Devices
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design works on mobile
- [ ] Touch interactions work

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels where needed

## Performance

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Navigation is smooth
- [ ] Images load efficiently
- [ ] No console errors

### Bundle Size
- [ ] Run `npm run build` and check bundle size
- [ ] Verify no unnecessary large dependencies

## Security

### Environment Variables
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets in code
- [ ] Production environment variables set correctly

### Authentication
- [ ] Admin passwords are strong
- [ ] Session storage is secure
- [ ] Auth tokens handled securely

### API Security
- [ ] RLS policies prevent unauthorized access
- [ ] Public users cannot modify content
- [ ] Admin endpoints are protected

## Production Deployment

### Netlify
- [ ] Build succeeds
- [ ] Environment variables set in Netlify dashboard
- [ ] Redirects work correctly
- [ ] Site is accessible
- [ ] HTTPS enabled

### Post-Deployment
- [ ] All routes work in production
- [ ] Database connection works
- [ ] Images load correctly
- [ ] Admin access works
- [ ] No console errors

## Notes

- Test with actual data in database
- Test with empty database
- Test with various user roles
- Document any issues found
- Retest after fixes

