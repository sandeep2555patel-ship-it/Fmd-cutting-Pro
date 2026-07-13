const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');
code = code.replace(/selectedClip\.id/g, 'selectedClip?.id');
fs.writeFileSync('src/components/Properties.tsx', code);
