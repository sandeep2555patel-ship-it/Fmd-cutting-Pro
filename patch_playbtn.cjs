const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  'onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"',
  'onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-500 text-white rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all"'
);
code = code.replace(
  'fill="black"',
  'fill="white"'
);

fs.writeFileSync('src/components/Preview.tsx', code);
