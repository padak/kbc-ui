#!/usr/bin/env node

/**
 * Design Token Synchronization Script
 *
 * This script extracts CSS custom properties from design-system.html
 * and automatically updates src/app/globals.css with the new values.
 *
 * Usage:
 *   node scripts/sync-design-tokens.js
 *   or
 *   make sync-design
 */

const fs = require('fs');
const path = require('path');

// File paths
const DESIGN_SYSTEM_HTML = path.join(__dirname, '../design-system.html');
const GLOBALS_CSS = path.join(__dirname, '../src/app/globals.css');

console.log('🎨 Design Token Sync');
console.log('====================\n');

// Step 1: Read design-system.html
console.log('📖 Reading design-system.html...');
if (!fs.existsSync(DESIGN_SYSTEM_HTML)) {
  console.error('❌ Error: design-system.html not found!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(DESIGN_SYSTEM_HTML, 'utf-8');

// Step 2: Extract CSS custom properties from :root
console.log('🔍 Extracting CSS custom properties...');

const rootMatch = htmlContent.match(/:root\s*{([^}]+)}/s);
if (!rootMatch) {
  console.error('❌ Error: Could not find :root { } block in design-system.html');
  process.exit(1);
}

const rootContent = rootMatch[1];

// Parse all CSS custom properties
const tokenRegex = /--([\w-]+):\s*([^;]+);/g;
const tokens = {};
let match;

while ((match = tokenRegex.exec(rootContent)) !== null) {
  const [, name, value] = match;
  tokens[name] = value.trim();
}

console.log(`✅ Extracted ${Object.keys(tokens).length} design tokens\n`);

// Display extracted tokens by category
const categories = {
  'Color System': Object.keys(tokens).filter(k => k.startsWith('color-')),
  'Typography': Object.keys(tokens).filter(k => k.startsWith('font-')),
  'Spacing': Object.keys(tokens).filter(k => k.startsWith('space-')),
  'Border Radius': Object.keys(tokens).filter(k => k.startsWith('radius-')),
  'Shadows': Object.keys(tokens).filter(k => k.startsWith('shadow-')),
  'Transitions': Object.keys(tokens).filter(k => k.startsWith('transition-')),
  'Z-Index': Object.keys(tokens).filter(k => k.startsWith('z-')),
};

Object.entries(categories).forEach(([category, keys]) => {
  if (keys.length > 0) {
    console.log(`📦 ${category}: ${keys.length} tokens`);
  }
});

console.log('');

// Step 3: Read current globals.css
console.log('📖 Reading current globals.css...');
if (!fs.existsSync(GLOBALS_CSS)) {
  console.error('❌ Error: src/app/globals.css not found!');
  process.exit(1);
}

let globalsContent = fs.readFileSync(GLOBALS_CSS, 'utf-8');

// Step 4: Build new :root block
console.log('🔨 Building new CSS custom properties...');

const newRootBlock = `:root {
    /* ===== COLOR SYSTEM ===== */
    /* Primary - Keboola Blue */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-primary-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Neutral - Grays */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-neutral-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Success - Green */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-success-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Warning - Orange */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-warning-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Error - Red */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-error-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Info - Blue */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-info-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* AI Theme - Purple to Blue to Cyan Gradient */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('color-ai-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Glow Effects */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('glow-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== TYPOGRAPHY ===== */
    /* Font Families */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('font-family-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Font Sizes */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('font-size-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Font Weights */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('font-weight-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Line Heights */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('line-height-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== SPACING SCALE ===== */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('space-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== BORDER RADIUS ===== */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('radius-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== SHADOWS ===== */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('shadow-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== TRANSITIONS ===== */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('transition-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* ===== Z-INDEX SCALE ===== */
${Object.entries(tokens)
  .filter(([k]) => k.startsWith('z-'))
  .map(([k, v]) => `    --${k}: ${v};`)
  .join('\n')}

    /* Radius (shadcn/ui compatibility) */
    --radius: ${tokens['radius-lg'] || '0.5rem'};

    /* shadcn/ui tokens (using HSL format) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }`;

// Step 5: Replace :root block in globals.css
console.log('✏️  Updating globals.css...');

// Find the first :root block and replace it
const globalsRootMatch = globalsContent.match(/@layer base {\s+:root\s*{[^}]+}/s);
if (!globalsRootMatch) {
  console.error('❌ Error: Could not find :root block in globals.css');
  process.exit(1);
}

globalsContent = globalsContent.replace(
  /@layer base {\s+:root\s*{[^}]+}/s,
  `@layer base {\n  ${newRootBlock}`
);

// Step 6: Write updated globals.css
fs.writeFileSync(GLOBALS_CSS, globalsContent, 'utf-8');

console.log('✅ Successfully updated globals.css!');
console.log('');
console.log('📝 Summary:');
console.log(`   - Synced ${Object.keys(tokens).length} design tokens`);
console.log('   - Updated: src/app/globals.css');
console.log('');
console.log('🎯 Next steps:');
console.log('   1. Restart your dev server (if running)');
console.log('   2. Check the browser - colors should update automatically!');
console.log('   3. Run "git diff src/app/globals.css" to see changes');
console.log('');
console.log('✨ Design tokens synced successfully!');
