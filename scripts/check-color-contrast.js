/**
 * Color Contrast Checker Script
 * Checks WCAG AA compliance for common color combinations used in the site
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
function checkContrast(foreground, background, isLargeText = false) {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) {
    return { pass: false, reason: 'Invalid color format' };
  }
  
  const ratio = getContrastRatio(fgRgb, bgRgb);
  const requiredRatio = isLargeText ? 3 : 4.5;
  const pass = ratio >= requiredRatio;
  
  return {
    pass,
    ratio: ratio.toFixed(2),
    required: requiredRatio,
    level: ratio >= 7 ? 'AAA' : ratio >= requiredRatio ? 'AA' : 'FAIL'
  };
}

// Color combinations to check (from index.css)
const colorCombinations = [
  // Academic colors
  { fg: '#2c2a26', bg: '#faf8f5', name: 'Academic Charcoal on Cream', large: false },
  { fg: '#2c2a26', bg: '#faf8f5', name: 'Academic Charcoal on Cream (Large)', large: true },
  { fg: '#0f766e', bg: '#faf8f5', name: 'Teal-700 on Cream', large: false },
  { fg: '#0f766e', bg: '#faf8f5', name: 'Teal-700 on Cream (Large)', large: true },
  { fg: '#0d9488', bg: '#ffffff', name: 'Teal-600 on White', large: false },
  { fg: '#0d9488', bg: '#ffffff', name: 'Teal-600 on White (Large)', large: true },
  { fg: '#ffffff', bg: '#0f766e', name: 'White on Teal-700', large: false },
  { fg: '#ffffff', bg: '#0f766e', name: 'White on Teal-700 (Large)', large: true },
  { fg: '#ffffff', bg: '#0d9488', name: 'White on Teal-600', large: false },
  { fg: '#ffffff', bg: '#0d9488', name: 'White on Teal-600 (Large)', large: true },
  
  // Academic neutral scale
  { fg: '#454037', bg: '#faf9f7', name: 'Academic Neutral-900 on Neutral-50', large: false },
  { fg: '#534c42', bg: '#faf9f7', name: 'Academic Neutral-800 on Neutral-50', large: false },
  { fg: '#665d51', bg: '#faf9f7', name: 'Academic Neutral-700 on Neutral-50', large: false },
  { fg: '#7d7364', bg: '#faf9f7', name: 'Academic Neutral-600 on Neutral-50', large: false },
  { fg: '#9a9080', bg: '#faf9f7', name: 'Academic Neutral-500 on Neutral-50', large: false },
  
  // Link colors
  { fg: '#0f766e', bg: '#faf8f5', name: 'Link Teal-700 on Cream', large: false },
  { fg: '#0d9488', bg: '#faf8f5', name: 'Link Teal-600 on Cream', large: false },
  
  // Button colors
  { fg: '#ffffff', bg: '#0f766e', name: 'Button White on Teal-700', large: false },
  { fg: '#ffffff', bg: '#0d9488', name: 'Button White on Teal-600', large: false },
  
  // Academic prose
  { fg: '#4a4a42', bg: '#faf8f5', name: 'Prose Text on Cream', large: false },
  { fg: '#2c2a26', bg: '#faf8f5', name: 'Prose Headings on Cream', large: true },
];

function generateReport() {
  console.log('Checking color contrast for WCAG AA compliance...\n');
  
  const results = [];
  let passCount = 0;
  let failCount = 0;
  
  colorCombinations.forEach(combo => {
    const result = checkContrast(combo.fg, combo.bg, combo.large);
    const status = result.pass ? '✓ PASS' : '✗ FAIL';
    
    results.push({
      ...combo,
      ...result
    });
    
    if (result.pass) {
      passCount++;
      console.log(`${status} [${result.level}] ${combo.name}: ${result.ratio}:1 (required: ${result.required}:1)`);
    } else {
      failCount++;
      console.log(`${status} [${result.level}] ${combo.name}: ${result.ratio}:1 (required: ${result.required}:1)`);
    }
  });
  
  console.log(`\n--- Summary ---`);
  console.log(`Total combinations checked: ${colorCombinations.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  
  // Generate markdown report
  const report = `# Color Contrast Report
**Generated:** ${new Date().toISOString()}

## Summary
- **Total Combinations Checked:** ${colorCombinations.length}
- **Passed:** ${passCount}
- **Failed:** ${failCount}
- **Pass Rate:** ${((passCount / colorCombinations.length) * 100).toFixed(1)}%

## Results

| Foreground | Background | Name | Ratio | Required | Level | Status |
|------------|------------|------|-------|----------|-------|--------|
${results.map(r => `| \`${r.fg}\` | \`${r.bg}\` | ${r.name} | ${r.ratio}:1 | ${r.required}:1 | ${r.level} | ${r.pass ? '✓ PASS' : '✗ FAIL'} |`).join('\n')}

## WCAG Standards
- **AA Normal Text:** Requires 4.5:1 contrast ratio
- **AA Large Text:** Requires 3:1 contrast ratio (18pt+ or 14pt+ bold)
- **AAA Normal Text:** Requires 7:1 contrast ratio
- **AAA Large Text:** Requires 4.5:1 contrast ratio

## Notes
- Large text is defined as 18pt+ regular or 14pt+ bold
- This report checks common color combinations from the site's design system
- For comprehensive testing, use browser-based tools like axe DevTools or WAVE
`;

  const reportPath = join(__dirname, '..', 'COLOR_CONTRAST_REPORT.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`\nReport saved to: ${reportPath}`);
  
  return failCount === 0;
}

// Run the check
const allPassed = generateReport();
process.exit(allPassed ? 0 : 1);
