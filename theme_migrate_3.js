const fs = require('fs');
const path = require('path');

const directoriesToScan = ['app', 'components'];

const replacements = [
  // shadows
  [/shadow-blue-[0-9]+\/[0-9]+/g, 'shadow-theme-accent/20'],
  [/shadow-slate-[0-9]+\/[0-9]+/g, 'shadow-theme-bg/50'],
  
  // gradients
  [/from-blue-[0-9]+/g, 'from-theme-accent'],
  [/to-indigo-[0-9]+/g, 'to-theme-accent'],
  [/via-slate-[0-9]+/g, 'via-theme-bg'],
  [/from-slate-[0-9]+/g, 'from-theme-bg'],
  [/to-slate-[0-9]+/g, 'to-theme-bg'],
  
  // text colors
  [/text-slate-800/g, 'text-theme-light'],
  [/text-blue-100/g, 'text-theme-light'],
  [/text-blue-200/g, 'text-theme-light'],
  [/text-blue-300/g, 'text-theme-light'],
  [/text-blue-[0-9]+/g, 'text-theme-accent'],
  
  // background colors
  [/bg-blue-50/g, 'bg-theme-surface'],
  [/bg-blue-100/g, 'bg-theme-surface'],
  [/bg-blue-200/g, 'bg-theme-surface'],
  [/bg-blue-[0-9]+/g, 'bg-theme-accent'],
  
  // border colors
  [/border-blue-[0-9]+/g, 'border-theme-accent'],
  [/border-slate-[0-9]+/g, 'border-theme-muted'],
  
  // dynamic string templates (e.g. `bg-blue-50 border-blue-200 text-blue-700 ` -> `bg-theme-surface border-theme-accent text-theme-accent`)
  // they will naturally be caught by the above regexes since they are just substrings
  
  // dark modifiers left over
  [/dark:divide-slate-[0-9]+/g, 'divide-theme-muted'],
  [/divide-slate-[0-9]+/g, 'divide-theme-muted'],
  [/dark:focus:ring-offset-slate-[0-9]+/g, 'focus:ring-offset-theme-bg'],
  [/dark:hover:border-blue-[0-9]+/g, 'hover:border-theme-accent']
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  // Clean up double spaces created by replacing
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

console.log('Final scrub completed.');
