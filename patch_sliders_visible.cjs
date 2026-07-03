const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

// Remove {selectedClip?.reduceNoise && (
code = code.replace(/\{selectedClip\?\.reduceNoise && \(\s*<div className="space-y-4 pt-2">/g, '<div className="space-y-4 pt-2">');

// Remove closing brace of that if condition
code = code.replace(/<\/div>\s*\)\}\s*<div className="space-y-2 pt-4 border-t border-\[#222\]">/g, '</div>\n\n                  <div className="space-y-2 pt-4 border-t border-[#222]">');

fs.writeFileSync('src/components/Properties.tsx', code);
