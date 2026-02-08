/**
 * Lighthouse Performance Testing Script
 * Runs Lighthouse audits on key pages and generates reports
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pages to test
const pagesToTest = [
  { path: '/', name: 'Home' },
  { path: '/insights', name: 'Insights' },
  { path: '/facts', name: 'Facts' },
  { path: '/lessons', name: 'Lessons' },
];

const baseUrl = process.env.VITE_SITE_URL || 'http://localhost:5173';
const reportsDir = join(__dirname, '..', 'reports', 'lighthouse');

// Create reports directory if it doesn't exist
try {
  mkdirSync(reportsDir, { recursive: true });
} catch (e) {
  // Directory might already exist
}

async function runLighthouse() {
  console.log('Starting Lighthouse performance audit...\n');
  console.log('Note: This script requires lighthouse to be installed globally or as a dev dependency.');
  console.log('Install with: npm install --save-dev lighthouse\n');
  
  // Check if lighthouse is available
  try {
    const lighthouse = await import('lighthouse');
    const chromeLauncher = await import('chrome-launcher');
    
    const results = [];
    
    for (const page of pagesToTest) {
      console.log(`Testing ${page.name} (${page.path})...`);
      
      try {
        const chrome = await chromeLauncher.default.launch({ chromeFlags: ['--headless'] });
        const options = {
          logLevel: 'info',
          output: 'json',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          port: chrome.port,
        };
        
        const runnerResult = await lighthouse.default(`${baseUrl}${page.path}`, options);
        await chrome.kill();
        
        const lhr = runnerResult.lhr;
        const scores = {
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: Math.round(lhr.categories.accessibility.score * 100),
          'best-practices': Math.round(lhr.categories['best-practices'].score * 100),
          seo: Math.round(lhr.categories.seo.score * 100),
        };
        
        // Core Web Vitals
        const metrics = lhr.audits;
        const coreWebVitals = {
          lcp: metrics['largest-contentful-paint']?.displayValue || 'N/A',
          fid: metrics['max-potential-fid']?.displayValue || 'N/A',
          cls: metrics['cumulative-layout-shift']?.displayValue || 'N/A',
          fcp: metrics['first-contentful-paint']?.displayValue || 'N/A',
          tti: metrics['interactive']?.displayValue || 'N/A',
        };
        
        results.push({
          page: page.name,
          path: page.path,
          scores,
          coreWebVitals,
          report: lhr,
        });
        
        // Save individual HTML report
        const htmlReportPath = join(reportsDir, `${page.name.toLowerCase().replace(/\s+/g, '-')}-report.html`);
        writeFileSync(htmlReportPath, runnerResult.report[0], 'utf8');
        console.log(`  ✓ Report saved: ${htmlReportPath}`);
        
        console.log(`  Performance: ${scores.performance}/100`);
        console.log(`  Accessibility: ${scores.accessibility}/100`);
        console.log(`  Best Practices: ${scores['best-practices']}/100`);
        console.log(`  SEO: ${scores.seo}/100\n`);
        
      } catch (error) {
        console.error(`  ✗ Error testing ${page.name}:`, error.message);
        results.push({
          page: page.name,
          path: page.path,
          error: error.message,
        });
      }
    }
    
    // Generate summary report
    generateSummaryReport(results);
    
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error('Error: lighthouse package not found.');
      console.error('Please install it with: npm install --save-dev lighthouse chrome-launcher');
      console.error('\nAlternatively, run Lighthouse manually:');
      console.error('1. Open Chrome DevTools');
      console.error('2. Go to Lighthouse tab');
      console.error('3. Select categories and click "Generate report"');
      process.exit(1);
    } else {
      throw error;
    }
  }
}

function generateSummaryReport(results) {
  const report = `# Lighthouse Performance Audit Report
**Generated:** ${new Date().toISOString()}
**Base URL:** ${baseUrl}

## Summary

${results.map(r => {
  if (r.error) {
    return `### ${r.page} (${r.path})
**Status:** Error - ${r.error}
`;
  }
  
  const avgScore = Math.round(
    (r.scores.performance + r.scores.accessibility + r.scores['best-practices'] + r.scores.seo) / 4
  );
  
  return `### ${r.page} (${r.path})
**Overall Score:** ${avgScore}/100

| Category | Score |
|----------|-------|
| Performance | ${r.scores.performance}/100 |
| Accessibility | ${r.scores.accessibility}/100 |
| Best Practices | ${r.scores['best-practices']}/100 |
| SEO | ${r.scores.seo}/100 |

#### Core Web Vitals
- **LCP (Largest Contentful Paint):** ${r.coreWebVitals.lcp}
- **FID (First Input Delay):** ${r.coreWebVitals.fid}
- **CLS (Cumulative Layout Shift):** ${r.coreWebVitals.cls}
- **FCP (First Contentful Paint):** ${r.coreWebVitals.fcp}
- **TTI (Time to Interactive):** ${r.coreWebVitals.tti}

**Full Report:** [${r.page} Report](./reports/lighthouse/${r.page.toLowerCase().replace(/\s+/g, '-')}-report.html)
`;
}).join('\n')}

## Recommendations

### Performance
- Aim for Performance score > 90
- LCP should be < 2.5s
- CLS should be < 0.1
- FCP should be < 1.8s

### Accessibility
- Aim for Accessibility score > 95
- Ensure all images have alt text
- Ensure proper heading hierarchy
- Ensure sufficient color contrast

### Best Practices
- Use HTTPS
- Avoid deprecated APIs
- Ensure proper error handling
- Use modern web standards

### SEO
- Ensure proper meta tags
- Use semantic HTML
- Ensure proper heading structure
- Include structured data

## Notes
- Reports are saved in \`reports/lighthouse/\` directory
- For production testing, set \`VITE_SITE_URL\` environment variable to your production URL
- Run this script after building the site: \`npm run build && npm run test:performance\`
`;

  const reportPath = join(__dirname, '..', 'LIGHTHOUSE_AUDIT_REPORT.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`\nSummary report saved to: ${reportPath}`);
}

// Run if lighthouse is available, otherwise provide instructions
runLighthouse().catch(error => {
  console.error('Error running Lighthouse audit:', error);
  process.exit(1);
});
