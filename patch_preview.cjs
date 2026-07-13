const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(/bg-\[#111\]/g, "bg-zinc-950");
code = code.replace(/bg-black/g, "bg-zinc-950");
code = code.replace(/bg-\[#1e1e1e\]/g, "bg-zinc-900");
code = code.replace(/border-\[#222\]/g, "border-zinc-800");
code = code.replace(/bg-\[#181818\]/g, "bg-zinc-900");
code = code.replace(/border-\[#2fe4b9\]/g, "border-cyan-400");
code = code.replace(/border-\[#333\]/g, "border-zinc-700");

// Also update hover colors for the play controls
code = code.replace(/text-gray-400 hover:text-white/g, "text-zinc-400 hover:text-cyan-400 transition-colors");
code = code.replace(/text-white hover:text-\[#2fe4b9\]/g, "text-zinc-100 hover:text-cyan-400 transition-colors");
code = code.replace(/text-[#2fe4b9]/g, "text-cyan-400");

fs.writeFileSync('src/components/Preview.tsx', code);
