const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  "const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying } = useProject();",
  "const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying, setClips } = useProject();"
);

fs.writeFileSync('src/components/Preview.tsx', code);
