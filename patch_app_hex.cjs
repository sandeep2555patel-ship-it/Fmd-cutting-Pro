const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/selection:bg-\[#2fe4b9\]\/30/g, "selection:bg-cyan-500/30");
code = code.replace(/border-\[#222\]/g, "border-zinc-800");

fs.writeFileSync('src/App.tsx', code);
