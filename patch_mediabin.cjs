const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(/bg: '#A86624'/g, "bg: '#f59e0b'");
code = code.replace(/bg: '#6D3A8A'/g, "bg: '#d946ef'");
code = code.replace(/bg: '#2B547E'/g, "bg: '#8b5cf6'");
code = code.replace(/bg: media\.type === 'audio' \? '#1E6C54' : '#2B547E'/g, "bg: media.type === 'audio' ? '#10b981' : '#3b82f6'");
code = code.replace(/bg: '#1E6C54'/g, "bg: '#10b981'");

// Replace some class colors
code = code.replace(/text-gray-400 hover:text-white/g, 'text-zinc-400 hover:text-white hover:text-cyan-400 transition-colors');
code = code.replace(/bg-\[#333\]/g, 'bg-zinc-800');
code = code.replace(/bg-\[#222\]/g, 'bg-zinc-900');
code = code.replace(/bg-\[#111\]/g, 'bg-zinc-950');

fs.writeFileSync('src/components/MediaBin.tsx', code);
