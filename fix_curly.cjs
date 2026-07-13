const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(
  "ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => (",
  "{ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => ("
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
