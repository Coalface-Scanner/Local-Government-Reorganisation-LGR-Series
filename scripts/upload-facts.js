import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from .env file
function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
// Service role key bypasses RLS - needed for import scripts
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing Supabase URL!');
  console.error('Make sure VITE_SUPABASE_URL is set in .env file');
  process.exit(1);
}

// Use service role key if available (bypasses RLS), otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
  console.error('❌ Missing Supabase key!');
  console.error('Set either VITE_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in .env file');
  console.error('\n💡 For import scripts, SUPABASE_SERVICE_ROLE_KEY is recommended');
  console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

if (supabaseServiceKey) {
  console.log('🔑 Using service role key (bypasses RLS)');
} else {
  console.log('⚠️  Using anon key - may have RLS restrictions');
}

async function uploadFacts() {
  const factsDir = join(projectRoot, 'content-to-upload', 'facts');
  
  if (!existsSync(factsDir)) {
    console.log('📁 Creating facts directory...');
    const { mkdirSync } = await import('fs');
    mkdirSync(factsDir, { recursive: true });
    console.log('✅ Created content-to-upload/facts/ directory');
    console.log('📝 Please add your fact JSON files to this directory and run the script again.');
    return;
  }

  try {
    const files = readdirSync(factsDir).filter(f => extname(f) === '.json');
    
    if (files.length === 0) {
      console.log('📁 No fact files found in content-to-upload/facts/');
      console.log('💡 Create JSON files with your facts data. See example-fact.json for format.');
      return;
    }

    console.log(`\n📊 Found ${files.length} fact file(s)...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const filePath = join(factsDir, file);
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      console.log(`Uploading: ${content.title || file}...`);

      // Handle both single fact and array of facts
      const factsToUpload = Array.isArray(content) ? content : [content];

      for (const fact of factsToUpload) {
        try {
          // Check if fact with same title already exists
          const { data: existing } = await supabase
            .from('facts')
            .select('id')
            .eq('title', fact.title)
            .maybeSingle();

          if (existing) {
            // Update existing fact
            const { error: updateError } = await supabase
              .from('facts')
              .update({
                content: fact.content,
                category: fact.category || null,
                order_index: fact.order_index || 0,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);

            if (updateError) {
              console.error(`  ❌ Error updating: ${updateError.message}`);
              errorCount++;
            } else {
              console.log(`  🔄 Updated existing fact: ${fact.title}`);
              successCount++;
            }
          } else {
            // Insert new fact
            const { error: insertError } = await supabase
              .from('facts')
              .insert({
                title: fact.title,
                content: fact.content,
                category: fact.category || null,
                order_index: fact.order_index || 0,
              });

            if (insertError) {
              console.error(`  ❌ Error: ${insertError.message}`);
              errorCount++;
            } else {
              console.log(`  ✅ Uploaded successfully!`);
              successCount++;
            }
          }
        } catch (err) {
          console.error(`  ❌ Error processing fact: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✅ Upload complete!`);
    console.log(`   Success: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`);
    }
  } catch (error) {
    console.error('❌ Error reading facts directory:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting facts upload...\n');
  await uploadFacts();
  console.log('\n✨ Done!');
}

main().catch(console.error);
