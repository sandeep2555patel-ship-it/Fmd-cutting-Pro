const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import { createServer as createViteServer } from "vite";',
  'import { createServer as createViteServer } from "vite";\nimport https from "https";'
);

code = code.replace(
  "const https = require('https');",
  ""
);

fs.writeFileSync('server.ts', code);
