/**
 * List all published article titles from Supabase.
 * Loads .env from project root so VITE_SUPABASE_* are set.
 * Run: node scripts/list-articles.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('articles')
    .select('title, slug, published_date, status')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error.message);
    process.exit(1);
  }

  const published = (data || []).filter((a) => a.status === 'published');
  console.log(`Published articles (${published.length}):\n`);
  published.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title}`);
    console.log(`   /insights/${a.slug}${a.published_date ? ` (${a.published_date.split('T')[0]})` : ''}`);
  });

  const drafts = (data || []).filter((a) => a.status !== 'published');
  if (drafts.length > 0) {
    console.log(`\nDraft/unpublished (${drafts.length}):\n`);
    drafts.forEach((a, i) => {
      console.log(`${i + 1}. ${a.title} [${a.status}]`);
    });
  }
}

main();
