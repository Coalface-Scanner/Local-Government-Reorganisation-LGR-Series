#!/usr/bin/env node
/**
 * Pre-renders /faq into dist/faq/index.html at build time.
 * Run after `vite build`. Uses Puppeteer to render the SPA at /faq and save the HTML.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 34567;

if (!existsSync(DIST)) {
  console.error('prerender-faq: dist/ not found. Run `vite build` first.');
  process.exit(1);
}

async function run() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.warn('prerender-faq: puppeteer not installed. Skipping. Install with: npm i -D puppeteer');
    process.exit(0);
  }

  // Start vite preview to serve the built app
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let started = false;
  preview.stdout?.on('data', (d) => {
    const s = d.toString();
    if (s.includes('localhost') || s.includes(PORT)) started = true;
  });
  preview.stderr?.on('data', (d) => {
    const s = d.toString();
    if (s.includes('localhost') || s.includes(PORT)) started = true;
  });

  await new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve(), 5000);
    const check = () => {
      if (started) {
        clearTimeout(t);
        resolve();
      }
    };
    preview.stdout?.on('data', check);
    preview.stderr?.on('data', check);
  });

  await new Promise((r) => setTimeout(r, 2000));

  let browser;
  try {
    browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/faq`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('[data-faq-page]', { timeout: 15000 });
    let html = await page.content();
    // Use production URL for canonical, og:url, og:image etc. (Netlify sets URL/DEPLOY_PRIME_URL)
    const siteUrl = (process.env.VITE_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://localgovernmentreorganisation.co.uk').replace(/\/$/, '');
    html = html.replace(/https?:\/\/localhost(?::\d+)?/g, siteUrl);
    const faqDir = join(DIST, 'faq');
    mkdirSync(faqDir, { recursive: true });
    writeFileSync(join(faqDir, 'index.html'), html, 'utf8');
    console.log('prerender-faq: wrote dist/faq/index.html');
  } finally {
    if (browser) await browser.close();
    preview.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('prerender-faq:', err);
  process.exit(1);
});
