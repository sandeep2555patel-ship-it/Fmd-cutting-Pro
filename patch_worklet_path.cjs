const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(/addModule\('\/ai-noise-reduction\.js'\)/g, "addModule('./ai-noise-reduction.js')");

fs.writeFileSync('src/components/Preview.tsx', code);
