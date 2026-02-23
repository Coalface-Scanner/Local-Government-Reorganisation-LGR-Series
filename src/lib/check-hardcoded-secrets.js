import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const TARGET_DIR = join(ROOT, 'supabase', 'functions');

const bannedPatterns = [
  /const\s+\w*(password|email)\w*\s*=\s*['"][^'"]+['"]/i,
  /temporarypassword\s*[:=]\s*['"][^'"]+['"]/i,
  /newpassword\s*[:=]\s*['"][^'"]+['"]/i,
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.ts') || full.endsWith('.js')) out.push(full);
  }
  return out;
}

const files = walk(TARGET_DIR);
const violations = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of bannedPatterns) {
    if (pattern.test(content)) {
      violations.push(file.replace(ROOT + '/', ''));
      break;
    }
  }
}

if (violations.length > 0) {
  console.error('Hardcoded credential-like assignments found in function code:');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('No hardcoded credential-like assignments detected in supabase/functions.');
