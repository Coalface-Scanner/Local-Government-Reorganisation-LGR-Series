/**
 * Image Optimization Audit Script
 * Scans public directory for images and checks for optimization opportunities
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const srcDir = join(__dirname, '..', 'src');

// Image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];

// Size thresholds (in bytes)
const SIZE_THRESHOLDS = {
  small: 100 * 1024,      // 100KB
  medium: 500 * 1024,      // 500KB
  large: 1000 * 1024,     // 1MB
  veryLarge: 2000 * 1024, // 2MB
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function scanDirectory(dir, baseDir = dir) {
  const files = [];
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.replace(baseDir + '/', '');
      
      if (entry.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          files.push(...scanDirectory(fullPath, baseDir));
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          const stats = statSync(fullPath);
          files.push({
            path: relativePath,
            fullPath,
            size: stats.size,
            ext,
            name: entry.name,
          });
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be inaccessible
  }
  
  return files;
}

function checkImageUsage(imagePath, srcDir) {
  const imageName = imagePath.split('/').pop();
  const usage = [];
  
  // Search for image references in source files
  function searchInDirectory(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          searchInDirectory(fullPath);
        } else if (entry.isFile() && ['.tsx', '.ts', '.jsx', '.js', '.html'].includes(extname(entry.name))) {
          try {
            const content = readFileSync(fullPath, 'utf8');
            if (content.includes(imageName) || content.includes(imagePath) || content.includes(`/${imagePath}`)) {
              usage.push(fullPath.replace(srcDir + '/', ''));
            }
          } catch (e) {
            // File might not be readable
          }
        }
      }
    } catch (e) {
      // Directory might not exist
    }
  }
  
  searchInDirectory(srcDir);
  return usage;
}

function generateReport() {
  console.log('Scanning for images...\n');
  
  const publicImages = scanDirectory(publicDir, publicDir);
  
  console.log(`Found ${publicImages.length} images in public directory\n`);
  
  const report = {
    total: publicImages.length,
    bySize: {
      small: [],
      medium: [],
      large: [],
      veryLarge: [],
    },
    byExtension: {},
    recommendations: [],
    unused: [],
  };
  
  publicImages.forEach(img => {
    // Categorize by size
    if (img.size < SIZE_THRESHOLDS.small) {
      report.bySize.small.push(img);
    } else if (img.size < SIZE_THRESHOLDS.medium) {
      report.bySize.medium.push(img);
    } else if (img.size < SIZE_THRESHOLDS.large) {
      report.bySize.large.push(img);
    } else {
      report.bySize.veryLarge.push(img);
    }
    
    // Count by extension
    report.byExtension[img.ext] = (report.byExtension[img.ext] || 0) + 1;
    
    // Check usage
    const usage = checkImageUsage(img.path, srcDir);
    if (usage.length === 0) {
      report.unused.push(img);
    }
    
    // Generate recommendations
    if (img.size > SIZE_THRESHOLDS.large) {
      report.recommendations.push({
        type: 'size',
        image: img.path,
        size: formatBytes(img.size),
        suggestion: 'Consider compressing or converting to WebP/AVIF format',
      });
    }
    
    if (['.jpg', '.jpeg', '.png'].includes(img.ext) && img.size > SIZE_THRESHOLDS.medium) {
      report.recommendations.push({
        type: 'format',
        image: img.path,
        currentFormat: img.ext,
        suggestion: 'Consider converting to WebP or AVIF for better compression',
      });
    }
  });
  
  // Generate markdown report
  const markdown = `# Image Optimization Audit Report
**Generated:** ${new Date().toISOString()}

## Summary

- **Total Images:** ${report.total}
- **Small (< 100KB):** ${report.bySize.small.length}
- **Medium (100KB - 500KB):** ${report.bySize.medium.length}
- **Large (500KB - 1MB):** ${report.bySize.large.length}
- **Very Large (> 1MB):** ${report.bySize.veryLarge.length}
- **Potentially Unused:** ${report.unused.length}

## Images by Size

### Very Large Images (> 1MB)
${report.bySize.veryLarge.length > 0 
  ? report.bySize.veryLarge.map(img => `- **${img.path}** - ${formatBytes(img.size)}`).join('\n')
  : 'None ✓'
}

### Large Images (500KB - 1MB)
${report.bySize.large.length > 0 
  ? report.bySize.large.map(img => `- **${img.path}** - ${formatBytes(img.size)}`).join('\n')
  : 'None ✓'
}

## Images by Format

${Object.entries(report.byExtension).map(([ext, count]) => `- **${ext}**: ${count}`).join('\n')}

## Potentially Unused Images

${report.unused.length > 0 
  ? report.unused.map(img => `- **${img.path}** - ${formatBytes(img.size)}`).join('\n')
  : 'None ✓'
}

## Recommendations

${report.recommendations.length > 0 
  ? report.recommendations.map(rec => {
      if (rec.type === 'size') {
        return `- **${rec.image}** (${rec.size}): ${rec.suggestion}`;
      } else {
        return `- **${rec.image}** (${rec.currentFormat}): ${rec.suggestion}`;
      }
    }).join('\n')
  : 'No specific recommendations'
}

## Best Practices

1. **Use WebP or AVIF format** for better compression (with fallbacks)
2. **Optimize images** before adding to public directory
3. **Use responsive images** with srcset for different screen sizes
4. **Lazy load images** that are below the fold
5. **Provide alt text** for all images (accessibility)
6. **Remove unused images** to reduce bundle size

## Tools for Optimization

- **ImageOptim** (Mac): https://imageoptim.com/
- **Squoosh** (Web): https://squoosh.app/
- **Sharp** (Node.js): https://sharp.pixelplumbing.com/
- **imagemin** (Node.js): https://github.com/imagemin/imagemin

## Notes

- This audit scans the \`public/\` directory
- Usage detection searches source files for image references
- Manual review recommended for unused images before deletion
`;

  const reportPath = join(__dirname, '..', 'IMAGE_OPTIMIZATION_REPORT.md');
  writeFileSync(reportPath, markdown, 'utf8');
  
  console.log('Image audit complete!');
  console.log(`\nSummary:`);
  console.log(`  Total images: ${report.total}`);
  console.log(`  Very large (>1MB): ${report.bySize.veryLarge.length}`);
  console.log(`  Large (500KB-1MB): ${report.bySize.large.length}`);
  console.log(`  Potentially unused: ${report.unused.length}`);
  console.log(`\nReport saved to: ${reportPath}`);
  
  return report;
}

generateReport();
