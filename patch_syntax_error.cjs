const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(/\}\)\(\)\}\}/g, '})()}');

fs.writeFileSync('src/components/Preview.tsx', code);
