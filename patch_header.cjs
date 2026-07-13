const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/bg-\[#121212\]/g, "bg-zinc-950");
code = code.replace(/border-\[#222\]/g, "border-zinc-800/50");
code = code.replace(/bg-\[#1e1e1e\]/g, "bg-zinc-800 text-zinc-400");
code = code.replace(/bg-\[#2fe4b9\] hover:bg-\[#28cba5\] text-black/g, "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white");
code = code.replace(/bg-\[#2fe4b9\] hover:bg-\[#28cba5\] disabled:opacity-50 disabled:cursor-not-allowed text-black/g, "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white");
code = code.replace(/shadow-\[0_0_10px_rgba\(47,228,185,0.2\)\]/g, "shadow-[0_0_15px_rgba(6,182,212,0.4)]");
code = code.replace(/bg-\[#181818\]/g, "bg-zinc-900");
code = code.replace(/border-\[#333\]/g, "border-zinc-700");
code = code.replace(/bg-\[#111\]/g, "bg-zinc-950");
code = code.replace(/focus:border-\[#2fe4b9\]/g, "focus:border-cyan-500");
code = code.replace(/hover:bg-\[#222\]/g, "hover:bg-zinc-800");
code = code.replace(/text-gray-400/g, "text-zinc-400");

fs.writeFileSync('src/components/Header.tsx', code);
