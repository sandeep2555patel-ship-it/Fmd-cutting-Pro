const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  'const { clips, currentTime, setCurrentTime, isPlaying, setIsPlaying } = useProject();',
  'const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying } = useProject();'
);

fs.writeFileSync('src/components/Preview.tsx', code);
