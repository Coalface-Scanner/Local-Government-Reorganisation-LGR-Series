# Netlify Edge Functions

This directory contains Netlify Edge Functions that run at the edge for improved performance.

## RSS Proxy (`rss-proxy.ts`)

Proxies RSS feeds from external sources (like Anchor.fm) to avoid CORS issues when fetching from the browser.

### Usage

The edge function is automatically available at `/rss-proxy` when deployed to Netlify.

### Local Development

For local development with Netlify Dev:

```bash
npm install -g netlify-cli
netlify dev
```

This will start the development server with edge functions support.

### Production

The edge function is automatically deployed with your site when you push to the connected Git repository.
