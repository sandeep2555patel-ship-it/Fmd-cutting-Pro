const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(/setClips\(clips\.map\(c => c\.id === selectedClip\.id \? \{ \.\.\.c, vocalVolume: Number\(e\.target\.value\) \} : c\)\);/g, 
  'setClips(clips.map(c => c.id === selectedClip.id ? { ...c, vocalVolume: Number(e.target.value), reduceNoise: true } : c));');

code = code.replace(/setClips\(clips\.map\(c => c\.id === selectedClip\.id \? \{ \.\.\.c, backgroundVolume: Number\(e\.target\.value\) \} : c\)\);/g, 
  'setClips(clips.map(c => c.id === selectedClip.id ? { ...c, backgroundVolume: Number(e.target.value), reduceNoise: true } : c));');

fs.writeFileSync('src/components/Properties.tsx', code);
