import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseStringPromise } from 'xml2js';

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

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to extract excerpt from content
function extractExcerpt(content, maxLength = 200) {
  if (!content) return '';
  
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Take first sentence or first maxLength characters
  const firstSentence = text.match(/^[^.!?]+[.!?]/);
  if (firstSentence && firstSentence[0].length <= maxLength) {
    return firstSentence[0].trim();
  }
  
  return text.substring(0, maxLength).trim() + (text.length > maxLength ? '...' : '');
}

// Helper function to extract image URL from content
function extractImageUrl(content) {
  if (!content) return null;
  
  // Try to find first image in content
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    let url = imgMatch[1];
    // Clean up Substack CDN URLs - remove size parameters for better quality
    if (url.includes('substackcdn.com')) {
      // Try to get full size image
      url = url.replace(/\$s_[^!]+!/, ''); // Remove size parameter
      url = url.replace(/w_\d+/g, ''); // Remove width constraints
      url = url.replace(/c_limit/g, ''); // Remove limit constraints
      url = url.replace(/[?&]$/, ''); // Remove trailing ? or &
      url = url.replace(/[?&]+/g, '&'); // Normalize separators
      url = url.replace(/&$/, ''); // Remove trailing &
      if (url.includes('?')) {
        url = url + '&w=1200'; // Request larger image
      } else {
        url = url + '?w=1200';
      }
    }
    return url;
  }
  
  // Try enclosure image
  const enclosureMatch = content.match(/enclosure url=["']([^"']+)["']/i);
  if (enclosureMatch) {
    return enclosureMatch[1];
  }
  
  return null;
}

// Parse RSS feed
async function fetchRSSFeed(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    const xml = await response.text();
    return await parseStringPromise(xml);
  } catch (error) {
    throw new Error(`Error fetching RSS feed: ${error.message}`);
  }
}

// Process RSS items into articles
function processRSSItems(rssData) {
  if (!rssData.rss || !rssData.rss.channel || !rssData.rss.channel[0].item) {
    throw new Error('Invalid RSS feed format');
  }

  const items = rssData.rss.channel[0].item;
  const articles = [];

  for (const item of items) {
    const title = item.title?.[0] || 'Untitled';
    const link = item.link?.[0] || '';
    const pubDateRaw = item.pubDate?.[0];
    const description = item.description?.[0] || '';
    const content = item['content:encoded']?.[0] || item.description?.[0] || '';
    const creator = item['dc:creator']?.[0] || 'Rowan @ Coalface™';
    
    // Parse publication date correctly (RSS uses RFC 822 format)
    let publishedDate = null;
    if (pubDateRaw) {
      try {
        // Parse RFC 822 date format (e.g., "Mon, 05 Jan 2026 00:34:53 GMT")
        const parsedDate = new Date(pubDateRaw);
        if (!isNaN(parsedDate.getTime())) {
          publishedDate = parsedDate.toISOString();
        } else {
          console.warn(`  ⚠️  Could not parse date: ${pubDateRaw}, using current date`);
          publishedDate = new Date().toISOString();
        }
      } catch (error) {
        console.warn(`  ⚠️  Error parsing date: ${pubDateRaw}, using current date`);
        publishedDate = new Date().toISOString();
      }
    } else {
      // No date in RSS, use current date
      publishedDate = new Date().toISOString();
    }
    
    // Extract image from enclosure if available
    let imageUrl = null;
    if (item.enclosure && item.enclosure[0]) {
      const enclosure = Array.isArray(item.enclosure) ? item.enclosure[0] : item.enclosure;
      if (enclosure.$ && enclosure.$.type && enclosure.$.type.startsWith('image/')) {
        imageUrl = enclosure.$.url;
      }
    }
    
    // Try to extract image from content if not found
    if (!imageUrl) {
      imageUrl = extractImageUrl(content);
    }
    
    // Also check for image in description
    if (!imageUrl && description) {
      imageUrl = extractImageUrl(description);
    }

    const slug = generateSlug(title);
    const excerpt = extractExcerpt(description || content);

    articles.push({
      title,
      slug,
      excerpt,
      body: content,
      featured_image: imageUrl,
      status: 'published',
      published_date: publishedDate,
      featured: false,
      author: creator,
      category: 'Analysis', // Default category
      region: 'England', // Default region
    });
  }

  return articles;
}

