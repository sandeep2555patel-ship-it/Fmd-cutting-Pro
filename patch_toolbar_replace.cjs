const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

code = code.replace(
  "{selectedClip && (",
  "{selectedClip && selectedClip.type !== 'text' && ("
);

fs.writeFileSync('src/components/Toolbar.tsx', code);
