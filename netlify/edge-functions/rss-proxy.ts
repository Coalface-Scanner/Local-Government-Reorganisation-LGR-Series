/**
 * Netlify Edge Function to proxy RSS feeds
 * This solves CORS issues when fetching RSS feeds from external sources
 */

const RSS_FEED_URL = 'https://anchor.fm/s/10d7de5ac/podcast/rss';

export default async (request: Request) => {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Fetch the RSS feed from Anchor.fm
    const response = await fetch(RSS_FEED_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LGR-Series/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch RSS feed: ${response.status} ${response.statusText}` 
        }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the XML content
    let xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'RSS feed returned empty content' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize the XML to fix common malformed HTML issues
    // Remove script tags that might break XML parsing
    xmlText = xmlText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Fix unclosed HTML tags in descriptions by wrapping problematic content in CDATA
    xmlText = xmlText.replace(/<description>([\s\S]*?)<\/description>/gi, (match, content) => {
      // If content has HTML but no CDATA, wrap it
      if (content.includes('<') && content.includes('>') && !content.includes('<![CDATA[')) {
        // Escape any existing CDATA markers
        const escaped = content.replace(/<!\[CDATA\[/g, '&lt;![CDATA[').replace(/\]\]>/g, ']]&gt;');
        return `<description><![CDATA[${escaped}]]></description>`;
      }
      return match;
    });

    // Return the sanitized XML with appropriate headers
    return new Response(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error proxying RSS feed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch RSS feed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
