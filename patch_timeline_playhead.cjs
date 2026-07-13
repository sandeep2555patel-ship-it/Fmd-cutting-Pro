const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(
  'className="flex-1 relative flex flex-col"',
  'className="flex-1 relative flex flex-col min-h-max"'
);

fs.writeFileSync('src/components/Timeline.tsx', code);