// Upload articles to Supabase
async function uploadArticles(articles, updateExisting = false) {
  console.log(`\n📤 Uploading ${articles.length} article(s) to Supabase...\n`);
  if (updateExisting) {
    console.log('🔄 Update mode: Will update existing articles with new data\n');
  }

  let successCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      console.log(`Processing: ${article.title}...`);

      // Check if article with this slug already exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id, title, published_date')
        .eq('slug', article.slug)
        .single();

      if (existing) {
        if (updateExisting) {
          // Update existing article
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              ...article,
              updated_at: new Date().toISOString(),
              // Preserve existing published_date if it exists and new one is not provided
              published_date: article.published_date || existing.published_date,
            })
            .eq('id', existing.id);

          if (updateError) {
            throw updateError;
          } else {
            console.log(`  🔄 Updated: ${article.slug}`);
            updateCount++;
          }
        } else {
          console.log(`  ⏭️  Skipped (already exists): ${article.slug}`);
          skipCount++;
        }
        continue;
      }

      // Insert new article
      const { data, error } = await supabase
        .from('articles')
        .insert([{
          ...article,
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        if (error.message?.includes('duplicate key')) {
          console.log(`  ⏭️  Skipped (duplicate): ${article.slug}`);
          skipCount++;
        } else {
          throw error;
        }
      } else {
        console.log(`  ✅ Uploaded: ${article.slug}`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully uploaded: ${successCount}`);
  if (updateExisting) {
    console.log(`   🔄 Updated existing: ${updateCount}`);
  }
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// Main function
async function main() {
  const rssUrl = 'https://rowancole.substack.com/feed';

  console.log('🚀 Starting Substack RSS import...\n');
  console.log(`📡 Fetching RSS feed from: ${rssUrl}`);

  try {
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);

    if (testError) {
      if (testError.message?.includes('row-level security')) {
        console.error('❌ RLS Policy Error: Cannot insert articles with current key');
        console.error('\n💡 Solution: Add SUPABASE_SERVICE_ROLE_KEY to your .env file');
        console.error('   1. Go to Supabase Dashboard → Settings → API');
        console.error('   2. Copy the "service_role" key (NOT the anon key)');
        console.error('   3. Add to .env: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
        console.error('   4. Run the import again');
      } else {
        console.error('❌ Cannot connect to Supabase:', testError.message);
        console.error('Check your .env file and Supabase credentials');
      }
      process.exit(1);
    }

    console.log('✅ Connected to Supabase!\n');

    // Fetch and parse RSS feed
    const rssData = await fetchRSSFeed(rssUrl);
    console.log('✅ RSS feed fetched and parsed\n');

    // Process RSS items
    const articles = processRSSItems(rssData);
    console.log(`📰 Found ${articles.length} article(s) in RSS feed\n`);

    if (articles.length === 0) {
      console.log('⚠️  No articles found in RSS feed');
      process.exit(0);
    }

    // Display articles to be imported
    console.log('📋 Articles to import:');
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
      console.log(`      Slug: ${article.slug}`);
      const pubDate = article.published_date 
        ? new Date(article.published_date).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })
        : 'No date';
      console.log(`      Published: ${pubDate}`);
      console.log('');
    });

    // Check for --update flag
    const updateExisting = process.argv.includes('--update') || process.argv.includes('-u');
    
    // Upload articles
    await uploadArticles(articles, updateExisting);

    console.log('\n✨ Import complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);

