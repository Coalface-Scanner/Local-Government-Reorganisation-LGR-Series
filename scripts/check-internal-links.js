#!/usr/bin/env node

/**
 * Internal Links Validation Script
 * Checks all internal links across the codebase against valid routes in App.tsx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract routes from App.tsx
function extractRoutes(appTsxPath) {
  const content = fs.readFileSync(appTsxPath, 'utf8');
  const routes = [];
  const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    routes.push(match[1]);
  }
  
  return routes;
}

// Normalize route for comparison (remove leading slash, handle dynamic params)
function normalizeRoute(route) {
  // Remove leading slash
  let normalized = route.startsWith('/') ? route.slice(1) : route;
  
  // Replace dynamic params with wildcard for matching
  normalized = normalized.replace(/:[^/]+/g, '*');
  
  return normalized;
}

// Check if a route matches any valid route (handling dynamic params)
function isValidRoute(route, validRoutes) {
  const normalized = normalizeRoute(route);
  
  // Exact match
  if (validRoutes.some(r => normalizeRoute(r) === normalized)) {
    return true;
  }
  
  // Check if it matches a dynamic route pattern
  // e.g., "insights/my-article" matches "insights/:slug"
  const routeParts = normalized.split('/');
  
  for (const validRoute of validRoutes) {
    const validNormalized = normalizeRoute(validRoute);
    const validParts = validNormalized.split('/');
    
    if (routeParts.length !== validParts.length) continue;
    
    let matches = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (validParts[i] !== '*' && validParts[i] !== routeParts[i]) {
        matches = false;
        break;
      }
    }
    
    if (matches) return true;
  }
  
  return false;
}

// Find all internal links in a file
function findLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  // Pattern 1: onNavigate('path') or onNavigate("path") - check if it has a second parameter
  // onNavigate('article', slug) creates /article/:slug which is valid
  const onNavigateRegex = /onNavigate\(['"]([^'"]+)['"](?:\s*,\s*[^)]+)?\)/g;
  let match;
  let lineNum = 1;
  
  for (const line of lines) {
    // Reset regex
    onNavigateRegex.lastIndex = 0;
    
    while ((match = onNavigateRegex.exec(line)) !== null) {
      const link = match[1];
      // Skip external links, mailto, anchors
      if (!link.startsWith('http') && !link.startsWith('mailto:') && !link.startsWith('#')) {
        // Check if this onNavigate call has a second parameter (dynamic route)
        const hasSecondParam = /onNavigate\(['"][^'"]+['"]\s*,\s*[^)]+\)/.test(line);
        
        issues.push({
          type: 'onNavigate',
          link: link,
          line: lineNum,
          code: line.trim(),
          hasDynamicParam: hasSecondParam,
        });
      }
    }
    
    // Pattern 2: <Link to="/path">
    const linkToRegex = /<Link\s+to=["']([^"']+)["']/g;
    linkToRegex.lastIndex = 0;
    while ((match = linkToRegex.exec(line)) !== null) {
      const link = match[1];
      if (link.startsWith('/')) {
        issues.push({
          type: 'Link',
          link: link,
          line: lineNum,
          code: line.trim(),
        });
      }
    }
    
    // Pattern 3: href="/path" (internal links only)
    const hrefRegex = /href=["']\/([^"']+)["']/g;
    hrefRegex.lastIndex = 0;
    while ((match = hrefRegex.exec(line)) !== null) {
      const link = '/' + match[1];
      // Skip sitemap, manifest, etc.
      if (!link.includes('.xml') && !link.includes('.json') && !link.includes('.ico')) {
        issues.push({
          type: 'href',
          link: link,
          line: lineNum,
          code: line.trim(),
        });
      }
    }
    
    lineNum++;
  }
  
  return issues;
}

// Recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        findTsxFiles(filePath, fileList);
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Main function
function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const appTsxPath = path.join(projectRoot, 'src', 'App.tsx');
  
  console.log('🔍 Internal Links Validation Script\n');
  console.log('Extracting routes from App.tsx...');
  
  const validRoutes = extractRoutes(appTsxPath);
  console.log(`Found ${validRoutes.length} valid routes\n`);
  
  console.log('Scanning files for internal links...');
  const srcDir = path.join(projectRoot, 'src');
  const files = findTsxFiles(srcDir);
  
  const allIssues = [];
  const brokenLinks = [];
  
  for (const file of files) {
    const relativePath = path.relative(projectRoot, file);
    const issues = findLinksInFile(file);
    
    if (issues.length > 0) {
      for (const issue of issues) {
        const route = issue.link.startsWith('/') ? issue.link.slice(1) : issue.link;
        
        // If onNavigate has a second parameter, check if the base route pattern is valid
        // e.g., 'article' with slug param creates /article/:slug which matches /article/:slug route
        let isValid;
        if (issue.hasDynamicParam) {
          // Check if there's a matching dynamic route pattern
          // e.g., 'article' should match '/article/:slug'
          const dynamicRoutePattern = `/${route}/*`;
          isValid = validRoutes.some(r => {
            const normalized = normalizeRoute(r);
            const routeNormalized = normalizeRoute(route);
            // Check if route matches a dynamic pattern (ends with /* or has :param)
            return normalized.startsWith(routeNormalized + '/') || 
                   normalized === routeNormalized ||
                   validRoutes.some(vr => {
                     const vrNorm = normalizeRoute(vr);
                     return vrNorm.startsWith(routeNormalized + '/') && vrNorm.includes('*');
                   });
          });
        } else {
          isValid = isValidRoute(route, validRoutes);
        }
        
        if (!isValid) {
          brokenLinks.push({
            file: relativePath,
            line: issue.line,
            type: issue.type,
            link: issue.link,
            code: issue.code,
          });
        }
        
        allIssues.push({
          file: relativePath,
          line: issue.line,
          type: issue.type,
          link: issue.link,
          isValid: isValid,
        });
      }
    }
  }
  
  // Report results
  console.log(`\n📊 Summary:`);
  console.log(`   Total links found: ${allIssues.length}`);
  console.log(`   Broken links: ${brokenLinks.length}\n`);
  
  if (brokenLinks.length > 0) {
    console.log('❌ Broken Links Found:\n');
    
    // Group by file
    const byFile = {};
    for (const issue of brokenLinks) {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    }
    
    for (const [file, issues] of Object.entries(byFile)) {
      console.log(`📄 ${file}:`);
      for (const issue of issues) {
        console.log(`   Line ${issue.line} (${issue.type}): "${issue.link}"`);
        console.log(`   ${issue.code.substring(0, 80)}...`);
      }
      console.log('');
    }
    
    // Suggest fixes
    console.log('💡 Suggested Fixes:\n');
    const suggestions = new Map();
    
    for (const issue of brokenLinks) {
      const link = issue.link;
      const normalized = normalizeRoute(link);
      
      // Find similar routes
      const similar = validRoutes
        .map(r => ({ route: r, normalized: normalizeRoute(r) }))
        .filter(r => {
          const linkParts = normalized.split('/');
          const routeParts = r.normalized.split('/');
          if (linkParts.length !== routeParts.length) return false;
          
          // Count matching parts
          let matches = 0;
          for (let i = 0; i < linkParts.length; i++) {
            if (routeParts[i] === '*' || routeParts[i] === linkParts[i]) {
              matches++;
            }
          }
          return matches >= linkParts.length - 1; // Allow one mismatch
        })
        .map(r => r.route);
      
      if (similar.length > 0) {
        suggestions.set(link, similar[0]);
      }
    }
    
    for (const [broken, suggested] of suggestions) {
      console.log(`   "${broken}" → "${suggested}"`);
    }
    
    process.exit(1);
  } else {
    console.log('✅ All internal links are valid!');
    process.exit(0);
  }
}

main();
