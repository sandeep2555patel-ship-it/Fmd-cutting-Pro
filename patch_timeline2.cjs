const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Change timeline height to make the preview bigger
code = code.replace(
  'className="h-[40%] min-h-[250px] bg-[#121212] flex flex-col flex-shrink-0 relative z-10 border-t border-[#222]"',
  'className="h-[30%] min-h-[200px] bg-[#121212] flex flex-col flex-shrink-0 relative z-10 border-t border-[#222]"'
);

fs.writeFileSync('src/components/Timeline.tsx', code);
