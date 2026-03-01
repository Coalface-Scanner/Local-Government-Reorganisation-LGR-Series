#!/bin/bash
# verify-seo.sh
# ============================================================
# Post-deploy SEO smoke test.
# Usage: bash verify-seo.sh [domain]
# Default: https://localgovernmentreorganisation.co.uk
# ============================================================

DOMAIN="${1:-https://localgovernmentreorganisation.co.uk}"
PASS=0
FAIL=0

check() {
  local label="$1"
  local url="$2"
  local search="$3"

  response=$(curl -sL --max-time 10 "$url")

  if echo "$response" | grep -qi "$search"; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label — expected: $search"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "🔍 SEO Verification for $DOMAIN"
echo "================================="

# ── INFRASTRUCTURE ─────────────────────────────────────────
echo ""
echo "Infrastructure:"
check "robots.txt accessible"        "$DOMAIN/robots.txt"    "Sitemap:"
check "sitemap.xml accessible"       "$DOMAIN/sitemap.xml"   "<urlset"
check "sitemap has homepage"         "$DOMAIN/sitemap.xml"   "${DOMAIN}/"
check "sitemap has /what-is-lgr"     "$DOMAIN/sitemap.xml"   "/what-is-lgr"
check "sitemap has /surrey"          "$DOMAIN/sitemap.xml"   "/surrey"

# ── HOMEPAGE ───────────────────────────────────────────────
echo ""
echo "Homepage (/):"
check "Has <title>"                  "$DOMAIN/"              "<title>"
check "Has meta description"         "$DOMAIN/"              'name="description"'
check "Has og:title"                 "$DOMAIN/"              'property="og:title"'
check "Has JSON-LD"                  "$DOMAIN/"              'application/ld+json'
check "Has prerender marker"         "$DOMAIN/"              'name="x-prerendered"'

# ── HIGH-PRIORITY PAGES ───────────────────────────────────
echo ""
echo "What is LGR (/what-is-lgr):"
check "Has page-specific <title>"    "$DOMAIN/what-is-lgr"   "What Is Local Government"
check "Has meta description"         "$DOMAIN/what-is-lgr"   'name="description"'
check "Has prerender marker"         "$DOMAIN/what-is-lgr"   'name="x-prerendered"'

echo ""
echo "First 100 Days (/first-100-days):"
check "Has page-specific <title>"    "$DOMAIN/first-100-days" "First 100 Days"
check "Has meta description"         "$DOMAIN/first-100-days" 'name="description"'

echo ""
echo "Surrey (/surrey):"
check "Has page-specific <title>"    "$DOMAIN/surrey"         "Surrey LGR"
check "Has meta description"         "$DOMAIN/surrey"         'name="description"'

echo ""
echo "Beginners Guide (/beginners-guide):"
check "Has page-specific <title>"    "$DOMAIN/beginners-guide" "Beginner"
check "Has meta description"         "$DOMAIN/beginners-guide" 'name="description"'

# ── ADMIN BLOCKED ──────────────────────────────────────────
echo ""
echo "Admin blocked from robots.txt:"
check "robots.txt blocks /admin/"    "$DOMAIN/robots.txt"     "Disallow: /admin/"

# ── RESULTS ────────────────────────────────────────────────
echo ""
echo "================================="
echo "Results: $PASS passed, $FAIL failed"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "⚠️  Failures found. Common causes:"
  echo "   - Route missing from PRERENDER_ROUTES in vite.config.ts"
  echo "   - <SEOHead /> not added to the page component"
  echo "   - Prerender plugin failed (check build logs for errors)"
  echo "   - Netlify serving SPA fallback instead of static file"
  echo "   - Build didn't complete (run 'npm run build' locally to check)"
  exit 1
else
  echo ""
  echo "🎉 All checks passed."
  echo ""
  echo "Next steps:"
  echo "  1. Submit sitemap in Google Search Console"
  echo "  2. Submit sitemap in Bing Webmaster Tools"
  echo "  3. Use GSC URL Inspection on 3-4 key pages"
fi
