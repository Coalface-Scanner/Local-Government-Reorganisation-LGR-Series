import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from .env file
function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) {
    throw new Error('.env file not found!');
  }
  
  const envContent = readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadArticles() {
  const articlesDir = join(projectRoot, 'content-to-upload', 'articles');
  
  try {
    const files = readdirSync(articlesDir).filter(f => extname(f) === '.json');
    
    if (files.length === 0) {
      console.log('📁 No article files found in content-to-upload/articles/');
      return;
    }

    console.log(`\n📰 Found ${files.length} article file(s)...\n`);

    for (const file of files) {
      const filePath = join(articlesDir, file);
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      console.log(`Uploading: ${content.title || file}...`);

      const { data, error } = await supabase
        .from('articles')
        .upsert({
          title: content.title,
          slug: content.slug,
          excerpt: content.excerpt || null,
          body: content.body || null,
          featured_image: content.featured_image || null,
          status: content.status || 'published',
          published_date: content.published_date || new Date().toISOString(),
          featured: content.featured || false,
          author: content.author || null,
          category: content.category || null,
          region: content.region || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        });

      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
      } else {
        console.log(`  ✅ Uploaded successfully!`);
      }
    }
  } catch (error) {
    console.error('Error reading articles directory:', error.message);
  }
}

async function uploadMaterials() {
  const materialsDir = join(projectRoot, 'content-to-upload', 'materials');
  
  try {
    const files = readdirSync(materialsDir).filter(f => extname(f) === '.json');
    
    if (files.length === 0) {
      console.log('📁 No material files found in content-to-upload/materials/');
      return;
    }

    console.log(`\n📄 Found ${files.length} material file(s)...\n`);

    for (const file of files) {
      const filePath = join(materialsDir, file);
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      console.log(`Uploading: ${content.title || file}...`);

      const { data, error } = await supabase
        .from('materials')
        .upsert({
          title: content.title,
          slug: content.slug,
          description: content.description || null,
          content: content.content || null,
          type: content.type || 'Article',
          format: content.format || 'Article',
          author: content.author || null,
          author_name: content.author_name || null,
          published_date: content.published_date || new Date().toISOString(),
          featured: content.featured || false,
          geography: content.geography || null,
          theme: content.theme || null,
          lgr_phase: content.lgr_phase || null,
          image_url: content.image_url || null,
          pdf_url: content.pdf_url || null,
          external_url: content.external_url || null,
          status: content.status || 'published',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        });

      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
      } else {
        console.log(`  ✅ Uploaded successfully!`);
      }
    }
  } catch (error) {
    console.error('Error reading materials directory:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting content upload...\n');
  console.log('📡 Connecting to Supabase...');

  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('articles')
    .select('id')
    .limit(1);

  if (testError) {
    console.error('❌ Cannot connect to Supabase:', testError.message);
    console.error('Check your .env file and Supabase credentials');
    process.exit(1);
  }

  console.log('✅ Connected to Supabase!\n');

  await uploadArticles();
  await uploadMaterials();

  console.log('\n✨ Upload complete!');
}

main().catch(console.error);

