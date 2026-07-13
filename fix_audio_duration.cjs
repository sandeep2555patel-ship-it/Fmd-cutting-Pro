const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const regex = /duration: 300,/g;
code = code.replace(
  regex,
  "duration: audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : (audio.type === 'SFX' ? 60 : 150)),"
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
