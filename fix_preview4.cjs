const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  /  \}, \[isPlaying, setIsPlaying\]\);/g,
  `  }, [isPlaying, setIsPlaying, activeAudioClip?.url]);`
);

fs.writeFileSync('src/components/Preview.tsx', code);
