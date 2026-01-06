# Local Government Reorganisation (LGR) Insights Website

A comprehensive website providing expert analysis and insights on local government reorganisation in England. Built with React, TypeScript, Vite, and Supabase.

## Features

- **Content Management**: Full-featured CMS for managing articles, facts, lessons, interviews, and materials
- **Search & Discovery**: Advanced search functionality with filtering by type, region, category, and author
- **Interactive Maps**: Council boundary visualization using Leaflet
- **Admin Dashboard**: Secure admin interface for content management
- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags, structured data, and sitemap support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Maps**: Leaflet, React Leaflet
- **Rich Text Editor**: React Quill
- **Deployment**: Netlify

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Netlify account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Local-Government-Reorganisation-LGR-Series
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Site Password Protection
# If set, the entire site will be password-protected
VITE_SITE_PASSWORD=

# Optional - Admin Article Editor Password
# Password for accessing /admin/articles/login
VITE_ADMIN_PASSWORD=
```

**Getting Supabase Credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### 4. Database Setup

The project includes database migrations in the `supabase/migrations` directory. Apply these migrations to your Supabase database:

1. Go to Supabase Dashboard > SQL Editor
2. Run each migration file in order (they are timestamped)
3. Or use the Supabase CLI: `supabase db push`

**Important Tables:**
- `articles` - Main article content
- `materials` - Legacy materials/documents
- `facts`, `lessons`, `reasons`, `interviews` - Content sections
- `admin_users` - Admin user management
- `cms_audit_log` - Audit trail for CMS changes
- `subscriptions` - Email subscriptions
- `site_updates` - Site update notifications
- `faqs` - Frequently asked questions

### 5. Storage Buckets

Create the following storage buckets in Supabase:
- `article-images` - For article featured images and content images

Set appropriate RLS policies for public read access.

## Development

### Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/                 # Static assets
│   ├── _redirects          # Netlify redirect rules
│   └── ...
├── src/
│   ├── components/         # React components
│   ├── contexts/           # React contexts (Auth, AdminAuth)
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin CMS pages
│   │   └── ...             # Public pages
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/          # Database migrations
└── ...
```

## Admin Access

### Main CMS Admin (`/admin/login`)

Uses Supabase Authentication. Admin users must be:
1. Created in Supabase Auth
2. Added to the `admin_users` table

**Default Admin Credentials** (change immediately):
- Email: `rowan@coalfaceengagement.co.uk`
- Password: `MapleLeaf1988!`

### Article Editor (`/admin/articles/login`)

Uses session-based authentication with `VITE_ADMIN_PASSWORD`.

**Default Password** (change immediately):
- Password: `admin123`

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for detailed admin documentation.

## Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_PASSWORD` (optional)
   - `VITE_ADMIN_PASSWORD` (optional)
4. Deploy!

### Redirects

The `public/_redirects` file handles:
- SPA routing (all routes → `index.html`)
- Legacy URL redirects (`/insights-article/*` → `/insights/:splat`)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous/public key |
| `VITE_SITE_PASSWORD` | No | Site-wide password protection |
| `VITE_ADMIN_PASSWORD` | No | Article editor admin password |

## Security

- **Row Level Security (RLS)**: Enabled on all database tables
- **Admin Access Control**: Only users in `admin_users` table can modify content
- **Audit Logging**: All CMS changes are logged in `cms_audit_log`
- **Environment Variables**: Never commit `.env` files (already in `.gitignore`)

## Troubleshooting

### Build Errors

- Ensure all environment variables are set
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run typecheck`

### Database Connection Issues

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Verify RLS policies allow necessary access

### Admin Access Issues

- Verify user exists in Supabase Auth
- Check user is in `admin_users` table
- Review RLS policies for admin tables

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license here]

## Support

For technical support or questions, please contact the development team.
