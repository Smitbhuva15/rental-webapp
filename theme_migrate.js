const fs = require('fs');
const path = require('path');

const directoriesToScan = ['app', 'components'];

const replacements = [
  // Backgrounds
  [/bg-slate-50/g, 'bg-theme-bg'],
  [/bg-slate-950/g, 'bg-theme-bg'],
  [/bg-slate-900/g, 'bg-theme-bg'],
  [/bg-slate-800\/50/g, 'bg-theme-surface'],
  [/bg-slate-800/g, 'bg-theme-surface'],
  [/bg-white/g, 'bg-theme-surface'],
  [/bg-blue-600/g, 'bg-theme-accent'],
  [/bg-blue-500/g, 'bg-theme-accent'],
  [/bg-blue-700/g, 'bg-theme-accent'],
  [/bg-primary/g, 'bg-theme-accent'],
  [/bg-slate-100/g, 'bg-theme-muted'],
  [/bg-slate-200/g, 'bg-theme-muted'],
  [/bg-slate-300/g, 'bg-theme-muted'],
  [/bg-white\/10/g, 'bg-theme-muted'],

  // Text
  [/text-slate-900/g, 'text-theme-light'],
  [/text-white/g, 'text-theme-light'],
  [/text-slate-300/g, 'text-theme-light'],
  [/text-slate-500/g, 'text-theme-muted'],
  [/text-slate-400/g, 'text-theme-muted'],
  [/text-slate-600/g, 'text-theme-muted'],
  [/text-slate-700/g, 'text-theme-muted'],
  [/text-blue-600/g, 'text-theme-accent'],
  [/text-blue-500/g, 'text-theme-accent'],
  [/text-blue-400/g, 'text-theme-accent'],
  [/text-primary/g, 'text-theme-accent'],

  // Borders
  [/border-slate-200/g, 'border-theme-muted'],
  [/border-slate-800/g, 'border-theme-muted'],
  [/border-slate-100/g, 'border-theme-muted'],
  [/border-slate-300/g, 'border-theme-muted'],
  [/border-slate-700/g, 'border-theme-muted'],
  [/border-slate-600/g, 'border-theme-muted'],
  [/border-blue-500/g, 'border-theme-accent'],
  [/border-primary/g, 'border-theme-accent'],
  [/border-blue-400/g, 'border-theme-accent'],

  // Hover States
  [/hover:bg-slate-800/g, 'hover:bg-theme-surface'],
  [/hover:bg-slate-900/g, 'hover:bg-theme-surface'],
  [/hover:bg-slate-100/g, 'hover:bg-theme-muted'],
  [/hover:bg-slate-200/g, 'hover:bg-theme-muted'],
  [/hover:text-blue-500/g, 'hover:text-theme-accent'],
  [/hover:text-blue-600/g, 'hover:text-theme-accent'],
  [/hover:text-primary/g, 'hover:text-theme-accent'],
  [/hover:bg-blue-600/g, 'hover:bg-theme-accent'],
  [/hover:bg-blue-700/g, 'hover:bg-theme-accent'],
  [/hover:bg-primary/g, 'hover:bg-theme-accent'],
  [/hover:bg-white/g, 'hover:bg-theme-surface'],
  [/hover:text-white/g, 'hover:text-theme-light'],

  // Ring
  [/focus:ring-blue-500/g, 'focus:ring-theme-accent'],
  [/focus:ring-primary/g, 'focus:ring-theme-accent'],

  // Cleanup explicit dark mode classes (removes "dark:" prefix from anywhere)
  [/dark:bg-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:text-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:border-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:hover:bg-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:hover:text-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:shadow-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:from-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:via-[a-zA-Z0-9-\/]+/g, ''],
  [/dark:to-[a-zA-Z0-9-\/]+/g, ''],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  // Clean up double spaces created by removing dark classes
  content = content.replace(/  +/g, ' ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

for (const dir of directoriesToScan) {
  const absolutePath = path.join(__dirname, dir);
  if (fs.existsSync(absolutePath)) {
    walkDir(absolutePath);
  }
}

console.log('Migration completed.');
