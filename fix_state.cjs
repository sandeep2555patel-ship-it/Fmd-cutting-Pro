const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');
code = code.replace(
  "const { state: { clips, mediaLibrary }, setClips, setMediaLibrary } = useProject();",
  "const { state, setClips, setMediaLibrary } = useProject();\n  const { clips, mediaLibrary } = state;"
);
fs.writeFileSync('src/components/MediaBin.tsx', code);
