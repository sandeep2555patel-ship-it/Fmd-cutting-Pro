const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(
  "We'll",
  "We\\'ll"
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
