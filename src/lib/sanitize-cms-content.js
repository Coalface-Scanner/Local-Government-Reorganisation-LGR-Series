import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) {
    throw new Error('.env file not found');
  }

  const raw = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

function sanitizeHtml(input) {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
}

async function sanitizeTable(supabase, table, column, key = 'id') {
  const { data, error } = await supabase.from(table).select(`${key}, ${column}`);
  if (error) {
    console.error(`Failed reading ${table}.${column}:`, error.message);
    return { updated: 0, scanned: 0 };
  }

  let updated = 0;
  for (const row of data || []) {
    const original = row[column] || '';
    const sanitized = sanitizeHtml(original);
    if (original !== sanitized) {
      const { error: updateError } = await supabase
        .from(table)
        .update({ [column]: sanitized })
        .eq(key, row[key]);

      if (updateError) {
        console.error(`Update failed for ${table}.${column} ${row[key]}:`, updateError.message);
      } else {
        updated += 1;
      }
    }
  }

  return { updated, scanned: (data || []).length };
}

async function main() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const supabase = createClient(url, serviceKey);
  const tasks = [
    ['articles', 'body'],
    ['news', 'content'],
    ['news', 'embed_code'],
    ['facts', 'content'],
    ['about_pages', 'content'],
    ['article_qa', 'answer'],
    ['page_content', 'content'],
  ];

  console.log('Starting one-time CMS content sanitization...');
  for (const [table, column] of tasks) {
    const result = await sanitizeTable(supabase, table, column);
    console.log(`- ${table}.${column}: scanned=${result.scanned}, updated=${result.updated}`);
  }
  console.log('Done.');
}

main().catch((error) => {
  console.error('sanitize-cms-content failed:', error.message);
  process.exit(1);
});
