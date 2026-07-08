/**
 * Generate placeholder SVG images for all template/image paths referenced in code.
 * Run: node scripts/generate-placeholders.js
 *
 * Creates lightweight SVG files that work offline and load instantly.
 * Replace with real images as they become available.
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// All image paths referenced in code that need placeholders
const imagePaths = [
  // Template previews
  'templates/salon-luxury-preview.jpg',
  'templates/salon-luxury-thumb.jpg',
  'templates/salon-hero-bg.jpg',
  'templates/business-professional.jpg',
  'templates/retail-modern-preview.jpg',
  'templates/healthcare-professional-preview.jpg',
  'templates/restaurant-cozy-preview.jpg',
  'templates/corporate-executive.jpg',
  'templates/automotive-classic-preview.jpg',
  'templates/automotive-classic-thumb.jpg',
  'templates/automotive-hero-bg.jpg',
  // Service images
  'templates/service-sales.jpg',
  'templates/service-repair.jpg',
  'templates/service-parts.jpg',
  // Gallery images
  'templates/automotive-gallery-1.jpg',
  'templates/automotive-gallery-2.jpg',
  'templates/automotive-gallery-3.jpg',
  // Logo placeholders
  'images/restaurant-logo.jpg',
  'images/salon-logo.jpg',
  'images/gym-logo.jpg',
  'images/clinic-logo.jpg',
];

const colors = {
  'salon': { bg: '#fdf2f8', accent: '#ec4899' },
  'business': { bg: '#eff6ff', accent: '#3b82f6' },
  'retail': { bg: '#f0fdf4', accent: '#22c55e' },
  'healthcare': { bg: '#fef2f2', accent: '#ef4444' },
  'restaurant': { bg: '#fffbeb', accent: '#f59e0b' },
  'corporate': { bg: '#f8fafc', accent: '#1e293b' },
  'automotive': { bg: '#f1f5f9', accent: '#dc2626' },
  'gym': { bg: '#f0fdf4', accent: '#16a34a' },
  'clinic': { bg: '#fef2f2', accent: '#dc2626' },
  'service': { bg: '#f5f3ff', accent: '#7c3aed' },
  'gallery': { bg: '#f8fafc', accent: '#6366f1' },
  'default': { bg: '#f1f5f9', accent: '#6366f1' },
};

function getColorScheme(filename) {
  for (const [key, scheme] of Object.entries(colors)) {
    if (filename.toLowerCase().includes(key)) return scheme;
  }
  return colors.default;
}

function generateSVG(filename, width = 800, height = 600) {
  const { bg, accent } = getColorScheme(filename);
  const label = filename
    .replace(/\.(jpg|png|svg)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const isThumb = filename.includes('thumb');
  const isLogo = filename.includes('logo');
  const w = isThumb ? 200 : isLogo ? 200 : width;
  const h = isThumb ? 150 : isLogo ? 200 : height;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect fill="${bg}" width="${w}" height="${h}"/>
  <rect fill="${accent}" x="0" y="0" width="${w}" height="${Math.round(h * 0.15)}" opacity="0.8"/>
  <circle cx="${Math.round(w / 2)}" cy="${Math.round(h / 2)}" r="${Math.round(Math.min(w, h) * 0.12)}" fill="${accent}" opacity="0.15"/>
  <text x="${Math.round(w / 2)}" y="${Math.round(h / 2 + 5)}" font-family="system-ui,sans-serif" font-size="${isThumb ? 10 : 13}" fill="${accent}" text-anchor="middle" opacity="0.7">${label.slice(0, 30)}</text>
</svg>`;
}

// Generate all placeholders
let created = 0;
for (const imgPath of imagePaths) {
  const fullPath = path.join(PUBLIC_DIR, imgPath);
  const dir = path.dirname(fullPath);

  // Create directory if needed
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Skip if file already exists (don't overwrite real images)
  if (fs.existsSync(fullPath)) {
    console.log(`  SKIP: ${imgPath} (already exists)`);
    continue;
  }

  const svg = generateSVG(imgPath);
  fs.writeFileSync(fullPath, svg);
  created++;
  console.log(`  CREATE: ${imgPath}`);
}

console.log(`\nDone! Created ${created} placeholder images.`);
console.log('Replace these with real images as they become available.');
