const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(/h-\[30%\] min-h-\[200px\]/, 'h-[40%] min-h-[250px] md:min-h-[280px]');
code = code.replace(/const heightClass = 'h-14';/g, "const heightClass = 'h-12';");

fs.writeFileSync('src/components/Timeline.tsx', code);
