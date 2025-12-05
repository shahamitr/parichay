#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 *
 * Analyzes the production bundle and reports:
 * - Total bundle size
 * - Individual chunk sizes
 * - Size comparisons against limits
 * - Recommendations for optimization
 */

const fs = require('fs');
const path = require('path');

// Bundle size limits (in KB)
const LIMITS = {
  firstLoadJS: 250,
  page: 150,
  shared: 100,
  css: 50,
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Format bytes to KB
 */
function formatSize(bytes) {
  return (bytes / 1024).toFixed(2);
}

/**
 * Get color based on percentage of limit
 */
function getColor(percentage) {
  if (percentage > 100) return colors.red;
  if (percentage > 80) return colors.yellow;
  return colors.green;
}

/**
 * Analyzey recursively
 */
function analyzeDirectory(dir, results = { files: [], totalSize: 0 }) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      analyzeDirectory(filePath, results);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.js', '.css', '.json'].includes(ext)) {
        results.files.push({
          path: filePath,
          name: file,
          size: stat.size,
          ext,
        });
        results.totalSize += stat.size;
      }
    }
  });

  return results;
}

/**
 * Categorize files
 */
function categorizeFiles(files) {
  const categories = {
    pages: [],
    chunks: [],
    css: [],
    other: [],
  };

  files.forEach(file => {
    if (file.name.includes('pages/')) {
      categories.pages.push(file);
    } else if (file.ext === '.css') {
      categories.css.push(file);
    } else if (file.name.includes('chunk') || file.name.includes('webpack')) {
      categories.chunks.push(file);
    } else {
      categories.other.push(file);
    }
  });

  return categories;
}

/**
 * Print analysis results
 */
function printResults(categories, totalSize) {
  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset);
  console.log(colors.cyan + '  Bundle Size Analysis' + colors.reset);
  console.log(colors.cyan + '='.repeat(60) + colors.reset + '\n');

  // Total size
  console.log(`${colors.blue}Total Bundle Size:${colors.reset} ${formatSize(totalSize)} KB\n`);

  // Pages
  if (categories.pages.length > 0) {
    console.log(`${colors.blue}Pages:${colors.reset}`);
    categories.pages
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach(file => {
        const sizeKB = formatSize(file.size);
        const percentage = (file.size / 1024 / LIMITS.page) * 100;
        const color = getColor(percentage);
        console.log(`  ${color}${sizeKB} KB${colors.reset} - ${file.name}`);
      });
    console.log();
  }

  // Chunks
  if (categories.chunks.length > 0) {
    console.log(`${colors.blue}Chunks:${colors.reset}`);
    categories.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach(file => {
        const sizeKB = formatSize(file.size);
        const percentage = (file.size / 1024 / LIMITS.shared) * 100;
        const color = getColor(percentage);
        console.log(`  ${color}${sizeKB} KB${colors.reset} - ${file.name}`);
      });
    console.log();
  }

  // CSS
  if (categories.css.length > 0) {
    console.log(`${colors.blue}CSS Files:${colors.reset}`);
    categories.css
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const sizeKB = formatSize(file.size);
        const percentage = (file.size / 1024 / LIMITS.css) * 100;
        const color = getColor(percentage);
        console.log(`  ${color}${sizeKB} KB${colors.reset} - ${file.name}`);
      });
    console.log();
  }

  // Recommendations
  console.log(`${colors.blue}Recommendations:${colors.reset}`);

  const largePages = categories.pages.filter(f => f.size / 1024 > LIMITS.page);
  if (largePages.length > 0) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${largePages.length} page(s) exceed size limit`);
    console.log(`    Consider code splitting or lazy loading`);
  }

  const largeChunks = categories.chunks.filter(f => f.size / 1024 > LIMITS.shared);
  if (largeChunks.length > 0) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${largeChunks.length} chunk(s) exceed size limit`);
    console.log(`    Consider splitting vendor chunks`);
  }

  const largeCSS = categories.css.filter(f => f.size / 1024 > LIMITS.css);
  if (largeCSS.length > 0) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${largeCSS.length} CSS file(s) exceed size limit`);
    console.log(`    Consider purging unused CSS or splitting styles`);
  }

  if (largePages.length === 0 && largeChunks.length === 0 && largeCSS.length === 0) {
    console.log(`  ${colors.green}✓${colors.reset} All bundles are within size limits!`);
  }

  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset + '\n');
}

/**
 * Main function
 */
function main() {
  const buildDir = path.join(__dirname, '..', '.next');

  if (!fs.existsSync(buildDir)) {
    console.error(`${colors.red}Error: Build directory not found${colors.reset}`);
    console.error('Please run "npm run build" first');
    process.exit(1);
  }

  console.log('Analyzing bundle...\n');

  const results = analyzeDirectory(buildDir);
  const categories = categorizeFiles(results.files);

  printResults(categories, results.totalSize);
}

// Run the analyzer
main();
