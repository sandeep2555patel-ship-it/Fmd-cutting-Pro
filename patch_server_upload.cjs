const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "file: inputFile,\n      mimeType: mimeType,",
  "file: inputFile,\n      config: { mimeType },"
);

fs.writeFileSync('server.ts', code);
