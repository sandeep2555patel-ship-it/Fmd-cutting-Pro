const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(/#2fe4b9/g, "#06b6d4"); // cyan-500
code = code.replace(/bg-\[#111\]/g, "bg-zinc-950/50");
code = code.replace(/bg-\[#222\]/g, "bg-zinc-900");
code = code.replace(/bg-\[#333\]/g, "bg-zinc-800");
code = code.replace(/border-\[#222\]/g, "border-zinc-800");
code = code.replace(/border-\[#333\]/g, "border-zinc-700");
code = code.replace(/text-[#2fe4b9]/g, "text-cyan-500");
code = code.replace(/border-[#2fe4b9]/g, "border-cyan-500");

fs.writeFileSync('src/components/Properties.tsx', code);
