const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(
  "start: clips.length * 20,",
  "start: state.currentTime,"
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
