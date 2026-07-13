const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(/bg-\[#121212\]/g, "bg-zinc-950/80 backdrop-blur-xl");
code = code.replace(/bg-\[#181818\]/g, "bg-zinc-900/90");
code = code.replace(/bg-\[#222\]/g, "bg-zinc-800");
code = code.replace(/bg-\[#111\]/g, "bg-zinc-950/90");
code = code.replace(/border-\[#222\]/g, "border-zinc-800");
code = code.replace(/border-\[#333\]/g, "border-zinc-800");
code = code.replace(/bg-\[#333\]/g, "bg-zinc-800");

// Make the playhead cyan
code = code.replace(
  'className="absolute top-0 bottom-0 w-[2px] bg-white z-40 pointer-events-auto cursor-ew-resize"',
  'className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,1)] z-40 pointer-events-auto cursor-ew-resize"'
);
code = code.replace(/fill="white"/g, 'fill="#06b6d4"');

// Fix selection borders and colors
code = code.replace(/border-\[#FFC800\]/g, "border-cyan-400");
code = code.replace(/bg-white cursor-ew-resize/g, "bg-cyan-50 cursor-ew-resize");
code = code.replace(/bg-\[#2fe4b9\]/g, "bg-cyan-400");

fs.writeFileSync('src/components/Timeline.tsx', code);
