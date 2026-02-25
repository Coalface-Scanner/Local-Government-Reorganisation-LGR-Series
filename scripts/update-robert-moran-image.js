import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const articleSlug = 'from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously';
const imageUrl = '/robert-moran-article-image.jpg';

async function updateArticleImage() {
  try {
    console.log('🖼️  Updating article featured image...');
    console.log(`Slug: ${articleSlug}`);
    console.log(`Image URL: ${imageUrl}`);

    // Check if article exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id, title, featured_image')
      .eq('slug', articleSlug)
      .maybeSingle();

    if (!existing) {
      console.error('❌ Article not found!');
      console.error(`No article found with slug: ${articleSlug}`);
      process.exit(1);
    }

    console.log(`Found article: ${existing.title}`);
    console.log(`Current featured_image: ${existing.featured_image || '(none)'}`);

    // Update the article
    const { data, error } = await supabase
      .from('articles')
      .update({ 
        featured_image: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', articleSlug)
      .select();

    if (error) throw error;

    console.log('✅ Article updated successfully!');
    console.log(`New featured_image: ${data[0].featured_image}`);
    console.log('\n📝 Next steps:');
    console.log(`1. Add the image file to the public folder as: robert-moran-article-image.jpg`);
    console.log(`2. The image will be accessible at: ${imageUrl}`);
    console.log(`3. View the article at: /insights/${articleSlug}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

updateArticleImage();

