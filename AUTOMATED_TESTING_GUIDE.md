# Automated Testing Guide

This guide explains how to run automated tests for accessibility, performance, and image optimization.

## Prerequisites

Ensure you have Node.js installed and dependencies installed:

```bash
npm install
```

## Available Tests

### 1. Color Contrast Checker

Checks WCAG AA compliance for common color combinations used throughout the site.

**Run:**
```bash
npm run check:contrast
```

**What it does:**
- Checks contrast ratios for foreground/background color combinations
- Validates against WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Generates a report: `COLOR_CONTRAST_REPORT.md`

**Output:**
- Console output with pass/fail status for each combination
- Markdown report with detailed results

**Example:**
```
✓ PASS [AA] Academic Charcoal on Cream: 12.45:1 (required: 4.5:1)
✗ FAIL [FAIL] Some Color Combination: 3.2:1 (required: 4.5:1)
```

### 2. Performance Testing (Lighthouse)

Runs Lighthouse audits on key pages to measure performance, accessibility, best practices, and SEO.

**Run:**
```bash
npm run test:performance
```

**Prerequisites:**
Install Lighthouse as a dev dependency:
```bash
npm install --save-dev lighthouse chrome-launcher
```

**What it does:**
- Tests key pages: Home, Insights, Facts, Lessons
- Measures Core Web Vitals (LCP, FID, CLS, FCP, TTI)
- Generates HTML reports in `reports/lighthouse/`
- Creates summary report: `LIGHTHOUSE_AUDIT_REPORT.md`

**Configuration:**
Set the base URL for testing:
```bash
VITE_SITE_URL=https://your-site.com npm run test:performance
```

**Output:**
- Individual HTML reports for each page
- Summary markdown report with scores and recommendations

**Note:** For production testing, build the site first:
```bash
npm run build
npm run preview  # In another terminal
VITE_SITE_URL=http://localhost:4173 npm run test:performance
```

### 3. Image Optimization Audit

Scans the public directory for images and identifies optimization opportunities.

**Run:**
```bash
npm run audit:images
```

**What it does:**
- Scans `public/` directory for images
- Categorizes by size (small, medium, large, very large)
- Identifies potentially unused images
- Suggests format conversions (WebP/AVIF)
- Generates report: `IMAGE_OPTIMIZATION_REPORT.md`

**Output:**
- Summary of image sizes and formats
- List of large images that could be optimized
- List of potentially unused images
- Recommendations for each image

**Example:**
```
Found 45 images in public directory

Summary:
  Total images: 45
  Very large (>1MB): 3
  Large (500KB-1MB): 5
  Potentially unused: 2
```

## Running All Tests

Run all automated tests in sequence:

```bash
npm run check:contrast && npm run audit:images
```

For performance testing, ensure the site is running:
```bash
npm run build
npm run preview  # Terminal 1
VITE_SITE_URL=http://localhost:4173 npm run test:performance  # Terminal 2
```

## Manual Testing Checklist

While automated tests are helpful, manual testing is still required:

### Accessibility
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Verify focus indicators are visible
- [ ] Test with browser zoom at 200%
- [ ] Verify color contrast with browser extensions (WAVE, axe DevTools)

### Performance
- [ ] Test on slow 3G connection (Chrome DevTools)
- [ ] Test on mobile devices
- [ ] Verify images lazy load correctly
- [ ] Check bundle sizes in Network tab
- [ ] Verify code splitting works

### Browser Compatibility
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome

## Continuous Integration

These scripts can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Check Color Contrast
  run: npm run check:contrast

- name: Audit Images
  run: npm run audit:images

- name: Build Site
  run: npm run build

- name: Performance Test
  run: |
    npm run preview &
    sleep 5
    VITE_SITE_URL=http://localhost:4173 npm run test:performance
```

## Troubleshooting

### Lighthouse not found
If you see "lighthouse package not found":
```bash
npm install --save-dev lighthouse chrome-launcher
```

### Port already in use
If preview port is in use:
```bash
npm run preview -- --port 4174
VITE_SITE_URL=http://localhost:4174 npm run test:performance
```

### Images not found
Ensure images are in the `public/` directory and the script has read permissions.

## Reports Location

All reports are generated in the project root:
- `COLOR_CONTRAST_REPORT.md` - Color contrast analysis
- `LIGHTHOUSE_AUDIT_REPORT.md` - Performance audit summary
- `IMAGE_OPTIMIZATION_REPORT.md` - Image optimization recommendations
- `reports/lighthouse/*.html` - Individual Lighthouse HTML reports

## Best Practices

1. **Run tests regularly** - Before each release
2. **Fix issues incrementally** - Address high-priority items first
3. **Document exceptions** - If a test fails for a valid reason, document it
4. **Update thresholds** - Adjust size thresholds in scripts as needed
5. **Review reports** - Don't just run tests, review and act on findings

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
