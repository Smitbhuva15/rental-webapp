const fs = require('fs');

const filesToProcess = [
  'app/page.js',
  'components/Navbar.jsx'
];

const replacements = [
  // page.js
  [/from-blue-900\/40 via-slate-900 to-slate-900\/90/g, 'from-theme-bg via-theme-surface to-theme-bg'],
  [/bg-indigo-600\/20/g, 'bg-theme-accent/20'],
  [/from-blue-400 to-indigo-400/g, 'from-theme-light to-theme-muted'],
  [/from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500/g, 'from-theme-accent to-theme-accent hover:from-theme-accent/90 hover:to-theme-accent/90'],
  [/from-slate-900 via-slate-900\/40/g, 'from-theme-bg via-theme-bg/40'],
  [/shadow-slate-200\/50/g, 'shadow-theme-bg'],
  [/bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700/g, 'bg-theme-muted rounded-full flex items-center justify-center font-bold text-theme-light'],
  [/bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700/g, 'bg-theme-muted rounded-full flex items-center justify-center font-bold text-theme-light'],
  [/shadow-blue-500\/25/g, 'shadow-theme-accent/25'],
  [/text-purple-500\/10/g, 'text-theme-accent/10'],

  // Navbar.jsx
  [/from-blue-600 to-indigo-500/g, 'from-theme-accent to-theme-accent'],
  [/from-slate-900 to-slate-700/g, 'text-theme-light'],
  [/hover:text-red-500/g, 'hover:text-red-400'],
  [/from-blue-100 to-indigo-100 border border-blue-200 text-blue-700/g, 'bg-theme-surface border border-theme-muted text-theme-light'],
  [/shadow-slate-500\/20/g, 'shadow-theme-surface/20'],
  [/shadow-blue-500\/30/g, 'shadow-theme-accent/30'],
  [/bg-red-50/g, 'bg-theme-surface'],
  [/text-red-600/g, 'text-red-400'],
  
  // Leftover generic dynamic replacement for app/page.js
  [/bg-\$\{feature\.color\}-100/g, 'bg-theme-surface'],
  [/dark:bg-\$\{feature\.color\}-500\/10/g, ''],
  [/text-\$\{feature\.color\}-600/g, 'text-theme-accent'],
  [/dark:text-\$\{feature\.color\}-400/g, ''],
];

for (const filePath of filesToProcess) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  content = content.replace(/  +/g, ' '); // cleanup double spaces
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Processed ${filePath}`);
}
